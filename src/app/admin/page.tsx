"use client";

import { useMemo, useState } from "react";
import { Plus, Truck as TruckIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DriverStatusBadge, PriorityBadge, StatusBadge, TypeBadge } from "@/components/Badges";
import DriverAvatar from "@/components/DriverAvatar";
import NewOrderModal from "@/components/NewOrderModal";
import { drivers as initialDrivers, tickets as initialTickets } from "@/lib/mock-data";
import { Ticket, TicketType } from "@/lib/types";

type Filter = "all" | "delivery" | "pickup" | "unassigned";

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const drivers = initialDrivers;

  const filtered = useMemo(() => {
    switch (filter) {
      case "delivery":
        return tickets.filter((t) => t.type === "delivery");
      case "pickup":
        return tickets.filter((t) => t.type === "pickup");
      case "unassigned":
        return tickets.filter((t) => !t.driverId);
      default:
        return tickets;
    }
  }, [tickets, filter]);

  function assignDriver(ticketId: string, driverId: string) {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        if (driverId) {
          return { ...t, driverId, status: t.status === "pending" ? "assigned" : t.status };
        }
        return { ...t, driverId: null, status: t.status === "assigned" ? "pending" : t.status };
      })
    );
  }

  function nextCode(type: TicketType) {
    const prefix = type === "delivery" ? "GH" : "LH";
    const maxNum = tickets
      .filter((t) => t.type === type)
      .reduce((max, t) => Math.max(max, Number(t.code.split("-")[1]) || 0), 0);
    return `${prefix}-${String(maxNum + 1).padStart(4, "0")}`;
  }

  const unassignedCount = tickets.filter((t) => !t.driverId).length;

  return (
    <div>
      <PageHeader
        title="Quản trị vận hành"
        subtitle="Phân công tài xế và tạo đơn hàng mới cho hệ thống"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            <Plus size={16} /> Tạo đơn hàng
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: `Tất cả (${tickets.length})` },
              { key: "delivery", label: "Giao hàng" },
              { key: "pickup", label: "Lấy hàng" },
              { key: "unassigned", label: `Chưa phân công (${unassignedCount})` },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as Filter)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-brand/15 text-brand ring-1 ring-brand/30"
                    : "bg-surface text-muted ring-1 ring-border hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-200 text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-4 py-3 font-medium">Mã phiếu</th>
                  <th className="px-4 py-3 font-medium">Loại</th>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium">Mặt hàng</th>
                  <th className="px-4 py-3 font-medium">Giờ hẹn</th>
                  <th className="px-4 py-3 font-medium">Tài xế</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                      {t.code}
                      <div className="mt-1">
                        <PriorityBadge priority={t.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={t.type} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{t.customerName}</p>
                      <p className="text-xs text-muted">{t.address}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {t.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/80">{t.timeWindow}</td>
                    <td className="px-4 py-3">
                      <select
                        value={t.driverId ?? ""}
                        onChange={(e) => assignDriver(t.id, e.target.value)}
                        className="rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-xs text-foreground outline-none focus:border-brand"
                      >
                        <option value="">— Chưa phân công —</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <TruckIcon size={16} className="text-brand" />
            <h2 className="text-sm font-semibold text-foreground/90">Đội ngũ tài xế</h2>
          </div>
          {drivers.map((d) => {
            const assignedCount = tickets.filter((t) => t.driverId === d.id).length;
            return (
              <div key={d.id} className="rounded-2xl border border-border bg-surface p-3.5">
                <div className="flex items-center gap-3">
                  <DriverAvatar name={d.name} color={d.avatarColor} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted">
                      {d.vehicleType} · {d.vehicle}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <DriverStatusBadge status={d.status} />
                  <span className="text-xs font-medium text-muted">{assignedCount} phiếu</span>
                </div>
              </div>
            );
          })}
        </aside>
      </div>

      <NewOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(ticket) => setTickets((prev) => [ticket, ...prev])}
        nextCode={nextCode}
      />
    </div>
  );
}
