// In FaqDrawer.tsx
"use client";
import { Button, Drawer} from "antd";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { createBlog } from "../services/api"; // Adjust the path as needed
import TiptapEditor from "./TiptapEditor";
import DefaultImage from "../../assets/images/not-logged-in-user.png";
import CloseIcons from "../../../public/images/closeIcon.svg";
import { ClipLoader } from "react-spinners";
import { saveDraft } from "../services/api";
// import toast from "react-hot-toast";
import { Toaster, toast } from "sonner";
export default function DraftDrawer({
  visible,
  onClose,
  title,
  topic,
  content
}: {
  visible: boolean;
  onClose: () => void;
  topic: string;
  title: string;
  content: string;

}) {
    
  const [editorKey, setEditorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(true);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const [topicValue, setTopicValue] = useState(topic || "");
const [titleValue, setTitleValue] = useState(title || "");
const [contentValue, setContentValue] = useState(content || "");

  // Check if Post Blog button should be disabled:
  // Disable if topic, title, or content is empty OR if content has less than 500 words.
  const isPostDisabled = !topic || !title || !content;

  //function to close Drawer
  const handleClose = () => {

    setEditorKey((prevKey) => prevKey + 1); // Force re-render of editor to clear content
    onClose();
  };

  const ProfileImage = Cookies.get("profileImage");
  //function to post the blog by calling createBlog api
  const handlePostBlog = async () => {
   
    if (isPostDisabled) {
      toast.error(
        "Incomplete Information: Please ensure Topic, Title, and at least 500 words of content are provided."
      );
 
      return;
    }
    setLoading(true);
    try {

      const blogData = { topic: topicValue, title: titleValue, content: contentValue };
      const token = Cookies.get("accessToken");
      const result = await createBlog(blogData, token);
      toast.success(result.msg || "Blog created successfully!");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast.error(error.message || "Failed to create blog");
    }
    setLoading(false);
  };
  // 2) Debounce saveDraft on topic/content change
  useEffect(() => {
    // clear any existing timer
    if (saveTimer.current) clearTimeout(saveTimer.current);

    // if either field is non-empty, schedule a save
    if (topic || content) {
      +setIsSaving(true);
      saveTimer.current = setTimeout(async () => {
        try {
          await saveDraft({ topic, title, content });
        } catch (err) {
          console.error("Autosave failed", err);
        } finally {
          +setIsSaving(false);
        }
      }, 6000);
    } else {
      // nothing to save
      +setIsSaving(false);
    }

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [topic, content]);

  useEffect(() => {
  if (visible) {
    setTopicValue(topic || "");
    setTitleValue(title || "");
    setContentValue(content || "");
  }
}, [visible, topic, title, content]);

  return (
    <Drawer
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={visible}
      height="100%"
      className="drawerZindex"
    >
      <div className="parent1" style={{ height: "50px" }}>
        <div className="leftBtns">
          <div className="createFaqProfileImageContainer">
            <Image
              src={`https://blogs-backend-ftie.onrender.com/${ProfileImage}` || DefaultImage}
              alt="Profile Image"
              className="createFaqProfileImage"
              width={40}
              height={40}
            />
          </div>
          <button className="createFaqBtn">Create FAQ</button>
        </div>
        <div className="rightBtns">
          {isSaving ? (
            <button className="autosaveBtn">
              <ClipLoader size={14} color="#0969da" />
              <span>&nbsp;Saving…</span>
            </button>
          ) : (
            ""
          )}
          <button
            className="postFaqBtn"
            onClick={handlePostBlog}
            disabled={isPostDisabled || loading}
          >
            {loading ? <ClipLoader size={14} color="#fff" /> : "Post Blog"}
          </button>

          <Button onClick={handleClose}>
            <CloseIcons className="closeIcon" /> 
          </Button>
        </div>
      </div>
      <section style={{ height: "90%" }} className="paddingTopForMobile">
        <div
          className="container"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <Toaster position="top-right" />
            {/* Topic input */}
            <input
              type="text"
              placeholder="Type your Topic here"
              className="type-question"
              value={topicValue}
             onChange={(e) => setTopicValue(e.target.value)}
            />
            {/* Title input */}
            <textarea
              placeholder="Type your title here"
              className="type-question"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
            />
            {/* Tiptap Editor for content */}
            <div className="editor-box-new" style={{ position: "relative" }}>
              <TiptapEditor key={editorKey} draftContent={contentValue} onContentChange={(newContent) => setContentValue(newContent)} />
            </div>
          </div>
        </div>
      </section>
    </Drawer>
  );
}
