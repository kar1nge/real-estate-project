import { API_BASE_URL } from "../../services/apiConfig";

export interface VisitSchedule {
  id: number;
  real_estate_property: number;
  property_title: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  remaining_slots: number;
  active: boolean;
  notes: string;
}

export interface VisitBooking {
  id: number;
  schedule: number;
  property_title: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  number_of_visitors: number;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  attendance_status: "booked" | "attended" | "cancelled" | "no_show";
  confirmation_sent: boolean;
  created_at: string;
}

export interface VisitProperty { id: number; title: string; }

function csrfToken() {
  return decodeURIComponent(document.cookie.split("; ").find((part) => part.startsWith("csrftoken="))?.split("=")[1] ?? "");
}

async function request<T>(path: string, method = "GET", body?: object): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(method !== "GET" ? { "X-CSRFToken": csrfToken() } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({})) as T & { detail?: string };
  if (!response.ok) throw new Error(payload.detail ?? `Could not save site visit data (HTTP ${response.status}).`);
  return payload;
}

async function results<T>(path: string): Promise<T[]> {
  const data = await request<T[] | { results: T[] }>(path);
  return Array.isArray(data) ? data : data.results;
}

export const listVisitSchedules = () => results<VisitSchedule>("site-visits/manage/schedules/");
export const listVisitBookings = () => results<VisitBooking>("site-visits/manage/bookings/");
export async function listVisitProperties(): Promise<VisitProperty[]> {
  const all: VisitProperty[] = [];
  for (let page = 1; page <= 50; page += 1) {
    const response = await request<{ results: VisitProperty[]; next: string | null }>(`properties/manage/?page=${page}`);
    all.push(...response.results);
    if (!response.next || !response.results.length) break;
  }
  return all;
}
export const saveVisitSchedule = (data: object, id?: number) => request<VisitSchedule>(`site-visits/manage/schedules/${id ? `${id}/` : ""}`, id ? "PATCH" : "POST", data);
export const saveVisitBooking = (data: object, id?: number) => request<VisitBooking>(`site-visits/manage/bookings/${id ? `${id}/` : ""}`, id ? "PATCH" : "POST", data);
