import { DriverStatus, TicketStatus, TicketType } from "./types";

export const statusMeta: Record<
  TicketStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Chờ xử lý",
    dot: "bg-slate-400",
    badge: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
  },
  assigned: {
    label: "Đã phân công",
    dot: "bg-sky-400",
    badge: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  },
  in_progress: {
    label: "Đang thực hiện",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  },
  completed: {
    label: "Hoàn thành",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  },
  failed: {
    label: "Thất bại",
    dot: "bg-rose-400",
    badge: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
  },
};

export const driverStatusMeta: Record<
  DriverStatus,
  { label: string; dot: string; badge: string }
> = {
  active: {
    label: "Đang hoạt động",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  },
  busy: {
    label: "Đang giao hàng",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  },
  offline: {
    label: "Ngoại tuyến",
    dot: "bg-slate-500",
    badge: "bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30",
  },
};

export const typeMeta: Record<
  TicketType,
  { label: string; color: string; bg: string; ring: string }
> = {
  delivery: {
    label: "Giao hàng",
    color: "text-delivery",
    bg: "bg-delivery/10",
    ring: "ring-delivery/30",
  },
  pickup: {
    label: "Lấy hàng",
    color: "text-pickup",
    bg: "bg-pickup/10",
    ring: "ring-pickup/30",
  },
};

export function formatCurrency(value?: number) {
  if (!value) return null;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
