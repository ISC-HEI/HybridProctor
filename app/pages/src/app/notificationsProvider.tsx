'use client'

import { NotificationsContext } from "@/lib/utils/hooks/notificationsContext";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Notification } from "@/lib/types/notification";
import { v4 as uuidv4 } from "uuid";

interface ProvidersProps {
  children: ReactNode
}

const NOTIFICATION_COUNTDOWN = 5000;
const MAX_NOTIFICATIONS = 3;

export default function NotificationProvider({ children }: ProvidersProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    const id = uuidv4();
    setNotifications(prevNotifications => {
      const newNotifications = [...prevNotifications];
      if (newNotifications.length >= MAX_NOTIFICATIONS) {
        newNotifications.shift();
      }
      return [...newNotifications, { ...notification, id }];
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  useEffect(() => {
    const timeouts = notifications.map((notification) => {
      if (!notification.infinite && notification.id) {
        return setTimeout(() => {
          removeNotification(notification.id!);
        }, NOTIFICATION_COUNTDOWN);
      }
      return null;
    });

    return () => {
      timeouts.forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, [notifications, removeNotification]);

  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification
  }), [notifications, addNotification, removeNotification]);

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  )
}
