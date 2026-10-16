"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Ticket, TicketType } from "@/lib/types";

const inputClass =
  "rounded-[0.65rem] border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand";

export default function NewOrderModal({
  open,
  onClose,
  onCreate,
  nextCode,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (ticket: Ticket) => void;
  nextCode: (type: TicketType) => string;
}) {
  const [type, setType] = useState<TicketType>("delivery");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [timeWindow, setTimeWindow] = useState("09:00 - 11:00");
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [items, setItems] = useState([{ name: "", quantity: 1, unit: "cái" }]);

  if (!open) return null;

  function updateItem(i: number, patch: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function reset() {
    setType("delivery");
    setCustomerName("");
    setPhone("");
    setAddress("");
    setTimeWindow("09:00 - 11:00");
    setPriority("normal");
    setItems([{ name: "", quantity: 1, unit: "cái" }]);
  }

  function handleSubmit() {
    if (!customerName.trim() || !address.trim()) return;
    const ticket: Ticket = {
      id: `new-${Date.now()}`,
      code: nextCode(type),
      type,
      status: "pending",
      customerName: customerName.trim(),
      phone: phone.trim() || "Chưa có",
      address: address.trim(),
      lat: 10.7769 + (Math.random() - 0.5) * 0.06,
      lng: 106.6983 + (Math.random() - 0.5) * 0.06,
      items: items.filter((it) => it.name.trim()).map((it) => ({ ...it, quantity: Number(it.quantity) || 1 })),
      driverId: null,
      timeWindow,
      priority,
    };
    onCreate(ticket);
    reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Tạo đơn hàng mới</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            {(["delivery", "pickup"] as TicketType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t === "delivery" ? "Giao hàng" : "Lấy hàng"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tên khách hàng">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={`${inputClass} w-full`}
              />
            </Field>
            <Field label="Số điện thoại">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className={`${inputClass} w-full`}
              />
            </Field>
          </div>

          <Field label="Địa chỉ">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận..."
              className={`${inputClass} w-full`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Khung giờ hẹn">
              <input
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className={`${inputClass} w-full`}
              />
            </Field>
            <Field label="Mức độ ưu tiên">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "normal" | "high")}
                className={`${inputClass} w-full`}
              >
                <option value="normal">Bình thường</option>
                <option value="high">Ưu tiên cao</option>
              </select>
            </Field>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Mặt hàng</p>
              <button
                onClick={() => setItems((prev) => [...prev, { name: "", quantity: 1, unit: "cái" }])}
                className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                <Plus size={13} /> Thêm mặt hàng
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })}
                    placeholder="Tên mặt hàng"
                    className={`${inputClass} min-w-0 w-full sm:flex-1`}
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                    className={`${inputClass} min-w-0 w-16 shrink-0`}
                  />
                  <input
                    value={item.unit}
                    onChange={(e) => updateItem(i, { unit: e.target.value })}
                    placeholder="Đơn vị"
                    className={`${inputClass} min-w-0 w-20 shrink-0`}
                  />
                  <button
                    onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                    className="shrink-0 rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
