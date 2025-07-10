"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import { FC, useState } from "react";
import Image from "next/image";
import { Flex, Button, Dropdown, Select, Avatar, Menu } from "antd";
import type { MenuProps } from "antd";
import { postComment, getComments, deleteComment } from "../services/api"; // adjust the path as needed
import { PostCommentInterface } from "../services/schema"; // adjust the path as needed
import moment from "moment";
import Cookies from "js-cookie";
import NProgress from "nprogress";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
// CSS
import "../styles/comments.css";
// import Like from "../../../public/images/like.svg";
import Send from "../../../public/images/send.svg";
import SelectDrop from "../../../public/images/select-drop.svg";
import bydefaultUserImage from "../../assets/images/not-logged-in-user.png";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import OptionsHorizontal from "../../../public/images/OptionsHorizontal.svg";

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
  const profileImage = Cookies.get("profileImage");
  const accessToken = Cookies.get("accessToken");
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return; // Do not post empty comments

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
      if (!accessToken) {
        showLoginModal();
      } else {
        console.error("Error posting comment:", error.message);
        toast.error(
          error.message ||
            "Failed to create comment.. Please try again later :-)"
        );
      }
    }
  };

  const toggleDropdown = (commentId: string) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const result = await deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success(result?.msg || "Comment deleted successfully! 🗑️");
      setIsDropdownOpen((prev) => ({ ...prev, [commentId]: false })); // Close dropdown
    } catch (error: any) {
      toast.error(
        error.message || "Failed to delete comment.. Please try again later 😞"
      );
      console.error("Error deleting comment:", error);
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

  return (
    <>
      <Toaster position="top-right" />
      <Flex justify="space-between" align="center">
        <h3>Comments</h3>
      </Flex>
      <Flex vertical className="comments-list">
        <div className="comments-list-inner">
          <p className="comments-list--name">Total Comments: {totalComments}</p>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="comments-list--item"
              id="commentDiv"
            >
              <div className="comments-list--item--img">
                {/* this image tag is for commented user */}

                <Image
                  src={
                    comment.author.profileImage
                      ? `${backendBaseUrl}${comment.author.profileImage}`
                      : bydefaultUserImage
                  }
                  alt="User profile"
                  width={40}
                  height={40}
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

                {/* Delete Dropdown */}
                {isDropdownOpen[comment._id] && (
                  <div className="dropdown" ref={dropdownRef}>
                    {(loggedInUsername === comment.author.username ||
                      loggedInUsername === blogAuthor) && (
                      <button
                        className="deleteText"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteComment(comment._id);
                        }}
                      >
                        <span className="deleteText">Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
              {accessToken ? (
                <Image
                  src={`${backendBaseUrl}${profileImage}` || bydefaultUserImage}
                  alt="name"
                  width={40}
                  height={40}
                />
              ) : (
                <Image
                  src={bydefaultUserImage}
                  alt="name"
                  width={40}
                  height={40}
                />
              )}
            </div>
            <p>Add your comment</p>
          </Flex>
          <div className="commentAlignment flex-col lg:flex-row">
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
              className="redButtons commentBtn whitespace-nowrap cursor-pointer"
              onClick={handleAddComment}
            >
              Add Comment
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
