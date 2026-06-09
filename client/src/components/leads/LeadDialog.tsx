import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadInput, type LeadSource, type LeadStatus } from "../../types/lead";

type Props = {
  open: boolean;
  lead?: Lead | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: LeadInput) => void;
};

const emptyForm: LeadInput = {
  name: "",
  phone: "",
  email: "",
  company: "",
  source: "Website",
  status: "New Lead",
  budget: undefined,
  notes: "",
  assignedTo: "",
  nextFollowUpAt: "",
  lastContactedAt: "",
};

type FormErrors = Partial<Record<keyof LeadInput, string>>;

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function isEmail(value?: string) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateLead(form: LeadInput): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Lead name is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (form.phone.trim().length < 7) errors.phone = "Phone number should be at least 7 characters.";
  if (!isEmail(form.email)) errors.email = "Enter a valid email address.";
  if (form.budget !== undefined && form.budget < 0) errors.budget = "Budget cannot be negative.";
  if (form.nextFollowUpAt && Number.isNaN(new Date(form.nextFollowUpAt).getTime())) {
    errors.nextFollowUpAt = "Enter a valid follow-up date.";
  }
  if (form.lastContactedAt && Number.isNaN(new Date(form.lastContactedAt).getTime())) {
    errors.lastContactedAt = "Enter a valid contacted date.";
  }

  return errors;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export function LeadDialog({ open, lead, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<LeadInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setErrors({});
    setForm(
      lead
        ? {
            name: lead.name,
            phone: lead.phone,
            email: lead.email ?? "",
            company: lead.company ?? "",
            source: lead.source,
            status: lead.status,
            budget: lead.budget,
            notes: lead.notes ?? "",
            assignedTo: lead.assignedTo ?? "",
            nextFollowUpAt: toDatetimeLocal(lead.nextFollowUpAt),
            lastContactedAt: toDatetimeLocal(lead.lastContactedAt),
          }
        : emptyForm,
    );
  }, [lead, open]);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const updateField = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateLead(form);
    setSubmitted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      title={lead ? "Update Lead" : "Add Lead"}
      description="Capture the lead in a structured, validated flow."
      onOpenChange={onOpenChange}
    >
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 md:grid-cols-2">
          <Field label="Lead name" error={submitted ? errors.name : undefined}>
            <Input
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(submitted && errors.name)}
              required
            />
          </Field>
          <Field label="Phone" error={submitted ? errors.phone : undefined}>
            <Input
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={Boolean(submitted && errors.phone)}
              required
            />
          </Field>
          <Field label="Email" error={submitted ? errors.email : undefined}>
            <Input
              placeholder="rahul@example.com"
              value={form.email ?? ""}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(submitted && errors.email)}
            />
          </Field>
          <Field label="Company">
            <Input
              placeholder="Sharma Interiors"
              value={form.company ?? ""}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 md:grid-cols-2">
          <Field label="Source">
            <Select value={form.source} onChange={(event) => updateField("source", event.target.value as LeadSource)}>
              {LEAD_SOURCES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(event) => updateField("status", event.target.value as LeadStatus)}>
              {LEAD_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Budget" error={submitted ? errors.budget : undefined}>
            <Input
              type="number"
              min={0}
              placeholder="250000"
              value={form.budget ?? ""}
              onChange={(event) => updateField("budget", event.target.value ? Number(event.target.value) : undefined)}
              aria-invalid={Boolean(submitted && errors.budget)}
            />
          </Field>
          <Field label="Assigned to">
            <Input
              placeholder="Anita"
              value={form.assignedTo ?? ""}
              onChange={(event) => updateField("assignedTo", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 md:grid-cols-2">
          <Field label="Follow-up date" error={submitted ? errors.nextFollowUpAt : undefined}>
            <Input
              type="datetime-local"
              value={form.nextFollowUpAt ?? ""}
              onChange={(event) => updateField("nextFollowUpAt", event.target.value)}
              aria-invalid={Boolean(submitted && errors.nextFollowUpAt)}
            />
          </Field>
          <Field label="Last contacted" error={submitted ? errors.lastContactedAt : undefined}>
            <Input
              type="datetime-local"
              value={form.lastContactedAt ?? ""}
              onChange={(event) => updateField("lastContactedAt", event.target.value)}
              aria-invalid={Boolean(submitted && errors.lastContactedAt)}
            />
          </Field>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notes</span>
            <Textarea
              placeholder="Enter context, requirements, or next action..."
              value={form.notes ?? ""}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {hasErrors ? "Please fix the highlighted fields before saving." : "All required fields are ready."}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {lead ? "Save Changes" : "Add Lead"}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
