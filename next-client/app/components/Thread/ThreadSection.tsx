/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import ItemCard from "../Layout/ItemCard";
import ItemModal from "../Modal/ItemModal";
import { deleteThread, getThreads } from "@/lib/api";

type Props = {
  protocolId: number;
  initialThreads: {
    data: any[];
    current_page: number;
    last_page: number;
  };
};

export default function ThreadSection({ protocolId, initialThreads }: Props) {
  const [threads, setThreads] = useState(initialThreads.data);
  
  const [page, setPage] = useState(initialThreads.current_page);
  const [hasMore, setHasMore] = useState(
    initialThreads.current_page < initialThreads.last_page,
  );
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // --- Fetch threads (replace or append) ---
  const fetchThreads = useCallback(
    async (pageToFetch = 1, append = false) => {
      setLoading(true);
      try {
        const data = await getThreads(protocolId, pageToFetch);
        setThreads((prev) => (append ? [...prev, ...data.data] : data.data));
        setPage(data.current_page);
        setHasMore(data.current_page < data.last_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [protocolId],
  );

  // --- Pagination: load more ---
  const fetchMoreThreads = () => fetchThreads(page + 1, true);

  // --- Delete thread (refresh first page after delete) ---
  const handleDelete = async (threadId: number) => {
    if (!confirm("Are you sure you want to delete this thread?")) return;

    setLoading(true);
    try {
      await deleteThread(threadId);
      // Always fetch first page after deletion
      const data = await getThreads(protocolId, 1);
      setThreads(data.data);
      setPage(data.current_page);
      setHasMore(data.current_page < data.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Threads</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        >
          + New Thread
        </button>
      </div>

      <ItemModal
        isOpen={modalOpen}
        itemId={protocolId}
        onClose={() => setModalOpen(false)}
        onRefresh={() => fetchThreads(1, false)} // full refresh on add
        mode="create"
        isProtocolPage={false}
      />

      {threads.map((t,i) => (
        <ItemCard
          key={i}
          initialItemData={t}
          onDelete={handleDelete}
          isProtocolPage={false}
        />
      ))}

      {hasMore && (
        <button
          onClick={fetchMoreThreads}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </section>
  );
}
