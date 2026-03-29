"use client";
import { Button, Flex } from "antd";
import { useRef, useState, useEffect } from "react";
import EditIcon from "../../../public/images/edit.svg";
import { editABout } from "../services/api";
import { Toaster, toast } from "sonner";

interface AboutTabProps {
  about: string;
}

export default function AboutTab({ about }: AboutTabProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [aboutText, setAboutText] = useState<string>(about || "");
  const [loading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local state if the prop changes.
  useEffect(() => {
    setAboutText(about || "");
  }, [about]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    // Validate length (optional; backend enforces maximum of 300 characters)
    if (aboutText.length > 300) {
      // You can display an error message here if needed.
      return;
    }
    setLoading(true);
    try {
      // Call the API with { about: aboutText } as payload.
      const result = await editABout({ about: aboutText });

      toast.success(result.msg || "About Updated Successfully!");
      // Optionally display a success message here.
      setEditMode(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update About");
      // Optionally display an error message.
    }
    setLoading(false);
  };

  return (
    <Flex vertical className="about-section">
      <Toaster position="top-right" />
      <div className="abouteditAllignment">
        <h4>About</h4>
        <EditIcon className="pointer editIcon" onClick={handleEditClick} />
      </div>
      {editMode ? (
        <>
          <textarea
            ref={textareaRef}
            className="aboutProfile !lg:mb-[16px]"
            name="aboutProfile"
            placeholder="Tell us something about yourself..."
            cols={30}
            rows={8}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
          />
          <div className="flex justify-start gap-2 text-xs mt-1">
            <span
              className={`${
                aboutText.length > 300
                  ? "text-red-500!"
                  : aboutText.length > 260
                    ? "text-yellow-500!"
                    : "text-gray-400!"
              }`}
            >
              {aboutText.length} / 300
            </span>

            {aboutText.length > 300 && (
              <span className="text-red-500!">Limit exceeded</span>
            )}
          </div>

          <Button
            type="primary"
            style={{ width: "100px", marginTop: "20px" }}
            onClick={handleSave}
            disabled={!aboutText || aboutText.length > 300 || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </>
      ) : (
        <div className="about-section--para">
          <p>{aboutText}</p>
        </div>
      )}
    </Flex>
  );
}
