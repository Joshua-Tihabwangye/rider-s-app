import type {
  DeliveryDraft,
  DeliveryDraftStop,
  DeliveryOrder,
  DeliveryParty,
  DeliveryRouteSummary,
  DeliveryStop,
  RideLocation
} from "../../store/types";

export const BASE_PICKUP_FEE = 3500;
export const FIRST_DROPOFF_FEE = 600;
export const ADDITIONAL_STOP_FEE = 900;
export const DISTANCE_FEE_PER_KM = 300;
export const SERVICE_FEE_BASE = 1200;
export const SERVICE_FEE_PER_EXTRA_STOP = 250;
export const INSURANCE_FEE_BASE = 900;
export const INSURANCE_FEE_PER_EXTRA_STOP = 100;

export function createEmptyDeliveryDraftStop(sequence: number): DeliveryDraftStop {
  return {
    id: `draft_stop_${sequence}_${Math.random().toString(16).slice(2, 8)}`,
    sequence,
    location: null,
    recipient: null
  };
}

export function estimateDeliveryDistanceKm(originAddress: string, destinationAddress: string): number {
  const fallback = 8.2;
  if (originAddress === destinationAddress) {
    return 1.2;
  }
  const pseudo = Math.abs(
    [...`${originAddress}-${destinationAddress}`].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  return Number(((pseudo % 150) / 10 + fallback).toFixed(1));
}

export function deriveDraftStops(draft: DeliveryDraft): DeliveryDraftStop[] {
  const draftStops = draft.stops.length > 0 ? draft.stops : [createEmptyDeliveryDraftStop(1)];
  return draftStops.map((stop, index) => ({
    ...stop,
    sequence: index + 1,
    location:
      stop.location ??
      (index === 0 ? draft.dropoff : null),
    recipient:
      stop.recipient ??
      (index === 0 && draft.recipient
        ? {
            ...draft.recipient,
            deliveryNote: draft.recipient.notes ?? "",
            allocationNote: ""
          }
        : null)
  }));
}

export function deriveLegacyFieldsFromStops(stops: DeliveryDraftStop[]): {
  dropoff: RideLocation | null;
  recipient: DeliveryParty | null;
} {
  const first = stops[0] ?? null;
  return {
    dropoff: first?.location ?? null,
    recipient: first?.recipient
      ? {
          name: first.recipient.name,
          phone: first.recipient.phone,
          address: first.recipient.address,
          notes: first.recipient.deliveryNote ?? first.recipient.notes
        }
      : null
  };
}

export function calculateDraftPricing(draft: DeliveryDraft): {
  deliveryFee: number;
  serviceFee: number;
  insuranceFee: number;
  basePickupFee: number;
  firstDropoffFee: number;
  additionalStopFee: number;
  distanceFee: number;
  stopCount: number;
  totalDistanceKm: number;
  total: number;
} {
  const stops = deriveDraftStops(draft).filter((stop) => stop.location?.address?.trim());
  const stopCount = stops.length;
  if (!draft.pickup || stopCount === 0) {
    return {
      deliveryFee: draft.deliveryFee,
      serviceFee: draft.serviceFee,
      insuranceFee: draft.insuranceFee,
      basePickupFee: draft.basePickupFee ?? BASE_PICKUP_FEE,
      firstDropoffFee: draft.firstDropoffFee ?? FIRST_DROPOFF_FEE,
      additionalStopFee: draft.additionalStopFee ?? 0,
      distanceFee: draft.distanceFee ?? 0,
      stopCount,
      totalDistanceKm: draft.totalDistanceKm ?? 0,
      total: draft.deliveryFee + draft.serviceFee + draft.insuranceFee
    };
  }

  let totalDistanceKm = 0;
  let previousAddress = draft.pickup.address;
  for (const stop of stops) {
    totalDistanceKm += estimateDeliveryDistanceKm(previousAddress, stop.location!.address);
    previousAddress = stop.location!.address;
  }
  totalDistanceKm = Number(totalDistanceKm.toFixed(1));

  const additionalStops = Math.max(0, stopCount - 1);
  const basePickupFee = BASE_PICKUP_FEE;
  const firstDropoffFee = FIRST_DROPOFF_FEE;
  const additionalStopFee = ADDITIONAL_STOP_FEE * additionalStops;
  const distanceFee = Math.round(totalDistanceKm * DISTANCE_FEE_PER_KM);
  const deliveryFee = basePickupFee + firstDropoffFee + additionalStopFee + distanceFee;
  const serviceFee = SERVICE_FEE_BASE + SERVICE_FEE_PER_EXTRA_STOP * additionalStops;
  const insuranceFee = draft.parcel.value > 0 ? INSURANCE_FEE_BASE + INSURANCE_FEE_PER_EXTRA_STOP * additionalStops : 0;

  return {
    deliveryFee,
    serviceFee,
    insuranceFee,
    basePickupFee,
    firstDropoffFee,
    additionalStopFee,
    distanceFee,
    stopCount,
    totalDistanceKm,
    total: deliveryFee + serviceFee + insuranceFee
  };
}

export function buildOrderStops(
  orderId: string,
  pickup: RideLocation,
  draftStops: DeliveryDraftStop[]
): DeliveryStop[] {
  const validStops = draftStops.filter(
    (stop) =>
      stop.location?.address?.trim() &&
      stop.recipient?.name?.trim() &&
      stop.recipient?.phone?.trim()
  );

  let previousAddress = pickup.address;
  let cumulativeMinutes = 0;

  return validStops.map((stop, index) => {
    const distanceKm = estimateDeliveryDistanceKm(previousAddress, stop.location!.address);
    const segmentEta = Math.max(8, Math.round(distanceKm * 2.6) + 4);
    cumulativeMinutes += segmentEta;
    previousAddress = stop.location!.address;

    return {
      id: `${orderId}_stop_${index + 1}`,
      orderId,
      sequence: index + 1,
      location: stop.location!,
      recipient: {
        ...stop.recipient!,
        address: stop.recipient?.address?.trim() ? stop.recipient.address : stop.location!.address
      },
      status: index === 0 ? "queued" : "pending",
      etaMinutes: cumulativeMinutes,
      distanceKm,
      deliveryNote: stop.recipient?.deliveryNote ?? "",
      allocationNote: stop.recipient?.allocationNote ?? "",
      proofOfDelivery: null
    };
  });
}

export function summarizeRoute(stops: DeliveryStop[], optimized = false, manualOrder = true): DeliveryRouteSummary {
  const completedStops = stops.filter((stop) => stop.status === "delivered").length;
  const failedStops = stops.filter((stop) => stop.status === "failed").length;
  const skippedStops = stops.filter((stop) => stop.status === "skipped").length;
  const remainingStops = stops.filter(
    (stop) => !["delivered", "failed", "skipped", "cancelled"].includes(stop.status)
  ).length;
  const nextStop = stops.find((stop) => ["queued", "arriving", "pending", "rescheduled"].includes(stop.status)) ?? null;
  const currentStop = stops.find((stop) => stop.status === "arriving") ?? nextStop;

  return {
    totalStops: stops.length,
    completedStops,
    failedStops,
    skippedStops,
    remainingStops,
    totalDistanceKm: Number(stops.reduce((sum, stop) => sum + stop.distanceKm, 0).toFixed(1)),
    totalEtaMinutes: stops.reduce((sum, stop) => Math.max(sum, stop.etaMinutes), 0),
    nextStopId: nextStop?.id,
    currentStopId: currentStop?.id,
    optimized,
    manualOrder
  };
}

export function deriveOrderLegacyFields(order: DeliveryOrder): Pick<DeliveryOrder, "dropoff" | "recipient"> {
  const nextStop =
    order.stops.find((stop) => ["queued", "arriving", "pending", "rescheduled"].includes(stop.status)) ??
    order.stops[order.stops.length - 1];

  return {
    dropoff: nextStop?.location ?? order.dropoff,
    recipient: nextStop
      ? {
          name: nextStop.recipient.name,
          phone: nextStop.recipient.phone,
          address: nextStop.recipient.address,
          notes: nextStop.deliveryNote
        }
      : order.recipient
  };
}
