"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flex, Button, Drawer, Skeleton } from "antd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
// import CreateModal from "./CreateModal";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Logo from "../../../public/images/logo.svg";
import SettingIcon from "../../../public/images/setting.svg";
import SignOutIcon from "../../../public/images/sign-out.svg";
import Bell from "../../../public/images/bell.svg";
import ChartIcon from "../../../public/images/chart.svg";
import "../styles/header.css";
import Cookies from "js-cookie";
// import bydefaultUser from "../../../public/images/avatar2.png";
import uncheckedNotificationIcon from "../../../public/images/redDot.png";
import Logos from "../../../public/images/Logos.png";
import Qnaly from "../../assets/images/QnalyHeaderLogo.webp";
import defaultUser from "../../assets/images/not-logged-in-user.png";
import FaqDrawer from "./FaqDrawer";
import { getNotifications, markAllNotificationsAsRead } from "../services/api";
import { useNotifications } from "../hooks/notificationHook";
import NProgress from "nprogress";
import BlogsLogo from "../../assets/images/BlogsNewLogo.png";
import Lekhan from "../../assets/images/lekhan.png";

interface MenuItem {
  label: string;
  key: string;
  type?: "divider";
}

interface CommentsProps {
  // ownProfile?: boolean;
  profileData?: any;
}

