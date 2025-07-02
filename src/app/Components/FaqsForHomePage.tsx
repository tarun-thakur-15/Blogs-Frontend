"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Flex, Button, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Comment from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";
import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
import moment from "moment";
import { getAllBlogs, reactToBlog } from "../services/api";
import { ReactionPayload } from "../services/schema"; // ensure correct path
import "../styles/awnserbox.css";
import Cookies from "js-cookie";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import NProgress from "nprogress";

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
  author: { username: string, profileImage: String };
  isFavourite: boolean;
  commentCount: number;
  reactions: {
    like: ReactionDetail;
    amazing: ReactionDetail;
    dislike: ReactionDetail;
    confusing: ReactionDetail;
  };
  isLiked: boolean;
  isDisliked: boolean;
  isConfusing: boolean;
  isAmazing: boolean;
}

interface FaqsForUserPageProps {
  initialBlogs: BlogPreview[];
}

const FaqsForUserPage: React.FC<FaqsForUserPageProps> = ({ initialBlogs }) => {
  const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";
  // Use a mapping of blogId to an array of fly objects
  const [flyMap, setFlyMap] = useState<Record<string, Fly[]>>({});
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPreview[]>(initialBlogs);
  // We'll use a ref to keep the offset stable between renders.
  const offsetRef = useRef<number>(initialBlogs.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const AccessToken = Cookies.get("accessToken")!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedReactions, setSelectedReactions] = useState<
      Record<string, ReactionPayload["reactionType"]>
    >({});

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

  // Reaction API call
  const handleReaction = async (
    slug: string,
    reactionType: ReactionPayload["reactionType"],
    blogId: string
  ) => {
    console.log("handleReaction called for:", slug, reactionType);
    try {
      const result = await reactToBlog(slug, { reactionType }, AccessToken);
      console.log("Reaction updated:", result);
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
      console.log(`Button clicked for blog ${blogId} with emoji ${emoji}`);
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
    if (AccessToken) {
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

  // Using a stable callback with offset stored in a ref for infinite scrolling:
  const loadMoreBlogs = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getAllBlogs(offsetRef.current, 10);
      if (data.blogs && data.blogs.length > 0) {
        setBlogs((prev) => {
          const newBlogs = [...prev, ...data.blogs];
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
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
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
                <Link href={`/${blog.slug}`} onClick={() => NProgress.start()}>
                  <div className="awnser-box-header">
                    <p className="awnser-box--question">{blog.title}</p>
                  </div>
                  <div className="awnser-box-body">
                    <p className="awnser-box--awnser" dangerouslySetInnerHTML={{ __html: blog.previewContent }} />
                  </div>
                  <div className="awnser-box-footer">
                    <Flex justify="space-between" align="center">
                      <Flex gap={2} align="center">
                        <div className="awnser-box--company">
                          <Image
                            src={ `${backendBaseUrl}/${blog.author.profileImage}` || notLoggedInIcon}
                            alt="Placeholder avatar"
                            width={40}
                            height={40}
                          />
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
                      <Flex gap={12} align="center">
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
                          <Comment width={15} height={15} />
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
        : ""}

      {/* No more blogs message */}
      {!hasMore && (
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
      <div ref={loadMoreRef} style={{ padding: "20px 0" }}>
        {loadingMore && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          >
            {/* Skeleton for header */}
            <div
              className="skeletonHeaderProfile"
              style={{ marginBottom: "30px" }}
            >
              <div>
                <Skeleton.Avatar size={70} shape="circle" />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton active paragraph={{ rows: 1, width: "100%" }} />
              </div>
            </div>
          </div>
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

export default FaqsForUserPage;
