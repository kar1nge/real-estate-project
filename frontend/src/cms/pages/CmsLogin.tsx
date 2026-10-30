import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCmsSession, signInCms } from "../services/cmsAuthService";

export default function CmsLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: string } | null)?.from ?? "/manage";

  useEffect(() => {
    let active = true;
    getCmsSession().then((user) => {
      if (active && user) navigate("/manage", { replace: true });
    }).catch(() => undefined).finally(() => {
      if (active) setChecking(false);
    });
    return () => { active = false; };
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInCms(username, password);
      navigate(from, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#FAFAF8] text-sm text-[#666]">Loading sign-in…</main>;
  return (
    <main className="cms-auth-page grid min-h-screen place-items-center bg-[#FAFAF8] px-4 py-12 text-[#232323]">
      <section className="w-full max-w-md rounded-2xl border border-[#E8E5DF] bg-white p-7 shadow-sm sm:p-9">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Website Management</p>
        <h1 className="font-serif text-3xl">Sign in to the CMS</h1>
        <p className="mt-2 text-sm leading-6 text-[#666]">Use your staff account to manage the website.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">Username
            <input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2.5 outline-none focus:border-[#9B7B4B]" />
          </label>
          <label className="block text-sm font-medium">Password
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2.5 outline-none focus:border-[#9B7B4B]" />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-md bg-[#232323] px-4 py-3 text-sm font-medium text-white hover:bg-[#3C3C3C] disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
        <Link to="/" className="mt-6 inline-block text-sm text-[#666] underline underline-offset-4">Return to website</Link>
      </section>
    </main>
  );
}
