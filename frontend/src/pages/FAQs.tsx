import { useEffect, useMemo, useState } from "react";
import { getFAQs } from "../services/faqService";
import { Link } from "react-router-dom";
import type { FAQ } from "../types/faq";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFAQs() {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFAQs();
  }, []);

  const categories = [
    "All",
    "General",
    "Buying",
    "Renting",
    "Site Visits",
    "Properties",
    "Legal",
    "Support",
  ];

  const filteredFAQs = useMemo(() => {
    const filtered = faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category_display === activeCategory;

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }

      return a.display_order - b.display_order;
    });
  }, [faqs, activeCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <Navbar />
      {/* FAQ Hero */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pt-32 pb-16">
        <div className="mx-auto grid max-w-[1280px] items-end gap-12 lg:grid-cols-[1.5fr_0.8fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C5A572]">
              Frequently Asked Questions
            </p>

            <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight text-[#232323] sm:text-6xl lg:text-7xl">
              Answers,
              <br />
              made simple.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#4A4A4A] sm:text-lg">
              Find clear answers to common questions about our properties,
              services, buying process, site visits, and more.
            </p>
          </div>

          <div className="border-l border-[#232323]/10 pl-8 pb-2 lg:pl-10">
            <p className="font-serif text-6xl leading-none text-[#232323] sm:text-7xl">
              {faqs.length.toString().padStart(2, "0")}
            </p>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#4A4A4A]">
              Frequently asked questions covering our properties, services, and
              client experience.
            </p>

            <div className="mt-6 h-px w-16 bg-[#C5A572]" />
          </div>
        </div>
      </section>

      {/* FAQ Search */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pb-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search your question..."
              className="w-full border-b border-[#232323]/20 bg-transparent px-0 py-4 pr-12 text-base text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/60 focus:border-[#C5A572]"
            />

            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-sm text-[#4A4A4A]/60">
              ⌕
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pb-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? "border-[#232323] bg-[#232323] text-white"
                    : "border-[#232323]/15 text-[#4A4A4A] hover:border-[#C5A572] hover:text-[#232323]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C5A572]">
                Find Your Answer
              </p>

              <h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight text-[#232323] sm:text-5xl">
                Everything you need to know.
              </h2>
            </div>

            <div className="border-t border-[#232323]/15">
              {loading ? (
                <div className="py-8 text-sm text-[#4A4A4A]">
                  Loading questions...
                </div>
              ) : filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group border-b border-[#232323]/15"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                      <span className="font-serif text-xl text-[#232323] sm:text-2xl">
                        {faq.question}
                      </span>

                      <span className="shrink-0 text-2xl font-light text-[#C5A572] transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>

                    <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-[#4A4A4A] sm:text-base">
                      {faq.answer}
                    </p>
                  </details>
                ))
              ) : (
                <div className="py-10 text-sm leading-7 text-[#4A4A4A]">
                  No questions match your search. Try another question or
                  category.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-[2rem] bg-[#232323] px-6 py-14 text-center sm:px-10 sm:py-16">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C5A572]">
              Still Have a Question?
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              We are here to help.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              If you cannot find the answer you are looking for, send us a
              message and our team will be happy to assist.
            </p>

            <Link
              to="/inquiry"
              className="mt-8 inline-block rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#232323]"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default FAQs;
