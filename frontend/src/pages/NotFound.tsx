import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#232323]">
      <Navbar />
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-[clamp(1rem,4vw,2.5rem)] py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#C5A572]">
          Page not found
        </p>
        <p className="mt-5 font-serif text-[clamp(5rem,18vw,10rem)] leading-none text-[#232323]">
          404
        </p>
        <h1 className="mt-5 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-normal">
          This page is no longer here.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#4A4A4A] sm:text-base">
          The address may be incorrect, or the page may have moved. Let’s help
          you find your way back.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-[#232323] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#C5A572]"
          >
            Back to home
          </Link>
          <Link
            to="/properties"
            className="rounded-full border border-[#232323]/20 px-6 py-3 text-sm font-medium transition hover:border-[#C5A572] hover:text-[#8B6B3E]"
          >
            Browse properties
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
