'use client'

import { NotificationsContext } from "@/lib/utils/hooks/notificationsContext";
import { ReactNode, useEffect, useState } from "react";
import { Notification } from "@/lib/types/notification";
import { v4 as uuidv4 } from "uuid";

interface ProvidersProps {
  children: ReactNode
}

const NOTIFICATION_COUNTDOWN = 5000;
const MAX_NOTIFICATIONS = 3;

export default function NotificationProvider({ children }: ProvidersProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const shift = () => {
    return notifications.filter((v, i) => i !== 0);
  }

  const addNotification = (notification: Notification) => {
    const id = uuidv4();

    if (notifications.length >= MAX_NOTIFICATIONS) {
      setNotifications(prev => [...shift(), { ...notification, id }]);
      return;
    }

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
    <NotificationsContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}
