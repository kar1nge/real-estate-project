import axios from "axios";
import type { FAQ } from "../types/faq";

const API_URL = "http://127.0.0.1:8000/api/faqs/";

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