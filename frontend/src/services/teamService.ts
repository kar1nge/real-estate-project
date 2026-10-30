import axios from "axios";
import type { TeamMember } from "../types/team";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}team/`;

interface PaginatedTeamMembers {
    count: number;
    next: string | null;
    previous: string | null;
    results: TeamMember[];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
    const response = await axios.get<PaginatedTeamMembers>(API_URL);

    return response.data.results;
}
