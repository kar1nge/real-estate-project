import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listManaged,
  managementPaths,
  saveManaged,
  type ManagedRecord,
  type PolicySection,
  type RecordValue,
} from "../services/contentManagementService";

type Section = keyof typeof managementPaths;
type Field = {
  name: string;
  label: string;
  kind?: "text" | "number" | "textarea" | "checkbox" | "select";
  options?: Array<[string, string]>;
  required?: boolean;
};
const tabs: Array<[Section, string]> = [
  ["statistics", "Statistics"],
  ["testimonials", "Testimonials"],
  ["faqs", "FAQs"],
  ["pages", "About & Legal Pages"],
];
const schemas: Record<Section, Field[]> = {
  statistics: [
    { name: "label", label: "Label", required: true },
    { name: "value", label: "Value", kind: "number", required: true },
    { name: "suffix", label: "Suffix (e.g. +, %)", required: false },
    {
      name: "display_order",
      label: "Display order",
      kind: "number",
      required: true,
    },
    { name: "is_active", label: "Show on website", kind: "checkbox" },
  ],
  testimonials: [
    { name: "client_name", label: "Client name", required: true },
    {
      name: "testimonial",
      label: "Testimonial",
      kind: "textarea",
      required: true,
    },
    { name: "rating", label: "Rating (1–5)", kind: "number", required: true },
    {
      name: "property",
      label: "Related property ID (optional)",
      kind: "number",
    },
    { name: "is_featured", label: "Featured", kind: "checkbox" },
    { name: "display_order", label: "Display order", kind: "number" },
    { name: "is_active", label: "Show on website", kind: "checkbox" },
  ],
  faqs: [
    { name: "question", label: "Question", required: true },
    { name: "answer", label: "Answer", kind: "textarea", required: true },
    {
      name: "category",
      label: "Category",
      kind: "select",
      options: [
        ["general", "General"],
        ["buying", "Buying"],
        ["renting", "Renting"],
        ["site_visits", "Site Visits"],
        ["properties", "Properties"],
        ["legal", "Legal"],
        ["support", "Support"],
      ],
    },
    { name: "display_order", label: "Display order", kind: "number" },
    { name: "is_featured", label: "Featured", kind: "checkbox" },
    { name: "is_active", label: "Show on website", kind: "checkbox" },
  ],
  pages: [
    {
      name: "slug",
      label: "Page",
      kind: "select",
      options: [
        ["about", "About Us"],
        ["privacy", "Privacy Policy"],
        ["terms", "Terms & Conditions"],
      ],
    },
    { name: "eyebrow", label: "Eyebrow" },
    { name: "title", label: "Title", required: true },
    { name: "lead", label: "Introduction", kind: "textarea" },
    {
      name: "body",
      label: "Page copy (separate paragraphs with a blank line)",
      kind: "textarea",
      required: true,
    },
  ],
};
const defaults: Record<Section, ManagedRecord> = {
  statistics: {
    label: "",
    value: 0,
    suffix: "",
    display_order: 1,
    is_active: true,
  },
  testimonials: {
    client_name: "",
    testimonial: "",
    rating: 5,
    property: "",
    is_featured: false,
    display_order: 1,
    is_active: true,
  },
  faqs: {
    question: "",
    answer: "",
    category: "general",
    display_order: 1,
    is_featured: false,
    is_active: true,
  },
  pages: { slug: "about", eyebrow: "", title: "", lead: "", body: "", sections: [] },
};
const titleField: Record<Section, string> = {
  statistics: "label",
  testimonials: "client_name",
  faqs: "question",
  pages: "title",
};
const identityField: Record<Section, string> = {
  statistics: "id",
  testimonials: "id",
  faqs: "id",
  pages: "slug",
};

