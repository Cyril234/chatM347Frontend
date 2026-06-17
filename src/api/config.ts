export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
export const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws";

export function apiUrl(path: string) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
