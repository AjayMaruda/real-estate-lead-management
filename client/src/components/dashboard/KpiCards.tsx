import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import type { Metrics } from "../../types/lead";

type Props = {
  metrics: Metrics;
};

export function KpiCards({ metrics }: Props) {
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
            <CardTitle className="mt-2 text-3xl">{card.value}</CardTitle>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

