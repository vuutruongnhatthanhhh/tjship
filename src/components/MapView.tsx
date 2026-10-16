"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Navigation, Phone } from "lucide-react";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  kind: "delivery" | "pickup" | "driver" | "depot";
  title: string;
  subtitle?: string;
  phone?: string;
  order?: number;
};

const colors: Record<MapMarker["kind"], string> = {
  delivery: "#3b9eff",
  pickup: "#a855f7",
  driver: "#ff7a1a",
  depot: "#e8e9ed",
};

function buildIcon(kind: MapMarker["kind"], order?: number) {
  const color = colors[kind];
  const isDriver = kind === "driver";
  const isDepot = kind === "depot";
  const hasOrder = typeof order === "number";
  const size = hasOrder ? 28 : isDriver ? 30 : 24;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        border-radius:${isDepot ? "8px" : "50%"};
        background:${color};
        box-shadow:0 0 0 3px rgba(10,11,15,0.9), 0 2px 8px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
        border:2px solid rgba(255,255,255,0.85);
        font-family:ui-sans-serif,system-ui,sans-serif;
        font-size:12px;font-weight:700;color:#0a0b0f;
      ">${hasOrder ? order : ""}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({
  markers,
  center,
  zoom = 13,
  height = 360,
  routes = [],
}: {
  markers: MapMarker[];
  center: [number, number];
  zoom?: number;
  height?: number | string;
  routes?: { points: [number, number][]; color: string }[];
}) {
  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-2xl border border-border"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          subdomains="abc"
          className="map-tiles-dark"
        />
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.points}
            pathOptions={{ color: r.color, weight: 3, opacity: 0.7, dashArray: "6 6" }}
          />
        ))}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={buildIcon(m.kind, m.order)}>
            <Popup>
              <p className="font-semibold">{m.title}</p>
              {m.subtitle && <p className="text-xs opacity-80">{m.subtitle}</p>}
              <div className="mt-2 flex gap-1.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-brand/15 px-2 py-1 text-[11px] font-semibold text-brand no-underline hover:bg-brand/25"
                >
                  <Navigation size={11} /> Chỉ đường
                </a>
                {m.phone && (
                  <a
                    href={`tel:${m.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1 text-[11px] font-semibold text-foreground/80 no-underline hover:text-foreground"
                  >
                    <Phone size={11} /> Gọi điện
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
