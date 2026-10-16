"use client";

import { useMemo, useState } from "react";
import { Phone, Navigation, CheckCircle2, PlayCircle, XCircle, Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TicketCard from "@/components/TicketCard";
import DriverAvatar from "@/components/DriverAvatar";
import MapSection from "@/components/MapSection";
import { MapMarker } from "@/components/MapViewLoader";
import { DriverStatusBadge, TypeBadge } from "@/components/Badges";
import { drivers, depot, tickets as initialTickets } from "@/lib/mock-data";
import { Ticket, TicketStatus } from "@/lib/types";

export default function DriverPage() {
  const [driverId, setDriverId] = useState(drivers[0].id);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [online, setOnline] = useState(true);

  const driver = drivers.find((d) => d.id === driverId)!;
  const myTickets = useMemo(
    () => tickets.filter((t) => t.driverId === driverId),
    [tickets, driverId]
  );
  const deliveries = myTickets.filter((t) => t.type === "delivery");
  const pickups = myTickets.filter((t) => t.type === "pickup");
  const doneToday = myTickets.filter((t) => t.status === "completed").length;

  function setStatus(id: string, status: TicketStatus) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const markers: MapMarker[] = [
    { id: "depot", lat: depot.lat, lng: depot.lng, kind: "depot", title: depot.name },
    ...myTickets.map((t) => ({
      id: t.id,
      lat: t.lat,
      lng: t.lng,
      kind: t.type,
      title: `${t.code} · ${t.customerName}`,
      subtitle: t.address,
      phone: t.phone,
    })),
  ];
  const routeColor = "#ff7a1a";
  const route = {
    points: [[depot.lat, depot.lng] as [number, number], ...myTickets.map((t) => [t.lat, t.lng] as [number, number])],
    color: routeColor,
  };

  const pendingStops = myTickets.filter(
    (t) => t.status !== "completed" && t.status !== "failed"
  );
  const optimizer = {
    origin: { lat: depot.lat, lng: depot.lng, label: depot.name },
    stops: pendingStops.map((t) => ({
      id: t.id,
      code: t.code,
      title: t.customerName,
      lat: t.lat,
      lng: t.lng,
      priority: t.priority,
      timeWindow: t.timeWindow,
    })),
  };

  function actionsFor(ticket: Ticket) {
    if (ticket.status === "completed" || ticket.status === "failed") return null;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {(ticket.status === "pending" || ticket.status === "assigned") && (
          <button
            onClick={() => setStatus(ticket.id, "in_progress")}
            className="flex items-center gap-1.5 rounded-lg bg-brand/15 px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/30 hover:bg-brand/25"
          >
            <PlayCircle size={14} /> Bắt đầu
          </button>
        )}
        {ticket.status === "in_progress" && (
          <>
            <button
              onClick={() => setStatus(ticket.id, "completed")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
            >
              <CheckCircle2 size={14} /> Hoàn thành
            </button>
            <button
              onClick={() => setStatus(ticket.id, "failed")}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30 hover:bg-rose-500/25"
            >
              <XCircle size={14} /> Không thành công
            </button>
          </>
        )}
        <a
          href={`tel:${ticket.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground/80 ring-1 ring-border hover:text-foreground"
        >
          <Phone size={14} /> Gọi khách
        </a>
        <span className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground/80 ring-1 ring-border">
          <Navigation size={14} /> Chỉ đường
        </span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Trang tài xế"
        subtitle="Danh sách phiếu được phân công và cập nhật trạng thái thực hiện"
        actions={
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="space-y-6 px-4 py-6 md:px-8">
        <div className="rounded-2xl border border-border bg-surface p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DriverAvatar name={driver.name} color={driver.avatarColor} size={52} />
              <div>
                <p className="text-base font-bold text-foreground">{driver.name}</p>
                <p className="text-sm text-muted">
                  {driver.vehicleType} · {driver.vehicle}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                  <Star size={12} fill="currentColor" /> {driver.rating}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{myTickets.length}</p>
                <p className="text-xs text-muted">Tổng phiếu</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{doneToday}</p>
                <p className="text-xs text-muted">Hoàn thành</p>
              </div>
              <button
                onClick={() => setOnline((v) => !v)}
                className="flex flex-col items-center gap-1"
              >
                <DriverStatusBadge status={online ? "active" : "offline"} />
                <span className="text-[11px] text-muted underline">Đổi trạng thái</span>
              </button>
            </div>
          </div>
        </div>

        <MapSection
          key={driverId}
          title="Bản đồ lộ trình"
          markers={markers}
          center={[depot.lat, depot.lng]}
          zoom={13}
          routes={myTickets.length ? [route] : []}
          optimizer={optimizer}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <TypeBadge type="delivery" />
              <h2 className="text-sm font-semibold text-foreground/90">
                Giao hàng ({deliveries.length})
              </h2>
            </div>
            <div className="space-y-3">
              {deliveries.length === 0 && (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                  Không có phiếu giao hàng nào
                </p>
              )}
              {deliveries.map((t) => (
                <TicketCard key={t.id} ticket={t} driver={driver} footer={actionsFor(t)} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <TypeBadge type="pickup" />
              <h2 className="text-sm font-semibold text-foreground/90">
                Lấy hàng ({pickups.length})
              </h2>
            </div>
            <div className="space-y-3">
              {pickups.length === 0 && (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
                  Không có phiếu lấy hàng nào
                </p>
              )}
              {pickups.map((t) => (
                <TicketCard key={t.id} ticket={t} driver={driver} footer={actionsFor(t)} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
