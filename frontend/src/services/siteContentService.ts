import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}site-content/`;

export interface SitePage {
    slug: "about" | "privacy" | "terms";
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    sections: Array<{ heading: string; body: string }>;
    updated_at: string;
}

export async function getSitePage(slug: SitePage["slug"]): Promise<SitePage> {
    const response = await axios.get<SitePage>(`${API_URL}${slug}/`);
    return response.data;
}
