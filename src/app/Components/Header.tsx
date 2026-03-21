"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flex, Button } from "antd";
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
import Cookies from "js-cookie";
import FaqDrawer from "./FaqDrawer";
import NProgress from "nprogress";
import Lekhan from "../../assets/images/LekhanTransparent.png";
import NotificationDrawer from "./NotificationDrawer";
import { getUnreadNotificationCount } from "../services/api";

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
  const [unreadNotifications, setUnreadNotifications] = useState(0);
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

  //this useEffect will check for accessToken, email, username, fullname to conditionally display the logged in state
  useEffect(() => {
    const storedEmail = Cookies.get("email");
    const storedUsername = Cookies.get("username");
    const storedFullName = Cookies.get("fullname");
    const accessToken = Cookies.get("accessToken");

    if (storedEmail && storedUsername && storedFullName && accessToken) {
      setEmail(storedEmail);
      setUsername(storedUsername);
      setFullName(storedFullName);
      setIsLoggedIn(true);
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

  // this below useEffect is for calling unread notification count api
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadNotificationCount(token);

        if (data?.unreadCount) {
          setUnreadNotifications(data.unreadCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadCount();
  }, []);

  //logout function to clear all the cookies and then page reload
  const logout = () => {
    const cookies = Cookies.get(); // Get all cookies
    Object.keys(cookies).forEach((cookie) => {
      Cookies.remove(cookie); // Remove each cookie
      window.location.reload();
    });
  };

  const DEFAULT_AVATAR = `/images/default-user.webp`;

  const initialSrc = profileImage
    ? `${profileImage}`
    : DEFAULT_AVATAR;

  const [imgSrc, setImgSrc] = useState(initialSrc);

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
          {/* commented dark mode toggle for now.. coz its not working perfectly on vercel */}
          {/* <div className="md:w-[146.23px]">{isLoggedIn && <ThemeToggle />}</div> */}

          <Link className="logo" href={"/"}>
            <Image
              src={Lekhan}
              alt="Blogs"
              className="w-[79px] h-[31px] lg:w-[130px] lg:h-[50px]"
            />
          </Link>

          <Flex gap={16} className="nav-btns" align="center">
            {isLoggedIn ? (
              <>
                {" "}
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
                <div
                  className="avatar"
                  ref={avatarRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile((prevState) => !prevState);
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt="User Profile"
                    width={27}
                    height={27}
                    onError={() => {
                      if (imgSrc !== DEFAULT_AVATAR) {
                        setImgSrc(DEFAULT_AVATAR);
                      }
                    }}
                  />
                </div>
                {showProfile && (
                  <div className="profile-popover" ref={popoverRef}>
                    <div>
                      <div className="avatar">
                        <Image
                          src={imgSrc}
                          alt={username || fullName || "Profile Picture"}
                          width={40}
                          height={40}
                          onError={() => {
                            if (imgSrc !== DEFAULT_AVATAR) {
                              setImgSrc(DEFAULT_AVATAR);
                            }
                          }}
                        />
                      </div>
                      <p className="profile-popover--name">{fullName}</p>
                      <p className="profile-popover--id">{username}</p>
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
      {/* notification drawer */}

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
// ----
