import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { activateCmsAccount } from "../services/cmsAuthService";

export default function CmsActivateAccount() {
  const [params] = useSearchParams();
  const { token: pathToken } = useParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = pathToken ?? params.get("token") ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await activateCmsAccount(token, password);
      navigate("/manage", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not activate this account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="cms-auth-page grid min-h-screen place-items-center bg-[#FAFAF8] px-4 py-12 text-[#232323]">
      <section className="w-full max-w-md rounded-2xl border border-[#E8E5DF] bg-white p-7 shadow-sm sm:p-9">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Website Management</p>
        <h1 className="font-serif text-3xl">Set up your account</h1>
        <p className="mt-2 text-sm leading-6 text-[#666]">An administrator created this account for you. Set a password to finish activation.</p>
        {!token ? <p role="alert" className="mt-6 text-sm text-red-700">This activation link is missing its invitation token. Ask your administrator for a fresh link.</p> : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium">New password
              <input required minLength={10} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2.5 outline-none focus:border-[#9B7B4B]" />
            </label>
            <label className="block text-sm font-medium">Confirm password
              <input required minLength={10} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2.5 outline-none focus:border-[#9B7B4B]" />
            </label>
            <p className="text-xs text-[#666]">Use at least 10 characters.</p>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button disabled={submitting} className="w-full rounded-md bg-[#232323] px-4 py-3 text-sm font-medium text-white hover:bg-[#3C3C3C] disabled:opacity-60">{submitting ? "Activating…" : "Activate account"}</button>
          </form>
        )}
        <Link to="/manage/login" className="mt-6 inline-block text-sm text-[#666] underline underline-offset-4">Go to sign in</Link>
      </section>
    </main>
  );
}
