"use client";

import React, { useState, useRef, useEffect } from "react";
import TextToSpeechPlayer from "./TextToSpeech";

interface ReadTTSProps {
  text: string;
  children: React.ReactNode;
}

// Utility to remove HTML tags (client-only)
const stripHtml = (html: string): string => {
  if (typeof document === "undefined") return html;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const ReadTTS: React.FC<ReadTTSProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [cleanedText, setCleanedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely strip HTML only after component mounts on client
  useEffect(() => {
    setCleanedText(stripHtml(text));
  }, [text]);

  const handleToggle = () => {
    setVisible((v) => !v);
  };

  // Stop speaking when closing
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (!visible) {
        window.speechSynthesis.cancel();
      }
    }
  }, [visible]);

  // Hide when clicking outside
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    if (visible) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [visible]);

  // Clone the Read button to attach toggle
  const triggerEl = React.Children.only(children) as React.ReactElement<any>;
  const triggerWithOnClick = React.cloneElement(triggerEl, {
    onClick: handleToggle,
  });

  return (
    <div ref={containerRef} className="relative inline-block !my-[10px] md:my-0">
      {triggerWithOnClick}

      {visible && cleanedText && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-xl">
          <TextToSpeechPlayer text={cleanedText} autoPlay />
        </div>
      )}
    </div>
  );
};

export default ReadTTS;
