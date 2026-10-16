import { Truck } from "lucide-react";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-[0_0_0_1px_rgba(255,122,26,0.3),0_8px_20px_-6px_rgba(255,122,26,0.5)]">
        <Truck size={20} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight text-foreground">
            TJShip
          </p>
          <p className="text-[11px] text-muted -mt-0.5">Giao vận thông minh</p>
        </div>
      )}
    </div>
  );
}
