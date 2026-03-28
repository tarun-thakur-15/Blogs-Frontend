"use client";
import { Button, Flex } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CommentIcon from "../../../public/images/comment.svg";
import { reactToBlog } from "../services/api"; // Ensure correct path
import { ReactionPayload } from "../services/schema"; // Ensure correct path
import "../styles/awnserbox.css";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import ShareModal from "./ShareModal";
import ReportModal from "./ReportModal";
import Share from "../../assets/images/Share.svg";
import { useAuthStore } from "../stores/authStore";

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

export default function FaqPageActions({
  slug,
  reaction,
  totalComments,
  isLiked,
  isAmazing,
  isDisliked,
  isConfusing,
}: FaqPageProps) {
    const { isLoggedIn } = useAuthStore();
  const [flies, setFlies] = useState<Fly[]>([]);
  // Create a local state for reaction counts initialized with the prop
  const [reactionState, setReactionState] = useState<ReactionType>(reaction);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Local state to override selected reaction on UI (null means not changed by user)
  const [selectedReaction, setSelectedReaction] = useState<
    ReactionPayload["reactionType"] | null
  >(null);

  //states for opening and closing Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareModalAnimating, setIsShareModalAnimating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  //states for report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reportingCommentSlug, setReportingCommentSlug] = useState("");

  const closeReportModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsReportModalOpen(false);
      document.body.classList.remove("modal-opened");
    }, 300);
  };
  const showReportModal = (commentSlug: any) => {
    setReportingCommentSlug(commentSlug);
    setIsReportModalOpen(true);
    setTimeout(() => {
      setIsAnimating(true);
      document.body.classList.add("modal-opened");
    }, 0);
  };

  const showShareModal = () => {
    const fullUrl = window.location.origin;
    setShareUrl(fullUrl);
    setIsShareModalOpen(true);
    setTimeout(() => {
      setIsShareModalAnimating(true);
      document.body.classList.add("modal-opened");
    }, 0);
  };

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
      const result = await reactToBlog(slug, { reactionType });

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
      if (isLoggedIn) {
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

  const closeShareModal = () => {
    setIsShareModalAnimating(false);
    setTimeout(() => {
      setIsShareModalOpen(false);
      document.body.classList.remove("modal-opened");
    }, 300);
  };



  return (
    <div>
      {/* --------FOR BIGGER SCREEN----- */}
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
                onClick={handleReactionWithAnimation("like")}
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
                onClick={handleReactionWithAnimation("amazing")}
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
                onClick={handleReactionWithAnimation("confusing")}
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
                onClick={handleReactionWithAnimation("dislike")}
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
            <a href="#comments">
              <Button className="add-like" type="text">
                <CommentIcon width={15} height={15} />
              </Button>
            </a>
            <p className="font-sm">{totalComments}</p>
          </Flex>
          <Flex vertical gap={8} align="center">
            <Button className="add-like" type="text" onClick={showShareModal}>
              <Share width={15} height={15} />
            </Button>
          </Flex>
          {/* report button commented temporarily */}
          {/* <Flex vertical gap={8} align="center">
            <Button
              className="add-like"
              type="text"
              onClick={(e) => {
                showReportModal(slug);
              }}
            >
              <Report width={15} height={15} />
            </Button>
          </Flex> */}
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
      <ShareModal
        isShareModalOpen={isShareModalOpen}
        closeShareModal={closeShareModal}
        isShareModalAnimating={isShareModalAnimating}
        shareUrl={`${shareUrl}/${slug}`}
      />
      <ReportModal
        isReportModalOpen={isReportModalOpen}
        closeReportModal={closeReportModal}
        isAnimating={isAnimating}
        commentSlug={reportingCommentSlug}
      />
    </div>
  );
}
