import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { TeamMember } from "../../types/team";
import { API_BASE_URL, API_ORIGIN } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}team/manage/`;
const CSRF_URL = `${API_BASE_URL}csrf/`;
const positions = [
  ["managing_director", "Managing Director"],
  ["sales_manager", "Sales Manager"],
  ["property_consultant", "Property Consultant"],
  ["marketing_lead", "Marketing Lead"],
  ["customer_relations", "Customer Relations Officer"],
  ["operations_manager", "Operations Manager"],
] as const;

type EmployeeForm = {
  name: string;
  position: string;
  bio: string;
  email: string;
  phone: string;
  linkedin_url: string;
  display_order: string;
  is_active: boolean;
};

const emptyForm: EmployeeForm = {
  name: "", position: "property_consultant", bio: "", email: "", phone: "",
  linkedin_url: "", display_order: "1", is_active: true,
};

async function csrfToken() {
  const response = await fetch(CSRF_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Could not start a secure CMS request.");
  return (await response.json() as { csrfToken: string }).csrfToken;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadEmployees = useCallback(async () => {
    const response = await fetch(API_URL, { credentials: "include" });
    if (!response.ok) throw new Error(response.status === 403 ? "You need a CMS staff account to manage employees." : "Could not load employee profiles.");
    const data = await response.json() as { results?: TeamMember[] } | TeamMember[];
    setEmployees(Array.isArray(data) ? data : data.results ?? []);
  }, []);

  useEffect(() => {
    loadEmployees().catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Could not load employees."))
      .finally(() => setLoading(false));
  }, [loadEmployees]);

  function startEditing(employee: TeamMember) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      position: employee.position,
      bio: employee.bio,
      email: employee.email ?? "",
      phone: employee.phone ?? "",
      linkedin_url: employee.linkedin_url ?? "",
      display_order: String(employee.display_order),
      is_active: employee.is_active,
    });
    setPhoto(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearForm() {
    setEditingId(null);
    setForm(emptyForm);
    setPhoto(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const token = await csrfToken();
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, String(value)));
      if (photo) body.append("photo", photo);
      const response = await fetch(editingId ? `${API_URL}${editingId}/` : API_URL, {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: { "X-CSRFToken": token },
        body,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { detail?: string };
        throw new Error(data.detail ?? `Could not save employee profile (${response.status}).`);
      }
      clearForm();
      setMessage(editingId ? "Employee profile updated." : "Employee added to the team.");
      await loadEmployees();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not save employee profile.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(employee: TeamMember) {
    setMessage("");
    try {
      const token = await csrfToken();
      const body = new FormData();
      body.append("is_active", String(!employee.is_active));
      const response = await fetch(`${API_URL}${employee.id}/`, {
        method: "PATCH", credentials: "include", headers: { "X-CSRFToken": token }, body,
      });
      if (!response.ok) throw new Error("Could not update employee visibility.");
      await loadEmployees();
      setMessage(employee.is_active ? "Employee profile hidden from the public team page." : "Employee profile is visible on the public team page.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not update employee visibility.");
    }
  }

  function changeField<K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (loading) return <main className="p-8 text-sm">Loading employee profiles…</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Website Management</p>
      <h1 className="font-serif text-4xl">Employee Management</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">Manage the employee profiles displayed on the public team page. Hiding a profile keeps its information in the CMS.</p>

      {message && <p role="status" className="mt-5 rounded-md bg-[#F4F1EB] p-3 text-sm">{message}</p>}

      <section className="mt-7 rounded-xl border border-[#E8E5DF] bg-white p-5 sm:p-7">
        <h2 className="font-serif text-2xl">{editingId ? "Edit employee" : "Add an employee"}</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Full name<input required value={form.name} onChange={(event) => changeField("name", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Position<select value={form.position} onChange={(event) => changeField("position", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2">{positions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-sm font-medium sm:col-span-2">Biography<textarea required rows={4} value={form.bio} onChange={(event) => changeField("bio", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Email<input type="email" value={form.email} onChange={(event) => changeField("email", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Phone<input value={form.phone} onChange={(event) => changeField("phone", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">LinkedIn URL<input type="url" value={form.linkedin_url} onChange={(event) => changeField("linkedin_url", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Display order<input type="number" min="0" value={form.display_order} onChange={(event) => changeField("display_order", event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Profile photo<input type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm" /></label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => changeField("is_active", event.target.checked)} />Show profile on the website</label>
          <div className="flex gap-3 sm:col-span-2"><button disabled={saving} className="rounded-md bg-[#232323] px-5 py-2.5 text-sm text-white disabled:opacity-60">{saving ? "Saving…" : editingId ? "Save employee" : "Add employee"}</button>{editingId && <button type="button" onClick={clearForm} className="rounded-md border border-[#D8D3CA] px-5 py-2.5 text-sm">Cancel</button>}</div>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#E8E5DF] bg-white">
        <div className="border-b border-[#E8E5DF] p-5"><h2 className="font-serif text-2xl">Employee profiles</h2></div>
        {employees.length === 0 ? <p className="p-5 text-sm text-[#666]">No employee profiles yet. Add the first one above.</p> : <div className="divide-y divide-[#E8E5DF]">{employees.map((employee) => (
          <article key={employee.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            {employee.photo && <img src={employee.photo.startsWith("http") ? employee.photo : `${API_ORIGIN}${employee.photo}`} alt="" className="h-16 w-16 rounded-full object-cover" />}
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{employee.name}</h3><span className={`rounded-full px-2 py-0.5 text-xs ${employee.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{employee.is_active ? "Visible" : "Hidden"}</span></div><p className="mt-1 text-sm text-[#666]">{employee.position_display} · Order {employee.display_order}</p><p className="mt-2 line-clamp-2 text-sm text-[#4A4A4A]">{employee.bio}</p></div>
            <div className="flex gap-3"><button onClick={() => startEditing(employee)} className="rounded-md border border-[#D8D3CA] px-3 py-2 text-sm">Edit</button><button onClick={() => void toggleActive(employee)} className="rounded-md border border-[#D8D3CA] px-3 py-2 text-sm">{employee.is_active ? "Hide" : "Show"}</button></div>
          </article>
        ))}</div>}
      </section>
    </main>
  );
}
