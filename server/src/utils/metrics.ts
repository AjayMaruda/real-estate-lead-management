import type { LeadInput, LeadSource, LeadStatus } from "../types/lead";

type LeadRecord = LeadInput & {
  _id: string;
  priorityScore: number;
  followUpAlert: boolean;
  createdAt: string;
  updatedAt: string;
};

export function computeMetrics(leads: LeadRecord[]) {
  const totalLeads = leads.length;
  const leadsByStatus = Object.fromEntries(
    ([
      "New Lead",
      "Contacted",
      "Site Visit Scheduled",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ] as LeadStatus[]).map((status) => [
      status,
      leads.filter((lead) => lead.status === status).length,
    ]),
  ) as Record<LeadStatus, number>;

  const leadsBySource = Object.fromEntries(
    ([
      "Website",
      "Referral",
      "Walk-in",
      "Facebook",
      "Google Ads",
      "Instagram",
      "Other",
    ] as LeadSource[]).map((source) => [
      source,
      leads.filter((lead) => lead.source === source).length,
    ]),
  ) as Record<LeadSource, number>;

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

