import type { CompanySettings } from "../../types/companySettings";
import { API_BASE_URL } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}contacts/manage/`;
const CSRF_URL = `${API_BASE_URL}csrf/`;

async function responseError(response: Response): Promise<Error> {
    try {
        const body = await response.json() as { detail?: string };
        if (body.detail) return new Error(body.detail);
    } catch {
        // Django may return an HTML response for middleware-level CSRF failures.
    }
    if (response.status === 403) {
        return new Error("Save was forbidden. Sign in to the CMS using a staff account, then try again.");
    }
    return new Error(`Company settings request failed (${response.status}).`);
}

export async function getCompanySettings(): Promise<CompanySettings> {
    const response = await fetch(API_URL, { credentials: "include" });
    if (!response.ok) throw await responseError(response);
    return response.json() as Promise<CompanySettings>;
}

async function getCsrfToken(): Promise<string> {
    const response = await fetch(CSRF_URL, { credentials: "include" });
    if (!response.ok) throw await responseError(response);
    const data = await response.json() as { csrfToken: string };
    return data.csrfToken;
}

export async function updateCompanySettings(
    data: CompanySettings,
): Promise<CompanySettings> {
    const csrfToken = await getCsrfToken();
    const response = await fetch(API_URL, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw await responseError(response);
    return response.json() as Promise<CompanySettings>;
}
