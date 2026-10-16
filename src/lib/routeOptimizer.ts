import { distanceKm, LatLng, routeDistanceKm } from "./geo";

export type RouteStop = {
  id: string;
  code: string;
  title: string;
  lat: number;
  lng: number;
  priority: "normal" | "high";
  timeWindow: string;
};

export type OptimizedResult = {
  order: RouteStop[];
  legs: number[];
  totalDistanceKm: number;
  totalMinutes: number;
  originalDistanceKm: number;
  savingsPercent: number;
};

const AVG_SPEED_KMH = 24;
const PRIORITY_BONUS_KM = 1.3;

export function optimizeRoute(origin: LatLng, stops: RouteStop[]): OptimizedResult {
  const originalDistanceKm = routeDistanceKm([origin, ...stops]);

  const remaining = [...stops];
  const order: RouteStop[] = [];
  const legs: number[] = [];
  let current = origin;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = distanceKm(current, remaining[i]);
      const score = remaining[i].priority === "high" ? d - PRIORITY_BONUS_KM : d;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    const next = remaining.splice(bestIndex, 1)[0];
    legs.push(distanceKm(current, next));
    order.push(next);
    current = next;
  }

  const totalDistanceKm = legs.reduce((a, b) => a + b, 0);
  const totalMinutes = (totalDistanceKm / AVG_SPEED_KMH) * 60;
  const savingsPercent =
    originalDistanceKm > 0
      ? Math.max(0, Math.round((1 - totalDistanceKm / originalDistanceKm) * 100))
      : 0;

  return { order, legs, totalDistanceKm, totalMinutes, originalDistanceKm, savingsPercent };
}
