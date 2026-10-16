import { PackageCheck, PackageSearch, PackageX, Truck, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import TicketCard from "@/components/TicketCard";
import MapSection from "@/components/MapSection";
import { MapMarker } from "@/components/MapViewLoader";
import { drivers, depot, tickets } from "@/lib/mock-data";
import { TypeBadge } from "@/components/Badges";

export default function DashboardPage() {
  const deliveries = tickets.filter((t) => t.type === "delivery");
  const pickups = tickets.filter((t) => t.type === "pickup");

  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const completed = tickets.filter((t) => t.status === "completed").length;
  const failed = tickets.filter((t) => t.status === "failed").length;
  const activeDrivers = drivers.filter((d) => d.status !== "offline").length;

  const findDriver = (id: string | null) =>
    id ? drivers.find((d) => d.id === id) ?? null : null;

  const markers: MapMarker[] = [
    { id: "depot", lat: depot.lat, lng: depot.lng, kind: "depot", title: depot.name, subtitle: depot.address },
    ...tickets.map((t) => ({
      id: t.id,
      lat: t.lat,
      lng: t.lng,
      kind: t.type,
      title: `${t.code} · ${t.customerName}`,
      subtitle: t.address,
      phone: t.phone,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="Tổng quan vận hành"
        subtitle="Theo dõi phiếu giao hàng, lấy hàng và vị trí tài xế theo thời gian thực"
      />

      <div className="space-y-6 px-4 py-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Tổng phiếu hôm nay" value={tickets.length} icon={PackageSearch} tint="#ff7a1a" />
          <StatCard label="Đang thực hiện" value={inProgress} icon={Truck} tint="#f59e0b" />
          <StatCard label="Hoàn thành" value={completed} icon={PackageCheck} tint="#22c55e" />
          <StatCard label="Thất bại" value={failed} icon={PackageX} tint="#f43f5e" />
          <StatCard
            label="Tài xế hoạt động"
            value={`${activeDrivers}/${drivers.length}`}
            icon={Users}
            tint="#3b9eff"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <MapSection markers={markers} center={[depot.lat, depot.lng]} zoom={12} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TypeBadge type="delivery" />
                <h2 className="text-sm font-semibold text-foreground/90">
                  Phiếu giao hàng ({deliveries.length})
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {deliveries.map((t) => (
                <TicketCard key={t.id} ticket={t} driver={findDriver(t.driverId)} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TypeBadge type="pickup" />
                <h2 className="text-sm font-semibold text-foreground/90">
                  Phiếu lấy hàng ({pickups.length})
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {pickups.map((t) => (
                <TicketCard key={t.id} ticket={t} driver={findDriver(t.driverId)} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
