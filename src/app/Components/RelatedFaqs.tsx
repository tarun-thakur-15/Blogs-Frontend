"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flex, Button } from "antd";
// CSS
import "../styles/awnserbox.css";
// Images
import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
// import Like from "../../../public/images/like.svg";
import Comment from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";

interface Fly {
  id: number;
  startX: number;
  startY: number;
  emoji: string;
}

const RelatedFaqs = () => {
  const [flies, setFlies] = useState<Fly[]>([]);

  const handleClick =
    (emoji: string) => (e: React.MouseEvent<HTMLButtonElement>) => {

      const id = Date.now();
      const button = e.currentTarget;
      // Calculate starting coordinates relative to the container
      const startX = button.offsetLeft + button.offsetWidth / 2;
      const startY = button.offsetTop;

      const newFly: Fly = { id, startX, startY, emoji };

      setFlies((prev) => [...prev, newFly]);

      // Remove the fly after the animation duration (1.5s)
      setTimeout(() => {
        setFlies((prev) => prev.filter((f) => f.id !== id));
      }, 1500);
    };

  // Define the emojis for each button
  const emojis = ["👍", "🔥", "😵‍💫", "👎"];
  const router = useRouter();

  return (
    <>
      <div>
        <div className="awnser-box" style={{ marginBottom: "16px" }}>
          <div className="awnser-box-header">
            <p className="awnser-box--question">title</p>
          </div>

          <div className="awnser-box-body">
            <p className="awnser-box--awnser">content</p>
          </div>

          <div className="awnser-box-footer">
            <Flex justify="space-between" align="center">
              <Flex gap={2} align="center">
                <div className="awnser-box--company">
                  <Image src={notLoggedInIcon} alt="Placeholder avatar" />
                  <span>Tarun Thakur</span>
                </div>

                <Flex gap={4} align="center">
                  <p>&nbsp;&nbsp;Tarun Thakur&nbsp;&nbsp;</p>
                  <p className="date">15th May, 2003</p>
                </Flex>
              </Flex>

              <Flex gap={12} align="center">
                <div
                  className="crown-button-container !flex !gap-2"
                  style={{ display: "flex", gap: "12px" }}
                >
                  {/* Render a button for each emoji */}
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={handleClick(emoji)}
                      style={{ border: "none", backgroundColor: "#f6f8fa" }}
                    >
                      <p className="reactionCountOnHome">
                        {" "}
                        {emoji} 10
                      </p>
                    </button>
                  ))}
                  {/* Render the animated flying emojis */}
                  {flies.map((fly) => (
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

                <Button className="add-like" type="text">
                  <Comment />
                  <p>10</p>
                </Button>
              </Flex>
            </Flex>
          </div>
        </div>

        <div className="no-data-profile">
          <Image src={BoxIconPng} alt="No  faqs"></Image>
          <div>
            <h2>No Faq's Available</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedFaqs;
