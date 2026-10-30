import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { createCmsAccount, getCmsActivationUrl, getCmsSession, listCmsAccounts, renewCmsInvitation, updateCmsAccount, type CmsAccount, type CmsUser } from "../services/cmsAuthService";

export default function CmsAccounts() {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [accounts, setAccounts] = useState<CmsAccount[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [activationLink, setActivationLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [sessionUser, managedAccounts] = await Promise.all([getCmsSession(), listCmsAccounts()]);
    setUser(sessionUser);
    setAccounts(managedAccounts);
  }, []);

  useEffect(() => {
    refresh().catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Could not load accounts."))
      .finally(() => setLoading(false));
  }, [refresh]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setActivationLink("");
    try {
      const created = await createCmsAccount(username, email);
      setActivationLink(getCmsActivationUrl(created.activation_token));
      setUsername("");
      setEmail("");
      setMessage("Account created. Share its activation link with the user; it expires in 7 days.");
      await refresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not create the account.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(id: number, changes: Partial<Pick<CmsAccount, "is_active" | "theme">>) {
    setMessage("");
    try {
      await updateCmsAccount(id, changes);
      await refresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not update this account.");
    }
  }

  async function handleRenew(id: number) {
    setMessage("");
    try {
      const invitation = await renewCmsInvitation(id);
      setActivationLink(getCmsActivationUrl(invitation.activation_token));
      setMessage("A fresh activation link is ready and expires in 7 days.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not renew the invitation.");
    }
  }

  if (loading) return <main className="p-8 text-sm">Loading accounts…</main>;
  if (!user?.is_superuser) return <Navigate to="/manage" replace />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Administration</p>
      <h1 className="font-serif text-4xl">CMS accounts</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">Create staff accounts before users sign up. Each user activates their invitation by choosing a password. Manage access and saved theme preferences here.</p>

      <section className="mt-8 rounded-xl border border-[#E8E5DF] bg-white p-6">
        <h2 className="font-serif text-2xl">Create an account</h2>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium">Username<input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <label className="text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-md border border-[#D8D3CA] px-3 py-2" /></label>
          <button disabled={busy} className="self-end rounded-md bg-[#232323] px-4 py-2.5 text-sm text-white disabled:opacity-60">{busy ? "Creating…" : "Create staff account"}</button>
        </form>
      </section>

      {message && <p role="status" className="mt-5 rounded-md bg-[#F4F1EB] p-3 text-sm">{message}</p>}
      {activationLink && <div className="mt-3 break-all rounded-md border border-[#E8E5DF] bg-white p-4 text-sm"><p className="mb-2 font-medium">Activation link — share privately with the user:</p><code>{activationLink}</code><button onClick={() => navigator.clipboard?.writeText(activationLink)} className="ml-3 underline">Copy</button></div>}

      <section className="mt-8 overflow-x-auto rounded-xl border border-[#E8E5DF] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#E8E5DF] text-[#666]"><tr><th className="p-4">User</th><th className="p-4">Access</th><th className="p-4">Theme</th><th className="p-4">Account</th><th className="p-4">Actions</th></tr></thead>
          <tbody>{accounts.map((account) => <tr key={account.id} className="border-b border-[#E8E5DF] last:border-0">
            <td className="p-4"><strong>{account.username}</strong><div className="mt-1 text-xs text-[#666]">{account.email}</div></td>
            <td className="p-4">{account.is_superuser ? "Administrator" : "CMS staff"}</td>
            <td className="p-4"><select aria-label={`Theme for ${account.username}`} value={account.theme} onChange={(event) => void handleUpdate(account.id, { theme: event.target.value as CmsAccount["theme"] })} className="rounded border border-[#D8D3CA] px-2 py-1"><option value="light">Light</option><option value="dark">Dark</option></select></td>
            <td className="p-4">{!account.claimed ? "Awaiting activation" : account.is_active ? "Active" : "Disabled"}</td>
            <td className="p-4"><div className="flex gap-3">{!account.is_superuser && account.claimed && <button onClick={() => void handleUpdate(account.id, { is_active: !account.is_active })} className="underline">{account.is_active ? "Disable" : "Enable"}</button>}{!account.claimed && <button onClick={() => void handleRenew(account.id)} className="underline">New invite link</button>}</div></td>
          </tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}
