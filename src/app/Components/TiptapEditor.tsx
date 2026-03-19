"use client";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useEditor, EditorContent, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Italic from "@tiptap/extension-italic";
import UnderlineExt from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExt from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import Youtube from "@tiptap/extension-youtube";
import { notification } from "antd";

// ─── lowlight setup ────────────────────────────────────────────────────────────
const lowlight = createLowlight();
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("html", html);
lowlight.register("python", python);
lowlight.register("bash", bash);
lowlight.register("json", json);

// ─── Custom FontSize extension ─────────────────────────────────────────────────
import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    } as any;
  },
});

// ─── Embed (iframe) extension ──────────────────────────────────────────────────
const EmbedNode = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      service: { default: "generic" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-embed]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-embed": "" }, HTMLAttributes)];
  },
  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText =
        "position:relative;width:100%;margin:16px 0;border-radius:8px;overflow:hidden;background:#f8fafc;border:1px solid #e2e8f0;";

      const { src, service } = node.attrs;

      if (service === "youtube") {
        // handled by Youtube extension
      } else if (service === "twitter") {
        wrapper.innerHTML = `
          <div style="padding:16px;display:flex;align-items:center;gap:12px;color:#64748b;font-family:sans-serif;font-size:14px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1da1f2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.854L1.254 2.25H8.08l4.262 5.647 5.901-5.647Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Tweet: <a href="${src}" target="_blank" style="color:#1da1f2;">${src}</a></span>
          </div>`;
      } else if (service === "instagram") {
        wrapper.innerHTML = `
          <div style="padding:16px;display:flex;align-items:center;gap:12px;color:#64748b;font-family:sans-serif;font-size:14px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span>Instagram: <a href="${src}" target="_blank" style="color:#e1306c;">${src}</a></span>
          </div>`;
      } else if (service === "github-gist") {
        const scriptSrc = src.endsWith(".js") ? src : `${src}.js`;
        const id = `gist-${Math.random().toString(36).slice(2)}`;
        wrapper.innerHTML = `<div id="${id}" style="padding:8px;"></div>`;
        setTimeout(() => {
          const sc = document.createElement("script");
          sc.src = scriptSrc;
          document.getElementById(id)?.appendChild(sc);
        }, 100);
      } else if (service === "codepen") {
        const iframeSrc = src.replace("/pen/", "/embed/");
        wrapper.innerHTML = `<iframe src="${iframeSrc}" style="width:100%;height:400px;border:0;" loading="lazy" allowfullscreen></iframe>`;
      } else if (service === "figma") {
        const encoded = encodeURIComponent(src);
        wrapper.innerHTML = `<iframe src="https://www.figma.com/embed?embed_host=share&url=${encoded}" style="width:100%;height:450px;border:0;" allowfullscreen loading="lazy"></iframe>`;
      } else if (service === "google-maps") {
        wrapper.innerHTML = `<iframe src="${src}" style="width:100%;height:400px;border:0;" loading="lazy" allowfullscreen></iframe>`;
      } else if (service === "google-docs") {
        const embedSrc = src.replace("/edit", "/preview");
        wrapper.innerHTML = `<iframe src="${embedSrc}" style="width:100%;height:500px;border:0;" loading="lazy"></iframe>`;
      } else if (service === "notion") {
        wrapper.innerHTML = `
          <div style="padding:16px;display:flex;align-items:center;gap:12px;color:#64748b;font-family:sans-serif;font-size:14px;">
            <span style="font-size:20px;">📝</span>
            <span>Notion page: <a href="${src}" target="_blank" style="color:#0f172a;">${src}</a></span>
          </div>`;
      } else {
        wrapper.innerHTML = `<iframe src="${src}" style="width:100%;height:400px;border:0;" loading="lazy" allowfullscreen></iframe>`;
      }

      return { dom: wrapper };
    };
  },
});

// ─── Pull Quote node ────────────────────────────────────────────────────────────
const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "aside[data-pull-quote]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes({ "data-pull-quote": "" }, HTMLAttributes, {
        style:
          "border-left:4px solid #0969da;padding:16px 24px;margin:24px 0;font-size:1.25rem;font-style:italic;color:#0969da;background:#f0f7ff;border-radius:0 8px 8px 0;",
      }),
      0,
    ];
  },
});

