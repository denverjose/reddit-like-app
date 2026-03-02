"use client";
import { useState } from "react";
import ItemModal from "../Modal/ItemModal";

type Props = {
  query: string;
  sort: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loadItemData: () => void;
  isProtocolPage: boolean;
  isForDetail?: boolean;
};

export default function Toolbar({
  query,
  sort,
  onSearchChange,
  onSortChange,
  loadItemData,
  isProtocolPage,
  isForDetail = false,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const sortOptions = isProtocolPage
    ? [
        { value: "recent", label: "Most Recent" },
        { value: "most_reviewed", label: "Most Reviewed" },
        { value: "top_rated", label: "Top Rated" },
      ]
    : [
        { value: "recent", label: "Newest" },
        { value: "top_voted", label: "Most Upvoted" },
      ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={onSearchChange}
          placeholder={
            isProtocolPage ? "Search protocols..." : "Search threads..."
          }
          className="border border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={sort}
          onChange={onSortChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {isProtocolPage && (
          <button
            onClick={() => setModalOpen(true)}
            className="h-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            + Create Protocol
          </button>
        )}
        {isForDetail && (
          <button
            onClick={() => setModalOpen(true)}
            className="h-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            + Create Protocol
          </button>
        )}
      </div>

      {modalOpen && (
        <ItemModal
          isOpen={modalOpen}
          mode={"create"}
          onClose={() => setModalOpen(false)}
          onRefresh={loadItemData}
          isProtocolPage={isProtocolPage}
        />
      )}
    </>
  );
}
