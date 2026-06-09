import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import type { Metrics } from "../../types/lead";
import { LEAD_SOURCES, LEAD_STATUSES } from "../../types/lead";

type Props = {
  metrics: Metrics;
  loading?: boolean;
};

const chartColors = ["#0f172a", "#3b82f6", "#14b8a6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export function Charts({ metrics, loading = false }: Props) {
  const statusData = LEAD_STATUSES.map((status) => ({ name: status, value: metrics.leadsByStatus[status] }));
  const sourceData = LEAD_SOURCES.map((source) => ({ name: source, value: metrics.leadsBySource[source] }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leads by Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex h-full flex-col justify-end gap-3 pb-2">
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-6" />
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="grid h-48 w-48 place-items-center rounded-full border border-slate-200 bg-slate-50">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={4}>
                  {sourceData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
