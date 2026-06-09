import type { Lead, LeadInput, LeadSource, LeadStatus, Metrics } from "../types/lead";

const API_URL = (import.meta.env.VITE_API_URL?.trim() || "http://localhost:4000").replace(/\/$/, "");

type ApiEnvelope<T> = { data: T; meta?: unknown };

type LeadQuery = {
  q?: string;
  status?: LeadStatus | "All";
  source?: LeadSource | "All";
  page?: number;
  limit?: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Request failed");
  }
  return (await response.json()) as T;
}

function buildQueryString(query: LeadQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status && query.status !== "All") params.set("status", query.status);
  if (query.source && query.source !== "All") params.set("source", query.source);
  params.set("limit", String(query.limit ?? 100));
  params.set("page", String(query.page ?? 1));
  return params.toString();
}

export async function loadLeads(query: LeadQuery = {}): Promise<Lead[]> {
  const response = await request<ApiEnvelope<Lead[]>>(`/api/leads?${buildQueryString(query)}`);
  return response.data;
}

export async function loadMetrics(): Promise<Metrics> {
  const response = await request<ApiEnvelope<Metrics>>("/api/metrics");
  return response.data;
}

export async function addLead(payload: LeadInput): Promise<Lead> {
  const response = await request<ApiEnvelope<Lead>>("/api/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateLead(id: string, payload: Partial<LeadInput>): Promise<Lead> {
  const response = await request<ApiEnvelope<Lead>>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function recalculateLead(id: string): Promise<Lead> {
  const response = await request<ApiEnvelope<Lead>>(`/api/leads/${id}/recalculate`, {
    method: "POST",
  });
  return response.data;
}

export async function recalculateAllLeads() {
  await request<{ updated: number }>("/api/leads/recalculate-scores", {
    method: "POST",
  });
}
