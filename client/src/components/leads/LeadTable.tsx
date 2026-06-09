import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Select } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FollowUpAlertBadge, PriorityScoreBadge } from "./LeadBadges";
import type { Lead, LeadStatus } from "../../types/lead";
import { LEAD_STATUSES } from "../../types/lead";

type Props = {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  loading?: boolean;
};

export function LeadTable({ leads, onEdit, onStatusChange, loading = false }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-56" />
                      <Skeleton className="mt-2 h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-11 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-10 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                    No leads match the current search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-xs text-slate-500">
                        {lead.company || "No company"} · {lead.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{lead.source}</TableCell>
                    <TableCell className="min-w-56">
                      <Select value={lead.status} onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}>
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <PriorityScoreBadge score={lead.priorityScore} />
                    </TableCell>
                    <TableCell>
                      <FollowUpAlertBadge active={lead.followUpAlert} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" type="button" onClick={() => onEdit(lead)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
