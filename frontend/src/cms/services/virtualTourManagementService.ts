import { API_BASE_URL } from "../../services/apiConfig";
import type { TourHotspot, TourScene, VirtualTour } from "../../types/property";

const API = `${API_BASE_URL}properties/`;

function csrfToken() {
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("csrftoken="))
    ?.slice("csrftoken=".length) ?? "";
}

function responseMessage(data: unknown, statusCode: number) {
  if (data && typeof data === "object") {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    const messages = Object.entries(data as Record<string, unknown>).flatMap(
      ([field, value]) =>
        Array.isArray(value)
          ? value.map((message) => `${field}: ${String(message)}`)
          : [`${field}: ${String(value)}`],
    );
    if (messages.length) return messages.join(" ");
  }
  return `The tour request failed (HTTP ${statusCode}).`;
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  allowNotFound = false,
): Promise<T | null> {
  const method = options.method ?? "GET";
  const bodyIsFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body && !bodyIsFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...(method !== "GET" ? { "X-CSRFToken": csrfToken() } : {}),
      ...options.headers,
    },
  });

  if (allowNotFound && response.status === 404) return null;
  const data = response.status === 204
    ? null
    : await response.json().catch(() => null);
  if (!response.ok) throw new Error(responseMessage(data, response.status));
  return data as T;
}

export async function getVirtualTourForProperty(
  propertyId: number,
): Promise<VirtualTour | null> {
  return (await request<VirtualTour>(
    `${API}manage/${propertyId}/virtual-tour/`,
    {},
    true,
  )) ?? null;
}

export function createVirtualTour(propertyId: number, title: string) {
  return request<VirtualTour>(
    `${API}manage/${propertyId}/virtual-tour/`,
    { method: "POST", body: JSON.stringify({ title }) },
  ) as Promise<VirtualTour>;
}

export function updateVirtualTour(propertyId: number, title: string) {
  return request<VirtualTour>(
    `${API}manage/${propertyId}/virtual-tour/`,
    { method: "PATCH", body: JSON.stringify({ title }) },
  ) as Promise<VirtualTour>;
}

export function createTourScene(
  tourId: number,
  name: string,
  image: File,
) {
  const data = new FormData();
  data.append("name", name);
  data.append("image", image);
  return request<TourScene>(
    `${API}manage/tours/${tourId}/scenes/`,
    { method: "POST", body: data },
  ) as Promise<TourScene>;
}

export function updateTourScene(
  sceneId: number,
  values: { name: string; display_order: number; image?: File },
) {
  const data = new FormData();
  data.append("name", values.name);
  data.append("display_order", String(values.display_order));
  if (values.image) data.append("image", values.image);
  return request<TourScene>(
    `${API}manage/scenes/${sceneId}/`,
    { method: "PATCH", body: data },
  ) as Promise<TourScene>;
}

export function createTourHotspot(
  sceneId: number,
  values: Omit<TourHotspot, "id" | "target_scene_name">,
) {
  return request<TourHotspot>(
    `${API}manage/scenes/${sceneId}/hotspots/`,
    { method: "POST", body: JSON.stringify(values) },
  ) as Promise<TourHotspot>;
}

export function updateTourHotspot(
  hotspotId: number,
  values: Omit<TourHotspot, "id" | "target_scene_name">,
) {
  return request<TourHotspot>(
    `${API}manage/hotspots/${hotspotId}/`,
    { method: "PATCH", body: JSON.stringify(values) },
  ) as Promise<TourHotspot>;
}
