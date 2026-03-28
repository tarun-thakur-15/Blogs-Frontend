// In FaqDrawer.tsx
"use client";
import { Button, Drawer } from "antd";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { createBlog } from "../services/api";
import TiptapEditor from "./TiptapEditor";
import DefaultImage from "../../assets/images/not-logged-in-user.png";
import CloseIcons from "../../../public/images/closeIcon.svg";
import { ClipLoader } from "react-spinners";
import { saveDraft } from "../services/api";
import { toast } from "sonner";

export default function FaqDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ← fixed: start false, not true

  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const isPostDisabled = !topic || !title || !content;

  // ─── close & reset ────────────────────────────────────────────────────────
  const handleClose = () => {
    setTopic("");
    setTitle("");
    setContent("");
    setEditorKey((prevKey) => prevKey + 1);
    onClose();
  };

  const ProfileImage = Cookies.get("profileImage");

  // ─── post blog ────────────────────────────────────────────────────────────
  const handlePostBlog = async () => {
    if (isPostDisabled) {
      toast.error(
        "Incomplete Information: Please ensure Topic, Title, and content are provided."
      );
      return;
    }
    setLoading(true);
    try {
      const blogData = { topic, title, content };
      const result = await createBlog(blogData);
      toast.success(result.msg || "Blog created successfully!");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      const apiMsg = error?.response?.data?.msg;
      toast.error(apiMsg || "Failed to create blog");
    }
    setLoading(false);
  };

  // ─── autosave (debounced 3 s) ─────────────────────────────────────────────
  // BUG FIX: original code had `+setIsSaving(...)` — the unary `+` coerces the
  // return value of setIsSaving (undefined) to a number and discards it,
  // so isSaving was never actually set. Removed the leading `+`.
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    if (topic || title || content) {
      setIsSaving(true); // ← fixed (was `+setIsSaving(true)`)
      saveTimer.current = setTimeout(async () => {
        try {
          await saveDraft({ topic, title, content });
        } catch (err) {
          console.error("Autosave failed", err);
        } finally {
          setIsSaving(false); // ← fixed (was `+setIsSaving(false)`)
        }
      }, 3000);
    } else {
      setIsSaving(false); // ← fixed (was `+setIsSaving(false)`)
    }

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [topic, title, content]); // ← also watch `title` so saving reflects all fields

  return (
    <Drawer
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={visible}
      height="100%"
      className="drawerZindex"
    >
      {/* ── Top bar ── */}
      <div className="parent1" style={{ height: "50px" }}>
        <div className="leftBtns">
          <div className="createFaqProfileImageContainer">
            <Image
              src={
                ProfileImage
                  ? `https://blogs-backend-ftie.onrender.com/${ProfileImage}`
                  : DefaultImage
              }
              alt="Profile Image"
              className="createFaqProfileImage"
              width={40}
              height={40}
            />
          </div>
          <button className="createFaqBtn">Create FAQ</button>
        </div>

        <div className="rightBtns">
          {isSaving && (
            <button className="autosaveBtn">
              <ClipLoader size={14} color="#0969da" />
              <span>&nbsp;Saving…</span>
            </button>
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

      {/* ── Body ── */}
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
            {/* <Toaster position="top-right" /> */}

            {/* Topic */}
            <input
              type="text"
              placeholder="Type your Topic here"
              className="type-question"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* Title */}
            <textarea
              placeholder="Type your title here"
              className="type-question"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Editor */}
            <div className="editor-box-new" style={{ position: "relative" }}>
              <TiptapEditor key={editorKey} setEditorContent={setContent} />
            </div>
          </div>
        </div>
      </section>
    </Drawer>
  );
}