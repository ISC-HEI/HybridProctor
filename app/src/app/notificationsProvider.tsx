'use client'

import { NotificationsContext } from "@/lib/utils/hooks/notificationsContext";
import { ReactNode, useEffect, useState } from "react";
import { Notification } from "@/lib/types/notification";

interface ProvidersProps {
  children: ReactNode
}

const NOTIFICATION_COUNTDOWN = 5000;

export default function NotificationProvider({ children }: ProvidersProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    const id = crypto.randomUUID();

    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.infinite) {
        const timeoutId = setTimeout(() => {
          removeNotification(notification.id!);

        }, NOTIFICATION_COUNTDOWN);

        return () => clearTimeout(timeoutId);
      }
    });
  }, [notifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}
