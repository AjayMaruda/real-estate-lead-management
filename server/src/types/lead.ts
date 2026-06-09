export const LEAD_STATUSES = [
  "New Lead",
  "Contacted",
  "Site Visit Scheduled",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
] as const;

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Walk-in",
  "Facebook",
  "Google Ads",
  "Instagram",
  "Other",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  budget?: number;
  notes?: string;
  assignedTo?: string;
  nextFollowUpAt?: string;
  lastContactedAt?: string;
}