// ─── detect embed service ───────────────────────────────────────────────────────
function detectService(url: string): string {
  if (/youtu\.?be/.test(url)) return "youtube";
  if (/twitter\.com|x\.com/.test(url)) return "twitter";
  if (/instagram\.com/.test(url)) return "instagram";
  if (/gist\.github\.com/.test(url)) return "github-gist";
  if (/codepen\.io/.test(url)) return "codepen";
  if (/figma\.com/.test(url)) return "figma";
  if (/maps\.google\.com|google\.com\/maps/.test(url)) return "google-maps";
  if (/docs\.google\.com/.test(url)) return "google-docs";
  if (/notion\.so/.test(url)) return "notion";
  return "generic";
}

// ─── types ──────────────────────────────────────────────────────────────────────
interface TiptapEditorProps {
  setEditorContent?: Dispatch<SetStateAction<string>>;
  draftContent?: string;
  initialContent?: string;
  maxLength?: any;
  onContentChange?: (content: string) => void;
}

// ─── highlight colors ───────────────────────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { label: "Yellow", color: "#fef08a" },
  { label: "Green", color: "#bbf7d0" },
  { label: "Blue", color: "#bfdbfe" },
  { label: "Pink", color: "#fbcfe8" },
  { label: "Orange", color: "#fed7aa" },
  { label: "Purple", color: "#e9d5ff" },
];

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];

// ─── Toolbar Button ─────────────────────────────────────────────────────────────
const ToolBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "30px",
      minWidth: "30px",
      padding: "0 7px",
      border: "none",
      borderRadius: "5px",
      background: active ? "#dbeafe" : "transparent",
      color: active ? "#1d4ed8" : "#374151",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: active ? 700 : 500,
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) => {
      if (!active)
        (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
    }}
    onMouseLeave={(e) => {
      if (!active)
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
    }}
  >
    {children}
  </button>
);

const Divider = () => (
  <span
    style={{
      width: "1px",
      height: "20px",
      background: "#e2e8f0",
      display: "inline-block",
      margin: "0 4px",
      verticalAlign: "middle",
    }}
  />
);

