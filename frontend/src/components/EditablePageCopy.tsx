import { useEffect, useState } from "react";
import { getSitePage, type SitePage } from "../services/siteContentService";

export default function EditablePageCopy({ slug }: { slug: SitePage["slug"] }) {
  const [page, setPage] = useState<SitePage | null>(null);
  useEffect(() => {
    let active = true;
    getSitePage(slug)
      .then((item) => {
        if (active) setPage(item);
      })
      .catch((error) =>
        console.error(`Unable to load editable ${slug} copy:`, error),
      );
    return () => {
      active = false;
    };
  }, [slug]);
  if (!page || (!page.lead && !page.body)) return null;
  const paragraphs = page.body
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);
  return (
    <section className="border-t border-black/10 bg-[#FAFAF8] px-[clamp(1rem,4vw,2.5rem)] py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C5A572]">
          Website copy
        </p>
        <h2 className="mt-3 font-[Cormorant_Garamond] text-4xl font-light text-[#232323]">
          {page.title}
        </h2>
        {page.lead && (
          <p className="mt-5 text-base leading-7 text-[#4A4A4A]">{page.lead}</p>
        )}
        <div className="mt-6 space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-[#4A4A4A]">
              {paragraph}
            </p>
          ))}
        </div>
        {(slug === "privacy" || slug === "terms") && (
          <p className="mt-8 border border-[#C5A572]/40 bg-[#C5A572]/10 px-5 py-4 text-sm leading-6 text-[#4A4A4A]">
            Editable starter draft: have your business and a qualified legal
            professional review and complete this content before publication.
          </p>
        )}
      </div>
    </section>
  );
}