export default function Header() {
  const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { notifications, setNotifications } = useNotifications(
    Cookies.get("userId")!
  );
  const [offset, setOffset] = useState(0);
  const router = useRouter();

  const token = Cookies.get("accessToken");
  const profileImage = Cookies.get("profileImage");
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState<boolean>(false);
  const toggleNotificationDrawer = () => {
    setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
  };
  const toggleBottomDrawer = () => {
    setDrawerVisible((prevVisible) => !prevVisible);
  };
  const showLoginModal = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(true);
    document.body.classList.add("modal-opened");
  };

  const showModal = () => {
    setIsModalOpen(true);
    setIsLoginModalOpen(false);
    document.body.classList.add("modal-opened");
  };
  const pathname = usePathname();

  //this useEffect will check for accessToken, email, username, fullname to conditionally display the logged in state
  useEffect(() => {
    console.log("useEffect called");
    const storedEmail = Cookies.get("email");
    const storedUsername = Cookies.get("username");
    const storedFullName = Cookies.get("fullname");
    const accessToken = Cookies.get("accessToken");
    console.log("storedEmail is ", storedEmail);
    console.log("storedUsername is ", storedUsername);
    console.log("storedFullName is ", storedFullName);
    console.log("accessToken is ", accessToken);

    if (storedEmail && storedUsername && storedFullName && accessToken) {
      setEmail(storedEmail);
      setUsername(storedUsername);
      setFullName(storedFullName);
      setIsLoggedIn(true);
      console.log("values assigned to states");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //logout function to clear all the cookies and then page reload
  const logout = () => {
    const cookies = Cookies.get(); // Get all cookies
    Object.keys(cookies).forEach((cookie) => {
      Cookies.remove(cookie); // Remove each cookie
      window.location.reload();
    });
  };

  // Function to load existing notifications (when drawer opens)
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await getNotifications(token, offset, 10);
      console.log("notification data is:- ", data);
      setNotifications(data.notifications);
      setUnreadNotifications(data.unreadCount); // Adjust if API returns a total count separately
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoadingNotifications(false);
  };

  // Load notifications when drawer opens
  useEffect(() => {
    if (isNotificationDrawerOpen) {
      fetchNotifications();
    }
  }, [isNotificationDrawerOpen]);

  // **Mark all notifications as read**
  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;

    // **Optimistically update the state**
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    setUnreadNotifications(0); // Since all are marked read

    try {
      await markAllNotificationsAsRead();
      console.log("All notifications marked as read successfully.");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      // **Revert state if API call fails**
      fetchNotifications();
    }
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="relative z-10">
      <div className="container home-container header-container">
        <Flex
          gap={20}
          wrap="wrap"
          justify="space-between"
          align="center"
          className="desktop-nav"
          style={{ borderBottomWidth: "1px", justifyContent: "space-between" }}
        >
          {/* <Flex gap={4} className="nav-list">
            <Link
              className={`headerLiks ${pathname === "/" ? "underline" : ""}`}
              href={"/"}
            >
              Home
            </Link>
            <Link
              className={`headerLiks ${
                pathname === "/channels" ? "underline" : ""
              }`}
              href={"/channels"}
            >
              Channels
            </Link>
          </Flex> */}

          <Link className="logo" href={"/"}>
            {/* <Logo /> */}
            <Image
              src={Lekhan}
              alt="Blogs"
              className="w-[84px] h-[36px] lg:w-[130px] lg:h-[50px]"
            />
          </Link>

          <Flex gap={16} className="nav-btns" align="center">
            {isLoggedIn ? (
              <>
                {" "}
                <Button
                  type="text"
                  className="font-sm"
                  onClick={toggleBottomDrawer}
                >
                  Create
                </Button>
                <FaqDrawer
                  visible={isDrawerVisible}
                  onClose={toggleBottomDrawer}
                />
                <Button
                  type="text"
                  className={`font-sm ${unreadNotifications ? "icon" : ""}`}
                  onClick={toggleNotificationDrawer}
                >
                  <div style={{ position: "relative" }}>
                    <Bell />
                  </div>
                </Button>
                <div
                  className="avatar"
                  ref={avatarRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile((prevState) => !prevState);
                  }}
                >
                  <Image
                    src={`${backendBaseUrl}/${profileImage}`}
                    alt="User Profile"
                    width={27}
                    height={27}
                  />
                </div>
                {showProfile && (
                  <div className="profile-popover" ref={popoverRef}>
                    <div>
                      <div className="avatar">
                        <Image
                          src={`${backendBaseUrl}/${profileImage}`}
                          alt="User Profile"
                          width={40}
                          height={40}
                        />
                      </div>
                      <p className="profile-popover--name">{fullName}</p>
                      <p className="profile-popover--id">{username}</p>
                    </div>
                    <Flex gap={6} vertical className="profile-popover--actions">
                      <Button
                        onClick={() => {
                          router.push("/profile");
                          setShowProfile(false);
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Flex>
                    <span className="divider"></span>
                    <Flex
                      gap={8}
                      vertical
                      className="profile-popover--other-actions"
                    >
                      {/* <Button
                        onClick={() => {
                         
                          setShowProfile(false);
                        }}
                      >
                        <ChartIcon />
                        View Activities
                      </Button> */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => {
                                // router.push("settings");
                                setShowProfile(false);
                              }}
                            >
                              <SettingIcon />
                              Settings
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="!p-[5px]">
                            <p className="!text-white">Coming soon! ⏳</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Flex>
                    <span className="divider"></span>
                    <Button className="signout" onClick={logout}>
                      <SignOutIcon />
                      Sign Out
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Button onClick={showLoginModal}>Login</Button>
                <Button type="primary" onClick={showModal}>
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </div>
      {/* notification drawer */}
      <Drawer
        title="Notification"
        onClose={toggleNotificationDrawer}
        open={isNotificationDrawerOpen}
        width={350}
      >
        <div className="notificationInnerZero">
          <p className="unread">
            <span>{unreadNotifications} </span> Unread
          </p>
          <Button className="markAllAsReadBtn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="notification-content">
          {loadingNotifications ? (
            <Skeleton active avatar paragraph={{ rows: 1, width: "100%" }} />
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
                      ? `/user/${notif.message.split(" ")[0]}` // Extract username from message
                      : notif.type === "comment"
                      ? `/${notif?.blog?.slug}` // Link to the blog where the comment was made
                      : `/${notif?.blog?.slug}` // Default case (for reactions, etc.)
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
      <SignInModal
        setIsModalOpen={setIsModalOpen}
        showLoginModal={showLoginModal}
        isModalOpen={isModalOpen}
      />
      <LogInModal
        setIsModalOpen={setIsLoginModalOpen}
        showSignModal={showModal}
        isModalOpen={isLoginModalOpen}
      />
    </header>
  );
}
// ----