"use client";
import React, { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
  className?: string;
}

/**
 * BlogContent
 * -----------
 * Drop-in replacement for the raw dangerouslySetInnerHTML div.
 * Usage:
 *   <BlogContent content={blogData.content} />
 *
 * Handles:
 *  - Headings h1–h4
 *  - Paragraphs with word-wrap
 *  - Bullet lists (ul > li) and Ordered lists (ol > li)
 *  - Blockquote (standard quote)
 *  - Pull quote (<aside data-pull-quote>)
 *  - Inline code and Code blocks with dark theme
 *  - Horizontal rule
 *  - Highlighted text (<mark>)
 *  - Strikethrough
 *  - Links (tiptap-link class)
 *  - Images (with optional figcaption)
 *  - Embeds (<div data-embed src="..." service="...">)
 *    → YouTube, Twitter/X, Instagram, GitHub Gist, CodePen,
 *      Figma, Google Maps, Google Docs, Notion, generic iframe
 */
export default function BlogContent({ content, className = "" }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // After mount, post-process embed divs that dangerouslySetInnerHTML
  // rendered as plain empty divs — hydrate them with real iframes/widgets.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const embedDivs = container.querySelectorAll<HTMLDivElement>("div[data-embed]");
    embedDivs.forEach((div) => {
      // already hydrated
      if (div.dataset.hydrated === "1") return;
      div.dataset.hydrated = "1";

      const src = div.getAttribute("src") || "";
      const service = div.getAttribute("service") || "generic";

      div.style.cssText =
        "width:100%;margin:20px 0;border-radius:8px;overflow:hidden;background:#f8fafc;border:1px solid #e2e8f0;";
      div.removeAttribute("src");
      div.removeAttribute("service");

      switch (service) {
        case "youtube": {
          // extract video id from various youtube url forms
          const ytMatch = src.match(
            /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
          );
          const videoId = ytMatch?.[1];
          if (videoId) {
            div.innerHTML = `
              <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/${videoId}"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:8px;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>`;
          } else {
            div.innerHTML = embedLink("YouTube", src, "#ff0000");
          }
          break;
        }

        case "twitter": {
          // Twitter oEmbed via their widget script
          div.innerHTML = `
            <div style="padding:16px;display:flex;align-items:center;gap:12px;font-family:sans-serif;font-size:14px;color:#64748b;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1da1f2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.854L1.254 2.25H8.08l4.262 5.647 5.901-5.647Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <a href="${src}" target="_blank" rel="noopener noreferrer"
                style="color:#1da1f2;word-break:break-all;">${src}</a>
            </div>`;

          // Attempt to load Twitter widget if script available
          const tweetId = src.match(/status\/(\d+)/)?.[1];
          if (tweetId && typeof window !== "undefined") {
            const tweetContainer = document.createElement("div");
            div.innerHTML = "";
            div.appendChild(tweetContainer);

            const loadTwitter = () => {
              if ((window as any).twttr?.widgets) {
                (window as any).twttr.widgets.createTweet(tweetId, tweetContainer, {
                  theme: "light",
                  dnt: true,
                });
              }
            };

            if ((window as any).twttr) {
              loadTwitter();
            } else {
              const s = document.createElement("script");
              s.src = "https://platform.twitter.com/widgets.js";
              s.async = true;
              s.onload = loadTwitter;
              document.head.appendChild(s);
            }
          }
          break;
        }

        case "instagram": {
          div.innerHTML = `
            <div style="padding:16px;display:flex;align-items:center;gap:12px;font-family:sans-serif;font-size:14px;color:#64748b;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#e1306c">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <a href="${src}" target="_blank" rel="noopener noreferrer"
                style="color:#e1306c;word-break:break-all;">${src}</a>
            </div>`;
          break;
        }

        case "github-gist": {
          const gistId = `gist-${Math.random().toString(36).slice(2)}`;
          const scriptSrc = src.endsWith(".js") ? src : `${src}.js`;
          div.innerHTML = `<div id="${gistId}" style="padding:8px;overflow:auto;"></div>`;
          setTimeout(() => {
            const sc = document.createElement("script");
            sc.src = scriptSrc;
            document.getElementById(gistId)?.appendChild(sc);
          }, 200);
          break;
        }

        case "codepen": {
          const iframeSrc = src
            .replace("/pen/", "/embed/")
            .replace(/\?.*$/, "") + "?default-tab=result";
          div.innerHTML = `
            <iframe src="${iframeSrc}"
              style="width:100%;height:400px;border:0;border-radius:8px;"
              loading="lazy" allowfullscreen
              title="CodePen Embed">
            </iframe>`;
          break;
        }

        case "figma": {
          const encoded = encodeURIComponent(src);
          div.innerHTML = `
            <iframe
              src="https://www.figma.com/embed?embed_host=share&url=${encoded}"
              style="width:100%;height:450px;border:0;border-radius:8px;"
              allowfullscreen loading="lazy"
              title="Figma Embed">
            </iframe>`;
          break;
        }

        case "google-maps": {
          div.innerHTML = `
            <iframe src="${src}"
              style="width:100%;height:400px;border:0;border-radius:8px;"
              loading="lazy" allowfullscreen
              title="Google Maps">
            </iframe>`;
          break;
        }

        case "google-docs": {
          const previewSrc = src.replace(/\/edit.*$/, "/preview");
          div.innerHTML = `
            <iframe src="${previewSrc}"
              style="width:100%;height:500px;border:0;border-radius:8px;"
              loading="lazy"
              title="Google Docs">
            </iframe>`;
          break;
        }

        case "notion": {
          div.innerHTML = `
            <div style="padding:16px;display:flex;align-items:center;gap:12px;font-family:sans-serif;font-size:14px;color:#64748b;">
              <span style="font-size:20px;">📝</span>
              <a href="${src}" target="_blank" rel="noopener noreferrer"
                style="color:#0f172a;word-break:break-all;">${src}</a>
            </div>`;
          break;
        }

        default: {
          // generic — try an iframe, fall back to a link card
          div.innerHTML = `
            <iframe src="${src}"
              style="width:100%;height:400px;border:0;border-radius:8px;"
              loading="lazy" allowfullscreen
              title="Embedded content">
            </iframe>`;
          break;
        }
      }
    });
  }, [content]);

  return (
    <>
      <style>{BLOG_CONTENT_CSS}</style>
      <div
        ref={containerRef}
        className={`blog-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}

// ─── helper ──────────────────────────────────────────────────────────────────
function embedLink(label: string, href: string, color: string) {
  return `<div style="padding:14px 16px;font-family:sans-serif;font-size:14px;">
    <a href="${href}" target="_blank" rel="noopener noreferrer"
       style="color:${color};word-break:break-all;">${label}: ${href}</a>
  </div>`;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const BLOG_CONTENT_CSS = `
/* ── Base container ── */
.blog-content {
  font-size: 16px;
  line-height: 1.75;
  color: #1e293b;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}

/* ── Paragraphs ── */
.blog-content p {
  margin: 0 0 14px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;        /* preserves intentional newlines, still wraps */
}

/* ── Headings ── */
.blog-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 28px 0 12px;
  line-height: 1.25;
}
.blog-content h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 24px 0 10px;
  line-height: 1.3;
}
.blog-content h3 {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 20px 0 8px;
  line-height: 1.35;
}
.blog-content h4 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 16px 0 6px;
  line-height: 1.4;
}

