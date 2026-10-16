"use client";

import { useMemo, useState } from "react";
import { Expand, Map as MapIcon, X } from "lucide-react";
import MapView, { MapMarker } from "./MapViewLoader";
import RouteOptimizerPanel from "./RouteOptimizerPanel";
import { OptimizedResult, RouteStop } from "@/lib/routeOptimizer";
import { LatLng } from "@/lib/geo";

export default function MapSection({
  title = "Bản đồ vị trí",
  markers,
  center,
  zoom = 13,
  routes = [],
  optimizer,
}: {
  title?: string;
  markers: MapMarker[];
  center: [number, number];
  zoom?: number;
  routes?: { points: [number, number][]; color: string }[];
  optimizer?: { origin: LatLng & { label: string }; stops: RouteStop[] };
}) {
  const [open, setOpen] = useState(false);
  const [aiResult, setAiResult] = useState<OptimizedResult | null>(null);

  const legend = (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-delivery" /> Giao hàng
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-pickup" /> Lấy hàng
      </span>
    </div>
  );

  const effectiveMarkers = useMemo<MapMarker[]>(() => {
    if (!aiResult) return markers;
    const orderById = new Map(aiResult.order.map((s, i) => [s.id, i + 1]));
    return markers.map((m) =>
      orderById.has(m.id) ? { ...m, order: orderById.get(m.id) } : m
    );
  }, [markers, aiResult]);

  const effectiveRoutes = useMemo(() => {
    if (!aiResult || !optimizer) return routes;
    return [
      {
        points: [
          [optimizer.origin.lat, optimizer.origin.lng] as [number, number],
          ...aiResult.order.map((s) => [s.lat, s.lng] as [number, number]),
        ],
        color: "#ff7a1a",
      },
    ];
  }, [routes, aiResult, optimizer]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground/90">{title}</h2>
        {legend}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface py-10 text-sm font-medium text-muted transition-colors hover:border-brand/40 hover:text-foreground"
      >
        <MapIcon size={18} />
        Xem bản đồ toàn màn hình
        <Expand size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-8">
            <div>
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
              {legend}
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                <X size={14} /> Đóng
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <MapView
              markers={effectiveMarkers}
              center={center}
              zoom={zoom}
              height="100%"
              routes={effectiveRoutes}
            />
            {optimizer && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1000 flex justify-center p-4 md:inset-x-auto md:right-4 md:top-4 md:bottom-auto md:justify-end">
                <RouteOptimizerPanel
                  origin={optimizer.origin}
                  stops={optimizer.stops}
                  onResult={setAiResult}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
