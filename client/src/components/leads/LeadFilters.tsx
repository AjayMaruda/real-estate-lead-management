import { Button } from "../ui/button";
import { Select } from "../ui/select";
import type { LeadSource, LeadStatus } from "../../types/lead";
import { LEAD_SOURCES, LEAD_STATUSES } from "../../types/lead";

type Props = {
  status: LeadStatus | "All";
  source: LeadSource | "All";
  onStatusChange: (value: LeadStatus | "All") => void;
  onSourceChange: (value: LeadSource | "All") => void;
  onReset: () => void;
};

export function LeadFilters({ status, source, onStatusChange, onSourceChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center">
      <div className="grid flex-1 gap-3 md:grid-cols-2">
        <Select value={status} onChange={(event) => onStatusChange(event.target.value as LeadStatus | "All")}>
          <option value="All">All Statuses</option>
          {LEAD_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={source} onChange={(event) => onSourceChange(event.target.value as LeadSource | "All")}>
          <option value="All">All Sources</option>
          {LEAD_SOURCES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
      <Button variant="outline" type="button" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

