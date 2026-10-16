import { drivers, tickets } from "./mock-data";
import { driverStatusMeta, statusMeta, typeMeta } from "./ui";

export type BotReply = {
  text: string;
  list?: string[];
};

export function countsReply(): BotReply {
  const delivery = tickets.filter((t) => t.type === "delivery").length;
  const pickup = tickets.filter((t) => t.type === "pickup").length;
  const byStatus = (
    ["pending", "assigned", "in_progress", "completed", "failed"] as const
  )
    .map((s) => ({ s, count: tickets.filter((t) => t.status === s).length }))
    .filter((x) => x.count > 0);

  return {
    text: `Hôm nay hệ thống có tổng cộng ${tickets.length} đơn, gồm ${delivery} đơn ${typeMeta.delivery.label.toLowerCase()} và ${pickup} đơn ${typeMeta.pickup.label.toLowerCase()}.`,
    list: byStatus.map((x) => `${statusMeta[x.s].label}: ${x.count} đơn`),
  };
}

export function driverTicketsReply(): BotReply {
  const list = drivers.map((d) => {
    const mine = tickets.filter((t) => t.driverId === d.id);
    if (mine.length === 0) return `${d.name}: chưa có phiếu nào`;
    return `${d.name} (${mine.length} phiếu): ${mine.map((t) => t.code).join(", ")}`;
  });
  return {
    text: "Đây là danh sách phiếu đang được phân công theo từng tài xế:",
    list,
  };
}

export function workingDriversReply(): BotReply {
  const working = drivers.filter((d) => d.status !== "offline");
  const offline = drivers.filter((d) => d.status === "offline");
  return {
    text: `Hôm nay có ${working.length}/${drivers.length} tài xế đang làm việc:`,
    list: [
      ...working.map((d) => `${d.name} — ${driverStatusMeta[d.status].label}`),
      ...offline.map((d) => `${d.name} — ${driverStatusMeta[d.status].label} (nghỉ)`),
    ],
  };
}

export function unassignedReply(): BotReply {
  const unassigned = tickets.filter((t) => !t.driverId);
  if (unassigned.length === 0) {
    return { text: "Tất cả đơn hôm nay đã được phân công tài xế hết rồi ạ." };
  }
  return {
    text: `Hiện có ${unassigned.length} đơn chưa được giao cho tài xế nào:`,
    list: unassigned.map(
      (t) => `${t.code} · ${t.customerName} — ${t.address}`
    ),
  };
}

export function completedReply(): BotReply {
  const completed = tickets.filter((t) => t.status === "completed");
  if (completed.length === 0) {
    return { text: "Hôm nay chưa có đơn nào hoàn thành cả." };
  }
  return {
    text: `Đã có ${completed.length} đơn hoàn thành hôm nay:`,
    list: completed.map((t) => `${t.code} · ${t.customerName}`),
  };
}

export function fallbackReply(): BotReply {
  return {
    text: "Em chưa chắc hiểu ý anh/chị lắm, anh/chị thử chọn một trong các câu gợi ý bên dưới hoặc hỏi lại cụ thể hơn nhé.",
  };
}

export type Suggestion = { id: string; label: string; run: () => BotReply };

export const suggestions: Suggestion[] = [
  { id: "counts", label: "Hôm nay có bao nhiêu đơn?", run: countsReply },
  { id: "driver-tickets", label: "Tài xế nào đang có đơn nào?", run: driverTicketsReply },
  { id: "working", label: "Hôm nay tài xế nào làm việc?", run: workingDriversReply },
  { id: "unassigned", label: "Đơn nào chưa giao cho tài xế?", run: unassignedReply },
  { id: "completed", label: "Đơn nào đã hoàn thành?", run: completedReply },
];

export function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function randomTypingDelay(): number {
  return 500 + Math.random() * 400;
}

export function matchQuestion(raw: string): BotReply {
  const q = raw.toLowerCase();
  if (q.includes("bao nhiêu đơn") || q.includes("bao nhiêu phiếu")) return countsReply();
  if (q.includes("tài xế") && (q.includes("đơn nào") || q.includes("phiếu nào"))) return driverTicketsReply();
  if (q.includes("làm việc") || q.includes("hoạt động")) return workingDriversReply();
  if (q.includes("chưa giao") || q.includes("chưa phân công") || q.includes("chưa có tài xế")) return unassignedReply();
  if (q.includes("hoàn thành") || q.includes("xong")) return completedReply();
  return fallbackReply();
}
