
import { useContext } from "preact/hooks";
import { NotificationsContext } from "./notificationsContext";

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
}
