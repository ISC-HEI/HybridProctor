
'use client'

import { useContext } from "react";
import { NotificationsContext } from "./notificationsContext";

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
}
