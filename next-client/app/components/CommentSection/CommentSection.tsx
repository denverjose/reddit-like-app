/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect } from "react";
import VoteButton from "../VoteButton/VoteButton";
import DropdownMenu from "../Common/DropDownMenu";

interface CommentSectionProps {
  threadId: number;
}

interface Comment {
  id: number;
  author: string;
  body: string;
  total_votes?: number;
  user_vote?: number;
  replies_count: number;
}

const API_URL = "http://localhost:8000/api";

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export default function CommentSection({ threadId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState("");

  const loadComments = async (pageNum = 1, append = false) => {
    setLoading(true);
    const data = await fetchJSON(
      `${API_URL}/threads/${threadId}/comments?page=${pageNum}&per_page=5`,
    );
    setComments((prev) => (append ? [...prev, ...data.data] : data.data));
    setHasMore(data.current_page < data.last_page);
    setPage(pageNum);
    setLoading(false);
  };

  useEffect(() => {
    loadComments(1);
  }, [threadId]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    const data = await fetchJSON(`${API_URL}/threads/${threadId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newComment, author: "test-author" }),
    });
    setComments((prev) => [data.comment, ...prev]);
    setNewComment("");
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {/* New comment input */}
      <div className="flex flex-col gap-2 mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={addComment}
          className="self-end bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Post Comment
        </button>
      </div>

      {loading && comments.length === 0 ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              threadId={threadId}
              onDelete={(id) =>
                setComments((prev) => prev.filter((c) => c.id !== id))
              }
            />
          ))}

          {hasMore && (
            <button
              onClick={() => loadComments(page + 1, true)}
              className="text-blue-600 hover:underline mt-2"
            >
              Load more comments
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function CommentCard({
  comment,
  threadId,
  onDelete,
  level = 0,
}: {
  comment: Comment;
  threadId: number;
  onDelete: (id: number) => void;
  level?: number;
}) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [repliesPage, setRepliesPage] = useState(1);
  const [repliesHasMore, setRepliesHasMore] = useState(
    comment.replies_count > 0,
  );
  const [loadingReplies, setLoadingReplies] = useState(false);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [editAuthor, setEditAuthor] = useState(comment.author);

  const menuItems = [
    {
      label: "Edit",
      onClick: () => setEditing(true),
      colorClass: "text-blue-600",
      roundedTop: true,
    },
    {
      label: "Delete",
      onClick: () => handleDelete(),
      colorClass: "text-red-600",
      roundedBottom: true,
    },
  ];

  const fetchReplies = async () => {
    setLoadingReplies(true);
    const data = await fetchJSON(
      `${API_URL}/comments/${comment.id}/replies?page=${repliesPage}&per_page=5`,
    );
    setReplies((prev) => [...prev, ...data.data]);
    setRepliesPage((prev) => prev + 1);
    setRepliesHasMore(data.current_page < data.last_page);
    setLoadingReplies(false);
  };

  const addReply = async () => {
    if (!replyText.trim()) return;
    const data = await fetchJSON(`${API_URL}/comments/${comment.id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyText, author: "test-author" }),
    });
    setReplies((prev) => [...prev, data.reply]);
    setReplyText("");
    setReplyOpen(false);
  };

  const handleEdit = async () => {
    await fetchJSON(`${API_URL}/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editBody, author: editAuthor }),
    });
    setEditing(false);
    comment.body = editBody;
    comment.author = editAuthor;
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    await fetchJSON(`${API_URL}/comments/${comment.id}`, { method: "DELETE" });
    onDelete(comment.id);
  };

  return (
    <div className="relative" style={{ paddingLeft: level * 24 }}>
      <div className="bg-white p-3 rounded-xl shadow space-y-2">
        {editing ? (
          <>
            <input
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="border p-1 rounded w-full"
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="border p-1 rounded w-full"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.body}</p>
              </div>

              {/* Dropdown for Edit/Delete */}
              <DropdownMenu items={menuItems} />
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-4 text-sm mt-2">
              <VoteButton
                initialUserVote={comment.user_vote}
                votableId={comment.id}
                votableType="comment"
                initialVoteScore={comment.total_votes}
              />
              <button
                onClick={() => setReplyOpen(!replyOpen)}
                className="text-green-600 hover:underline"
              >
                Reply
              </button>
            </div>

            {/* Reply input */}
            {replyOpen && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="border p-1 rounded flex-1 text-sm"
                />
                <button
                  onClick={addReply}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Post
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nested replies */}
      {replies.map((reply) => (
        <CommentCard
          key={reply.id}
          comment={reply}
          level={level + 1}
          threadId={threadId}
          onDelete={(id) =>
            setReplies((prev) => prev.filter((r) => r.id !== id))
          }
        />
      ))}

      {repliesHasMore && (
        <button
          onClick={fetchReplies}
          className="text-blue-600 hover:underline mt-1 text-sm"
          disabled={loadingReplies}
        >
          {loadingReplies ? "Loading..." : "Load more replies"}
        </button>
      )}
    </div>
  );
}
