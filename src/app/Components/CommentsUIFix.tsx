"use client";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import { Flex } from "antd";
import { postComment, getComments, deleteComment } from "../services/api";
import { PostCommentInterface } from "../services/schema";
import moment from "moment";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import { StaticImageData } from "next/image";
// CSS
import "../styles/comments.css";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import OptionsHorizontal from "../../../public/images/OptionsHorizontal.svg";
import { useAuthStore } from "../stores/authStore";

interface CommentItem {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
interface CommentsProps {
  slug: string;
  initialComments: CommentItem[];
  initialTotalComments: number;
  blogAuthor: string;
}
export default function Comments({
  slug,
  initialComments,
  initialTotalComments,
  blogAuthor,
}: CommentsProps) {
  const backendBaseUrl = "https://blogs-backend-ftie.onrender.com/";
  const { isLoggedIn } = useAuthStore();
  const profileImage = Cookies.get("profileImage");
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [totalComments, setTotalComments] =
    useState<number>(initialTotalComments);
  const [offset, setOffset] = useState<number>(initialComments.length);
  const [loading, setLoading] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const loggedInUsername = Cookies.get("username");
  const [isDropdownClicked, setIsDropdownClicked] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const optionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const loadMoreComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(slug, offset, 10);

      // Assuming data contains { comments, totalComments }
      setComments((prev) => [...prev, ...data.comments]);
      setOffset((prev) => prev + data.comments.length);
      setTotalComments(data.totalComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
    setLoading(false);
  };
  // Function to post a new comment and add it to the top of the list
  const [isPosting, setIsPosting] = useState(false);
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return; // Do not post empty comments
    setIsPosting(true); // start loading
    const commentData: PostCommentInterface = {
      slug,
      content: newCommentText,
    };

    try {
      const result = await postComment(commentData);
      // Assuming the API returns the new comment in result.comment
      const newComment: CommentItem = result.comment;
      // Add the new comment at the beginning of the list
      toast.success(result.msg || "Comment created successfully! :-)");
      setComments((prev) => [newComment, ...prev]);
      setTotalComments((prev) => prev + 1);
      setNewCommentText(""); // Clear the input field
    } catch (error: any) {
      if (!isLoggedIn) {
        showLoginModal();
      } else {
        console.error("Error posting comment:", error.message);
        toast.error(
          error.message ||
            "Failed to create comment.. Please try again later :-)",
        );
      }
    } finally {
      setIsPosting(false); // stop loading
    }
  };

  const toggleDropdown = (commentId: string) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId); // mark this comment as being deleted

      const result = await deleteComment(commentId);

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
      toast.success(result?.msg || "Comment deleted successfully! 🗑️");

      setIsDropdownOpen((prev) => ({ ...prev, [commentId]: false })); // Close dropdown
    } catch (error: any) {
      toast.error(
        error.message || "Failed to delete comment.. Please try again later 😞",
      );
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingCommentId(null); // reset
    }
  };

  // this useEffect is used to lose dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsButtonRef.current &&
        dropdownRef.current &&
        !optionsButtonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close all dropdowns
        setIsDropdownOpen({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const DEFAULT_AVATAR = `/images/default-user.webp`;
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

  function CommentAvatar({
    imageUrl,
    fallback,
  }: {
    imageUrl: string | StaticImageData;
    fallback: string | StaticImageData;
  }) {
    const [src, setSrc] = useState(imageUrl);

    return (
      <Image
        src={src}
        alt="User profile"
        width={40}
        height={40}
        className="rounded-full object-cover"
        onError={() => {
          if (src !== fallback) {
            setSrc(fallback);
          }
        }}
      />
    );
  }
  return (
    <>
      <Toaster position="top-right" />
      <Flex justify="space-between" align="center">
        <h3>Comments</h3>
      </Flex>
      <Flex vertical className="comments-list">
        <div className="comments-list-inner">
          <p className="comments-list--name">Total Comments: {totalComments}</p>
          {comments.map((comment) => {
            const commentImgSrc = getImageSrc(comment.author.profileImage);
            return (
              <div
                key={comment._id}
                className="comments-list--item"
                id="commentDiv"
              >
                <div className="comments-list--item--img">
                  {/* this image tag is for commented user */}

                  <CommentAvatar
                    imageUrl={commentImgSrc}
                    fallback={DEFAULT_AVATAR}
                  />
                </div>
                <div className="comments-list--item--details">
                  <Flex align="center" gap={8} justify="space-between">
                    <Flex align="center" gap={8}>
                      <Link
                        href={`/user/${
                          comment.author.username || loggedInUsername
                        }`}
                        onClick={() => NProgress.start()}
                        className="comments-list--name"
                      >
                        {comment.author.username || loggedInUsername}
                      </Link>
                      <p>•</p>
                      <p className="comments-list--date">
                        {moment(comment.createdAt).format("Do MMM, YYYY")}
                      </p>
                    </Flex>
                  </Flex>
                  <div className="awnser-box--awnser">
                    <p className="awnser-box--awnser">{comment.content}</p>
                  </div>
                </div>

                <div className="relative">
                  {isLoggedIn && (
                    <button
                      ref={optionsButtonRef}
                      className="optionsMain group cursor-pointer"
                      style={{
                        backgroundColor: "white",
                        border: "none",
                        width: "24px",
                        height: "24px",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(comment._id);
                      }}
                    >
                      <OptionsHorizontal
                        className="optionIconSize"
                        height={20}
                        width={20}
                      />
                    </button>
                  )}

                  {/* Delete Dropdown */}

                  {isDropdownOpen[comment._id] && (
                    <div className="dropdown" ref={dropdownRef}>
                      {(loggedInUsername === comment.author.username ||
                        loggedInUsername === blogAuthor) && (
                        <button
                          className="dropdownBtn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteComment(comment._id);
                          }}
                        >
                          {deletingCommentId === comment._id ? (
                            <span className=".loading-dots-delete">
                              Deleting
                            </span>
                          ) : (
                            <span className="dropdownText text-[#dc2626]!">
                              Delete
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button (visible only if there are more comments) */}
        {comments.length < totalComments && (
          <button
            className="redButtons commentBtn"
            onClick={loadMoreComments}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}

        {/* New Comment Input */}
        <div className="editor-box">
          <Flex gap={10} className="add-comment-box">
            <div className="comments-list--item--img">
              {/* This image tag is for logged in user so use profile image from cookies here */}
              {isLoggedIn ? (
                <Image
                  src={imgSrc}
                  alt="name"
                  width={40}
                  height={40}
                  onError={() => {
                    if (imgSrc !== DEFAULT_AVATAR) {
                      setImgSrc(DEFAULT_AVATAR);
                    }
                  }}
                />
              ) : (
                <Image src={DEFAULT_AVATAR} alt="name" width={40} height={40} />
              )}
            </div>
            <p>Add your comment</p>
          </Flex>
          <div className="commentAlignment flex-row lg:flex-row items-center">
            <div className="addCommentInputDiv">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a Comment"
                className="custom-input"
              />
            </div>

            <button
              disabled={isPosting}
              onClick={handleAddComment}
              className="flex items-center justify-center h-8 w-8 bg-transparent"
            >
              {isPosting ? (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" />
                </div>
              ) : (
                <Image
                  src="https://www.tarunthakur.com/lekhan/images/send-comment-icon.svg"
                  alt="Send Comment"
                  width={20}
                  height={20}
                  className="object-contain cursor-pointer"
                />
              )}
            </button>
          </div>
        </div>
      </Flex>
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
