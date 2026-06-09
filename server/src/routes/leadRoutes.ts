import { Router } from "express";
import { LeadModel } from "../models/Lead";
import { calculatePriorityScore, getFollowUpAlert } from "../utils/leadScoring";
import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "../types/lead";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.preprocess((value) => (value === "" ? undefined : value), z.string().email().optional()),
  company: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES),
  budget: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.number().optional()),
  notes: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  assignedTo: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  nextFollowUpAt: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
  lastContactedAt: z.preprocess((value) => (value === "" ? undefined : value), z.string().optional()),
});

export const leadRoutes = Router();

leadRoutes.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const status = String(req.query.status ?? "").trim();
    const source = String(req.query.source ?? "").trim();
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 100);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { source: { $regex: q, $options: "i" } },
      ];
    }

    const [leads, total] = await Promise.all([
      LeadModel.find(filter)
        .sort({ priorityScore: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      LeadModel.countDocuments(filter),
    ]);

    res.json({
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

leadRoutes.post("/", async (req, res, next) => {
  try {
    const payload = leadSchema.parse(req.body);
    const score = calculatePriorityScore(payload);
    const followUpAlert = getFollowUpAlert(payload);

    const lead = await LeadModel.create({
      ...payload,
      priorityScore: score,
      followUpAlert,
    });

    res.status(201).json({ data: lead });
  } catch (error) {
    next(error);
  }
});

leadRoutes.patch("/:id", async (req, res, next) => {
  try {
    const existing = await LeadModel.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    const payload = leadSchema.partial().parse(req.body);
    const merged = {
      name: payload.name ?? existing.name,
      phone: payload.phone ?? existing.phone,
      email: payload.email ?? existing.email,
      company: payload.company ?? existing.company,
      source: payload.source ?? existing.source,
      status: payload.status ?? existing.status,
      budget: payload.budget ?? existing.budget,
      notes: payload.notes ?? existing.notes,
      assignedTo: payload.assignedTo ?? existing.assignedTo,
      nextFollowUpAt: payload.nextFollowUpAt ?? existing.nextFollowUpAt?.toISOString(),
      lastContactedAt: payload.lastContactedAt ?? existing.lastContactedAt?.toISOString(),
    };

    const priorityScore = calculatePriorityScore(merged);
    const followUpAlert = getFollowUpAlert(merged);

    const updated = await LeadModel.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        priorityScore,
        followUpAlert,
      },
      { new: true },
    );

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

leadRoutes.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await LeadModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

leadRoutes.post("/:id/recalculate", async (req, res, next) => {
  try {
    const lead = await LeadModel.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    const payload = {
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? undefined,
      company: lead.company ?? undefined,
      source: lead.source,
      status: lead.status,
      budget: lead.budget ?? undefined,
      notes: lead.notes ?? undefined,
      assignedTo: lead.assignedTo ?? undefined,
      nextFollowUpAt: lead.nextFollowUpAt?.toISOString(),
      lastContactedAt: lead.lastContactedAt?.toISOString(),
    };

    lead.priorityScore = calculatePriorityScore(payload);
    lead.followUpAlert = getFollowUpAlert(payload);
    await lead.save();

    res.json({ data: lead });
  } catch (error) {
    next(error);
  }
});

leadRoutes.post("/recalculate-scores", async (_req, res, next) => {
  try {
    const leads = await LeadModel.find();
    for (const lead of leads) {
      const payload = {
        name: lead.name,
        phone: lead.phone,
        email: lead.email ?? undefined,
        company: lead.company ?? undefined,
        source: lead.source,
        status: lead.status,
        budget: lead.budget ?? undefined,
        notes: lead.notes ?? undefined,
        assignedTo: lead.assignedTo ?? undefined,
        nextFollowUpAt: lead.nextFollowUpAt?.toISOString(),
        lastContactedAt: lead.lastContactedAt?.toISOString(),
      };

      lead.priorityScore = calculatePriorityScore(payload);
      lead.followUpAlert = getFollowUpAlert(payload);
      await lead.save();
    }

    res.json({ updated: leads.length });
  } catch (error) {
    next(error);
  }
});
