import type {
    Property,
    PropertyImage,
} from "../../types/property";
import { API_BASE_URL } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}properties/manage/`;

export interface PropertyManagementData {
    title: string;
    short_description: string;
    description: string;
    property_type: number;
    status: number;
    starting_price: string;
    bedrooms: number;
    bathrooms: number;
    location: number;
    google_maps_url: string;
    featured: boolean;
    homepage_order: number | null;
    publication_status: "draft" | "published";
    amenities: number[];
    youtube_url: string;
    similar_properties: number[];
    completion_date: string;
}

export interface PaginatedProperties {
    count: number;
    next: string | null;
    previous: string | null;
    results: Property[];
}

function getCsrfToken(): string {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

    return cookie
        ? decodeURIComponent(cookie.split("=")[1])
        : "";
}

export async function getPropertiesForManagement(
  page = 1,
): Promise<PaginatedProperties> {
  const url = new URL(API_URL, window.location.origin);
  url.searchParams.set("page", String(page));

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties.");
  }

  const data: PaginatedProperties = await response.json();
  return data;
}

export async function createProperty(
    data: PropertyManagementData
): Promise<Property> {
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create property.");
    }

    return response.json();
}

export async function updateProperty(
    id: number,
    data: PropertyManagementData
): Promise<Property> {
    const response = await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(
    "Property update failed:",
    JSON.stringify(errorData, null, 2)
);
        throw new Error("Failed to update property.");
    }

    return response.json();
}

export async function getPropertyImages(
    propertyId: number
): Promise<PropertyImage[]> {
    const response = await fetch(
        `${API_URL}${propertyId}/images/`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch property images.");
    }

    return response.json();
}

export async function uploadPropertyImage(
    propertyId: number,
    file: File,
    altText = ""
): Promise<PropertyImage> {
    const formData = new FormData();

    formData.append("image", file);
    formData.append("alt_text", altText);

    const response = await fetch(
        `${API_URL}${propertyId}/images/`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRFToken": getCsrfToken(),
            },
            body: formData,
        }
    );

    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
        const details = responseData && typeof responseData === "object"
            ? Object.entries(responseData as Record<string, unknown>)
                .flatMap(([field, messages]) =>
                    Array.isArray(messages)
                        ? messages.map((message) => `${field}: ${String(message)}`)
                        : [`${field}: ${String(messages)}`],
                )
                .join(" ")
            : "";
        throw new Error(details || `Image upload failed (HTTP ${response.status}).`);
    }

    return responseData as PropertyImage;
}

export async function updatePropertyImage(
    propertyId: number,
    imageId: number,
    file?: File,
    altText?: string,
    isActive?: boolean
): Promise<PropertyImage> {
    const formData = new FormData();

    if (file) {
        formData.append("image", file);
    }

    if (altText !== undefined) {
        formData.append("alt_text", altText);
    }

    if (isActive !== undefined) {
        formData.append("is_active", String(isActive));
    }

    const response = await fetch(
        `${API_URL}${propertyId}/images/${imageId}/`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                "X-CSRFToken": getCsrfToken(),
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update property image.");
    }

    return response.json();
}

export async function deletePropertyImage(
    propertyId: number,
    imageId: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}${propertyId}/images/${imageId}/`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CSRFToken": getCsrfToken(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete property image.");
    }
}
