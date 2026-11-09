import { API_BASE_URL } from "../../services/apiConfig";

const SESSION_URL = `${API_BASE_URL}cms/session/`;
const LOGIN_URL = `${API_BASE_URL}cms/login/`;
const CSRF_URL = `${API_BASE_URL}csrf/`;
const configuredCmsPublicUrl = import.meta.env.VITE_CMS_PUBLIC_URL?.trim().replace(/\/+$/, "");
const cmsPublicUrl = configuredCmsPublicUrl || window.location.origin;

export function getCmsActivationUrl(token: string): string {
  return `${cmsPublicUrl}/activate/${encodeURIComponent(token)}`;
}

export interface CmsUser {
  id: number;
  username: string;
  email?: string;
  is_superuser: boolean;
  theme: "light" | "dark";
}

export interface CmsAccount {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  theme: "light" | "dark";
  claimed: boolean;
}

export interface CmsMyAccount {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  theme: "light" | "dark";
}

export async function getCmsSession(): Promise<CmsUser | null> {
  const response = await fetch(SESSION_URL, { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Could not verify your CMS sign-in.");
  const data = await response.json() as { user: CmsUser };
  return data.user;
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(CSRF_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Could not start a secure sign-in session.");
  const data = await response.json() as { csrfToken: string };
  return data.csrfToken;
}

export const getCmsCsrfToken = getCsrfToken;

export async function signInCms(username: string, password: string): Promise<CmsUser> {
  const csrfToken = await getCsrfToken();
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json().catch(() => ({})) as { user?: CmsUser; detail?: string };
  if (!response.ok || !data.user) throw new Error(data.detail ?? "Sign-in failed.");
  return data.user;
}

export async function signOutCms(): Promise<void> {
  const csrfToken = await getCsrfToken();
  const response = await fetch(SESSION_URL, {
    method: "DELETE",
    credentials: "include",
    headers: { "X-CSRFToken": csrfToken },
  });
  if (!response.ok) throw new Error("Could not sign out. Please try again.");
}

async function protectedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const csrfResponse = await fetch(CSRF_URL, { credentials: "include" });
  if (!csrfResponse.ok) throw new Error("Could not start a secure CMS request.");
  const { csrfToken } = await csrfResponse.json() as { csrfToken: string };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.method && init.method !== "GET" ? { "X-CSRFToken": csrfToken } : {}),
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as T & { detail?: string };
  if (!response.ok) throw new Error(data.detail ?? `CMS request failed (${response.status}).`);
  return data;
}

export function activateCmsAccount(token: string, password: string): Promise<{ user: CmsUser }> {
  return protectedRequest("cms/activate/", { method: "POST", body: JSON.stringify({ token, password }) });
}

export async function listCmsAccounts(): Promise<CmsAccount[]> {
  const data = await protectedRequest<{ results: CmsAccount[] }>("cms/accounts/");
  return data.results;
}

export function createCmsAccount(username: string, email: string): Promise<{ id: number; username: string; email: string; activation_token: string }> {
  return protectedRequest("cms/accounts/", { method: "POST", body: JSON.stringify({ username, email }) });
}

export function renewCmsInvitation(id: number): Promise<{ activation_token: string }> {
  return protectedRequest(`cms/accounts/${id}/invite/`, { method: "POST", body: JSON.stringify({}) });
}

export function updateCmsAccount(id: number, changes: Partial<Pick<CmsAccount, "is_active" | "theme">>): Promise<unknown> {
  return protectedRequest(`cms/accounts/${id}/`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function updateCmsTheme(theme: CmsUser["theme"]): Promise<{ theme: CmsUser["theme"] }> {
  return protectedRequest("cms/preferences/", { method: "PATCH", body: JSON.stringify({ theme }) });
}

export function getCmsMyAccount(): Promise<CmsMyAccount> {
  return protectedRequest("cms/my-account/");
}

export function updateCmsMyAccount(data: Partial<CmsMyAccount> & {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}): Promise<CmsMyAccount> {
  return protectedRequest("cms/my-account/", { method: "PATCH", body: JSON.stringify(data) });
}
