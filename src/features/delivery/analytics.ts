import type { DeliveryOrder } from "../../store/types";

export interface DeliveryKpis {
  totalOrders: number;
  deliveredOrders: number;
  onTimePercent: number;
  cancelPercent: number;
  failedHandoffPercent: number;
  supportContactRate: number;
}

function toPercent(value: number): number {
  return Number((value * 100).toFixed(1));
}

function isOnTime(order: DeliveryOrder): boolean {
  if (order.status !== "delivered" && order.status !== "partially_completed") {
    return false;
  }

  if (!order.scheduleTime || order.schedule !== "scheduled" || !order.deliveredAt) {
    return !((order.exceptions ?? []).some((item) => item.type === "delayed_courier"));
  }

  const scheduled = new Date(order.scheduleTime).getTime();
  const delivered = new Date(order.deliveredAt).getTime();

  if (Number.isNaN(scheduled) || Number.isNaN(delivered)) {
    return !((order.exceptions ?? []).some((item) => item.type === "delayed_courier"));
  }

  // 45-minute grace window.
  return delivered <= scheduled + 45 * 60 * 1000;
}

export function calculateDeliveryKpis(orders: DeliveryOrder[]): DeliveryKpis {
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((item) => item.status === "delivered" || item.status === "partially_completed").length;
  const cancelledOrders = orders.filter((item) => item.status === "cancelled").length;
  const failedHandoffOrders = orders.filter(
    (item) =>
      item.status === "failed" ||
      (item.exceptions ?? []).some((exception) => exception.type === "failed_handoff")
  ).length;
  const supportContactOrders = orders.filter((item) =>
    (item.contactEvents ?? []).some((event) => event.type === "support")
  ).length;
  const onTimeDelivered = orders.filter((item) => isOnTime(item)).length;

  return {
    totalOrders,
    deliveredOrders,
    onTimePercent: deliveredOrders === 0 ? 0 : toPercent(onTimeDelivered / deliveredOrders),
    cancelPercent: totalOrders === 0 ? 0 : toPercent(cancelledOrders / totalOrders),
    failedHandoffPercent: totalOrders === 0 ? 0 : toPercent(failedHandoffOrders / totalOrders),
    supportContactRate: totalOrders === 0 ? 0 : toPercent(supportContactOrders / totalOrders)
  };
}
