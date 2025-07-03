"use client";
import type { StaticImageData } from "next/image";
import {
  FC,
  useState,
  useLayoutEffect,
  useContext,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import Search from "../../../public/images/search.svg";
import { Flex, Button, Select, Modal, Input, Skeleton } from "antd";
import {
  getFollowersList,
  getFollowingList,
  searchFollowers,
  searchFollowing,
  changeProfilePicture,
} from "../services/api";
import "../styles/signin.css";
import NProgress from "nprogress";
// Images
import Cookies from "js-cookie";
import bydefaultUser from "../../assets/images/not-logged-in-user.png";
import UserNotFound from "../../assets/images/not-logged-in-user.png";
import Link from "next/link";
interface CompanyHeaderProps {
  username: string;
  fullName: string;
  profileImage: string;
  followersCount: number;
  followingCount: number;
  totalBlogs: number;
  usernameFromCookies: string;
}
interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

export default function CompanyHeader({
  username,
  fullName,
  profileImage,
  followersCount,
  followingCount,
  totalBlogs,
  usernameFromCookies,
}: CompanyHeaderProps) {
  // USER ACTION
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

  const baseUrl = "https://blogs-backend-ftie.onrender.com/";
  const encodedImagePath = encodeURI(profileImage); // Handles spaces properly
  const fullImageUrl = `${baseUrl}${encodedImagePath}`;

  const token = Cookies.get("accessToken");
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
      }
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
                10
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
      { root: null, rootMargin: "0px", threshold: 0.1 }
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

  // ---------------------
  const fetchAllFollowers = useCallback(async () => {
    setLoadingFollowers(true);
    try {
      const data = await searchFollowers(username, followersQuery, token);
      setFollowers(data.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
    setLoadingFollowers(false);
  }, [username, followersQuery, token]);

  const fetchAllFollowing = useCallback(async () => {
    setLoadingFollowing(true);
    try {
      const data = await searchFollowing(username, followingQuery, token);
      setFollowingList(data.following);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
    setLoadingFollowing(false);
  }, [username, followingQuery, token]);

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

  // --------profile image functionality--------
  // Local state for profile picture. Initialize with the provided profileImage.
  const [currentProfileImage, setCurrentProfileImage] = useState<
    string | StaticImageData
  >(UserNotFound);

  // Function to handle profile picture change
  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Call the API function to change the profile picture
      const response = await changeProfilePicture(file);


      // Update the local state with the new profile image path (assumed to be returned in response)
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      // Optionally, display an error message to the user here.
    }
  };

  return (
    <>
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
              <input
                type="file"
                id="profile-input"
                accept="image/*"
                onChange={handleProfileChange}
                style={{ display: "none" }}
              />
              {/* Clicking on the label triggers the file input */}
              <label htmlFor="profile-input" style={{ cursor: "pointer" }} className="profileImage">
                <Image
                  src={fullImageUrl}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  onError={() => setCurrentProfileImage(UserNotFound)}
                  className="profileImage"
                />
              </label>
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
                <span className="dark">{totalBlogs}</span> Blogs
              </p>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {/* followers modal */}
      <Modal
        open={isSubscriberListModalOpen}
        onCancel={() => setIsSubscriberListModalOpen(false)}
        footer={null}
        styles={{ body: { height: "100%", overflowY: "auto", padding: "1rem" } }}
        className="!w-screen !h-screen !m-0 !p-0 !rounded-none sm:!w-auto sm:!h-auto sm:!m-4 sm:!p-6 sm:!rounded-lg"
      >
        <div className="followersModalParent" style={{ maxWidth: "100%", width: "100%" }}>
          <div className="followersSpanParent" style={{ maxWidth: "100%" }}>
            <span className="followersSpan">Followers</span>
          </div>
          <Input
            className="home-search"
            placeholder="Search"
            prefix={<Search />}
            style={{ maxWidth: "100%" }}
            value={followersQuery}
            onChange={(e) => setFollowersQuery(e.target.value)}
          />
          <div className="followersList" style={{ maxWidth: "100%" }}>
            {loadingFollowers ? (
              <Skeleton active avatar paragraph={{ rows: 1, width: "100%" }} />
            ) : followers.length > 0 ? (
              followers.map((follower) => (
                <Link
                  onClick={() => NProgress.start()}
                  key={follower._id}
                  className="followerItem"
                  href={`/user/${follower.username}`}
                >
                  <div className="followerItemInner">
                    <div className="followerIconContainer">
                      <Image
                        src={bydefaultUser}
                        alt="follower"
                        className="followerIcon"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="followerInfo">
                      <span className="followerName">{follower.fullName}</span>
                      <span className="followerUsername">
                        @{follower.username}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No followers found.</p>
            )}
          </div>
        </div>
      </Modal>
      {/* Following Modal */}
      <Modal
        open={isFollowingModalOpen}
        onCancel={() => setIsFollowingModalOpen(false)}
        footer={null}
        styles={{ body: { height: "100%", overflowY: "auto", padding: "1rem" } }}
        className="!w-screen !h-screen !m-0 !p-0 !rounded-none sm:!w-auto sm:!h-auto sm:!m-4 sm:!p-6 sm:!rounded-lg"
      >
        <div className="followersModalParent" style={{ maxWidth: "100%", width: "100%" }}>
          <div className="followersSpanParent" style={{ maxWidth: "100%" }}>
            <span className="followersSpan">Following</span>
          </div>
          <Input
            className="home-search"
            placeholder="Search"
            prefix={<Search />}
            style={{ maxWidth: "100%" }}
            value={followingQuery}
            onChange={(e) => setFollowingQuery(e.target.value)}
          />
          <div className="followersList" style={{ maxWidth: "100%" }}>
            {loadingFollowing ? (
              <Skeleton active avatar paragraph={{ rows: 1, width: "100%" }} />
            ) : followingList.length > 0 ? (
              followingList.map((user) => (
                <Link
                  onClick={() => NProgress.start()}
                  key={user._id}
                  className="followerItem"
                  href={`/user/${user.username}`}
                >
                  <div className="followerItemInner">
                    <div className="followerIconContainer">
                      <Image
                        src={bydefaultUser}
                        alt="following user"
                        className="followerIcon"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="followerInfo">
                      <span className="followerName">{user.fullName}</span>
                      <span className="followerUsername">@{user.username}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No following found.</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
