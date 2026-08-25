import axios from "axios";
import type { Property } from "../types/property";

const API_URL = "http://127.0.0.1:8000/api/properties/";

export interface PaginatedProperties {
    count: number;
    next: string | null;
    previous: string | null;
    results: Property[];
}

export interface PropertyFilters {
    search?: string;
    location__slug?: string;
    property_type?: number;
    status?: number;
    bedrooms?: number;
    starting_price__gte?: number;
    starting_price__lte?: number;
    page?: number;
}

export interface Location {
    id: number;
    name: string;
    slug: string;
    description: string;
    hero_image: string | null;
    latitude: string | null;
    longitude: string | null;
    created_at: string;
    property_count: number; 
}

export interface PropertyType {
    id: number;
    name: string;
}

export interface PropertyStatus {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
    slug: string;
    description: string;
    hero_image: string | null;
    latitude: string | null;
    longitude: string | null;
    created_at: string;
}

export interface PropertyType {
    id: number;
    name: string;
}

export interface PropertyStatus {
    id: number;
    name: string;
}



export async function getLocations(): Promise<Location[]> {
    const response = await axios.get<Location[]>(
        `${API_URL}locations/`
    );

    return response.data;
}

export async function getPropertyTypes(): Promise<PropertyType[]> {
    const response = await axios.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: PropertyType[];
    }>(`${API_URL}property-types/`);

    return response.data.results;
}

export async function getProperty(
    slug: string
): Promise<Property> {
    const response = await axios.get<Property>(
        `${API_URL}${slug}/`
    );

    return response.data;
}

export async function getPropertyStatuses(): Promise<PropertyStatus[]> {
    const response = await axios.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: PropertyStatus[];
    }>(`${API_URL}statuses/`);

    return response.data.results;
}

export async function getProperties(
    filters: PropertyFilters = {}
): Promise<PaginatedProperties> {
    const response = await axios.get<PaginatedProperties>(
        API_URL,
        {
            params: filters,
        }
    );

    return response.data;
}



