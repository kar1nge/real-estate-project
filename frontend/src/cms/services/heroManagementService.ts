import type { HeroSlide } from "../../types/hero";

import { API_BASE_URL } from "../../services/apiConfig";

const API_URL = `${API_BASE_URL}hero/manage/`;

function getCsrfToken(): string {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

export async function getHeroSlidesForManagement(): Promise<HeroSlide[]> {
    const response = await fetch(API_URL, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch Hero slides.");
    }

    const data = await response.json();

    return data.results;
}

export async function createHeroSlide(
    data: FormData
): Promise<HeroSlide> {
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCsrfToken(),
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error("Failed to create Hero slide.");
    }

    return response.json();
}

export async function updateHeroSlide(
    id: number,
    data: FormData
): Promise<HeroSlide> {
    const response = await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCsrfToken(),
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error("Failed to update Hero slide.");
    }

    return response.json();
}
