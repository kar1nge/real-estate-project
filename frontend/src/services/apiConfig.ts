const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const localDevelopmentApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8000/api/`;

export const API_BASE_URL = configuredApiBaseUrl
  ? `${configuredApiBaseUrl.replace(/\/+$/, "")}/`
  : import.meta.env.DEV
    ? localDevelopmentApiBaseUrl
    : "/api/";

export const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;
