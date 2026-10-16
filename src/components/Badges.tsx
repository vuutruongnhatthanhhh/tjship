import { DriverStatus, TicketStatus, TicketType } from "@/lib/types";
import { driverStatusMeta, statusMeta, typeMeta } from "@/lib/ui";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const meta = driverStatusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: TicketType }) {
  const meta = typeMeta[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.bg} ${meta.color} ${meta.ring}`}
    >
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "normal" | "high" }) {
  if (priority === "normal") return null;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
      Ưu tiên cao
    </span>
  );
}
