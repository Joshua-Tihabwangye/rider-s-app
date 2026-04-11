import type { DeliveryNotification } from "../../store/types";

export function createDeliveryNotification(params: {
  orderId: string;
  title: string;
  body: string;
  category: DeliveryNotification["category"];
  createdAt?: string;
}): DeliveryNotification {
  const createdAt = params.createdAt ?? new Date().toISOString();
  return {
    id: `ntf_${params.orderId}_${new Date(createdAt).getTime()}_${Math.random().toString(16).slice(2, 7)}`,
    orderId: params.orderId,
    title: params.title,
    body: params.body,
    category: params.category,
    createdAt,
    read: false
  };
}
