import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}testimonials/`;

export interface Testimonial {
    id: number;
    client_name: string;
    testimonial: string;
    rating: number;
    property_name: string | null;
}

interface PaginatedTestimonials {
    results: Testimonial[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
    const response = await axios.get<PaginatedTestimonials | Testimonial[]>(API_URL);
    return Array.isArray(response.data) ? response.data : response.data.results;
}
