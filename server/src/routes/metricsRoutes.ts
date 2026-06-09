import { Router } from "express";
import { LeadModel } from "../models/Lead";
import { computeMetrics } from "../utils/metrics";

export const metricsRoutes = Router();

metricsRoutes.get("/", async (_req, res, next) => {
  try {
    const leads = await LeadModel.find().sort({ createdAt: -1 });
    res.json({ data: computeMetrics(leads.map((lead) => lead.toObject())) });
  } catch (error) {
    next(error);
  }
});

