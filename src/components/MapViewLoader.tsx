"use client";

import dynamic from "next/dynamic";

export type { MapMarker } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 360 }}
      className="flex items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted"
    >
      Đang tải bản đồ...
    </div>
  ),
});

export default MapView;
