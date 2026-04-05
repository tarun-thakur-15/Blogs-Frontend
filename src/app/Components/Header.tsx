"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flex, Button } from "antd";
import { useAuthStore } from "../stores/authStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import { useRouter } from "next/navigation";
import SettingIcon from "../../../public/images/setting.svg";
import SignOutIcon from "../../../public/images/sign-out.svg";
import Bell from "../../../public/images/bell.svg";
import "../styles/header.css";
import FaqDrawer from "./FaqDrawer";
import NProgress from "nprogress";
import Lekhan from "../../assets/images/LekhanTransparent.png";
import NotificationDrawer from "./NotificationDrawer";
import { getUnreadNotificationCount, logoutUser } from "../services/api";
import Cookies from "js-cookie";

const DEFAULT_AVATAR = `https://www.tarunthakur.com/lekhan/images/default-user.webp`;

export default function Header() {
  // ✅ Use authStore — no more manual getMe() calls here
  const { user, isLoggedIn, isHydrated } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [imgSrc, setImgSrc] = useState(DEFAULT_AVATAR);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  // ✅ Sync avatar with user from store
  useEffect(() => {
    if (user?.profileImage) {
      setImgSrc(user.profileImage);
    } else {
      setImgSrc(DEFAULT_AVATAR);
    }
  }, [user]);

  // ✅ Fetch unread notifications only when logged in and hydrated
  useEffect(() => {
    if (!isHydrated || !isLoggedIn) return;

    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadNotificationCount();
        if (data?.unreadCount) {
          setUnreadNotifications(data.unreadCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadCount();
  }, [isHydrated, isLoggedIn]); // ✅ only runs once auth state is known

  // Close profile popover on outside click
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      useAuthStore.getState().logout();
      Cookies.remove("accessToken");
      window.location.href = "/lekhan";
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
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

  const toggleNotificationDrawer = () =>
    setIsNotificationDrawerOpen((prev) => !prev);

  const toggleBottomDrawer = () =>
    setDrawerVisible((prev) => !prev);

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState<boolean>(false);

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
          <Link className="logo" href={"/"}>
            <Image
              src={Lekhan}
              alt="Lekhan"
              className="w-[79px] h-[31px] lg:w-[130px] lg:h-[50px]"
            />
          </Link>

          <Flex gap={16} className="nav-btns" align="center">
            {/* ✅ Wait for hydration before rendering auth-dependent UI */}
            {!isHydrated ? null : isLoggedIn ? (
              <>
                <Button
                  type="text"
                  className="font-sm btnHoverOnDarkMode"
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
                  className="font-sm notificationButton"
                  onClick={toggleNotificationDrawer}
                >
                  <div className="bellWrapper">
                    <Bell className="NotificationIcon" />
                    {unreadNotifications > 0 && (
                      <span className="notificationBadge">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </Button>

                {/* Avatar */}
                <div
                  className="avatar"
                  ref={avatarRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile((prev) => !prev);
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt="User Profile"
                    width={27}
                    height={27}
                    onError={() => {
                      if (imgSrc !== DEFAULT_AVATAR) setImgSrc(DEFAULT_AVATAR);
                    }}
                  />
                </div>

                {/* Profile popover */}
                {showProfile && (
                  <div className="profile-popover" ref={popoverRef}>
                    <div>
                      <div className="avatar">
                        <Image
                          src={imgSrc}
                          alt={user?.username || user?.fullname || "Profile Picture"}
                          width={40}
                          height={40}
                          onError={() => {
                            if (imgSrc !== DEFAULT_AVATAR) setImgSrc(DEFAULT_AVATAR);
                          }}
                        />
                      </div>
                      <p className="profile-popover--name">{user?.fullname}</p>
                      <p className="profile-popover--id">{user?.username}</p>
                    </div>

                    <Flex gap={6} vertical className="profile-popover--actions">
                      <Button
                        onClick={() => {
                          router.push("/profile");
                          NProgress.start();
                          setShowProfile(false);
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Flex>

                    <span className="divider"></span>

                    <Flex gap={8} vertical className="profile-popover--other-actions">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={() => setShowProfile(false)}>
                              <SettingIcon className="settingIcon" />
                              Settings
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="!p-[5px]">
                            <p className="tooltipText">Coming soon! ⏳</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Flex>

                    <span className="divider"></span>

                    <Button className="signout" onClick={logout}>
                      <SignOutIcon className="signOutIcon" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Button className="loginBtn" onClick={showLoginModal}>
                  Login
                </Button>
                <Button type="primary" onClick={showModal}>
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </div>

      <NotificationDrawer
        open={isNotificationDrawerOpen}
        onClose={toggleNotificationDrawer}
        setUnreadNotifications={setUnreadNotifications}
      />
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