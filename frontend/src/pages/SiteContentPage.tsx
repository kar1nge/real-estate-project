import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TeamSection from "../components/about/TeamSection";
import { getSitePage, type SitePage } from "../services/siteContentService";

interface Props {
  slug: SitePage["slug"];
  fallbackTitle: string;
  showTeam?: boolean;
}

export default function SiteContentPage({
  slug,
  fallbackTitle,
  showTeam = false,
}: Props) {
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getSitePage(slug)
      .then((content) => {
        if (active) setPage(content);
      })
      .catch((error) =>
        console.error(`Could not load ${slug} page content:`, error),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  const title = page?.title || fallbackTitle;
  const paragraphs =
    page?.body
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean) ?? [];
  const policySections = page?.sections ?? [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <Navbar />
      <main>
        <section className="border-b border-black/5 bg-[#232323] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(5rem,10vw,7rem)] text-white">
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-5 text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
              {page?.eyebrow || (slug === "about" ? "Our Company" : "Legal")}
            </p>
            <h1 className="font-[Cormorant_Garamond] text-[clamp(3rem,7vw,5.5rem)] font-light leading-[0.9] tracking-tight">
              {title}
            </h1>
            {page?.lead && (
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70">
                {page.lead}
              </p>
            )}
          </div>
        </section>
        <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(4rem,8vw,6rem)]">
          <div className="mx-auto w-full max-w-4xl">
            {loading ? (
              <p className="text-sm text-[#4A4A4A]">Loading page content…</p>
            ) : policySections.length ? (
              <div className="space-y-9">
                {policySections.map((section, index) => (
                  <section key={`${index}-${section.heading}`}>
                    <h2 className="font-[Cormorant_Garamond] text-xl font-semibold text-[#232323] sm:text-2xl">
                      {index + 1}. {section.heading}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {section.body
                        .split(/\n\s*\n/)
                        .map((paragraph) => paragraph.trim())
                        .filter(Boolean)
                        .map((paragraph, paragraphIndex) => (
                          <p
                            key={paragraphIndex}
                            className="text-sm leading-8 text-[#4A4A4A] sm:text-base"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : paragraphs.length ? (
              <div className="space-y-7">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-8 text-[#4A4A4A] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#4A4A4A]">
                Page content is being prepared.
              </p>
            )}
            {page?.updated_at && (
              <p className="mt-12 border-t border-black/10 pt-6 text-xs leading-6 text-[#4A4A4A]/70">
                Last updated: {new Date(page.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </section>
        {showTeam && (
          <section id="team">
            <TeamSection />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
