"use client";

import { useEffect, useState } from "react";
import { searchProtocols } from "../../lib/api";
import { Protocol } from "../types/protocol";

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const perPage = 10;

  const fetchProtocols = async (
    q = query,
    s = sort,
    pageNum = 1,
    append = false
  ) => {
    setLoading(true);

    const data = await searchProtocols({
      q,
      sort: s,
      page: pageNum,
      perPage,
    });

    const newProtocols = data.hits.map((hit: any) => hit.document);

    setProtocols((prev) =>
      append ? [...prev, ...newProtocols] : newProtocols
    );

    setHasMore(data.found > pageNum * perPage);
    setPage(pageNum);
    setLoading(false);
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  return {
    protocols,
    query,
    sort,
    loading,
    hasMore,
    setQuery,
    setSort,
    fetchProtocols,
    page,
  };
}