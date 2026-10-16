import { MapPin, Clock, Package, Phone } from "lucide-react";
import { Driver, Ticket } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./Badges";
import DriverAvatar from "./DriverAvatar";
import { formatCurrency } from "@/lib/ui";
import { ReactNode } from "react";

export default function TicketCard({
  ticket,
  driver,
  footer,
}: {
  ticket: Ticket;
  driver?: Driver | null;
  footer?: ReactNode;
}) {
  const cod = formatCurrency(ticket.codAmount);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border/80 hover:bg-surface-2/60">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-semibold text-foreground">
            {ticket.code}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {ticket.customerName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-muted">
        <div className="flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-muted" />
          <span className="text-foreground/80">{ticket.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="shrink-0 text-muted" />
          <span>{ticket.timeWindow}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={15} className="shrink-0 text-muted" />
          <span>{ticket.phone}</span>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <Package size={15} className="mt-0.5 shrink-0 text-muted" />
        <div className="flex flex-wrap gap-1.5">
          {ticket.items.map((item, i) => (
            <span
              key={i}
              className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-foreground/80 ring-1 ring-border"
            >
              {item.name} × {item.quantity} {item.unit}
            </span>
          ))}
        </div>
      </div>

      {ticket.note && (
        <p className="mt-3 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300 ring-1 ring-rose-500/20">
          {ticket.note}
        </p>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          {driver ? (
            <>
              <DriverAvatar name={driver.name} color={driver.avatarColor} size={26} />
              <span className="text-xs font-medium text-foreground/80">
                {driver.name}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted italic">Chưa phân công tài xế</span>
          )}
        </div>
        {cod && (
          <span className="text-xs font-semibold text-brand">COD {cod}</span>
        )}
      </div>

      {footer && <div className="mt-3 border-t border-border pt-3">{footer}</div>}
    </div>
  );
}
