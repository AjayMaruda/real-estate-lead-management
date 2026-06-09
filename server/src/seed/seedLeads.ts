import "dotenv/config";
import { connect, disconnect } from "mongoose";
import { LeadModel } from "../models/Lead";
import { mockLeads } from "../data/mockLeads";
import { calculatePriorityScore, getFollowUpAlert } from "../utils/leadScoring";

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required to run the seed script");
  }

  await connect(mongoUri);
  await LeadModel.deleteMany({});
  await LeadModel.insertMany(
    mockLeads.map((lead) => ({
      ...lead,
      priorityScore: calculatePriorityScore(lead),
      followUpAlert: getFollowUpAlert(lead),
    })),
  );
  await disconnect();
  console.log(`Seeded ${mockLeads.length} leads`);
}

void run();

