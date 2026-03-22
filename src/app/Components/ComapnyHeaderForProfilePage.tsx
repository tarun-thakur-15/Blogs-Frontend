"use client";
import type { StaticImageData } from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Flex, Input } from "antd";
import { EditUsernameSchema } from "../services/schema";
import {
  getFollowersList,
  getFollowingList,
  searchFollowers,
  searchFollowing,
  changeProfilePicture,
  updateFullName,
  updateUsername,
} from "../services/api";
import "../styles/signin.css";
import { useAuthStore } from "../stores/authStore";
// Images
import UserNotFound from "../../assets/images/not-logged-in-user.png";
import EditIcon from "../../../public/images/edit.svg";
import { Toaster, toast } from "sonner";
import { ClipLoader } from "react-spinners";
import FollowersFollowingModal from "./FollowersFollowingModal";

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
}: CompanyHeaderProps) {
  const { user, setUser } = useAuthStore.getState();
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

  //states for editing full name
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(fullName);
  const [loading, setLoading] = useState(false);
  //states for editing user name
  const [isusernameEditing, setIsusernameEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [usernameloading, setusernameLoading] = useState(false);

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

  // --------profile image functionality--------
  // Local state for profile picture. Initialize with the provided profileImage.
  const [currentProfileImage, setCurrentProfileImage] = useState<
    string | StaticImageData
  >(UserNotFound);

  // Function to handle profile picture change
  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Call the API function to change the profile picture
      const response = await changeProfilePicture(file);
      if (!user) return;
      setUser({
        ...user,
        profileImage: response.profileImage,
      });
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      // Optionally, display an error message to the user here.
    }
  };

  //----functions for editing full name
  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setNewFullName(fullName);
  };

  const handleSave = async () => {
    if (newFullName.trim() === "") return;
    setLoading(true);
    try {
      await updateFullName({ fullName: newFullName });

      if (!user) return;
      setUser({
        ...user,
        fullname: newFullName,
      });
      setIsEditing(false);
      toast.success("Full name updated");

      // Optional: refetch user profile or set fullName state
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //----functions for editing user name
  const handleUsernameEditClick = () => setIsusernameEditing(true);
  const handleUsernameCancel = () => {
    setIsusernameEditing(false);
    setNewUsername(username);
  };

  const handleUsernameSave = async () => {
    if (newUsername.trim() === "") return;
    setusernameLoading(true);
    try {
      const payload: EditUsernameSchema = { username: newUsername };
      await updateUsername(payload);
      if (!user) return;
      setUser({
        ...user,
        username: newUsername,
      });
      toast.success("Username updated successfully");
      setIsusernameEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setusernameLoading(false);
    }
  };
  const baseUrl = "https://blogs-backend-ftie.onrender.com/";
  const encodedImagePath = encodeURI(profileImage); // Handles spaces properly

  const DEFAULT_AVATAR = `/images/default-user.webp`;
  const initialSrc = profileImage || DEFAULT_AVATAR;

  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <>
      <Flex
        align="center"
        wrap="wrap"
        className="company-header justify-self-start"
        gap={20}
        justify="space-between"
      >
        <Toaster position="top-right" />
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
              <label
                htmlFor="profile-input"
                style={{ cursor: "pointer" }}
                className="profileImage"
              >
                <Image
                  src={imgSrc}
                  alt={username}
                  width={100}
                  height={100}
                  onError={() => {
                    if (imgSrc !== DEFAULT_AVATAR) {
                      setImgSrc(DEFAULT_AVATAR);
                    }
                  }}
                  className="profileImage"
                />
              </label>
            </div>
          </div>

          <Flex gap={5} vertical className="company-header-info">
            <Flex align="center" gap={8}>
              {isEditing ? (
                <>
                  <Input
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    style={{ maxWidth: 250 }}
                    autoFocus
                    size="middle"
                  />
                  {loading ? (
                    <ClipLoader size={20} color="#1677ff" />
                  ) : (
                    <>
                      <p
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={handleSave}
                      >
                        ✔️
                      </p>
                      <p
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={handleCancel}
                      >
                        ❌
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h3 className="company-header-name">{fullName}</h3>
                  <EditIcon
                    className="self-center cursor-pointer editIcon"
                    onClick={handleEditClick}
                  />
                </>
              )}
            </Flex>

            {/* ----------------- */}
            <Flex align="center" gap={8} className="company-header-details">
              {isusernameEditing ? (
                <>
                  <Input
                    value={newUsername}
                    className=" m-w-full lg:m-w-[130px]"
                    onChange={(e) => setNewUsername(e.target.value)}
                    autoFocus
                    size="middle"
                  />
                  {loading ? (
                    <ClipLoader size={20} color="#1677ff" />
                  ) : (
                    <>
                      <p
                        className="!inline-block"
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={handleUsernameSave}
                      >
                        ✔️
                      </p>

                      <p
                        className="!inline-block"
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={handleUsernameCancel}
                      >
                        ❌
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex">
                    <p className="dark" style={{ cursor: "pointer" }}>
                      @{username}
                    </p>
                    <EditIcon
                      className="self-center cursor-pointer editIcon"
                      onClick={handleUsernameEditClick}
                    />
                  </div>
                </>
              )}
              {/* ---------- */}
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
    </>
  );
}
