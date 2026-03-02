/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/ReviewsList/ReviewLists.tsx
"use client";

import { deleteReview } from "@/lib/api";
import DropdownMenu from "../Common/DropDownMenu";
import ItemModal from "../Modal/ItemModal";

import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:8000/api";

export type Review = {
  id: number;
  author: string;
  rating: number;
  feedback?: string;
};

type Props = {
  initialReviews: any[];
  protocolId: number;
};

export default function ReviewsList({ protocolId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews.data);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"review" | "editReview">("review");
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const perPage = 2;

  const fetchReviews = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/protocols/${protocolId}/reviews?page=${pageNum}&per_page=${perPage}`,
        );
        const data = await res.json();
        setReviews(data.data);
        setPage(data.current_page);
        setTotalPages(data.last_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [protocolId],
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      fetchReviews(page);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (mode: "editReview", review?: Review) => {
    setModalMode(mode);
    setEditingReview(review ?? null);
    setModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchReviews(newPage);
  };

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reviews</h2>
      </div>

      {reviews.length === 0 && !loading ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const menuItems: any[] = [
              {
                label: "Edit",
                onClick: () => openModal("editReview", r),
                colorClass: "text-blue-600",
                roundedTop: true,
              },
              {
                label: "Delete",
                onClick: () => handleDelete(r.id),
                colorClass: "text-red-600",
                roundedBottom: true,
              },
            ];

            return (
              <div
                key={r.id}
                className="relative border p-3 rounded-xl bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{r.author}</p>
                  <p>⭐ {r.rating}</p>
                  <p className="text-gray-600">{r.feedback}</p>
                </div>
                <DropdownMenu items={menuItems} />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Centralized ItemModal */}
      <ItemModal
        isOpen={modalOpen}
        mode={modalMode}
        itemId={protocolId}
        review={editingReview ?? undefined}
        onClose={() => setModalOpen(false)}
        onRefresh={() => fetchReviews(page)}
        isProtocolPage={true}
      />
    </section>
  );
}
