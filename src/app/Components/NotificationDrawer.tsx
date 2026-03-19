"use client";
interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
}
import { Flex, Button, Drawer, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsAsRead } from "../services/api";
import { useNotifications } from "../hooks/notificationHook";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import NProgress from "nprogress";
import uncheckedNotificationIcon from "../../../public/images/redDot.png";

export default function NotificationDrawer({
  open,
  onClose,
  setUnreadNotifications,
}: NotificationDrawerProps) {
  const { notifications, setNotifications } = useNotifications(
    Cookies.get("userId")!,
  );

  const token = Cookies.get("accessToken") || "";
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await getNotifications(token, offset, 10);
      setNotifications(data.notifications);
      setUnreadNotifications(data.unreadCount);
      setLocalUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoadingNotifications(false);
  };
  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;

    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));

    setNotifications(updatedNotifications);
    setUnreadNotifications(0);
    setLocalUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      fetchNotifications();
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchNotifications();
  }, [open]);
  return (
    <>
      <Drawer title="Notification" onClose={onClose} open={open} width={350}>
        <div className="notificationInnerZero">
          <p className="unread">
            <span>{localUnreadCount} </span> Unread
          </p>
          <Button className="markAllAsReadBtn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="notification-content">
          {loadingNotifications ? (
            <Skeleton
              active
              avatar
              paragraph={{ rows: 1, width: "100%" }}
              className="px-5 notificationSkeleton"
            />
          ) : notifications.length > 0 ? (
            notifications.map((notif: any) => (
              <div
                key={notif._id}
                className="notificationInner"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // Navigate or mark notification as read
                  NProgress.start();
                }}
              >
                <Link
                  href={
                    notif.type === "follow"
                      ? `/user/${notif.message.split(" ")[0]}`
                      : notif.type === "comment"
                        ? `/${notif?.blog?.slug}`
                        : `/${notif?.blog?.slug}`
                  }
                >
                  {/* Show different layout if notification is unread */}
                  {notif.isRead ? (
                    <>
                      <div className="notificationContentParent">
                        <p className="notificationContent">{notif.message}</p>
                        <div className="notificationDayParent">
                          <span className="notificationDay">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={uncheckedNotificationIcon}
                        alt="unchecked notification"
                        className="uncheckedNotificationIcon"
                        width={40}
                        height={40}
                      />
                      <div className="notificationContentParent">
                        <p className="notificationContentIfAlreadyRead">
                          {notif.message}
                        </p>
                        <div className="notificationDayParent">
                          <span className="notificationDay">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              </div>
            ))
          ) : (
            <p style={{ padding: "10px" }}>No notifications found.</p>
          )}
        </div>
      </Drawer>
    </>
  );
}
