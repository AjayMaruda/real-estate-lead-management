import { Badge } from "../ui/badge";
import { getPriorityBand } from "../../lib/leadLogic";

export function PriorityScoreBadge({ score }: { score: number }) {
  const band = getPriorityBand(score);
  const styles =
    band === "Hot"
      ? "border-red-200 bg-red-50 text-red-700"
      : band === "Warm"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : band === "Medium"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-100 text-slate-700";

  return <Badge className={styles}>{score} / 100 · {band}</Badge>;
}

export function FollowUpAlertBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge className="border-amber-200 bg-amber-50 text-amber-700">Follow-up due</Badge>
  ) : (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">On track</Badge>
  );
}

