"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flex, Button, Skeleton } from "antd";
import type { MenuProps } from "antd";
import Cookies from "js-cookie";
import {
  getDislikedBlogs,
} from "../services/api";
import { ReactionPayload } from "../services/schema"; // ensure correct path
import { Toaster, toast } from "sonner";
// CSS
import "../styles/awnserbox.css";
// Images

import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
import Comment from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";
import SignInModal from "../Components/SignInModal";
import LogInModal from "../Components/LogInModal";
import moment from "moment";
import Link from "next/link";
import BlogSkeleton from "./BlogSkeleton";

interface Fly {
  id: number;
  startX: number;
  startY: number;
  emoji: string;
}
export interface ReactionDetail {
  count: number;
  users: string[];
}
export interface BlogPreview {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  author: { username: string, profileImage?: string };
  isFavourite: boolean;
  commentCount: number;
  reactions: {
    like: ReactionDetail;
    amazing: ReactionDetail;
    dislike: ReactionDetail;
    confusing: ReactionDetail;
  };
  isLiked: boolean;
  isAmazing: boolean;
  isConfusing: boolean;
  isDisliked: boolean;
}

interface DislikedBlogsTab {
  initialBlogs: BlogPreview[];
  username: string;
  topic: string;
}
interface BlogCardProps {
  blog: BlogPreview;
}
export default function DislikedBlogsTab({
  initialBlogs,
  username,
  topic,
}: DislikedBlogsTab) {
  const [blogs, setBlogs] = useState<BlogPreview[]>(initialBlogs);
  // const [offset, setOffset] = useState(blogs.length);
  const offsetRef = useRef<number>(initialBlogs.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState<
    Record<string, ReactionPayload["reactionType"]>
  >({});
  const [archieveloading, setArchieveLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
    setIsLoginModalOpen(false);
    document.body.classList.add("modal-opened");
  };
  const showLoginModal = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(true);
    document.body.classList.add("modal-opened");
  };
  // Use a mapping of blogId to an array of fly objects
  const [flyMap, setFlyMap] = useState<Record<string, Fly[]>>({});
  const AccessToken = Cookies.get("accessToken")!;

  // Fly animation function scoped per blog
  const handleClickForBlog =
    (blogId: string, emoji: string) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      
      const id = Date.now();
      const button = e.currentTarget;
      const startX = button.offsetLeft + button.offsetWidth / 2;
      const startY = button.offsetTop;
      setFlyMap((prev) => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), { id, startX, startY, emoji }],
      }));
      setTimeout(() => {
        setFlyMap((prev) => ({
          ...prev,
          [blogId]: prev[blogId]?.filter((f) => f.id !== id) || [],
        }));
      }, 1500);
    };

  const loadMoreBlogs = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getDislikedBlogs(
        offsetRef.current,
        10,
        AccessToken
      );
      if (data.blogs && data.blogs.length > 0) {
        setBlogs((prev) => {
          const newBlogs = [...prev, ...data.blogs];
          // Update the offsetRef to the new total count.
          offsetRef.current = newBlogs.length;
          return newBlogs;
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
    }
    setLoadingMore(false);
  }, [username]);
  useEffect(() => {
    if (!hasMore) return; // If no more blogs, do nothing
    const observer = new IntersectionObserver(
      (entries) => {
        // If the loadMoreRef container is visible and not currently loading, trigger loadMoreBlogs
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreBlogs();
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
  }, [loadMoreBlogs, loadingMore, hasMore]);

  const baseUrl = "https://blogs-backend-ftie.onrender.com/";
  const DEFAULT_AVATAR = `/images/default-user.webp`;

  function BlogCard({ blog }: BlogCardProps) {
    const initialSrc = blog.author.profileImage
      ? `${baseUrl}/${blog.author.profileImage}`
      : DEFAULT_AVATAR;

    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
      <Image
        src={imgSrc}
        alt={blog.author.username}
        width={40}
        height={40}
        onError={() => setImgSrc(DEFAULT_AVATAR)}
      />
    );
  }

  return (
    <>
      {blogs && blogs.length > 0
        ? blogs.map((blog) => {
            // Determine the selected reaction for the blog
            const currentReaction =
              selectedReactions[blog._id] ??
              (blog.isLiked
                ? "like"
                : blog.isAmazing
                ? "amazing"
                : blog.isConfusing
                ? "confusing"
                : blog.isDisliked
                ? "dislike"
                : "");

            return (
              <div key={blog._id} className="awnser-box">
                <Toaster position="top-right" />
                <Link href={`/${blog.slug}`}>
                  <div className="awnser-box-header">
                    <p className="awnser-box--question">{blog.title}</p>
                  </div>
                  <div className="awnser-box-body">
                    <p className="awnser-box--awnser" dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>
                  <div className="awnser-box-footer">
                    <Flex justify="space-between" align="center">
                      <Flex gap={2} align="center">
                        <div className="awnser-box--company">
                          <BlogCard key={blog._id} blog={blog} />
                        </div>
                        <span className="usernameBlogsHome">
                          {" "}
                          &nbsp; {blog.author.username} &nbsp;{" "}
                        </span>
                        <Flex gap={4} align="center">
                          <p className="date">
                            {moment(blog.createdAt).format("Do MMM, YYYY")}
                          </p>
                        </Flex>
                      </Flex>
                      <Flex
                        gap={12}
                        align="center"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="crown-button-container"
                          style={{ display: "flex", gap: "12px" }}
                        >
                          {/* Like Button */}
                          <Button
                            type="text"
                          >
                            <p
                              className={`reactionCountOnHome`}
                            >
                              👍
                            </p>
                            <p>{blog.reactions?.like?.count ?? 0}</p>
                          </Button>

                          {/* Amazing Button */}
                          <Button
                            type="text"
                          >
                            <p
                              className={`reactionCountOnHome`}
                            >
                              🔥
                            </p>
                            <p>{blog.reactions?.amazing?.count ?? 0}</p>
                          </Button>

                          {/* Confusing Button */}
                          <Button
                            type="text"
                          >
                            <p
                              className={`reactionCountOnHome`}
                            >
                              😵‍💫
                            </p>
                            <p>{blog.reactions?.confusing?.count ?? 0}</p>
                          </Button>

                          {/* Dislike Button */}
                          <Button
                            type="text"
                          >
                            <p
                              className={`reactionCountOnHome fontSizeIfSelected`}
                            >
                              👎
                            </p>
                            <p>{blog.reactions?.dislike?.count ?? 0}</p>
                          </Button>

                          {/* Render fly animations */}
                          {flyMap[blog._id]?.map((fly) => (
                            <span
                              key={fly.id}
                              className="fly-animation"
                              style={{
                                left: `${fly.startX}px`,
                                top: `${fly.startY}px`,
                              }}
                            >
                              {fly.emoji}
                            </span>
                          ))}
                        </div>

                        {/* Comment Button */}
                        <Button className="add-like" type="text">
                          <Comment width={15} height={15} className="commentIcon" />
                          <p className="reactionCountOnHome">
                            {blog.commentCount}
                          </p>
                        </Button>
                      </Flex>
                    </Flex>
                  </div>
                </Link>
              </div>
            );
          })
        : (
          <>
          <div className="no-data-profile">
                      <Image src={BoxIconPng} alt="No blogs" />
                      <div>
                        <h2>
                          No disliked blogs. 😊
                        </h2>
                      </div>
                    </div>
          </>
        )}

      {/* No more blogs message */}
      {!hasMore && blogs.length > 0 && (
        <div className="no-data-profile">
          <Image src={BoxIconPng} alt="No blogs" />
          <div>
            <h2>
              Looks like you've reached the end! <br /> No more blogs. 😊
            </h2>
          </div>
        </div>
      )}

      {/* Loading Skeleton for Infinite Scroll */}
      <div ref={loadMoreRef}>
        {loadingMore && (
          <BlogSkeleton/>
        )}
      </div>

      {/* Modals */}
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
