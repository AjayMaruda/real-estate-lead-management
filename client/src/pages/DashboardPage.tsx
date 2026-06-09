import { useEffect, useState } from "react";
import { AlertTriangle, Plus, RefreshCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { mockLeads } from "../lib/mockLeads";
import type { Lead, LeadInput, LeadSource, LeadStatus, Metrics } from "../types/lead";
import { addLead, loadLeads, loadMetrics, recalculateLead, updateLead } from "../lib/api";
import { calculatePriorityScore, computeMetrics, getFollowUpAlert } from "../lib/leadLogic";
import { KpiCards } from "../components/dashboard/KpiCards";
import { Charts } from "../components/dashboard/Charts";
import { LeadFilters } from "../components/leads/LeadFilters";
import { LeadSearchBar } from "../components/leads/LeadSearchBar";
import { LeadTable } from "../components/leads/LeadTable";
import { LeadDialog } from "../components/leads/LeadDialog";

const defaultFilters = { status: "All" as LeadStatus | "All", source: "All" as LeadSource | "All" };

export function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [metrics, setMetrics] = useState<Metrics>(computeMetrics(mockLeads));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const remoteLeads = await loadLeads();
        const remoteMetrics = await loadMetrics(remoteLeads);
        if (!active) return;
        setLeads(remoteLeads);
        setMetrics(remoteMetrics);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [lead.name, lead.phone, lead.company ?? "", lead.source].some((field) => field.toLowerCase().includes(query));
    const matchesStatus = filters.status === "All" || lead.status === filters.status;
    const matchesSource = filters.source === "All" || lead.source === filters.source;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const refreshMetrics = (nextLeads: Lead[]) => {
    const nextMetrics = computeMetrics(nextLeads);
    setMetrics(nextMetrics);
  };

  const handleSubmitLead = async (payload: LeadInput) => {
    if (editingLead) {
      const updated = await updateLead(editingLead.id, payload);
      const nextLeads = leads.map((lead) => (lead.id === updated.id ? updated : lead));
      setLeads(nextLeads);
      refreshMetrics(nextLeads);
    } else {
      const created = await addLead(payload);
      const nextLeads = [created, ...leads];
      setLeads(nextLeads);
      refreshMetrics(nextLeads);
    }
    setEditingLead(null);
    setIsDialogOpen(false);
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    const nextLeads = leads.map((lead) =>
      lead.id === id
        ? {
            ...lead,
            status,
            priorityScore: calculatePriorityScore({ ...lead, status }),
            followUpAlert: getFollowUpAlert({ ...lead, status }),
            updatedAt: new Date().toISOString(),
          }
        : lead,
    );
    setLeads(nextLeads);
    refreshMetrics(nextLeads);

    try {
      const updated = await updateLead(id, { status });
      setLeads(nextLeads.map((lead) => (lead.id === updated.id ? updated : lead)));
      refreshMetrics(nextLeads.map((lead) => (lead.id === updated.id ? updated : lead)));
    } catch {
      // local fallback already updated
    }
  };

  const handleRecalculate = async () => {
    const recalculated = await Promise.all(leads.map((lead) => recalculateLead(lead.id).catch(() => lead)));
    setLeads(recalculated);
    refreshMetrics(recalculated);
  };

  const totalHotLeads = filteredLeads.filter((lead) => lead.priorityScore >= 80).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Real Estate Sales Ops</p>
            <h1 className="mt-2 text-3xl font-bold">Lead Management Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Track every lead, surface the hottest opportunities, and keep follow-ups moving without extra noise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={handleRecalculate}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Recalculate Scores
            </Button>
            <Button
              className="bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => {
                setEditingLead(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <KpiCards metrics={metrics} />

          <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
            <Charts metrics={metrics} />
            <Card>
              <CardHeader>
                <CardTitle>Product Feature</CardTitle>
                <CardDescription>Lead Priority Scoring + Follow-Up Alert Engine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Hot leads: {totalHotLeads}</p>
                    <p className="text-sm">
                      Scores are based on source quality, budget, pipeline stage, and follow-up urgency.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Hot</p>
                    <p>80-100 score, prioritize immediately.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Warm</p>
                    <p>60-79 score, keep active follow-up.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Follow-up alerts</p>
                    <p>Shown when a lead is due within 48 hours or overdue.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
              <LeadSearchBar value={search} onChange={setSearch} />
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setFilters(defaultFilters);
                }}
              >
                Clear All
              </Button>
            </div>

            <LeadFilters
              status={filters.status}
              source={filters.source}
              onStatusChange={(status) => setFilters((current) => ({ ...current, status }))}
              onSourceChange={(source) => setFilters((current) => ({ ...current, source }))}
              onReset={() => setFilters(defaultFilters)}
            />

            <Card>
              <CardHeader>
                <CardTitle>Leads</CardTitle>
                <CardDescription>
                  {loading ? "Loading lead data..." : `${filteredLeads.length} matching leads out of ${leads.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeadTable
                  leads={filteredLeads}
                  onEdit={(lead) => {
                    setEditingLead(lead);
                    setIsDialogOpen(true);
                  }}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LeadDialog
        open={isDialogOpen}
        lead={editingLead}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingLead(null);
        }}
        onSubmit={handleSubmitLead}
      />
    </main>
  );
}
