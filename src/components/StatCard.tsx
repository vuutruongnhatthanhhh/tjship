import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tint,
  trend,
  className = "",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tint: string;
  trend?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
    </div>
  );
}
