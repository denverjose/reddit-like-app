"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type ReviewData = {
  id: number;
  author: string;
  rating: number;
  feedback?: string;
};

type ItemModalProps = {
  isOpen: boolean;
  mode: "create" | "edit" | "review" | "editReview";
  itemId?: number; // protocol or thread id
  review?: ReviewData; // for editReview
  onClose: () => void;
  onRefresh?: () => void;
  isProtocolPage?: boolean;
};

export default function ItemModal({
  isOpen,
  mode,
  itemId,
  review,
  onClose,
  onRefresh,
  isProtocolPage,
}: ItemModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [loading, setLoading] = useState(false);

  const resource = isProtocolPage ? "protocols" : "threads";
  const singular = isProtocolPage ? "Protocol" : "Thread";

  // Prefill form on edit or editReview
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && itemId) {
      const fetchItem = async () => {
        try {
          const res = await fetch(`${API_URL}/${resource}/${itemId}`);
          const data = await res.json();
          setTitle(data.title ?? "");
          setAuthor(data.author ?? "");
          setContent(isProtocolPage ? (data.content ?? "") : (data.body ?? ""));
          setTags(Array.isArray(data.tags) ? data.tags : []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchItem();
    }

    if (mode === "editReview" && review) {
      setReviewBody(review.feedback ?? "");
      setReviewRating(review.rating);
      setAuthor(review.author);
    }

    if (mode === "review") {
      setReviewBody("");
      setReviewRating(5);
      setAuthor("");
    }
  }, [isOpen, mode, itemId, review, resource, isProtocolPage]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create protocol/thread
      if (mode === "create") {
        const url = isProtocolPage
          ? `${API_URL}/protocols`
          : `${API_URL}/protocols/${itemId}/threads`;
        const payload = isProtocolPage
          ? { title, author, content, tags }
          : { title, author, body: content };
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // Edit protocol/thread
      else if (mode === "edit" && itemId) {
        await fetch(`${API_URL}/${resource}/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isProtocolPage
              ? { title, author, content, tags }
              : { title, author, body: content },
          ),
        });
      }

      // Add new review
      else if (mode === "review" && itemId && isProtocolPage) {
        await fetch(`${API_URL}/protocols/${itemId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedback: reviewBody,
            rating: reviewRating,
            author: author || "anonymous",
          }),
        });
      }

      // Edit existing review
      else if (mode === "editReview" && review && itemId) {
        await fetch(`${API_URL}/reviews/${review.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: reviewRating,
            feedback: reviewBody,
            author,
          }),
        });
      }

      onClose();
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === "create"
              ? `Create ${singular}`
              : mode === "edit"
                ? `Edit ${singular}`
                : mode === "review"
                  ? "Add Review"
                  : "Edit Review"}
          </h3>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {(mode === "review" || mode === "editReview") && (
            <>
              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Write your review..."
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                rows={5}
              />
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium">Rating:</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-20 border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Author:</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </>
          )}

          {(mode === "create" || mode === "edit") && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Author</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={5}
                />
              </div>
              {isProtocolPage && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <input
                    value={tags.join(", ")}
                    onChange={(e) =>
                      setTags(e.target.value.split(",").map((t) => t.trim()))
                    }
                    placeholder="Tags (comma separated)"
                    className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            {loading
              ? "Processing..."
              : mode === "review"
                ? "Submit"
                : mode === "editReview"
                  ? "Update Review"
                  : mode === "create"
                    ? `Create ${singular}`
                    : `Update ${singular}`}
          </button>
        </div>
      </div>
    </div>
  );
}
