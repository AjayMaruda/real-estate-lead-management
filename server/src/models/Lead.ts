import { Schema, model, type InferSchemaType } from "mongoose";
import { LEAD_SOURCES, LEAD_STATUSES } from "../types/lead";

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    company: { type: String, trim: true },
    source: { type: String, enum: LEAD_SOURCES, required: true },
    status: { type: String, enum: LEAD_STATUSES, default: "New Lead" },
    budget: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    assignedTo: { type: String, trim: true },
    nextFollowUpAt: { type: Date },
    lastContactedAt: { type: Date },
    priorityScore: { type: Number, default: 0 },
    followUpAlert: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type LeadDocument = InferSchemaType<typeof leadSchema>;

export const LeadModel = model("Lead", leadSchema);

