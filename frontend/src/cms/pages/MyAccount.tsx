import { useEffect, useState, type FormEvent } from "react";
import { getCmsMyAccount, updateCmsMyAccount, type CmsMyAccount } from "../services/cmsAuthService";

export default function MyAccount() {
  const [account, setAccount] = useState<CmsMyAccount | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCmsMyAccount().then(setAccount)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load your account."))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;
    setSavingProfile(true);
    setError("");
    setMessage("");
    try {
      setAccount(await updateCmsMyAccount({ first_name: account.first_name, last_name: account.last_name, email: account.email }));
      setMessage("Your personal details have been saved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your details.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setError("");
    setMessage("");
    try {
      await updateCmsMyAccount({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been changed.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not change your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) return <main className="p-8 text-sm">Loading your account…</main>;
  if (!account) return <main className="mx-auto max-w-3xl px-4 py-10 text-sm">{error || "Your account could not be loaded."}</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Personal settings</p>
      <h1 className="font-serif text-4xl">My Account</h1>
      <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">Update your own contact details, password, and CMS appearance preference.</p>
      {message && <p role="status" className="mt-5 rounded-md bg-[#F4F1EB] p-3 text-sm">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="mt-7 rounded-xl border border-[#E8E5DF] bg-white p-6">
        <h2 className="font-serif text-2xl">Personal details</h2>
        <form onSubmit={saveProfile} className="mt-5 space-y-4">
          <div className="text-sm text-[#666]">Username: <strong className="text-[#232323]">{account.username}</strong></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">First name<input value={account.first_name} onChange={(event) => setAccount({ ...account, first_name: event.target.value })} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
            <label className="text-sm font-medium">Last name<input value={account.last_name} onChange={(event) => setAccount({ ...account, last_name: event.target.value })} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          </div>
          <label className="block text-sm font-medium">Email<input required type="email" value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <div className="flex items-center justify-between gap-3"><p className="text-sm">Appearance: <strong className="capitalize">{account.theme}</strong> · Change it with the theme button in the CMS header.</p><button disabled={savingProfile} className="rounded-md bg-[#232323] px-4 py-2.5 text-sm text-white disabled:opacity-60">{savingProfile ? "Saving…" : "Save details"}</button></div>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-[#E8E5DF] bg-white p-6">
        <h2 className="font-serif text-2xl">Change password</h2>
        <p className="mt-2 text-sm text-[#666]">Choose a password with at least 10 characters.</p>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="block text-sm font-medium">New password<input required minLength={10} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="block text-sm font-medium">Confirm new password<input required minLength={10} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <button disabled={savingPassword} className="rounded-md bg-[#232323] px-4 py-2.5 text-sm text-white disabled:opacity-60">{savingPassword ? "Updating…" : "Update password"}</button>
        </form>
      </section>
    </main>
  );
}
