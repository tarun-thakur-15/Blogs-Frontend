import React, {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import { Button, notification } from "antd";

interface TiptapEditorProps {
  setEditorContent?: Dispatch<SetStateAction<string>>;
  draftContent?: string;
  initialContent?: string;
  maxLength?: any;
  onContentChange?: (content: string) => void;
}

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

  const notifyError = (message: string, description: string) => {
    notification.error({
      message,
      description,
      placement: "topRight",
    });
  };

  const CustomImage = Image.extend({
    addNodeView() {
      return ({ node, getPos, editor }) => {
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.display = "inline-block";

        const img = document.createElement("img");
        img.setAttribute("src", node.attrs.src);
        img.style.maxWidth = "700px";
        img.style.width = "100%";

        const button = document.createElement("button");
        button.innerText = "Remove";
        button.style.position = "absolute";
        button.style.top = "5px";
        button.style.right = "5px";
        button.style.background = "red";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "5px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "3px";
        button.style.opacity = "0"; // Initially hidden
        button.style.transition = "opacity 0.3s ease"; // Smooth transition

        button.addEventListener("click", () => {
          if (typeof getPos === "function") {
            const pos = getPos();
            editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize });
          }
        });

        // Show button on hover
        container.addEventListener("mouseenter", () => {
          button.style.opacity = "1"; // Fully visible
        });

        container.addEventListener("mouseleave", () => {
          button.style.opacity = "0"; // Hidden again
        });

        container.appendChild(img);
        container.appendChild(button);

        return {
          dom: container,
          update: (updatedNode: any) =>
            updatedNode.type.name === node.type.name,
        };
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          className: "positionRelative",
          style: "max-width: 700px; width: 100%; position: relative;",
        },
      }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "underline text-gray-700 font-bold",
        },
      }),
      Bold,
      Italic,
      Underline,
      Placeholder.configure({
        placeholder: ({ editor }) =>
          editor.isEmpty ? "Type your content here" : "",
        emptyEditorClass: "custom-placeholder",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      if (setEditorContent) setEditorContent(htmlContent);
      if (onContentChange) onContentChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class: "prose focus:outline-none",
      },
    },
  });
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);
  // ----use effect to set the draft blog content in tiptap editor if it is available-----
  useEffect(() => {
    if (editor) {
      if (draftContent) {
        editor.commands.setContent(draftContent);
      } else if (initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [draftContent, initialContent, editor]);

  const handleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const handleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const handleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedExtensions.includes(file.type)) {
      notifyError("Invalid File Type", "Only JPG and PNG images are allowed.");
      return;
    }

    if (file.size > maxImageSize) {
      notifyError("Image Too Large", "Each image must be less than 500 KB.");
      return;
    }

    if (imageCount >= maxImages) {
      notifyError(
        "Image Limit Exceeded",
        "You can only upload up to 3 images."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      editor
        ?.chain()
        .focus()
        .insertContentAt(editor.state.selection.to, {
          type: "image",
          attrs: { src: base64Image },
        })
        .run();

      setImageCount((prevCount) => prevCount + 1);
    };

    reader.readAsDataURL(file);
  };

  const openFileUploader = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div className="tiptap-editor">
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            borderTop: "solid 1px #EAEEF2",
          }}
        >
          <div style={{ marginTop: "-8px" }}>
            <Button
              onClick={handleBold}
              style={{
                borderRadius: "10px 0px 0px 10px",
                marginTop: "-18px",
                display: "inline-block",
              }}
            >
              <span style={{ fontWeight: "bold" }}>B</span>
            </Button>
            <Button
              onClick={handleItalic}
              style={{
                marginTop: "-18px",
                display: "inline-block",
              }}
            >
              <span style={{ fontStyle: "italic" }}>I</span>
            </Button>
            <Button
              onClick={handleUnderline}
              style={{
                marginTop: "-18px",
                display: "inline-block",
              }}
            >
              <span style={{ textDecoration: "underline" }}>U</span>
            </Button>
            <Button
              onClick={openFileUploader}
              style={{
                borderRadius: "0px 10px 10px 0px",
                marginTop: "-18px",
                display: "inline-block",
              }}
            >
              📷
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div>
          <EditorContent
            editor={editor}
            className="tiptapeditor-hover-border"
          />
        </div>
      </div>
    </>
  );
};

export default TiptapEditor;
