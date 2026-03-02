/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback } from "react";
import { Protocol } from "@/types/protocol";
import {
  fetchProtocols,
  deleteProtocol,
  fetchThreads,
  deleteThread,
} from "@/lib/api";
import ItemGrid from "./ItemGrid";
import LoadMore from "./LoadMore";
import Toolbar from "./Toolbar";

type Props = {
  initialData: Protocol[];
  perPage: number;
  isProtocolPage?: boolean;
};

export default function ItemList({
  initialData,
  perPage,
  isProtocolPage = true,
}: Props) {
  const [itemData, setItemData] = useState<Protocol[]>(initialData);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({ firstPage: false, more: false });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadItemData = useCallback(
    async (opts?: {
      append?: boolean;
      pageNum?: number;
      queryVal?: string;
      sortVal?: string;
    }) => {
      const {
        append = false,
        pageNum = page,
        queryVal = query,
        sortVal = sort,
      } = opts || {};

      setError(null);
      setLoading((prev) => ({
        ...prev,
        [append ? "more" : "firstPage"]: true,
      }));

      try {
        if (isProtocolPage) {
          // Fetch protocols
          const { protocols: newProtocols, hasMore: moreAvailable } =
            await fetchProtocols({
              query: queryVal,
              sort: sortVal,
              page: pageNum,
              perPage: perPage,
            });

          setItemData((prev) =>
            append ? [...prev, ...newProtocols] : newProtocols,
          );
          setPage(pageNum);
          setHasMore(moreAvailable);
        } else {
          // Fetch threads
          const { threads: newThreads, hasMore: moreAvailable } =
            await fetchThreads({
              search: queryVal || "*",
              sort: sortVal || "created_at:desc",
              page: pageNum,
              perPage: perPage,
            });

          setItemData((prev) =>
            append ? [...prev, ...newThreads] : newThreads,
          );
          setPage(pageNum);
          setHasMore(moreAvailable);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading((prev) => ({
          ...prev,
          [append ? "more" : "firstPage"]: false,
        }));
      }
    },
    [page, query, sort, isProtocolPage, perPage],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        loadItemData({ append: false, pageNum: 1, queryVal: val });
      }, 300);
    },
    [loadItemData],
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSort(val);
      loadItemData({ append: false, pageNum: 1, sortVal: val });
    },
    [loadItemData],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading.more) return;
    loadItemData({ append: true, pageNum: page + 1 });
  }, [loadItemData, hasMore, page, loading.more]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (
        !confirm(
          `Are you sure you want to delete this ${isProtocolPage ? "protocol" : "thread"}?`,
        )
      )
        return;

      setError(null);

      try {
        if (isProtocolPage) {
          await deleteProtocol(id);
        } else {
          await deleteThread(id);
        }

        setItemData((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        console.error(err);
        setError(
          err.message ||
            `Failed to delete the ${isProtocolPage ? "protocol" : "thread"}.`,
        );
      }
    },
    [isProtocolPage],
  );

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
        {isProtocolPage ? "Protocols" : "Threads"}
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <Toolbar
        query={query}
        sort={sort}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        loadItemData={() => loadItemData({ append: false, pageNum: 1 })}
        isProtocolPage={isProtocolPage}
      />

      <ItemGrid
        itemData={itemData}
        loading={loading.firstPage}
        onDelete={handleDelete}
        isProtocolPage={isProtocolPage}
      />

      {hasMore && !loading.firstPage && (
        <LoadMore onClick={handleLoadMore} loading={loading.more} />
      )}
    </main>
  );
}
