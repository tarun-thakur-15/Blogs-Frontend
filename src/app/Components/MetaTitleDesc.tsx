"use client";
import { useState } from "react";

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    metaTitle: string | null;
    metaDescription: string | null;
    useDefault: boolean;
  }) => void;
}

export default function MetaModal({ isOpen, onClose, onSubmit }: MetaModalProps) {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [useDefault, setUseDefault] = useState(false);

  if (!isOpen) return null;

  const isDisabled = useDefault;
  const isSubmitDisabled = !useDefault && (!metaTitle.trim() || !metaDescription.trim());

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    onSubmit({
      metaTitle: useDefault ? null : metaTitle,
      metaDescription: useDefault ? null : metaDescription,
      useDefault,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">SEO Meta Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a Meta Title and Meta Description to improve how your page appears in search engines like Google.
          </p>
        </div>

        {/* Preview */}
        <div className="mb-4 rounded-lg border p-3 bg-gray-50">
          <p className="text-blue-600 text-sm truncate">
            {metaTitle || "Your page title will appear here"}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {metaDescription || "Your meta description will appear here"}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              disabled={isDisabled}
              placeholder="Enter meta title (50-60 characters recommended)"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              disabled={isDisabled}
              placeholder="Enter meta description (150-160 characters recommended)"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
              rows={3}
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={(e) => setUseDefault(e.target.checked)}
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">
              Use default meta title & description
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-4 py-2 text-sm rounded-lg bg-black text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
