import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadInput, type Metrics } from "../types/lead";

const sourceScore = {
  Referral: 25,
  Website: 20,
  "Google Ads": 18,
  "Walk-in": 22,
  Facebook: 10,
  Instagram: 8,
  Other: 5,
} as const;

const statusScore = {
  "New Lead": 5,
  Contacted: 12,
  "Site Visit Scheduled": 20,
  Negotiation: 28,
  "Closed Won": 40,
  "Closed Lost": 0,
} as const;

export function calculatePriorityScore(lead: LeadInput) {
  if (lead.status === "Closed Won") return 100;
  if (lead.status === "Closed Lost") return 0;

  let score = 0;
  score += sourceScore[lead.source];
  score += statusScore[lead.status];

  if ((lead.budget ?? 0) >= 1_000_000) score += 20;
  else if ((lead.budget ?? 0) >= 500_000) score += 15;
  else if ((lead.budget ?? 0) >= 200_000) score += 10;
  else score += 5;

  if (lead.nextFollowUpAt) score += 10;
  if ((lead.notes?.length ?? 0) > 20) score += 5;

  return Math.min(100, score);
}

export function getFollowUpAlert(lead: LeadInput) {
  if (lead.status === "Closed Won" || lead.status === "Closed Lost") return false;
  if (!lead.nextFollowUpAt) return false;

  const followUpDate = new Date(lead.nextFollowUpAt).getTime();
  if (Number.isNaN(followUpDate)) return false;
  return followUpDate <= Date.now() + 2 * 24 * 60 * 60 * 1000;
}

export function getPriorityBand(score: number) {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 30) return "Medium";
  return "Low";
}

export function computeMetrics(leads: Lead[]): Metrics {
  const leadsByStatus = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, leads.filter((lead) => lead.status === status).length]),
  ) as Metrics["leadsByStatus"];

  const leadsBySource = Object.fromEntries(
    LEAD_SOURCES.map((source) => [source, leads.filter((lead) => lead.source === source).length]),
  ) as Metrics["leadsBySource"];

  const totalLeads = leads.length;
  const closedWon = leadsByStatus["Closed Won"];
  const conversionRate = totalLeads === 0 ? 0 : Number(((closedWon / totalLeads) * 100).toFixed(1));
  const avgPriorityScore =
    totalLeads === 0
      ? 0
      : Number((leads.reduce((sum, lead) => sum + lead.priorityScore, 0) / totalLeads).toFixed(1));
  const overdueFollowUps = leads.filter((lead) => lead.followUpAlert).length;

  return {
    totalLeads,
    leadsByStatus,
    leadsBySource,
    conversionRate,
    avgPriorityScore,
    overdueFollowUps,
  };
}

