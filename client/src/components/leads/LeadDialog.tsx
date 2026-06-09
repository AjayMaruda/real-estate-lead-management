import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
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

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function LeadDialog({ open, lead, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<LeadInput>(emptyForm);

  useEffect(() => {
    if (!open) return;
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

  return (
    <Dialog
      open={open}
      title={lead ? "Update Lead" : "Add Lead"}
      description="Capture the lead and keep the pipeline current."
      onOpenChange={onOpenChange}
    >
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <Input placeholder="Email" value={form.email ?? ""} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input placeholder="Company" value={form.company ?? ""} onChange={(event) => setForm({ ...form, company: event.target.value })} />
        <Select value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value as LeadSource })}>
          {LEAD_SOURCES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}>
          {LEAD_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          placeholder="Budget"
          value={form.budget ?? ""}
          onChange={(event) => setForm({ ...form, budget: event.target.value ? Number(event.target.value) : undefined })}
        />
        <Input
          placeholder="Assigned To"
          value={form.assignedTo ?? ""}
          onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
        />
        <Input
          type="datetime-local"
          placeholder="Follow-up"
          value={form.nextFollowUpAt ?? ""}
          onChange={(event) => setForm({ ...form, nextFollowUpAt: event.target.value })}
        />
        <Input
          type="datetime-local"
          placeholder="Last Contacted"
          value={form.lastContactedAt ?? ""}
          onChange={(event) => setForm({ ...form, lastContactedAt: event.target.value })}
        />
        <Input
          className="md:col-span-2"
          placeholder="Notes"
          value={form.notes ?? ""}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">{lead ? "Save Changes" : "Add Lead"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
