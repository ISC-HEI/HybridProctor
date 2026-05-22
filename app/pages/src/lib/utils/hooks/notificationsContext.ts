import { type Notification } from "@/lib/types/notification";
import { createContext } from "preact";

export interface NotificationsContextPayload {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const NotificationsContext = createContext<NotificationsContextPayload|null>(null);
