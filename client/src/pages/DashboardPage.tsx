import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, Plus, RefreshCcw, Search, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import type { Lead, LeadInput, LeadSource, LeadStatus, Metrics } from "../types/lead";
import { addLead, loadLeads, loadMetrics, recalculateAllLeads, updateLead } from "../lib/api";
import { computeMetrics } from "../lib/leadLogic";
import { KpiCards } from "../components/dashboard/KpiCards";
import { Charts } from "../components/dashboard/Charts";
import { LeadFilters } from "../components/leads/LeadFilters";
import { LeadSearchBar } from "../components/leads/LeadSearchBar";
import { LeadTable } from "../components/leads/LeadTable";
import { LeadDialog } from "../components/leads/LeadDialog";

const defaultFilters = { status: "All" as LeadStatus | "All", source: "All" as LeadSource | "All" };

function emptyMetrics(): Metrics {
  return computeMetrics([]);
}

export function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [filters, setFilters] = useState(defaultFilters);
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const isBusy = loading || refreshing;

  const query = useMemo(
    () => ({
      q: deferredSearch.trim(),
      status: filters.status,
      source: filters.source,
      limit: 100,
    }),
    [deferredSearch, filters.source, filters.status],
  );

  const syncDashboard = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [nextLeads, nextMetrics] = await Promise.all([loadLeads(query), loadMetrics()]);
      setLeads(nextLeads);
      setMetrics(nextMetrics);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void syncDashboard();
  }, [query.q, query.source, query.status]);

  const handleSubmitLead = async (payload: LeadInput) => {
    setError(null);
    try {
      if (editingLead) {
        await updateLead(editingLead.id, payload);
      } else {
        await addLead(payload);
      }
      setEditingLead(null);
      setIsDialogOpen(false);
      await syncDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save lead");
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setError(null);
    try {
      await updateLead(id, { status });
      await syncDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update lead status");
    }
  };

  const handleRecalculate = async () => {
    setError(null);
    try {
      await recalculateAllLeads();
      await syncDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to recalculate scores");
    }
  };

  const hotLeads = leads.filter((lead) => lead.priorityScore >= 80).length;
  const followUpDue = leads.filter((lead) => lead.followUpAlert).length;
  const topLead = leads[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950/95 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur">
          <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.6fr_0.9fr] lg:px-8 lg:py-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                <Sparkles className="h-3.5 w-3.5" />
                Dynamic backend data
              </div>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Lead management that feels fast, clear, and sales-ready.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Search, filter, score, and update leads from a single dashboard powered directly by the backend.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="bg-white text-slate-950 hover:bg-slate-100"
                  onClick={() => {
                    setEditingLead(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  onClick={handleRecalculate}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Recalculate Scores
                </Button>
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  onClick={syncDashboard}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Sync Data
                </Button>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hot leads</p>
                  {isBusy ? <Skeleton className="mt-2 h-8 w-12 bg-white/15" /> : <p className="mt-1 text-2xl font-semibold">{hotLeads}</p>}
                </div>
                <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Follow-ups due</p>
                  {isBusy ? <Skeleton className="mt-3 h-8 w-12 bg-white/15" /> : <p className="mt-2 text-2xl font-semibold">{followUpDue}</p>}
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest sync</p>
                  {isBusy ? <Skeleton className="mt-3 h-5 w-24 bg-white/15" /> : <p className="mt-2 text-sm font-medium">{lastSyncedAt ?? "Pending"}</p>}
                </div>
              </div>
              {isBusy ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <Skeleton className="h-4 w-20 bg-white/15" />
                  <Skeleton className="mt-3 h-6 w-40 bg-white/15" />
                  <Skeleton className="mt-2 h-4 w-28 bg-white/15" />
                  <Skeleton className="mt-4 h-8 w-24 bg-white/15" />
                </div>
              ) : topLead ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top lead</p>
                  <p className="mt-2 text-lg font-semibold">{topLead.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{topLead.company || topLead.source}</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-300">{topLead.priorityScore}/100</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <KpiCards metrics={metrics} loading={isBusy} />

          <div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
            <Charts metrics={metrics} loading={isBusy} />
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                <CardTitle className="text-base">Product Feature</CardTitle>
                <CardDescription>Lead Priority Scoring + Follow-Up Alert Engine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sky-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Priority engine</p>
                  <p className="mt-2 text-sm leading-6">
                    Scores are generated from source quality, budget, pipeline stage, and follow-up urgency so sales
                    reps can focus on the best opportunities first.
                  </p>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Hot</p>
                    <p className="mt-1 text-slate-600">80-100 score, highest priority.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Warm</p>
                    <p className="mt-1 text-slate-600">60-79 score, active follow-up.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Alert badge</p>
                    <p className="mt-1 text-slate-600">Highlights leads due within 48 hours.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-white/70 bg-white/95">
            <CardHeader className="border-b border-slate-100/80 bg-gradient-to-r from-white to-slate-50">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>Pipeline controls</CardTitle>
                  <CardDescription className="mt-1">
                    Search and filter the live pipeline without leaving the page.
                  </CardDescription>
                </div>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <LeadSearchBar value={search} onChange={setSearch} />
              </div>
              <LeadFilters
                status={filters.status}
                source={filters.source}
                onStatusChange={(status) => setFilters((current) => ({ ...current, status }))}
                onSourceChange={(source) => setFilters((current) => ({ ...current, source }))}
                onReset={() => setFilters(defaultFilters)}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-white/90">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>Leads</CardTitle>
                  <CardDescription className="mt-1">
                    {isBusy ? "Syncing live data from the backend..." : `${leads.length} leads loaded from the API`}
                  </CardDescription>
                </div>
                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <LeadTable
                leads={leads}
                onEdit={(lead) => {
                  setEditingLead(lead);
                  setIsDialogOpen(true);
                }}
                onStatusChange={handleStatusChange}
                loading={isBusy}
              />
            </CardContent>
          </Card>
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
