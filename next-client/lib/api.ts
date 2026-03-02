/* eslint-disable @typescript-eslint/no-explicit-any */

export const API_URL = "http://localhost:8000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API Error: ${res.status}`);
  }
  return res.json();
}

// --------------------
// Protocols
// --------------------
export async function fetchProtocols(params: {
  query?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}) {
  const { query = "", sort = "recent", page = 1, perPage = 10 } = params;
  const res = await fetch(
    `${API_URL}/protocols/search?q=${encodeURIComponent(query)}&sort=${sort}&page=${page}&per_page=${perPage}`,
    { cache: "no-store" },
  );

  const data = await handleResponse(res);
  const protocols = data.hits.map((hit: any) => hit.document);
  const hasMore = data.found > page * perPage;

  return { protocols, hasMore };
}

export async function createProtocol(payload: any) {
  const res = await fetch(`${API_URL}/protocols`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateProtocol(id: number, payload: any) {
  const res = await fetch(`${API_URL}/protocols/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteProtocol(id: number) {
  const res = await fetch(`${API_URL}/protocols/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// --------------------
// Threads
// --------------------
// lib/api.ts

export async function fetchThreads(params: {
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}) {
  const {
    search = "*",
    sort = "created_at:desc",
    page = 1,
    perPage = 10,
  } = params;

  const queryParams = new URLSearchParams({
    search,
    sort,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const res = await fetch(`${API_URL}/threads?${queryParams}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API Error: ${res.status}`);
  }

  const data = await res.json();

  const threads = data.hits?.map((hit: any) => hit.document) ?? [];
  const hasMore = (data.found ?? 0) > page * perPage;

  return { threads, hasMore };
}

export async function createThread(payload: any) {
  const res = await fetch(`${API_URL}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateThread(id: number, payload: any) {
  const res = await fetch(`${API_URL}/threads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteThread(id: number) {
  const res = await fetch(`${API_URL}/threads/${id}`, { method: "DELETE" });

  return handleResponse(res);
}

// export async function getProtocol(protocolId: number): Promise<Protocol> {
export async function getProtocol(protocolId: number): Promise<any> {
  const res = await fetch(`${API_URL}/protocols/${protocolId}`);
  if (!res.ok) throw new Error("Protocol not found");

  return handleResponse(res);
}

export async function getThreads(
  protocolId: number,
  page = 1,
  per_page = 2,
  // ): Promise<{ data: Thread[]; current_page: number; last_page: number }> {
): Promise<{ data: any[]; current_page: number; last_page: number }> {
  const res = await fetch(
    `${API_URL}/protocols/${protocolId}/threads?page=${page}&per_page=${per_page}`,
  );
  return handleResponse(res);
}

// --- NEW: fetch reviews ---
export async function getReviews(
  protocolId: number,
  page = 1,
  per_page = 2,
): Promise<{ data: any[]; current_page: number; last_page: number }> {
  const res = await fetch(
    `${API_URL}/protocols/${protocolId}/reviews?page=${page}&per_page=${per_page}`,
  );
  return handleResponse(res);
}

export async function deleteReview(id: number) {
  const res = await fetch(`${API_URL}/reviews/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
