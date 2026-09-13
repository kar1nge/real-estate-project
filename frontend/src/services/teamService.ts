import axios from "axios";
import type { TeamMember } from "../types/team";

const API_URL = "http://127.0.0.1:8000/api/team/";

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