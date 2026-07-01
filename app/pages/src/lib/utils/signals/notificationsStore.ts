
import { signal } from "@preact/signals";
import { v4 as uuidv4 } from "uuid";
import type { Notification } from "@/lib/types/notification";

const NOTIFICATION_COUNTDOWN = 5000;
const MAX_NOTIFICATIONS = 3;

export const notifications = signal<Notification[]>([]);

/** Removes a notification from the store by its identifier. */
export const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

/**
 * Adds a notification to the store. Automatically removes it after a timeout
 * unless marked as infinite. Oldest notifications are evicted when the maximum
 * count is exceeded.
 */
export const addNotification = (notification: Notification) => {
  const id = uuidv4();
  const current = [...notifications.value];
  if (current.length >= MAX_NOTIFICATIONS) current.shift();
  notifications.value = [...current, { ...notification, id }];

  if (!notification.infinite) {
    setTimeout(() => removeNotification(id), NOTIFICATION_COUNTDOWN);
  }
};
