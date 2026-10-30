import axios from "axios";
import type { FAQ } from "../types/faq";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}faqs/`;

interface PaginatedFAQs {
    count: number;
    next: string | null;
    previous: string | null;
    results: FAQ[];
}

export async function getFAQs(): Promise<FAQ[]> {
    const response = await axios.get<PaginatedFAQs>(API_URL);

    return response.data.results;
}
