/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DropdownMenu from "../Common/DropDownMenu";
import { deleteProtocol, deleteThread } from "@/lib/api";
import VoteButton from "../VoteButton/VoteButton";
import { API_URL } from "@/lib/api";
import ItemModal from "../Modal/ItemModal";

type ItemCardProps = {
  initialItemData: any;
  // onRefresh?: () => void;
  onDelete?: (id: number) => void;
  isProtocolPage?: boolean;
};

export default function ItemCard({
  initialItemData,
  // onRefresh,
  onDelete,
  isProtocolPage = true,
}: ItemCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "review">("edit");
  const [modalItemId, setModalItemId] = useState<number | null>(null);
  const [itemData, setItemData] = useState(initialItemData);
  const [loadingItemData, setLoadingItemData] = useState(false);

  const openModal = (mode: "edit" | "review", id?: number) => {
    setModalMode(mode);
    setModalItemId(id ?? null);
    setModalOpen(true);
  };

  const fetchItemData = async () => {
    setLoadingItemData(true);

    try {
      const endpoint = isProtocolPage
        ? `${API_URL}/protocols/${itemData.id}`
        : `${API_URL}/threads/${itemData.id}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      setItemData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItemData(false);
    }
  };
  const defaultDelete = async (id: number) => {
    const confirmMessage = isProtocolPage
      ? "Are you sure you want to delete this protocol?"
      : "Are you sure you want to delete this thread?";

    if (!confirm(confirmMessage)) return;

    try {
      if (isProtocolPage) {
        await deleteProtocol(id);
      } else {
        await deleteThread(id);
      }

      router.push(isProtocolPage ? "/" : "/threads");
    } catch (err: any) {
      console.error(err);
      alert(
        err.message ||
          `Failed to delete ${isProtocolPage ? "protocol" : "thread"}`,
      );
    }
  };

  const handleDelete = onDelete || defaultDelete;

  const menuItems = [
    {
      label: "Edit",
      onClick: () => openModal("edit", itemData.id),
      colorClass: "text-blue-600",
      roundedTop: true,
    },
    {
      label: "Delete",
      onClick: () => handleDelete(itemData.id),
      colorClass: "text-red-600",
      roundedBottom: !isProtocolPage,
    },
    ...(isProtocolPage
      ? [
          {
            label: "Add Review",
            onClick: () => openModal("review", itemData.id),
            colorClass: "text-green-600",
            roundedBottom: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg transition relative bg-white flex flex-col justify-between">
        <div>
          <Link
            href={
              isProtocolPage
                ? `/protocols/${itemData.id}`
                : `/threads/${itemData.id}`
            }
          >
            <h2 className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600">
              {itemData.title}
            </h2>
          </Link>

          <p className="mt-2 text-gray-600 text-sm line-clamp-3">
            {isProtocolPage ? itemData.content : itemData.body}
          </p>
          <p className="text-gray-400 text-xs">Author: {itemData.author}</p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {isProtocolPage ? (
            <>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span>⭐ {itemData.average_rating || 0}</span>
                <span>📝 {itemData.review_count || 0} reviews</span>
              </div>
            </>
          ) : (
            itemData.protocol_title && (
              <p className="text-gray-400 text-xs">
                Protocol: {itemData.protocol_title}
              </p>
            )
          )}
          <div className="flex flex-wrap gap-2">
            {isProtocolPage &&
              itemData.tags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            {!isProtocolPage && (
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <VoteButton
                  initialUserVote={itemData.user_vote}
                  votableId={itemData.id}
                  votableType="thread"
                  initialVoteScore={itemData.total_votes}
                />
                <span>💬 {itemData.comment_count}</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu items={menuItems} />
        </div>
      </div>

      {modalOpen && (
        <ItemModal
          isOpen={modalOpen}
          mode={modalMode}
          itemId={modalItemId ?? undefined}
          onClose={() => setModalOpen(false)}
          onRefresh={fetchItemData}
          isProtocolPage={isProtocolPage}
        />
      )}
    </>
  );
}
