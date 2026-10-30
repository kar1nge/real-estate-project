import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export interface Statistic {
    id: number;
    label: string;
    value: number;
    suffix: string;
    display_order: number;
}

interface PaginatedStatistics {
    count: number;
    next: string | null;
    previous: string | null;
    results: Statistic[];
}

export async function getStatistics(): Promise<Statistic[]> {
    const response = await axios.get<Statistic[] | PaginatedStatistics>(`${API_BASE_URL}statistics/`);
    return Array.isArray(response.data) ? response.data : response.data.results;
}
