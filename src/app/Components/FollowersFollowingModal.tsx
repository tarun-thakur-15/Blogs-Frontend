"use client";

import { Modal, Input, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import NProgress from "nprogress";
import { FC, useState } from "react";
// import { getImageSrc } from "@/utils/getImageSrc";

interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

interface UserListModalProps {
  open: boolean;
  onClose: () => void;
  title: string;

  users: User[];
  loading: boolean;

  searchValue: string;
  onSearchChange: (value: string) => void;

  emptyText?: string;
}

const DEFAULT_AVATAR = "/images/default-user.webp";
const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";

const FollowersFollowingModal: FC<UserListModalProps> = ({
  open,
  onClose,
  title,
  users,
  loading,
  searchValue,
  onSearchChange,
  emptyText = "No users found.",
}) => {
  function getImageSrc(img: any) {
    if (!img) return DEFAULT_AVATAR;

    // ✅ Cloudinary or any external URL
    if (img.startsWith("http")) {
      return img;
    }

    // ✅ Local image → prepend baseUrl
    return `${backendBaseUrl}/${img}`;
  }

  const UserItem = ({ user }: { user: User }) => {
    const initialSrc = getImageSrc(user.profileImage);
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
      <Link
        href={`/user/${user.username}`}
        onClick={() => NProgress.start()}
        className="followerItem"
      >
        <div className="followerItemInner">
          <div className="followerIconContainer">
            <Image
              src={imgSrc}
              alt={user.fullName}
              className="followerIcon object-cover"
              width={40}
              height={40}
              onError={() => setImgSrc(DEFAULT_AVATAR)}
            />
          </div>

          <div className="followerInfo">
            <span className="followerName">{user.fullName}</span>
            <span className="followerUsername">@{user.username}</span>
          </div>
        </div>
      </Link>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      styles={{
        body: { height: "100%", overflowY: "auto", padding: "1rem" },
      }}
      className="!w-screen !h-screen !m-0 !p-0 !rounded-none sm:!w-auto sm:!h-auto sm:!m-4 sm:!p-6 sm:!rounded-lg"
    >
      <div className="followersModalParent w-full">
        {/* Title */}
        <div className="followersSpanParent">
          <span className="followersSpan">{title}</span>
        </div>

        {/* Search */}
        <Input
          className="home-search"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* List */}
        <div className="followersList">
          {loading ? (
            <Skeleton active avatar paragraph={{ rows: 1, width: "100%" }} />
          ) : users.length > 0 ? (
            users.map((user) => <UserItem key={user._id} user={user} />)
          ) : (
            <p>{emptyText}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FollowersFollowingModal;
