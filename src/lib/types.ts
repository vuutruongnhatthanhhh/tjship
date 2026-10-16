export type TicketType = "delivery" | "pickup";

export type TicketStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "failed";

export type DriverStatus = "active" | "busy" | "offline";

export type VehicleType = "Xe máy" | "Xe tải nhỏ" | "Xe tải lớn";

export interface Item {
  name: string;
  quantity: number;
  unit: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  vehicle: string;
  vehicleType: VehicleType;
  status: DriverStatus;
  lat: number;
  lng: number;
  rating: number;
}

export interface Ticket {
  id: string;
  code: string;
  type: TicketType;
  status: TicketStatus;
  customerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  items: Item[];
  driverId: string | null;
  timeWindow: string;
  priority: "normal" | "high";
  note?: string;
  codAmount?: number;
}
