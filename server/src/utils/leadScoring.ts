import type { LeadInput, LeadSource, LeadStatus } from "../types/lead";

const sourceScore: Record<LeadSource, number> = {
  Referral: 25,
  Website: 20,
  "Google Ads": 18,
  "Walk-in": 22,
  Facebook: 10,
  Instagram: 8,
  Other: 5,
};

const statusScore: Record<LeadStatus, number> = {
  "New Lead": 5,
  Contacted: 12,
  "Site Visit Scheduled": 20,
  Negotiation: 28,
  "Closed Won": 40,
  "Closed Lost": 0,
};

export function calculatePriorityScore(lead: LeadInput) {
  if (lead.status === "Closed Won") return 100;
  if (lead.status === "Closed Lost") return 0;

  let score = 0;
  score += sourceScore[lead.source] ?? 5;
  score += statusScore[lead.status] ?? 5;

  if ((lead.budget ?? 0) >= 1_000_000) score += 20;
  else if ((lead.budget ?? 0) >= 500_000) score += 15;
  else if ((lead.budget ?? 0) >= 200_000) score += 10;
  else score += 5;

  if (lead.nextFollowUpAt) score += 10;
  if ((lead.notes?.length ?? 0) > 20) score += 5;

  return Math.min(100, score);
}

export function getPriorityBand(score: number) {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 30) return "Medium";
  return "Low";
}

export function getFollowUpAlert(lead: LeadInput) {
  if (lead.status === "Closed Won" || lead.status === "Closed Lost") {
    return false;
  }

  if (!lead.nextFollowUpAt) return false;

  const followUpDate = new Date(lead.nextFollowUpAt).getTime();
  if (Number.isNaN(followUpDate)) return false;

  const now = Date.now();
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  return followUpDate <= now + twoDays;
}

