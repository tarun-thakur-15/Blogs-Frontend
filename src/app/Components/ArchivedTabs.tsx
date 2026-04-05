"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Flex, Button } from "antd";
import Cookies from "js-cookie";
import {
  reactToBlog,
  getAllArchivedBlogs,
  toggleArchieve,
} from "../services/api";
import { ReactionPayload } from "../services/schema"; // ensure correct path
import { Toaster, toast } from "sonner";
// CSS
import "../styles/awnserbox.css";
// Images

import Comment from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";
import SignInModal from "../Components/SignInModal";
import LogInModal from "../Components/LogInModal";
import moment from "moment";
import Link from "next/link";
import Options from "../../../public/images/options.svg";
import BlogSkeleton from "./BlogSkeleton";
import { useAuthStore } from "../stores/authStore";

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
  previewContent: string;
  slug: string;
  createdAt: string;
  author: { username: string, profileImage?: string};
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

interface ArchivedTabs {
  initialBlogs: BlogPreview[];
  username: string;
  topic: string;
}
interface BlogCardProps {
  blog: BlogPreview;
}
export default function ArchivedTabs({
  initialBlogs,
  username,
  topic,
}: ArchivedTabs) {
    const { isLoggedIn } = useAuthStore();
  const [blogs, setBlogs] = useState<BlogPreview[]>(initialBlogs);
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

  const handleReaction = async (
    slug: string,
    reactionType: ReactionPayload["reactionType"],
    blogId: string
  ) => {
    try {
      const result = await reactToBlog(slug, { reactionType });

      // Update the local state with the new reaction counts for the blog that was updated
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.slug === slug ? { ...blog, reactions: result.reaction } : blog
        )
      );
      setSelectedReactions((prev) => ({ ...prev, [blogId]: reactionType }));
    } catch (error) {
      console.error("Error reacting to blog:", error);
    }
  };

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

  // Define mapping from reaction type to emoji symbol
  const reactionEmojiMap: Record<ReactionPayload["reactionType"], string> = {
    like: "👍",
    amazing: "🔥",
    confusing: "😵‍💫",
    dislike: "👎",
  };

  // Combined reaction handler with animation
  const handleReactionWithAnimation =
    (
      blogId: string,
      slug: string,
      reactionType: ReactionPayload["reactionType"]
    ) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isLoggedIn) {
        const emojiSymbol = reactionEmojiMap[reactionType];

        // Determine if the current reaction is already selected
        setSelectedReactions((prev: any) => {
          if (prev[blogId] === reactionType) {
            // If clicking the same reaction, remove it
            return { ...prev, [blogId]: undefined };
          }

          // Otherwise, update to the new reaction and clear previous selection
          return { ...prev, [blogId]: reactionType };
        });

        // Trigger fly animation
        handleClickForBlog(blogId, emojiSymbol)(e);

        // Call the API function to update the reaction
        handleReaction(slug, reactionType, blogId);
      } else {
        setIsModalOpen(false);
        setIsLoginModalOpen(true);
        document.body.classList.add("modal-opened");
      }
    };

  const loadMoreBlogs = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getAllArchivedBlogs(
        offsetRef.current,
        10
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

  const handleArchieveBlog = async (slug: string) => {
    try {
      setArchieveLoading(true);
      // Call the toggleHighlight API function
      const result = await toggleArchieve(slug);
      toast.success(result.msg);

      // Wait for 1 second before refreshing the highlighted blogs
      setTimeout(async () => {
        const data = await getAllArchivedBlogs(0, 10);
        if (data.blogs) {
          setBlogs(data.blogs);
          // Optionally update the offsetRef if required:
          offsetRef.current = data.blogs.length;
        }
      }, 1000);
    } catch (error: any) {
      console.error("Error toggling highlight:", error);
      toast.error(error.message || "Please try after some time..");
    } finally {
      setArchieveLoading(false);
    }
  };

  const toggleDropdown = (blogId: any) => {
    // Toggle the dropdown for the specific blog
    setIsDropdownOpen((prev) => (prev === blogId ? null : blogId));
  };

  // this is for closing dropdown when clicked anywhere outside it 👇
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown
        toggleDropdown(null); // Pass null or undefined to close
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    const DEFAULT_AVATAR = `https://www.tarunthakur.com/lekhan/images/default-user.webp`;
  
    function BlogCard({ blog }: BlogCardProps) {
      const initialSrc = blog.author.profileImage
        ? `${blog.author.profileImage}`
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
      {blogs && blogs.length > 0 ? (
        blogs.map((blog) => {
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
            <div key={blog._id} className="awnser-box rounded-xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Toaster position="top-right" />
              <Link href={`/${blog.slug}`}>
                <div className="awnser-box-header">
                  <p className="awnser-box--question">{blog.title}</p>
                </div>
                <div className="awnser-box-body">
                  <p
                    className="awnser-box--awnser"
                    dangerouslySetInnerHTML={{ __html: blog.previewContent }}
                  />
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
                          onClick={handleReactionWithAnimation(
                            blog._id,
                            blog.slug,
                            "like"
                          )}
                        >
                          <p
                            className={`reactionCountOnHome ${
                              currentReaction === "like"
                                ? "fontSizeIfSelected"
                                : ""
                            }`}
                          >
                            👍
                          </p>
                          <p>{blog.reactions?.like?.count ?? 0}</p>
                        </Button>

                        {/* Amazing Button */}
                        <Button
                          type="text"
                          onClick={handleReactionWithAnimation(
                            blog._id,
                            blog.slug,
                            "amazing"
                          )}
                        >
                          <p
                            className={`reactionCountOnHome ${
                              currentReaction === "amazing"
                                ? "fontSizeIfSelected"
                                : ""
                            }`}
                          >
                            🔥
                          </p>
                          <p>{blog.reactions?.amazing?.count ?? 0}</p>
                        </Button>

                        {/* Confusing Button */}
                        <Button
                          type="text"
                          onClick={handleReactionWithAnimation(
                            blog._id,
                            blog.slug,
                            "confusing"
                          )}
                        >
                          <p
                            className={`reactionCountOnHome ${
                              currentReaction === "confusing"
                                ? "fontSizeIfSelected"
                                : ""
                            }`}
                          >
                            😵‍💫
                          </p>
                          <p>{blog.reactions?.confusing?.count ?? 0}</p>
                        </Button>

                        {/* Dislike Button */}
                        <Button
                          type="text"
                          onClick={handleReactionWithAnimation(
                            blog._id,
                            blog.slug,
                            "dislike"
                          )}
                        >
                          <p
                            className={`reactionCountOnHome ${
                              currentReaction === "dislike"
                                ? "fontSizeIfSelected"
                                : ""
                            }`}
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

                      <div
                        ref={dropdownRef}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <Button
                          className="optionsBtn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown(blog._id);
                          }}
                        >
                          <Options height={18} width={18} />
                        </Button>
                        {isDropdownOpen === blog._id && (
                          <div
                            className="dropdown"
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: 0,
                              backgroundColor: "#fff",
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                              zIndex: 10,
                            }}
                          >
                            <button
                              className="dropdownBtn"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleArchieveBlog(blog.slug);
                                toggleDropdown(null);
                              }}
                              disabled={archieveloading}
                            >
                              <span className="dropdownText whitespace-nowrap">
                                Remove from Archives 📤
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </Flex>
                  </Flex>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <>
          <div className="no-data-profile">
            <Image src={BoxIconPng} alt="No blogs" />
            <div>
              <h2>No archived blogs. 😊</h2>
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
