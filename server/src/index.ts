import { connect } from "mongoose";
import "dotenv/config";
import { createServer } from "./app";
import { LeadModel } from "./models/Lead";
import { calculatePriorityScore, getFollowUpAlert } from "./utils/leadScoring";
import { mockLeads } from "./data/mockLeads";

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGO_URI;

async function bootstrap() {
  if (!mongoUri) {
    console.warn("MONGO_URI is not set. The server will start, but database routes need MongoDB.");
  } else {
    await connect(mongoUri);
    const count = await LeadModel.countDocuments();
    if (count === 0) {
      await LeadModel.insertMany(
        mockLeads.map((lead) => ({
          ...lead,
          priorityScore: calculatePriorityScore(lead),
          followUpAlert: getFollowUpAlert(lead),
        })),
      );
    }
  }

  createServer().listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

void bootstrap();

