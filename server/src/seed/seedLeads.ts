import "dotenv/config";
import { connect, disconnect } from "mongoose";
import { LeadModel } from "../models/Lead";
import { calculatePriorityScore, getFollowUpAlert } from "../utils/leadScoring";
import type { LeadInput } from "../types/lead";

const names = [
  "Rahul Sharma",
  "Priya Nair",
  "Aman Verma",
  "Sneha Iyer",
  "Karan Mehta",
  "Anjali Gupta",
  "Vikram Singh",
  "Neha Kapoor",
  "Arjun Patel",
  "Meera Joshi",
  "Riya Malhotra",
  "Dev Shah",
  "Pooja Rao",
  "Kabir Khan",
  "Sara Thomas",
];

const companies = [
  "Sharma Interiors",
  "Nair Builders",
  "Verma Holdings",
  "Iyer Associates",
  "Mehta Ventures",
  "Gupta Realty",
  "Singh Estates",
  "Kapoor Homes",
  "Patel Group",
  "Joshi Developers",
  "Malhotra Spaces",
  "Shah Properties",
  "Rao Living",
  "Khan Estates",
  "Thomas Realty",
];

const sources: LeadInput["source"][] = ["Website", "Referral", "Walk-in", "Facebook", "Google Ads", "Instagram"];
const statuses: LeadInput["status"][] = [
  "New Lead",
  "Contacted",
  "Site Visit Scheduled",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export function buildSeedLeads(count = 15): LeadInput[] {
  return Array.from({ length: count }, (_, index) => {
    const source = sources[index % sources.length];
    const status = statuses[index % statuses.length];
    const budget = 150000 + index * 125000;
    const nextFollowUpAt =
      status === "Closed Won" || status === "Closed Lost"
        ? undefined
        : new Date(Date.now() + (index + 1) * 12 * 60 * 60 * 1000).toISOString();

    return {
      name: names[index % names.length],
      phone: `+91 9${String(800000000 + index).padStart(9, "0")}`,
      email: `${names[index % names.length].toLowerCase().replace(/\s+/g, ".")}@example.com`,
      company: companies[index % companies.length],
      source,
      status,
      budget,
      notes: `Seeded lead ${index + 1} for demo coverage`,
      assignedTo: index % 2 === 0 ? "Anita" : "Rohit",
      nextFollowUpAt,
      lastContactedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

export async function seedLeads() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required to seed leads");
  }

  await connect(mongoUri);
  await LeadModel.deleteMany({});

  const seeds = buildSeedLeads();
  await LeadModel.insertMany(
    seeds.map((lead) => ({
      ...lead,
      priorityScore: calculatePriorityScore(lead),
      followUpAlert: getFollowUpAlert(lead),
    })),
  );

  await disconnect();
  console.log(`Seeded ${seeds.length} leads`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void seedLeads();
}
