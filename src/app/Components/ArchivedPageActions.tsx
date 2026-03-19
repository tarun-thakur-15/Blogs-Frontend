"use client";
import { Button, Flex } from "antd";
import { useState } from "react";
import CommentIcon from "../../../public/images/comment.svg";
import { ReactionPayload } from "../services/schema"; // Ensure correct path
import "../styles/awnserbox.css";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";

// Define your fly interface
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

export default function ArchivedPageActions({
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
    <div>
      <div className="single-answer--actions">
        <Flex vertical gap={20}>
          <Flex vertical gap={8} align="center">
            <div
              className="crown-button-container"
              style={{ display: "flex", gap: "8px", flexDirection: "column" }}
            >
              {/* Reaction buttons */}
              <Button
                className={`add-like ${
                  currentReaction === "like" ? "selectedEmojiDetailPage" : ""
                }`}
                type="text"
                // onClick={handleReactionWithAnimation("like")}
              >
                <p className="reactionCountOnHome">👍</p>
              </Button>
              <p className="reactionCountForDetailPage">
                {reactionState.like.count}
              </p>

              <Button
                className={`add-like ${
                  currentReaction === "amazing" ? "selectedEmojiDetailPage" : ""
                }`}
                type="text"
                // onClick={handleReactionWithAnimation("amazing")}
              >
                <p className="reactionCountOnHome">🔥</p>
              </Button>
              <p className="reactionCountForDetailPage">
                {reactionState.amazing.count}
              </p>

              <Button
                className={`add-like ${
                  currentReaction === "confusing"
                    ? "selectedEmojiDetailPage"
                    : ""
                }`}
                type="text"
                // onClick={handleReactionWithAnimation("confusing")}
              >
                <p className="reactionCountOnHome">😵‍💫</p>
              </Button>
              <p className="reactionCountForDetailPage">
                {reactionState.confusing.count}
              </p>

              <Button
                className={`add-like ${
                  currentReaction === "dislike" ? "selectedEmojiDetailPage" : ""
                }`}
                type="text"
                // onClick={handleReactionWithAnimation("dislike")}
              >
                <p className="reactionCountOnHome">👎</p>
              </Button>
              <p className="reactionCountForDetailPage">
                {reactionState.dislike.count}
              </p>

              {/* Render the animated flying emojis for this blog */}
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
          </Flex>
          <Flex vertical gap={8} align="center">
            
              <Button className="add-like" type="text">
                <CommentIcon width={15} height={15} />
              </Button>
            
            <p className="font-sm">{totalComments}</p>
          </Flex>
        </Flex>
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
    </div>
  );
}
