'use client'

import { Notification } from "@/lib/types/notification";
import { createContext } from "react";

export interface NotificationsContextPayload {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

export const NotificationsContext = createContext<NotificationsContextPayload|null>(null);
