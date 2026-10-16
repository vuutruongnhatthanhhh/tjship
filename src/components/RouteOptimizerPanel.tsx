"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, Navigation, Clock, Gauge } from "lucide-react";
import { optimizeRoute, OptimizedResult, RouteStop } from "@/lib/routeOptimizer";
import { LatLng } from "@/lib/geo";

type Status = "idle" | "thinking" | "done";

const THINKING_STEPS = [
  "Đang lấy toạ độ các điểm dừng...",
  "Đang tính khoảng cách giữa các điểm...",
  "Đang cân nhắc mức độ ưu tiên và khung giờ hẹn...",
  "Đang chọn thứ tự di chuyển tối ưu...",
];

function buildExplanation(origin: LatLng & { label: string }, result: OptimizedResult) {
  const { order, legs, totalDistanceKm, totalMinutes, savingsPercent } = result;
  if (order.length === 0) return "Hiện chưa có điểm dừng nào để tối ưu.";

  const first = order[0];
  const last = order[order.length - 1];
  const firstLeg = legs[0];
  const highPriorityCount = order.filter((s) => s.priority === "high").length;

  const parts: string[] = [];

  parts.push(
    `Em đã phân tích ${order.length} điểm dừng xuất phát từ ${origin.label}.`
  );

  if (first.priority === "high") {
    parts.push(
      `Điểm **${first.code} · ${first.title}** đang ở mức ưu tiên cao và chỉ cách ${firstLeg.toFixed(
        1
      )} km, nên em xếp ghé đầu tiên.`
    );
  } else {
    parts.push(
      `Điểm gần nhất để bắt đầu là **${first.code} · ${first.title}** (${firstLeg.toFixed(
        1
      )} km), giúp xe di chuyển ngay mà không mất công vòng lại.`
    );
  }

  if (highPriorityCount > 1) {
    parts.push(
      `Ngoài ra còn ${highPriorityCount - 1} điểm ưu tiên cao khác được em đẩy lên sớm hơn trong lộ trình dù không phải lúc nào cũng gần nhất.`
    );
  }

  parts.push(
    `Các điểm còn lại được sắp theo nguyên tắc "đi gần trước, xa sau" để hạn chế chạy vòng vèo, kết thúc tại **${last.code} · ${last.title}** (khung giờ hẹn ${last.timeWindow}).`
  );

  parts.push(
    `Tổng quãng đường khoảng ${totalDistanceKm.toFixed(1)} km, thời gian di chuyển ước tính ${Math.round(
      totalMinutes
    )} phút` +
      (savingsPercent > 0
        ? `, tiết kiệm khoảng ${savingsPercent}% quãng đường so với thứ tự ban đầu.`
        : ".")
  );

  return parts.join(" ");
}

export default function RouteOptimizerPanel({
  origin,
  stops,
  onResult,
}: {
  origin: LatLng & { label: string };
  stops: RouteStop[];
  onResult: (result: OptimizedResult | null) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<OptimizedResult | null>(null);

  function runOptimization() {
    if (stops.length === 0) return;
    setStatus("thinking");
    setStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setStepIndex(step);
      if (step >= THINKING_STEPS.length - 1) clearInterval(interval);
    }, 480);

    setTimeout(() => {
      clearInterval(interval);
      const res = optimizeRoute(origin, stops);
      setResult(res);
      setStatus("done");
      onResult(res);
    }, 2100);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    onResult(null);
  }

  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <Sparkles size={15} />
        </div>
        <p className="text-sm font-semibold text-foreground">Trợ lý tối ưu lộ trình AI</p>
      </div>

      <div className="max-h-[50vh] overflow-y-auto p-4">
        {status === "idle" && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Để em tính toán thứ tự ghé {stops.length} điểm dừng sao cho quãng đường di chuyển ngắn nhất, có cân nhắc mức độ ưu tiên và khung giờ hẹn.
            </p>
            <button
              onClick={runOptimization}
              disabled={stops.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={15} />
              Tối ưu lộ trình bằng AI
            </button>
          </div>
        )}

        {status === "thinking" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              AI đang xử lý...
            </div>
            <p className="text-sm text-muted">{THINKING_STEPS[stepIndex]}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / THINKING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/90">
              {buildExplanation(origin, result).split("**").map((chunk, i) =>
                i % 2 === 1 ? (
                  <span key={i} className="font-semibold text-foreground">
                    {chunk}
                  </span>
                ) : (
                  <span key={i}>{chunk}</span>
                )
              )}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-surface-2 p-2">
                <Gauge size={14} className="mx-auto mb-1 text-brand" />
                <p className="text-sm font-bold text-foreground">{result.totalDistanceKm.toFixed(1)} km</p>
                <p className="text-[10px] text-muted">Quãng đường</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-2">
                <Clock size={14} className="mx-auto mb-1 text-brand" />
                <p className="text-sm font-bold text-foreground">{Math.round(result.totalMinutes)} phút</p>
                <p className="text-[10px] text-muted">Thời gian</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-2">
                <Navigation size={14} className="mx-auto mb-1 text-brand" />
                <p className="text-sm font-bold text-emerald-400">
                  {result.savingsPercent > 0 ? `-${result.savingsPercent}%` : "0%"}
                </p>
                <p className="text-[10px] text-muted">Tiết kiệm</p>
              </div>
            </div>

            <ol className="space-y-2">
              {result.order.map((stop, i) => (
                <li
                  key={stop.id}
                  className="flex items-center gap-2.5 rounded-xl bg-surface-2 px-3 py-2 text-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-brand-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {stop.code} · {stop.title}
                    </p>
                    <p className="text-[11px] text-muted">
                      {result.legs[i].toFixed(1)} km · {stop.timeWindow}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <button
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted hover:text-foreground"
            >
              <RotateCcw size={13} /> Tính lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
