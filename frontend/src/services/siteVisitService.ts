import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import type {
    SiteVisitSchedule,
    CreateSiteVisitBookingData,
} from "../types/siteVisit";

const API_URL = `${API_BASE_URL}site-visits/`;

export async function getSiteVisitSchedules(): Promise<SiteVisitSchedule[]> {
    const response = await axios.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: SiteVisitSchedule[];
    }>(`${API_URL}schedules/`);

    return response.data.results;
}

export async function createSiteVisitBooking(
    data: CreateSiteVisitBookingData
): Promise<void> {
    await axios.post(`${API_URL}book/`, data);
}
