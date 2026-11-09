import { Link } from "react-router-dom";

const sections = [
  {
    title: "Website Content",
    description:
      "Statistics, testimonials, FAQs, About Us, Privacy Policy and Terms & Conditions.",
    to: "/manage/content",
  },
  {
    title: "Properties",
    description: "Manage listings and property details.",
    to: "/manage/properties",
  },
  {
    title: "Hero Slides",
    description: "Edit the homepage hero slides and images.",
    to: "/manage/hero",
  },
  {
    title: "Company Settings",
    description: "Update public contact and social details.",
    to: "/manage/company-settings",
  },
  {
    title: "Employees",
    description: "Add, edit, and show or hide employee profiles on the website.",
    to: "/manage/employees",
  },
  {
    title: "Site Visits",
    description: "Create viewing times, add phone bookings, and confirm website requests.",
    to: "/manage/site-visits",
  },
  {
    title: "Visitor Questions",
    description: "Review questions sent from the FAQs page and email visitors a reply.",
    to: "/manage/visitor-questions",
  },
];

export default function ManagementHome() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12 text-[#232323] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">
          Website Management
        </p>
        <h1 className="font-serif text-4xl">Content Management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">
          Choose an area to manage your website content.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sections.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl border border-[#E8E5DF] bg-white p-6 shadow-sm transition hover:border-[#C5A572]"
            >
              <h2 className="font-serif text-2xl">
                {item.title} <span aria-hidden="true">→</span>
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