function WebsiteContentManagement() {
  const [section, setSection] = useState<Section>("statistics");
  const [records, setRecords] = useState<ManagedRecord[]>([]);
  const [form, setForm] = useState<ManagedRecord>(defaults.statistics);
  const [editing, setEditing] = useState<number | string | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [policySectionDraft, setPolicySectionDraft] = useState<PolicySection>({ heading: "", body: "" });
  const [policySectionIndex, setPolicySectionIndex] = useState<number | null>(null);
  const [policySectionEditorOpen, setPolicySectionEditorOpen] = useState(false);

  async function load(nextSection: Section) {
    setLoading(true);
    setError("");
    try {
      const items = await listManaged(managementPaths[nextSection]);
      setRecords(items);
      setForm({ ...defaults[nextSection] });
      setEditing(undefined);
      setPolicySectionEditorOpen(false);
      setPolicySectionIndex(null);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not load content.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load(section);
  }, [section]);

  const displayRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
      ),
    [records],
  );
  function edit(record: ManagedRecord) {
    setEditing(record[identityField[section]] as number | string);
    setForm({ ...defaults[section], ...record });
    setPolicySectionEditorOpen(false);
    setPolicySectionIndex(null);
    setMessage("");
    setError("");
  }
  function startNew() {
    setEditing(undefined);
    const initial = { ...defaults[section] };
    if (section === "pages" && records.length)
      initial.slug = String(
        records.find((record) => record.slug === "about")?.slug ?? "about",
      );
    setForm(initial);
    setPolicySectionEditorOpen(false);
    setPolicySectionIndex(null);
    setMessage("");
    setError("");
  }
  function change(name: string, value: RecordValue) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  const policySections = Array.isArray(form.sections)
    ? (form.sections as PolicySection[])
    : [];
  const isLegalPage =
    section === "pages" &&
    (form.slug === "privacy" || form.slug === "terms");

  function openPolicySection(index?: number) {
    if (index === undefined) {
      setPolicySectionDraft({ heading: "", body: "" });
      setPolicySectionIndex(null);
    } else {
      setPolicySectionDraft({ ...policySections[index] });
      setPolicySectionIndex(index);
    }
    setPolicySectionEditorOpen(true);
    setError("");
    setMessage("");
  }

  async function savePolicySection() {
    const heading = policySectionDraft.heading.replace(/^\s*\d+[.)]\s*/, "").trim();
    const body = policySectionDraft.body.trim();
    if (!heading || !body) {
      setError("Enter both a section title and its body.");
      return;
    }
    if (editing === undefined) {
      setError("Select the existing Privacy Policy or Terms page first.");
      return;
    }

    const nextSections = [...policySections];
    const nextItem = { heading, body };
    if (policySectionIndex === null) nextSections.push(nextItem);
    else nextSections[policySectionIndex] = nextItem;
    const payload: ManagedRecord = { ...form, sections: nextSections };

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveManaged(managementPaths.pages, payload, String(form.slug));
      setForm(payload);
      setRecords(await listManaged(managementPaths.pages));
      setPolicySectionEditorOpen(false);
      setPolicySectionIndex(null);
      setMessage("Section saved to the website.");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not save this section.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = { ...form };
      if (payload.property === "") delete payload.property;
      await saveManaged(managementPaths[section], payload, editing);
      setMessage("Saved. The public website will show the updated content.");
      await load(section);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not save content.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-8 text-[#232323] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">
              Website Management
            </p>
            <h1 className="font-serif text-3xl font-medium sm:text-4xl">
              Website Content
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">
              Manage the content shown on your website. Changes here add or
              update content; there are no delete controls.
            </p>
          </div>
          <Link
            to="/manage/company-settings"
            className="rounded-full border border-[#232323]/20 px-4 py-2 text-sm hover:bg-white"
          >
            Company Settings →
          </Link>
        </div>
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Content type"
        >
          {tabs.map(([key, label]) => (
            <button
              type="button"
              role="tab"
              aria-selected={section === key}
              key={key}
              onClick={() => {
                setSection(key);
                setMessage("");
              }}
              className={`rounded-full border px-4 py-2.5 text-sm transition ${section === key ? "border-[#232323] bg-[#232323] text-white" : "border-[#232323]/15 bg-white hover:border-[#C5A572]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {section === "pages" &&
          (form.slug === "privacy" || form.slug === "terms") && (
            <p className="mb-5 border border-[#C5A572]/40 bg-[#C5A572]/10 px-5 py-4 text-sm leading-6 text-[#4A4A4A]">
              Privacy and terms are editable starter drafts. Have your business
              and a qualified legal professional review and complete them before
              publication.
            </p>
          )}
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </p>
        )}
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-xl border border-[#E8E5DF] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                Current {tabs.find(([key]) => key === section)?.[1]}
              </h2>
              {section !== "pages" && (
                <button
                  type="button"
                  onClick={startNew}
                  className="rounded-full bg-[#232323] px-4 py-2 text-xs font-medium text-white"
                >
                  Add new
                </button>
              )}
            </div>
            {loading ? (
              <p className="py-6 text-sm text-[#4A4A4A]">Loading content…</p>
            ) : displayRecords.length ? (
              <ul className="divide-y divide-[#E8E5DF]">
                {displayRecords.map((record, index) => {
                  const id = record[identityField[section]] as number | string;
                  return (
                    <li key={String(id ?? index)}>
                      <button
                        type="button"
                        onClick={() => edit(record)}
                        className={`w-full px-2 py-4 text-left transition hover:bg-[#FAFAF8] ${editing === id ? "bg-[#FAFAF8]" : ""}`}
                      >
                        <span className="block font-medium">
                          {String(record[titleField[section]] || "Untitled")}
                        </span>
                        <span className="mt-1 block text-xs text-[#777]">
                          {section === "statistics"
                            ? `${String(record.value)}${String(record.suffix ?? "")}`
                            : section === "pages"
                              ? String(record.slug)
                              : section === "faqs"
                                ? String(
                                    record.category_display ??
                                      record.category ??
                                      "",
                                  )
                                : String(record.property_name ?? "")}
                          {record.is_active === false ? " · Hidden" : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-sm text-[#4A4A4A]">
                No entries yet. Add the first item to show it on your website.
              </p>
            )}
          </section>
          <form
            onSubmit={submit}
            className="rounded-xl border border-[#E8E5DF] bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                {editing !== undefined
                  ? "Edit entry"
                  : section === "pages"
                    ? "Select a page to edit"
                    : "Add an entry"}
              </h2>
              {editing !== undefined && (
                <button
                  type="button"
                  onClick={startNew}
                  className="text-sm text-[#6A6258] underline"
                >
                  Clear form
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {schemas[section]
                .filter((field) => !(isLegalPage && field.name === "body"))
                .map((field) => (
                <label
                  key={field.name}
                  className={`block text-sm text-[#4A4A4A] ${field.kind === "textarea" ? "sm:col-span-2" : ""}`}
                >
                  {field.kind === "checkbox" ? (
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(event) =>
                          change(field.name, event.target.checked)
                        }
                        className="h-4 w-4 accent-[#232323]"
                      />
                      {field.label}
                    </span>
                  ) : (
                    <>
                      {field.label}
                      {field.kind === "textarea" ? (
                        <textarea
                          name={field.name}
                          required={field.required}
                          rows={
                            field.name === "body" ||
                            field.name === "testimonial"
                              ? 9
                              : 4
                          }
                          value={String(form[field.name] ?? "")}
                          onChange={(event) =>
                            change(field.name, event.target.value)
                          }
                          className="mt-1.5 w-full rounded-lg border border-[#DAD6CF] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]"
                        />
                      ) : field.kind === "select" ? (
                        <select
                          name={field.name}
                          value={String(form[field.name] ?? "")}
                          onChange={(event) =>
                            change(field.name, event.target.value)
                          }
                          disabled={
                            section === "pages" &&
                            editing !== undefined &&
                            field.name === "slug"
                          }
                          className="mt-1.5 w-full rounded-lg border border-[#DAD6CF] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]"
                        >
                          {field.options?.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={field.name}
                          type={field.kind ?? "text"}
                          required={field.required}
                          min={field.name === "rating" ? 1 : undefined}
                          max={field.name === "rating" ? 5 : undefined}
                          value={String(form[field.name] ?? "")}
                          onChange={(event) =>
                            change(
                              field.name,
                              field.kind === "number"
                                ? event.target.value === ""
                                  ? ""
                                  : Number(event.target.value)
                                : event.target.value,
                            )
                          }
                          className="mt-1.5 w-full rounded-lg border border-[#DAD6CF] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]"
                        />
                      )}
                    </>
                  )}
                </label>
                ))}
            </div>
            {isLegalPage && (
              <section className="mt-6 rounded-xl border border-[#E8E5DF] bg-[#FAFAF8] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl text-[#232323]">
                      {form.slug === "privacy" ? "Privacy Policy" : "Terms & Conditions"} sections
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#6A6258]">
                      Add or edit one section at a time. Section numbers are assigned automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPolicySection()}
                    className="rounded-full bg-[#232323] px-4 py-2 text-xs font-medium text-white"
                  >
                    Add section
                  </button>
                </div>
                {policySections.length ? (
                  <ol className="mt-4 divide-y divide-[#E8E5DF]">
                    {policySections.map((item, index) => (
                      <li key={`${index}-${item.heading}`} className="flex items-center justify-between gap-3 py-3">
                        <span className="text-sm font-semibold text-[#232323]">
                          {index + 1}. {item.heading}
                        </span>
                        <button
                          type="button"
                          onClick={() => openPolicySection(index)}
                          className="shrink-0 text-sm text-[#6A6258] underline underline-offset-4"
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm text-[#6A6258]">
                    No sections yet. Add the first section to build this page.
                  </p>
                )}
                {policySectionEditorOpen && (
                  <div className="mt-4 space-y-4 rounded-lg border border-[#DAD6CF] bg-white p-4">
                    <h4 className="text-sm font-semibold text-[#232323]">
                      {policySectionIndex === null ? "Add a section" : `Edit section ${policySectionIndex + 1}`}
                    </h4>
                    <label className="block text-sm text-[#4A4A4A]">
                      Section title
                      <input
                        value={policySectionDraft.heading}
                        onChange={(event) => setPolicySectionDraft((current) => ({ ...current, heading: event.target.value }))}
                        placeholder="e.g. Information we collect"
                        className="mt-1.5 w-full rounded-lg border border-[#DAD6CF] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]"
                      />
                    </label>
                    <label className="block text-sm text-[#4A4A4A]">
                      Section body
                      <textarea
                        rows={5}
                        value={policySectionDraft.body}
                        onChange={(event) => setPolicySectionDraft((current) => ({ ...current, body: event.target.value }))}
                        placeholder="Write the content for this section."
                        className="mt-1.5 w-full rounded-lg border border-[#DAD6CF] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => void savePolicySection()}
                        disabled={saving}
                        className="rounded-full bg-[#232323] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                      >
                        {saving ? "Saving…" : "Save section"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPolicySectionEditorOpen(false)}
                        className="rounded-full border border-[#232323]/20 px-5 py-2.5 text-sm text-[#4A4A4A]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
            <button
              type="submit"
              disabled={
                saving || (section === "pages" && editing === undefined)
              }
              className="mt-6 rounded-full bg-[#232323] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#403B34] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default WebsiteContentManagement;
