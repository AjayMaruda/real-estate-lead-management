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
import type { Metrics } from "../../types/lead";
import { LEAD_SOURCES, LEAD_STATUSES } from "../../types/lead";

type Props = {
  metrics: Metrics;
};

const chartColors = ["#0f172a", "#3b82f6", "#14b8a6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export function Charts({ metrics }: Props) {
  const statusData = LEAD_STATUSES.map((status) => ({ name: status, value: metrics.leadsByStatus[status] }));
  const sourceData = LEAD_SOURCES.map((source) => ({ name: source, value: metrics.leadsBySource[source] }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leads by Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
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
        </CardContent>
      </Card>
    </div>
  );
}

