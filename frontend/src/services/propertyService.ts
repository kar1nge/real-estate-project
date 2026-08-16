import axios from "axios";
import type { Property } from "../types/property";

const API_URL = "http://127.0.0.1:8000/api/properties/";

interface PropertyResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Property[];
}

export async function getProperties(): Promise<Property[]> {
    const response = await axios.get<PropertyResponse>(API_URL);

    return response.data.results;
}