// ─── Main Component ─────────────────────────────────────────────────────────────
const TiptapEditor: React.FC<TiptapEditorProps> = ({
  setEditorContent,
  draftContent,
  initialContent,
  onContentChange,
}) => {
  const [imageCount, setImageCount] = useState<number>(0);
  const maxImages = 3;
  const maxImageSize = 500 * 1024;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkType, setLinkType] = useState<"url" | "email" | "medium">("url");
  const [showEmbedMenu, setShowEmbedMenu] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [activeFontSize, setActiveFontSize] = useState("16px");

  const notifyError = (message: string, description: string) => {
    notification.error({ message, description, placement: "topRight" });
  };

  // ─── Image with caption ──────────────────────────────────────────────────
  const CustomImage = ImageExt.extend({
    addNodeView() {
      return ({ node, getPos, editor }) => {
        const container = document.createElement("figure");
        container.style.cssText =
          "position:relative;display:inline-block;margin:16px 0;max-width:700px;width:100%;";

        const img = document.createElement("img");
        img.setAttribute("src", node.attrs.src);
        img.style.cssText =
          "max-width:700px;width:100%;display:block;border-radius:6px;";

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "✕";
        removeBtn.style.cssText =
          "position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;opacity:0;transition:opacity 0.2s;font-size:12px;";

        removeBtn.addEventListener("click", () => {
          if (typeof getPos === "function") {
            const pos = getPos();
            if (typeof pos === "number") {
              editor.commands.deleteRange({
                from: pos,
                to: pos + node.nodeSize,
              });
              setImageCount((c) => Math.max(0, c - 1));
            }
          }
        });

        const caption = document.createElement("figcaption");
        caption.setAttribute("contenteditable", "true");
        caption.setAttribute("placeholder", "Add a caption…");
        caption.style.cssText =
          "font-size:13px;color:#64748b;text-align:center;margin-top:6px;font-style:italic;min-height:20px;outline:none;";
        caption.textContent = node.attrs.caption || "";

        container.addEventListener("mouseenter", () => {
          removeBtn.style.opacity = "1";
        });
        container.addEventListener("mouseleave", () => {
          removeBtn.style.opacity = "0";
        });

        container.appendChild(img);
        container.appendChild(removeBtn);
        container.appendChild(caption);

        return {
          dom: container,
          update: (n: any) => n.type.name === node.type.name,
        };
      };
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // disable built-in extensions we're replacing with standalone ones
        bold: false,
        italic: false,
        strike: false,
        codeBlock: false, // replaced by CodeBlockLowlight
        horizontalRule: false, // replaced by standalone HorizontalRule
        // code, blockquote, bulletList, orderedList — omit to keep defaults
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Bold,
      Italic,
      Strike,
      UnderlineExt,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,
      CodeBlockLowlight.configure({ lowlight }),
      CustomImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          style: "max-width:700px;width:100%;border-radius:6px;",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link", rel: "noopener noreferrer" },
        validate: (href) => /^(https?:\/\/|mailto:|#)/.test(href),
      }),
      Placeholder.configure({
        placeholder: ({ editor }) =>
          editor.isEmpty ? "Start writing your blog…" : "",
        emptyEditorClass: "custom-placeholder",
      }),
      Typography,
      Youtube.configure({ controls: true, nocookie: true }),
      EmbedNode,
      PullQuote,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (setEditorContent) setEditorContent(html);
      if (onContentChange) onContentChange(html);
    },
    editorProps: {
      attributes: { class: "prose focus:outline-none tiptap-content" },
      // Fix VS Code paste: strip pre/code wrapping if it's plain-text code
      transformPastedHTML(html) {
        return html
          .replace(/<pre[^>]*>/gi, "<p>")
          .replace(/<\/pre>/gi, "</p>")
          .replace(/white-space:\s*pre[^;"']*/gi, "white-space: pre-wrap");
      },
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (!file.type.startsWith("image/")) return false;
          if (file.size > maxImageSize) {
            notifyError("Image Too Large", "Each image must be < 500KB.");
            return true;
          }
          if (imageCount >= maxImages) {
            notifyError("Limit Exceeded", "Max 3 images allowed.");
            return true;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (coords) {
              view.dispatch(
                view.state.tr.insert(
                  coords.pos,
                  view.state.schema.nodes.image.create({ src: reader.result }),
                ),
              );
              setImageCount((c) => c + 1);
            }
          };
          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
    },
  });

  // sync draft/initial content
  useEffect(() => {
    if (!editor) return;
    if (draftContent) editor.commands.setContent(draftContent);
    else if (initialContent) editor.commands.setContent(initialContent);
  }, [draftContent, initialContent, editor]);

  // ─── toolbar handlers ────────────────────────────────────────────────────
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      ![
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.type)
    ) {
      notifyError("Invalid Type", "Only JPG, PNG, GIF, WEBP allowed.");
      return;
    }
    if (file.size > maxImageSize) {
      notifyError("Too Large", "Each image must be < 500KB.");
      return;
    }
    if (imageCount >= maxImages) {
      notifyError("Limit Exceeded", "Max 3 images.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      editor
        ?.chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
      setImageCount((c) => c + 1);
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-uploaded
    e.target.value = "";
  };

  const handleInsertLink = useCallback(() => {
    if (!linkUrl.trim()) return;
    let href = linkUrl.trim();
    if (linkType === "email")
      href = href.startsWith("mailto:") ? href : `mailto:${href}`;
    else if (linkType === "url" && !/^https?:\/\//.test(href))
      href = `https://${href}`;
    editor?.chain().focus().setLink({ href }).run();
    setLinkUrl("");
    setShowLinkMenu(false);
  }, [editor, linkUrl, linkType]);

  const handleInsertEmbed = useCallback(() => {
    if (!embedUrl.trim()) return;
    const url = embedUrl.trim();
    const service = detectService(url);
    if (service === "youtube") {
      editor?.commands.setYoutubeVideo({ src: url });
    } else {
      editor?.commands.insertContent({
        type: "embed",
        attrs: { src: url, service },
      });
    }
    setEmbedUrl("");
    setShowEmbedMenu(false);
  }, [editor, embedUrl]);

  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, any>) =>
    editor.isActive(name, attrs);

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <div className="tiptap-wrapper" style={{ position: "relative" }}>
      {/* ── Toolbar ── */}
      <div
        className="tiptap-toolbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "2px",
          padding: "6px 10px",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
          borderRadius: "8px 8px 0 0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* ── Text style / size ── */}
        <div style={{ position: "relative" }}>
          <ToolBtn
            onClick={() => setShowFontSizeMenu((v) => !v)}
            title="Font Size"
          >
            {activeFontSize} ▾
          </ToolBtn>
          {showFontSizeMenu && (
            <div
              style={{
                position: "absolute",
                top: "34px",
                left: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 100,
                padding: "4px",
                minWidth: "90px",
              }}
            >
              {FONT_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    (editor.chain().focus() as any).setFontSize(s).run();
                    setActiveFontSize(s);
                    setShowFontSizeMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "5px 10px",
                    background:
                      activeFontSize === s ? "#dbeafe" : "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* ── Headings ── */}
        {/* removed h1 because h1 is only for Title */}
        {/* <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolBtn> */}
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={isActive("heading", { level: 3 })}
          title="Main Heading (H3)"
        >
          H3
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={isActive("heading", { level: 4 })}
          title="Sub-Heading (H4)"
        >
          H4
        </ToolBtn>

        <Divider />

        {/* ── Formatting ── */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={isActive("bold")}
          title="Bold"
        >
          <b>B</b>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={isActive("italic")}
          title="Italic"
        >
          <i>I</i>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={isActive("underline")}
          title="Underline"
        >
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolBtn>

        <Divider />

        {/* ── Highlight ── */}
        <div style={{ position: "relative" }}>
          <ToolBtn
            onClick={() => setShowHighlightMenu((v) => !v)}
            active={isActive("highlight")}
            title="Highlight"
          >
            🖊 ▾
          </ToolBtn>
          {showHighlightMenu && (
            <div
              style={{
                position: "absolute",
                top: "34px",
                left: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 100,
                padding: "8px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                width: "160px",
              }}
            >
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: c.color })
                      .run();
                    setShowHighlightMenu(false);
                  }}
                  style={{
                    width: "28px",
                    height: "28px",
                    background: c.color,
                    border: "2px solid #e2e8f0",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              ))}
              <button
                type="button"
                title="Remove highlight"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightMenu(false);
                }}
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <Divider />

        {/* ── Lists ── */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={isActive("bulletList")}
          title="Bullet List"
        >
          • List
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={isActive("orderedList")}
          title="Numbered List"
        >
          1. List
        </ToolBtn>

        <Divider />

        {/* ── Quotes ── */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={isActive("blockquote")}
          title="Block Quote"
        >
          ❝ Quote
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "pullQuote",
                content: [{ type: "text", text: "Pull quote text here…" }],
              })
              .run()
          }
          active={isActive("pullQuote")}
          title="Pull Quote (large styled quote)"
        >
          ❝ Pull
        </ToolBtn>

        <Divider />

        {/* ── Code ── */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={isActive("code")}
          title="Inline Code"
        >
          {"</>"}
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={isActive("codeBlock")}
          title="Code Block"
        >
          Code Block
        </ToolBtn>

        <Divider />

        {/* ── Divider line ── */}
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Divider"
        >
          ─ HR
        </ToolBtn>

        <Divider />

        {/* ── Link ── */}
        <div style={{ position: "relative" }}>
          <ToolBtn
            onClick={() => {
              setShowLinkMenu((v) => !v);
              setShowEmbedMenu(false);
            }}
            active={isActive("link")}
            title="Add Link"
          >
            🔗 Link
          </ToolBtn>
          {showLinkMenu && (
            <div
              style={{
                position: "absolute",
                top: "34px",
                left: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                zIndex: 100,
                padding: "12px",
                width: "300px",
              }}
            >
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                {(["url", "email", "medium"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLinkType(t)}
                    style={{
                      padding: "3px 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "20px",
                      background: linkType === t ? "#dbeafe" : "transparent",
                      color: linkType === t ? "#1d4ed8" : "#64748b",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {t === "url" ? "URL" : t === "email" ? "Email" : "Medium"}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={
                  linkType === "email"
                    ? "user@example.com"
                    : linkType === "medium"
                      ? "https://medium.com/@user/article"
                      : "https://example.com"
                }
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInsertLink()}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  style={{
                    flex: 1,
                    padding: "6px",
                    background: "#1d4ed8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Insert
                </button>
                {isActive("link") && (
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setShowLinkMenu(false);
                    }}
                    style={{
                      padding: "6px 10px",
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowLinkMenu(false)}
                  style={{
                    padding: "6px 10px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Embed ── */}
        <div style={{ position: "relative" }}>
          <ToolBtn
            onClick={() => {
              setShowEmbedMenu((v) => !v);
              setShowLinkMenu(false);
            }}
            title="Embed URL (YouTube, Tweet, Figma, etc.)"
          >
            ⬡ Embed
          </ToolBtn>
          {showEmbedMenu && (
            <div
              style={{
                position: "absolute",
                top: "34px",
                right: 0,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                zIndex: 100,
                padding: "12px",
                width: "320px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 8px",
                }}
              >
                Paste a URL to embed: YouTube, Twitter/X, Instagram, GitHub
                Gist, CodePen, Figma, Google Maps, Google Docs, Notion
              </p>
              <input
                type="text"
                placeholder="https://..."
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInsertEmbed()}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={handleInsertEmbed}
                  style={{
                    flex: 1,
                    padding: "6px",
                    background: "#1d4ed8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Embed
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmbedMenu(false)}
                  style={{
                    padding: "6px 10px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* ── Image upload ── */}
        <ToolBtn onClick={() => inputRef.current?.click()} title="Upload Image">
          📷 Image
        </ToolBtn>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          style={{ display: "none" }}
        />
      </div>

      {/* ── Editor content ── */}
      <EditorContent
        editor={editor}
        className="tiptap-editor-content"
        style={{
          minHeight: "300px",
          padding: "16px",
          fontSize: "16px",
          lineHeight: "1.7",
          outline: "none",
        }}
      />

      {/* ── Required CSS ── */}
      <style>{`
        .tiptap-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: visible;
          background: #fff;
        }
        .tiptap-content {
          min-height: 280px;
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        .tiptap-content p {
          margin: 0 0 12px;
        }
        .tiptap-content h1 { font-size: 2rem; font-weight: 700; margin: 20px 0 10px; }
        .tiptap-content h2 { font-size: 1.6rem; font-weight: 700; margin: 18px 0 8px; }
        .tiptap-content h3 { font-size: 1.35rem; font-weight: 700; margin: 16px 0 8px; }
        .tiptap-content h4 { font-size: 1.15rem; font-weight: 600; margin: 14px 0 6px; }
        .tiptap-content blockquote {
          border-left: 4px solid #94a3b8;
          margin: 16px 0;
          padding: 10px 16px;
          color: #475569;
          font-style: italic;
          background: #f8fafc;
          border-radius: 0 6px 6px 0;
        }
        .tiptap-content ul { list-style: disc; padding-left: 24px; margin: 10px 0; }
        .tiptap-content ol { list-style: decimal; padding-left: 24px; margin: 10px 0; }
        .tiptap-content li { margin: 4px 0; }
        .tiptap-content code {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 1px 5px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.88em;
        }
        .tiptap-content pre {
          background: #1e293b;
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin: 16px 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .tiptap-content pre code {
          background: transparent;
          border: none;
          color: #e2e8f0;
          font-size: 0.9em;
          padding: 0;
        }
        .tiptap-content hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 24px 0;
        }
        .tiptap-link {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
        .tiptap-content mark {
          border-radius: 2px;
          padding: 0 2px;
        }
        .custom-placeholder::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          position: absolute;
          font-style: italic;
        }
        /* Syntax highlighting theme (One Dark inspired) */
        .hljs-keyword { color: #c678dd; }
        .hljs-string { color: #98c379; }
        .hljs-number { color: #d19a66; }
        .hljs-comment { color: #5c6370; font-style: italic; }
        .hljs-function { color: #61afef; }
        .hljs-variable { color: #e06c75; }
        .hljs-attr { color: #e06c75; }
        .hljs-tag { color: #e06c75; }
        .hljs-built_in { color: #e5c07b; }
        .hljs-type { color: #e5c07b; }
        .hljs-title { color: #61afef; }
        .hljs-params { color: #abb2bf; }
        /* YouTube embed fix */
        .tiptap-content iframe[src*="youtube"] {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 8px;
        }
        /* Figcaption */
        .tiptap-content figcaption[placeholder]:empty::before {
          content: attr(placeholder);
          color: #94a3b8;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
