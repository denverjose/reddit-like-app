"use client";
import { useState } from "react";

interface VoteButtonProps {
  votableId: number;
  votableType: "thread" | "comment";
  initialVoteScore?: number;
  initialUserVote?: 1 | -1 | 0;
}

export default function VoteButton({
  votableId,
  votableType,
  initialVoteScore = 0,
  initialUserVote = 0,
}: VoteButtonProps) {
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(initialUserVote);
  const [loading, setLoading] = useState(false);

  const handleVote = async (vote: 1 | -1) => {
    if (loading) return;

    const newVote = userVote === vote ? 0 : vote; // toggle if same vote
    setVoteScore((prev) => prev - userVote + newVote);
    setUserVote(newVote);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votable_id: votableId,
          votable_type: votableType,
          author: "test-author",
          vote: newVote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoteScore(data.total_votes);
        setUserVote(data.user_vote); // server-confirmed vote
      } else {
        console.error("Vote error:", data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-gray-600 select-none">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`transition-transform duration-150 hover:scale-110 ${
          userVote === 1
            ? "text-green-500 font-bold"
            : "text-gray-400 hover:text-green-400"
        }`}
        title="Upvote"
      >
        ▲
      </button>

      <span className="min-w-[2ch] text-center font-medium">{voteScore}</span>

      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`transition-transform duration-150 hover:scale-110 ${
          userVote === -1
            ? "text-red-500 font-bold"
            : "text-gray-400 hover:text-red-400"
        }`}
        title="Downvote"
      >
        ▼
      </button>
    </div>
  );
}