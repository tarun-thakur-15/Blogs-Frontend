"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Flex, Button, Select } from "antd";
import Link from "next/link";
import {
  getFollowersList,
  getFollowingList,
  toggleFollow,
  searchFollowers,
  searchFollowing,
} from "../services/api";
import DoneImage from "../../../public/images/done.svg";
import SelectDrop from "../../../public/images/select-drop.svg";
import { toast, Toaster } from "sonner";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import DetailedBlogHeaderSkeleton from "./DetailedBlogHeaderSkeleton";
import FollowersFollowingModal from "./FollowersFollowingModal";
import { useAuthStore } from "../stores/authStore";

interface CompanyHeaderOtherProps {
  username: string;
  fullName: string;
  profileImage?: string;
  followersCount: number;
  followingCount: number;
  isFollowed: boolean;
  usernameFromCookies: string;
  isFavourite?: boolean;
  totalBlogs?: number;
  blogSlug: string; // Added prop for blog slug
}

interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

export default function CompanyHeaderOther({
  username,
  fullName,
  profileImage,
  followersCount,
  followingCount,
  isFollowed,
  usernameFromCookies,
  isFavourite,
  totalBlogs,
  blogSlug,
}: CompanyHeaderOtherProps) {
  const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";
  // State for Followers Modal
  const [isSubscriberListModalOpen, setIsSubscriberListModalOpen] =
    useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [offset, setOffset] = useState(0);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [followersQuery, setFollowersQuery] = useState("");

  // State for Following Modal
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followingOffset, setFollowingOffset] = useState(0);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const followingLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const [followingQuery, setFollowingQuery] = useState("");

  const [localIsFollowed, setLocalIsFollowed] = useState(isFollowed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  // Function to open followers modal and load followers
  const openModal = async () => {
    setIsSubscriberListModalOpen(true);
    setLoadingFollowers(true);
    try {
      // Replace 'username' with the actual username prop passed into CompanyHeaderOther
      const data = await getFollowersList(/* username */ username, offset, 10);
      const newFollowers = data.followers || [];
      if (newFollowers.length < 10) {
        setHasMoreFollowers(false);
      }
      setFollowers((prev) => [...prev, ...newFollowers]);
      setOffset((prevOffset) => prevOffset + newFollowers.length);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
    setLoadingFollowers(false);
  };

  // Function to open Following Modal and reset state
  const openFollowingModal = async () => {
    setIsFollowingModalOpen(true);
    setFollowingList([]);
    setFollowingOffset(0);
    setHasMoreFollowing(true);
    setLoadingFollowing(true);
    try {
      const data = await getFollowingList(username, 0, 10);
      const newFollowing = data.following || [];
      if (newFollowing.length < 10) setHasMoreFollowing(false);
      setFollowingList(newFollowing);
      setFollowingOffset(newFollowing.length);
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
    setLoadingFollowing(false);
  };

  // Intersection Observer to load more followers when scrolling near the bottom
  useEffect(() => {
    if (!hasMoreFollowers || loadingFollowers) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingFollowers) {
          openModal();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMoreFollowers, loadingFollowers, offset]);

  // Intersection Observer for Following Modal
  useEffect(() => {
    if (!hasMoreFollowing || loadingFollowing) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingFollowing) {
          // Fetch more following users
          (async () => {
            try {
              const data = await getFollowingList(
                username,
                followingOffset,
                10,
              );
              const newFollowing = data.following || [];
              if (newFollowing.length < 10) setHasMoreFollowing(false);
              setFollowingList((prev) => [...prev, ...newFollowing]);
              setFollowingOffset((prev) => prev + newFollowing.length);
            } catch (error) {
              console.error("Error loading more following:", error);
            }
          })();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );
    if (followingLoadMoreRef.current) {
      observer.observe(followingLoadMoreRef.current);
    }
    return () => {
      if (followingLoadMoreRef.current) {
        observer.unobserve(followingLoadMoreRef.current);
      }
    };
  }, [hasMoreFollowing, loadingFollowing, followingOffset, username]);

  const handleFollowChange = async (value: string) => {
    setLocalIsFollowed((prev) => !prev);
    try {
      if (!isLoggedIn) {
        showLoginModal();
        setLocalIsFollowed((prev) => !prev); // Revert the follow toggle
        return;
      }

      const res = await toggleFollow(username);
      toast.success(
        res?.msg ||
          `You have ${
            localIsFollowed ? "unfollowed" : "followed"
          } ${username} successfully! 🎉`,
      );
    } catch (error: any) {
      if (!isLoggedIn) {
        showLoginModal();
      } else {
       setLocalIsFollowed((prev) => !prev);
        const msg =
          error?.response?.data?.msg ||
          "Failed to update follow status. Please try again. ❌";
        toast.error(msg);
      }

      // Always revert the follow state in case of error
      setLocalIsFollowed((prev) => !prev);
    }
  };

  const DEFAULT_AVATAR = `https://www.tarunthakur.com/lekhan/images/default-user.webp`;
  function getImageSrc(img: any) {
    if (!img) return DEFAULT_AVATAR;

    // ✅ Cloudinary or any external URL
    if (img.startsWith("http")) {
      return img;
    }

    // ✅ Local image → prepend baseUrl
    return `${backendBaseUrl}/${img}`;
  }

  const initialSrc = getImageSrc(profileImage);

  const [imgSrc, setImgSrc] = useState(initialSrc);
  // ---------------------
  const fetchAllFollowers = useCallback(async () => {
    setLoadingFollowers(true);
    try {
      const data = await searchFollowers(username, followersQuery);
      setFollowers(data.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
    setLoadingFollowers(false);
  }, [username, followersQuery]);

  const fetchAllFollowing = useCallback(async () => {
    setLoadingFollowing(true);
    try {
      const data = await searchFollowing(username, followingQuery);
      setFollowingList(data.following);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
    setLoadingFollowing(false);
  }, [username, followingQuery]);

  // Call fetch functions when query changes
  useEffect(() => {
    if (isSubscriberListModalOpen) {
      fetchAllFollowers();
    }
  }, [followersQuery, isSubscriberListModalOpen, fetchAllFollowers]);

  useEffect(() => {
    if (isFollowingModalOpen) {
      fetchAllFollowing();
    }
  }, [followingQuery, isFollowingModalOpen, fetchAllFollowing]);

  // ---------------------------
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

  //loading state UI
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(false);
  }, []);

  if (pageLoading) {
    return <DetailedBlogHeaderSkeleton />;
  }
  return (
    <>
      <Toaster position="top-right" />
      <Flex
        align="center"
        wrap="wrap"
        className="company-header"
        gap={20}
        justify="space-between"
      >
        <Flex align="center">
          <div className="wrapper">
            <div className="file-upload">
              {/* <input className="profile-pic" type="file" /> */}
              <Image
                src={imgSrc}
                alt="profile picture"
                width={68}
                height={68}
                onError={() => {
                  if (imgSrc !== DEFAULT_AVATAR) {
                    setImgSrc(DEFAULT_AVATAR);
                  }
                }}
              />
            </div>
          </div>
          <Flex gap={5} vertical className="company-header-info">
            <Flex align="center" gap={8}>
              <h3 className="company-header-name" style={{ cursor: "pointer" }}>
                {fullName}
              </h3>
            </Flex>
            <Flex align="center" gap={8} className="company-header-details">
              <p className="dark" style={{ cursor: "pointer" }}>
                @{username}
              </p>
              <p className="dark">•</p>
              <p onClick={openModal}>
                <span className="dark">{followersCount}</span> Followers
              </p>
              <p className="dark">•</p>
              <p onClick={openFollowingModal}>
                <span className="dark">{followingCount}</span> Following
              </p>
              <p className="dark">•</p>
              <p>
                <span className="dark">{totalBlogs ?? 0}</span> Blogs
              </p>
            </Flex>
          </Flex>
        </Flex>

        <Flex align="center" gap={12} className="company-header--btns">
          {usernameFromCookies === username ? (
            ""
          ) : (
            <div className="subscribed">
              <DoneImage className="done" />
              <Select
                className="normal"
                value={localIsFollowed ? "Following" : "follow"}
                suffixIcon={<SelectDrop className="closeIcon" />}
                placement="bottomLeft"
                options={
                  localIsFollowed
                    ? [{ value: "Unfollow", label: "Unfollow" }]
                    : [{ value: "Follow", label: "Follow" }]
                }
                onChange={(value) => {
                  handleFollowChange(value);
                }}
              />
            </div>
          )}
        </Flex>
      </Flex>
      <FollowersFollowingModal
        open={isSubscriberListModalOpen}
        onClose={() => setIsSubscriberListModalOpen(false)}
        title="Followers"
        users={followers}
        loading={loadingFollowers}
        searchValue={followersQuery}
        onSearchChange={setFollowersQuery}
      />
      <FollowersFollowingModal
        open={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        title="Following"
        users={followingList}
        loading={loadingFollowing}
        searchValue={followingQuery}
        onSearchChange={setFollowingQuery}
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
    </>
  );
}
