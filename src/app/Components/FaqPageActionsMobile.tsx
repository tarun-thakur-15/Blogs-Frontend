"use client";
import { Button, Flex, Skeleton } from "antd";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommentIcon from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";
import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
import moment from "moment";
import Link from "next/link";
import { reactToBlog } from "../services/api"; // Ensure correct path
import { ReactionPayload } from "../services/schema"; // Ensure correct path
import "../styles/awnserbox.css";
import Cookies from "js-cookie";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";

interface Fly {
  id: number;
  startX: number;
  startY: number;
  emoji: string;
}

// Our reaction detail interface (unchanged)
export interface ReactionDetail {
  count: number;
  users: string[];
}

export interface ReactionType {
  like: ReactionDetail;
  amazing: ReactionDetail;
  dislike: ReactionDetail;
  confusing: ReactionDetail;
}

// Update BlogPreview (if needed)
export interface BlogPreview {
  _id: string;
  title: string;
  previewContent: string;
  slug: string;
  createdAt: string;
  author: { username: string };
  isFavourite: boolean;
  commentCount: number;
  reactions: ReactionType;
  isLiked: boolean;
  isAmazing: boolean;
  isDisliked: boolean;
  isConfusing: boolean;
}

// Props for FaqPageActions now include slug so we know which blog we're updating,
// plus initial reaction counts and total comments.
export interface FaqPageProps {
  slug: string;
  reaction: ReactionType;
  totalComments: number;
  isLiked: boolean;
  isAmazing: boolean;
  isDisliked: boolean;
  isConfusing: boolean;
}
export default function FaqPageActionsMobile({
  slug,
  reaction,
  totalComments,
  isLiked,
  isAmazing,
  isDisliked,
  isConfusing,
}: FaqPageProps) {
  const [flies, setFlies] = useState<Fly[]>([]);
  // Create a local state for reaction counts initialized with the prop
  const [reactionState, setReactionState] = useState<ReactionType>(reaction);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Local state to override selected reaction on UI (null means not changed by user)
  const [selectedReaction, setSelectedReaction] = useState<
    ReactionPayload["reactionType"] | null
  >(null);

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

  const router = useRouter();
  const AccessToken = Cookies.get("accessToken")!;
  // This function triggers the fly-up animation for this blog only.
  const handleClick =
    (emoji: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      
      const id = Date.now();
      const button = e.currentTarget;
      const startX = button.offsetLeft + button.offsetWidth / 2;
      const startY = button.offsetTop;
      setFlies((prev) => [...prev, { id, startX, startY, emoji }]);
      setTimeout(() => {
        setFlies((prev) => prev.filter((f) => f.id !== id));
      }, 1500);
    };

  // Mapping from reaction type to emoji symbol
  const reactionEmojiMap: Record<ReactionPayload["reactionType"], string> = {
    like: "👍",
    amazing: "🔥",
    confusing: "😵‍💫",
    dislike: "👎",
  };

  // API call to update reaction; then update local reaction state from API response.
  const handleReaction = async (
    reactionType: ReactionPayload["reactionType"]
  ) => {
   
    try {
      const result = await reactToBlog(slug, { reactionType }, AccessToken);
    
      // Update the local reaction state with the API response.
      setReactionState(result.reaction);
    } catch (error) {
      console.error("Error reacting to blog:", error);
    }
  };

  // Combined handler: run animation, update local selected reaction state, and call API.
  const handleReactionWithAnimation =
    (reactionType: ReactionPayload["reactionType"]) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (AccessToken) {
        const emojiSymbol = reactionEmojiMap[reactionType];
        // Trigger fly-up animation for this blog.
        handleClick(emojiSymbol)(e);
        // Update local selected reaction: toggle if same reaction clicked again.
        setSelectedReaction((prev) =>
          prev === reactionType ? null : reactionType
        );
        // Call the API to update reaction counts.
        handleReaction(reactionType);
      } else {
        setIsModalOpen(false);
        setIsLoginModalOpen(true);
        document.body.classList.add("modal-opened");
      }
    };

  // Compute the current reaction for UI styling.
  // If user has selected a reaction locally, use that. Otherwise, fallback to API-provided booleans.
  const currentReaction =
    selectedReaction !== null
      ? selectedReaction
      : isLiked
      ? "like"
      : isAmazing
      ? "amazing"
      : isConfusing
      ? "confusing"
      : isDisliked
      ? "dislike"
      : "";

  return (
    <>
      <div className="w-full flex justify-start gap-[20px]">
        <div className="flex gap-[5px]">
          <Button
            className={`add-like ${
              currentReaction === "like" ? "selectedEmojiDetailPage" : ""
            }`}
            type="text"
            onClick={handleReactionWithAnimation("like")}
          >
            <p className="reactionCountOnHome">👍</p>
          </Button>
          <p className="reactionCountForDetailPage">
            {reactionState.like.count}
          </p>
        </div>
        <div className="flex gap-[5px]">
          <Button
            className={`add-like ${
              currentReaction === "amazing" ? "selectedEmojiDetailPage" : ""
            }`}
            type="text"
            onClick={handleReactionWithAnimation("amazing")}
          >
            <p className="reactionCountOnHome">🔥</p>
          </Button>
          <p className="reactionCountForDetailPage">
            {reactionState.amazing.count}
          </p>
        </div>
        <div className="flex gap-[5px]">
          <Button
            className={`add-like ${
              currentReaction === "confusing" ? "selectedEmojiDetailPage" : ""
            }`}
            type="text"
            onClick={handleReactionWithAnimation("confusing")}
          >
            <p className="reactionCountOnHome">😵‍💫</p>
          </Button>
          <p className="reactionCountForDetailPage">
            {reactionState.confusing.count}
          </p>
        </div>
        <div className="flex gap-[5px]">
          <Button
            className={`add-like ${
              currentReaction === "dislike" ? "selectedEmojiDetailPage" : ""
            }`}
            type="text"
            onClick={handleReactionWithAnimation("dislike")}
          >
            <p className="reactionCountOnHome">👎</p>
          </Button>
          <p className="reactionCountForDetailPage">
            {reactionState.dislike.count}
          </p>
        </div>
        <div className="flex gap-[5px]">
          <a href="#comments">
            <Button className="add-like" type="text">
              <CommentIcon width={19} height={27} className="w-[19px] h-[27px]" />
            </Button>
          </a>
          <p className="font-sm">{totalComments}</p>
        </div>
        {flies.map((fly) => (
          <span
            key={fly.id}
            className="fly-animation"
            style={{ left: `${fly.startX}px`, top: `${fly.startY}px` }}
          >
            {fly.emoji}
          </span>
        ))}
      </div>
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
