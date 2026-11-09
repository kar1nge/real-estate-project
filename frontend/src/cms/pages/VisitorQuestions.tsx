import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/apiConfig";
import { getCmsCsrfToken } from "../services/cmsAuthService";

interface VisitorQuestion {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  response: string | null;
  response_sent: boolean;
  status: "new" | "in_progress" | "answered" | "closed";
  created_at: string;
}

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
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load visitor questions."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); }, []);

  async function reply(question: VisitorQuestion) {
    const responseText = drafts[question.id]?.trim();
    if (!responseText) { setError("Write a reply before marking the question answered."); return; }
    setSaving(question.id); setError(""); setNotice("");
    try {
      const csrf = await getCmsCsrfToken();
      const result = await fetch(`${API_BASE_URL}inquiries/manage/${question.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
        body: JSON.stringify({ response: responseText, status: "answered" }),
      });
      const payload = await result.json().catch(() => ({})) as { detail?: string };
      if (!result.ok) throw new Error(payload.detail ?? `Could not save reply (HTTP ${result.status}).`);
      setNotice("Reply saved. The response email was sent or is ready to retry if delivery was unavailable.");
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save reply."); }
    finally { setSaving(null); }
  }

  return <main className="min-h-screen px-4 py-10 text-[#232323] sm:px-6"><div className="mx-auto max-w-5xl">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Website questions</p>
    <h1 className="mt-2 font-serif text-4xl">Visitor Questions</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#555]">Review questions sent from the public FAQs page. Write a response and mark it answered to email it to the visitor.</p>
    {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="mt-5 rounded-md bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    {loading ? <p className="mt-8 text-sm text-[#666]">Loading visitor questions…</p> : questions.length ? <div className="mt-7 space-y-5">{questions.map((question)=><article key={question.id} className="rounded-xl border border-[#E8E5DF] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-[#888]">{new Date(question.created_at).toLocaleString()}</p><h2 className="mt-2 font-serif text-2xl">{question.name}</h2><p className="mt-1 text-sm text-[#555]">{question.email} · {question.phone}</p></div><span className="rounded-full bg-[#F4F1EB] px-3 py-1 text-xs capitalize">{question.status}{question.response_sent ? " · emailed" : question.status === "answered" ? " · email pending" : ""}</span></div>
      <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[#333]">{question.message}</p>
      <label className="mt-6 block text-sm font-medium">Your response<textarea rows={4} value={drafts[question.id] ?? ""} onChange={(event)=>setDrafts({...drafts,[question.id]:event.target.value})} className="mt-2 w-full rounded-md border border-[#D8D3CA] bg-white px-3 py-3 text-sm font-normal" placeholder="Write a helpful answer for the visitor…" /></label>
      <button type="button" disabled={saving === question.id} onClick={()=>void reply(question)} className="mt-4 rounded-md bg-[#232323] px-5 py-2.5 text-sm text-white disabled:opacity-50">{saving === question.id ? "Saving…" : question.status === "answered" && !question.response_sent ? "Retry email reply" : "Save and email reply"}</button>
    </article>)}</div> : <p className="mt-8 rounded-xl border border-dashed border-[#D8D3CA] p-8 text-sm text-[#666]">No questions have come in from the FAQs page yet.</p>}
  </div></main>;
}
