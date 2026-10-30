import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCmsSession, signOutCms, updateCmsTheme, type CmsUser } from "../services/cmsAuthService";

const links = [
  { label: "Overview", to: "/manage", end: true },
  { label: "Properties", to: "/manage/properties" },
  { label: "Company & Contacts", to: "/manage/company-settings" },
  { label: "Website Content", to: "/manage/content" },
  { label: "Employees", to: "/manage/employees" },
  { label: "Hero Slides", to: "/manage/hero" },
];

export default function CmsLayout() {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getCmsSession()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not verify sign-in.");
      })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [location.pathname]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen]);

  async function handleSignOut() {
    try {
      await signOutCms();
      navigate("/manage/login", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign out.");
    }
  }

  async function handleThemeChange() {
    if (!user) return;
    const theme = user.theme === "dark" ? "light" : "dark";
    try {
      await updateCmsTheme(theme);
      setUser({ ...user, theme });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your theme preference.");
    }
  }

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#FAFAF8] text-sm text-[#666]">Checking CMS access…</main>;
  if (!user) return <Navigate to="/manage/login" replace state={{ from: location.pathname }} />;

  return (
    <div data-cms-theme={user.theme} className="cms-theme min-h-screen bg-[#FAFAF8] text-[#232323]">
      <header className="border-b border-[#E8E5DF] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog" aria-expanded={drawerOpen} aria-label="Open CMS navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[#D8D3CA] hover:bg-[#F4F1EB]">
              <span aria-hidden="true" className="flex flex-col gap-1"><span className="h-0.5 w-5 bg-current" /><span className="h-0.5 w-5 bg-current" /><span className="h-0.5 w-5 bg-current" /></span>
            </button>
            <Link to="/manage" className="truncate font-serif text-xl">Website Management</Link>
          </div>
          <button type="button" onClick={handleThemeChange} aria-label={user.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} title={user.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[#D8D3CA] text-lg hover:bg-[#F4F1EB]">{user.theme === "dark" ? "☀" : "☾"}</button>
        </div>
        {error && <p role="alert" className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-700 sm:px-6">{error}</p>}
      </header>
      {drawerOpen && (
        <div className="cms-nav-drawer fixed inset-0 z-50" role="presentation">
          <button type="button" aria-label="Close CMS navigation" onClick={() => setDrawerOpen(false)} className="absolute inset-0 h-full w-full bg-black/40" />
          <aside role="dialog" aria-modal="true" aria-labelledby="cms-nav-title" className="relative flex h-full w-[min(22rem,88vw)] flex-col border-r border-[#E8E5DF] bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 id="cms-nav-title" className="font-serif text-2xl">CMS Navigation</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close CMS navigation" className="grid h-10 w-10 place-items-center rounded-md border border-[#D8D3CA] text-xl">×</button>
            </div>
            <nav aria-label="CMS management pages" className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setDrawerOpen(false)} className={({ isActive }) =>
                  `rounded-md px-4 py-3 text-sm transition ${isActive ? "bg-[#232323] text-white" : "text-[#4A4A4A] hover:bg-[#F4F1EB]"}`
                }>{link.label}</NavLink>
              ))}
              {user.is_superuser && <NavLink to="/manage/accounts" onClick={() => setDrawerOpen(false)} className={({ isActive }) =>
                `rounded-md px-4 py-3 text-sm transition ${isActive ? "bg-[#232323] text-white" : "text-[#4A4A4A] hover:bg-[#F4F1EB]"}`
              }>Accounts</NavLink>}
            </nav>
            <div className="mt-auto border-t border-[#E8E5DF] pt-4">
              <p className="mb-2 px-4 text-xs text-[#666]">Signed in as {user.username}</p>
              <Link to="/manage/my-account" onClick={() => setDrawerOpen(false)} className="block rounded-md px-4 py-3 text-sm text-[#4A4A4A] hover:bg-[#F4F1EB]">My Account</Link>
              <button type="button" onClick={handleThemeChange} className="w-full rounded-md px-4 py-3 text-left text-sm text-[#4A4A4A] hover:bg-[#F4F1EB]">Switch to {user.theme === "dark" ? "light" : "dark"} theme</button>
              <button type="button" onClick={handleSignOut} className="w-full rounded-md px-4 py-3 text-left text-sm text-[#4A4A4A] hover:bg-[#F4F1EB]">Sign out</button>
            </div>
          </aside>
        </div>
      )}
      <Outlet />
    </div>
  );
}