/* ── Lists ── */
.blog-content ul {
  list-style: disc !important;
  padding-left: 28px !important;
  margin: 10px 0 14px !important;
}
.blog-content ol {
  list-style: decimal !important;
  padding-left: 28px !important;
  margin: 10px 0 14px !important;
}
.blog-content li {
  margin: 5px 0;
  display: list-item !important;  /* override any reset that sets display:block */
}
/* Tiptap wraps li content in <p> — strip the extra margin */
.blog-content li > p {
  margin: 0;
}

/* ── Blockquote ── */
.blog-content blockquote {
  border-left: 4px solid #94a3b8;
  margin: 20px 0;
  padding: 10px 18px;
  color: #475569;
  font-style: italic;
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
}
.blog-content blockquote p {
  margin: 0;
}

/* ── Pull quote ── */
.blog-content aside[data-pull-quote] {
  border-left: 4px solid #0969da !important;
  padding: 16px 24px !important;
  margin: 24px 0 !important;
  font-size: 1.25rem !important;
  font-style: italic !important;
  color: #0969da !important;
  background: #f0f7ff !important;
  border-radius: 0 8px 8px 0 !important;
  display: block;
}

/* ── Inline code ── */
.blog-content code {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1px 6px;
  font-family: 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
  font-size: 0.875em;
  word-break: break-word;
}

/* ── Code block ── */
.blog-content pre {
  background: #1e293b;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 16px 0;
  overflow-x: auto;
  white-space: pre-wrap;       /* wrap long lines — fixes the Lorem Ipsum overflow */
  word-break: break-word;
  overflow-wrap: break-word;
}
.blog-content pre code {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.9em;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── Horizontal rule ── */
.blog-content hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 28px 0;
}

/* ── Highlight ── */
.blog-content mark {
  border-radius: 3px;
  padding: 0 3px;
}

/* ── Strikethrough ── */
.blog-content s,
.blog-content del {
  text-decoration: line-through;
  color: #94a3b8;
}

/* ── Links ── */
.blog-content a,
.blog-content .tiptap-link {
  color: #2563eb;
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;
}
.blog-content a:hover {
  color: #1d4ed8;
}

/* ── Images ── */
.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  display: block;
  margin: 12px auto;
}
/* Desktop: content images 70% wide, centred.
   :not() excludes images inside embed containers. */
@media (min-width: 769px) {
  .blog-content img:not(div[data-embed] img):not(div[data-embed] * img) {
    width: 70% !important;
    margin-left: auto;
    margin-right: auto;
  }
}
.blog-content figure {
  margin: 16px 0;
  max-width: 100%;
}
.blog-content figcaption {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin-top: 6px;
  font-style: italic;
}

/* ── Embeds ── */
.blog-content div[data-embed] {
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
/* iframes always fill embed container */
.blog-content div[data-embed] iframe {
  display: block;
  width: 100% !important;
  max-width: 100% !important;
}
/* images inside embeds (icons etc.) are never constrained by the rule above */
.blog-content div[data-embed] img {
  width: auto !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* ── Syntax highlighting (One Dark) ── */
.blog-content .hljs-keyword  { color: #c678dd; }
.blog-content .hljs-string   { color: #98c379; }
.blog-content .hljs-number   { color: #d19a66; }
.blog-content .hljs-comment  { color: #5c6370; font-style: italic; }
.blog-content .hljs-function { color: #61afef; }
.blog-content .hljs-variable { color: #e06c75; }
.blog-content .hljs-attr     { color: #e06c75; }
.blog-content .hljs-tag      { color: #e06c75; }
.blog-content .hljs-built_in { color: #e5c07b; }
.blog-content .hljs-type     { color: #e5c07b; }
.blog-content .hljs-title    { color: #61afef; }
.blog-content .hljs-params   { color: #abb2bf; }

/* ── Bold / Italic / Underline ── */
.blog-content strong { font-weight: 700; }
.blog-content em     { font-style: italic; }
.blog-content u      { text-decoration: underline; }
`;