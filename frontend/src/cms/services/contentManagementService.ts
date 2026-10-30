import type { SitePage } from "../../services/siteContentService";
import { API_BASE_URL } from "../../services/apiConfig";

const API = API_BASE_URL;
export interface PolicySection {
    heading: string;
    body: string;
}
export type RecordValue = string | number | boolean | null | PolicySection[];
export type ManagedRecord = Record<string, RecordValue>;

function csrfToken() {
    return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("csrftoken="))?.slice("csrftoken=".length) ?? "";
}

async function request<T>(path: string, method = "GET", body?: ManagedRecord): Promise<T> {
    const response = await fetch(`${API}${path}`, {
        method,
        credentials: "include",
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(method !== "GET" ? { "X-CSRFToken": csrfToken() } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
        if (response.status === 403 || response.status === 401) throw new Error("Please sign in as a staff user before managing website content.");
        throw new Error(`Could not save website content (HTTP ${response.status}).`);
    }
    return response.json() as Promise<T>;
}

interface ListResponse<T> { results?: T[]; }
function unpack<T>(data: T[] | ListResponse<T>): T[] {
    return Array.isArray(data) ? data : data.results ?? [];
}

export async function listManaged(path: string): Promise<ManagedRecord[]> {
    const data = await request<ManagedRecord[] | ListResponse<ManagedRecord>>(path);
    return unpack(data);
}

export async function saveManaged(path: string, record: ManagedRecord, id?: number | string): Promise<void> {
    const detail = id === undefined ? path : `${path}${id}/`;
    await request<ManagedRecord>(detail, id === undefined ? "POST" : "PATCH", record);
}

export const managementPaths = {
    statistics: "statistics/manage/",
    testimonials: "testimonials/manage/",
    faqs: "faqs/manage/",
    pages: "site-content/manage/",
} as const;

export type EditablePage = SitePage & ManagedRecord;
