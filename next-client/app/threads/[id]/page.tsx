"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import CommentCard from "@/app/components/CommentsList/CommentCard";
import CommentSection from "@/app/components/CommentSection/CommentSection";
import VoteButton from "@/app/components/VoteButton/VoteButton";

const API_URL = "http://localhost:8000/api";

type Thread = {
  id: number;
  title: string;
  body: string;
  author: string;
  total_votes: number;
  comments_count: number;
  created_at: string;
  user_vote: number;
};

type Comment = {
  id: number;
  body: string;
  author: string;
  created_at: string;
};

export default function ThreadDetailPage() {
  const params = useParams();
  const threadId = params.id;

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingThread, setLoadingThread] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  const [newCommentBody, setNewCommentBody] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  /* ------------------------- */
  /* FETCH THREAD              */
  /* ------------------------- */
  const fetchThread = async () => {
    setLoadingThread(true);
    try {
      const res = await fetch(`${API_URL}/threads/${threadId}`);
      const data = await res.json();
      setThread(data);
      console.log("thread");
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThread(false);
    }
  };

  /* ------------------------- */
  /* FETCH COMMENTS            */
  /* ------------------------- */
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`${API_URL}/threads/${threadId}/comments`);
      const data = await res.json();
      console.log("comments data");
      console.log(data);

      setComments(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  /* ------------------------- */
  /* POST COMMENT              */
  /* ------------------------- */
  // const handlePostComment = async () => {
  //   if (!newCommentBody || !newCommentAuthor) {
  //     alert("All fields are required");
  //     return;
  //   }

  //   setPostingComment(true);

  //   try {
  //     const res = await fetch(`${API_URL}/threads/${threadId}/comments`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         body: newCommentBody,
  //         author: newCommentAuthor,
  //       }),
  //     });

  //     if (res.ok) {
  //       const created = await res.json();

  //       // optimistic update
  //       setComments((prev) => [created, ...prev]);

  //       setNewCommentBody("");
  //       setNewCommentAuthor("");

  //       // refresh thread count
  //       fetchThread();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setPostingComment(false);
  //   }
  // };

  useEffect(() => {
    if (!threadId) return;
    fetchThread();
    fetchComments();
  }, [threadId]);

  if (loadingThread) return <p className="p-8">Loading thread...</p>;
  if (!thread) return <p className="p-8 text-red-500">Thread not found</p>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      {/* Thread Info */}
      <div className="border p-6 rounded-lg bg-white shadow-sm mb-8">
        <h1 className="text-2xl font-bold mb-3">{thread.title}</h1>

        <p className="text-gray-700 mb-4 whitespace-pre-line">{thread.body}</p>

        <span>Author: {thread.author}</span>
        <div className="flex justify-between text-sm text-gray-500">
          <VoteButton
            initialUserVote={thread.user_vote}
            votableId={thread.id}
            votableType="thread"
            initialVoteScore={thread.total_votes}
          />
          <span>💬 {thread.comments_count}</span>
        </div>
      </div>

      {/* Post Comment */}
      {/* <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Add a Comment</h2>

        <input
          type="text"
          placeholder="Your name"
          value={newCommentAuthor}
          onChange={(e) => setNewCommentAuthor(e.target.value)}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Write your comment..."
          value={newCommentBody}
          onChange={(e) => setNewCommentBody(e.target.value)}
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handlePostComment}
          disabled={postingComment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {postingComment ? "Posting..." : "Post Comment"}
        </button>
      </section> */}

      {/* Comments List */}
      <CommentSection threadId={thread.id} />
      {/* <section>
        <h2 className="text-lg font-semibold mb-4">
          Comments ({thread.comments_count})
        </h2>

        {loadingComments ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} level={0} />
            ))}
          </div>
        )}
      </section> */}
    </main>
  );
}
