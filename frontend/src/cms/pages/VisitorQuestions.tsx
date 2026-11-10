import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../services/apiConfig";
import { getCmsCsrfToken } from "../services/cmsAuthService";

interface VisitorQuestion {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  faq_category: string;
  faq_category_display: string;
  response: string | null;
  response_sent: boolean;
  publish_to_faq: boolean;
  published_faq: number | null;
  status: "new" | "in_progress" | "answered" | "closed";
  created_at: string;
}

const categories = [
  ["general", "General"],
  ["buying", "Buying"],
  ["renting", "Renting"],
  ["site_visits", "Site Visits"],
  ["properties", "Properties"],
  ["legal", "Legal"],
  ["support", "Support"],
] as const;

async function loadQuestions(): Promise<VisitorQuestion[]> {
  const response = await fetch(`${API_BASE_URL}inquiries/manage/`, { credentials: "include" });
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? "Your CMS session may have expired. Sign in again to view visitor questions." : "Could not load visitor questions.");
  const data = await response.json() as { results?: VisitorQuestion[] } | VisitorQuestion[];
  const items = Array.isArray(data) ? data : data.results ?? [];
  return items.filter((item) => item.subject.toLowerCase().startsWith("faq question:"));
}

export default function VisitorQuestions() {
  const [questions, setQuestions] = useState<VisitorQuestion[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [publishDrafts, setPublishDrafts] = useState<Record<number, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setError("");
    try {
      const rows = await loadQuestions();
      setQuestions(rows);
      setDrafts((current) => Object.fromEntries(rows.map((row) => [row.id, current[row.id] ?? row.response ?? ""])));
      setPublishDrafts((current) => Object.fromEntries(rows.map((row) => [row.id, current[row.id] ?? row.publish_to_faq])));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load visitor questions."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); }, []);

  const visibleQuestions = useMemo(() => questions.filter((question) =>
    (categoryFilter === "all" || question.faq_category === categoryFilter) &&
    (statusFilter === "all" || question.status === statusFilter)), [questions, categoryFilter, statusFilter]);

  async function reply(question: VisitorQuestion) {
    const responseText = drafts[question.id]?.trim();
    if (!responseText) { setError("Write a reply before marking the question answered."); return; }
    setSaving(question.id); setError(""); setNotice("");
    const publish = publishDrafts[question.id] ?? question.publish_to_faq;
    try {
      const csrf = await getCmsCsrfToken();
      const result = await fetch(`${API_BASE_URL}inquiries/manage/${question.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
        body: JSON.stringify({ response: responseText, status: "answered", publish_to_faq: publish }),
      });
      const payload = await result.json().catch(() => ({})) as { detail?: string };
      if (!result.ok) throw new Error(payload.detail ?? `Could not save reply (HTTP ${result.status}).`);
      setNotice(publish
        ? "Marked answered and published to the public FAQs. Email delivery status appears beside the question."
        : "Marked answered. This reply is not published on the public FAQs; email delivery status appears beside the question.");
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save reply."); }
    finally { setSaving(null); }
  }

  return <main className="min-h-screen px-4 py-10 text-[#232323] sm:px-6"><div className="mx-auto max-w-5xl">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Website questions</p>
    <h1 className="mt-2 font-serif text-4xl">Visitor Questions</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#555]">Sort questions by category, reply by email, and choose which answers become public FAQs.</p>
    {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="mt-5 rounded-md bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    <div className="mt-7 flex flex-wrap gap-4">
      <label className="text-sm">Category<select value={categoryFilter} onChange={(event)=>setCategoryFilter(event.target.value)} className="ml-2 rounded-md border border-[#D8D3CA] bg-white px-3 py-2"><option value="all">All categories</option>{categories.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm">Status<select value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value)} className="ml-2 rounded-md border border-[#D8D3CA] bg-white px-3 py-2"><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="answered">Answered</option><option value="closed">Closed</option></select></label>
    </div>
    {loading ? <p className="mt-8 text-sm text-[#666]">Loading visitor questions…</p> : visibleQuestions.length ? <div className="mt-5 space-y-5">{visibleQuestions.map((question)=><article key={question.id} className="rounded-xl border border-[#E8E5DF] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-[#888]">{new Date(question.created_at).toLocaleString()} · {question.faq_category_display}</p><h2 className="mt-2 font-serif text-2xl">{question.name}</h2><p className="mt-1 text-sm text-[#555]">{question.email} · {question.phone}</p></div><span className="rounded-full bg-[#F4F1EB] px-3 py-1 text-xs capitalize">{question.status}{question.publish_to_faq ? " · public FAQ" : ""}{question.response_sent ? " · emailed" : question.status === "answered" ? " · email pending" : ""}</span></div>
      <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[#333]">{question.message}</p>
      <label className="mt-6 block text-sm font-medium">Your response<textarea rows={4} value={drafts[question.id] ?? ""} onChange={(event)=>setDrafts({...drafts,[question.id]:event.target.value})} className="mt-2 w-full rounded-md border border-[#D8D3CA] bg-white px-3 py-3 text-sm font-normal" placeholder="Write a helpful answer for the visitor…" /></label>
      <label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" checked={publishDrafts[question.id] ?? question.publish_to_faq} onChange={event=>setPublishDrafts({...publishDrafts,[question.id]:event.target.checked})} className="mt-1" /><span><span className="font-medium">Publish on public FAQs</span><span className="mt-1 block text-xs text-[#666]">When saved as answered, this Q&amp;A will appear under {question.faq_category_display}. Uncheck it later to hide it.</span></span></label>
      <button type="button" disabled={saving === question.id} onClick={()=>void reply(question)} className="mt-4 rounded-md bg-[#232323] px-5 py-2.5 text-sm text-white disabled:opacity-50">{saving === question.id ? "Saving…" : question.status === "answered" && !question.response_sent ? "Retry email reply" : "Save answer"}</button>
    </article>)}</div> : <p className="mt-8 rounded-xl border border-dashed border-[#D8D3CA] p-8 text-sm text-[#666]">No visitor questions match these filters.</p>}
  </div></main>;
}
