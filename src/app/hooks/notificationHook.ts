// notificationsHook.ts
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const socket = io("https://blogs-backend-ftie.onrender.com"); // adjust URL as needed

  useEffect(() => {

    socket.emit("join", userId);
    socket.on("newNotification", (notification) => {
      console.log("Received new notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [userId]);

  return { notifications, setNotifications };
}
