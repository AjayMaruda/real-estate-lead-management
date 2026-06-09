import { mockLeads } from "./mockLeads";
import { calculatePriorityScore, getFollowUpAlert } from "./leadLogic";
import type { Lead, LeadInput, Metrics } from "../types/lead";
import { computeMetrics } from "./leadLogic";

const API_URL = import.meta.env.VITE_API_URL?.trim();
let localLeads = [...mockLeads];

type ApiEnvelope<T> = { data: T; meta?: unknown };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("API not configured");
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

export async function loadLeads(): Promise<Lead[]> {
  if (!API_URL) return localLeads;
  try {
    const response = await request<ApiEnvelope<Lead[]>>("/api/leads?limit=100");
    localLeads = response.data;
    return response.data;
  } catch {
    return localLeads;
  }
}

export async function loadMetrics(leads: Lead[]): Promise<Metrics> {
  if (!API_URL) return computeMetrics(leads);
  try {
    const response = await request<ApiEnvelope<Metrics>>("/api/metrics");
    return response.data;
  } catch {
    return computeMetrics(leads);
  }
}

export async function addLead(payload: LeadInput): Promise<Lead> {
  if (!API_URL) {
    const now = new Date().toISOString();
    const created = {
      id: crypto.randomUUID(),
      ...payload,
      priorityScore: calculatePriorityScore(payload),
      followUpAlert: getFollowUpAlert(payload),
      createdAt: now,
      updatedAt: now,
    };
    localLeads = [created, ...localLeads];
    return created;
  }
  const response = await request<ApiEnvelope<Lead>>("/api/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateLead(id: string, payload: Partial<LeadInput>): Promise<Lead> {
  if (!API_URL) {
    const now = new Date().toISOString();
    const base = localLeads.find((lead) => lead.id === id);
    if (!base) throw new Error("Lead not found");
    const merged: LeadInput = { ...base, ...payload };
    const updated = {
      ...base,
      ...payload,
      priorityScore: calculatePriorityScore(merged),
      followUpAlert: getFollowUpAlert(merged),
      updatedAt: now,
    };
    localLeads = localLeads.map((lead) => (lead.id === id ? updated : lead));
    return updated;
  }
  const response = await request<ApiEnvelope<Lead>>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function recalculateLead(id: string): Promise<Lead> {
  if (!API_URL) {
    const base = localLeads.find((lead) => lead.id === id);
    if (!base) throw new Error("Lead not found");
    const leadInput: LeadInput = { ...base };
    const updated = {
      ...base,
      priorityScore: calculatePriorityScore(leadInput),
      followUpAlert: getFollowUpAlert(leadInput),
      updatedAt: new Date().toISOString(),
    };
    localLeads = localLeads.map((lead) => (lead.id === id ? updated : lead));
    return updated;
  }
  const response = await request<ApiEnvelope<Lead>>(`/api/leads/${id}/recalculate`, {
    method: "POST",
  });
  return response.data;
}
