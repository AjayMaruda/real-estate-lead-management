import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import type { Metrics } from "../../types/lead";

type Props = {
  metrics: Metrics;
  loading?: boolean;
};

export function KpiCards({ metrics, loading = false }: Props) {
  const cards = [
    { label: "Total Leads", value: metrics.totalLeads },
    { label: "Closed Won", value: metrics.leadsByStatus["Closed Won"] },
    { label: "Conversion Rate", value: `${metrics.conversionRate}%` },
    { label: "Follow-up Alerts", value: metrics.overdueFollowUps },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent>
            <CardDescription>{card.label}</CardDescription>
            {loading ? <Skeleton className="mt-3 h-9 w-24" /> : <CardTitle className="mt-2 text-3xl">{card.value}</CardTitle>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
