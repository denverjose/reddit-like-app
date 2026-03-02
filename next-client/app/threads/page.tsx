// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import VoteButton from "../components/VoteButton/VoteButton";

// export default function ThreadsPage() {
//   const [threads, setThreads] = useState<any[]>([]);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("created_at:desc");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

//   const [editingThread, setEditingThread] = useState<any | null>(null);
//   const [editedTitle, setEditedTitle] = useState("");
//   const [editedAuthor, setEditedAuthor] = useState("");
//   const [editedBody, setEditedBody] = useState("");

//   const perPage = 12;

//   const fetchThreads = async () => {
//     const params = new URLSearchParams({
//       search,
//       sort,
//       per_page: perPage.toString(),
//       page: page.toString(),
//     });

//     const res = await fetch(`http://localhost:8000/api/threads?${params}`);

//     const data = await res.json();
//     console.log(data)
//     setThreads(data.hits || []);
//     setTotalPages(Math.ceil((data.found || 0) / perPage));
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setPage(1);
//       fetchThreads();
//     }, 300);
//     return () => clearTimeout(timeout);
//   }, [search, sort]);

//   useEffect(() => {
//     fetchThreads();
//   }, [page]);

//   const openEditModal = (thread: any) => {
//     setEditingThread(thread);
//     setEditedTitle(thread.document.title);
//     setEditedAuthor(thread.document.title);

//     setEditedBody(thread.document.body);
//   };

//   // -----------------------
//   // UPDATE THREAD
//   // -----------------------
//   const handleSave = async () => {
//     if (!editingThread) return;
//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/threads/${editingThread.document.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: editedTitle,
//             author: editedAuthor,
//             body: editedBody,
//           }),
//         },
//       );

//       const data = await res.json();
//       console.log("Thread updated:", data);

//       // Update threads state locally
//       setThreads((prev) =>
//         prev.map((t) =>
//           t.document.id === editingThread.document.id
//             ? { ...t, document: data.thread }
//             : t,
//         ),
//       );

//       setEditingThread(null);
//     } catch (err) {
//       console.error("Failed to update thread:", err);
//     }
//   };

//   // -----------------------
//   // DELETE THREAD
//   // -----------------------
//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this thread?")) return;

//     try {
//       const res = await fetch(`http://localhost:8000/api/threads/${id}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();
//       console.log("Thread deleted:", data);

//       // Remove thread from local state
//       setThreads((prev) => prev.filter((t) => t.document.id !== id));
//     } catch (err) {
//       console.error("Failed to delete thread:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       {/* Search Input */}
//       <input
//         placeholder="Search threads by title, body, or tags"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border p-2 rounded w-full"
//       />

//       {/* Filters */}
//       <div className="flex gap-4">
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="created_at:desc">Newest</option>
//           <option value="total_votes:desc">Most Upvoted</option>
//         </select>
//       </div>

//       {/* Threads List */}
//       <div className="space-y-3">
//         {threads.length === 0 && (
//           <div className="text-gray-500">No threads found.</div>
//         )}

//         {threads.map((hit) => {
//           const t = hit.document;
//           return (
//             <div
//               key={t.id}
//               className="border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg transition relative bg-white"
//             >
//               <div className="flex justify-between items-start">
//                 <Link href={`/threads/${t.id}`}>
//                   <h2 className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600">
//                     {t.title}
//                   </h2>
//                 </Link>

//                 {/* 3-dot menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() =>
//                       setMenuOpenId(menuOpenId === t.id ? null : t.id)
//                     }
//                     className="p-1 rounded-full hover:bg-gray-100"
//                   >
//                     <svg
//                       className="w-6 h-6 text-gray-500"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4-4a2 2 0 11-4 0 2 2 0 014 0zm0 8a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                   </button>

//                   {menuOpenId === t.id && (
//                     <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
//                       <button
//                         onClick={() => openEditModal(hit)}
//                         className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(t.id)}
//                         className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <p className="mt-2 text-gray-600 text-sm line-clamp-3">
//                 {t.body}
//               </p>
//               <p className="mt-2 text-gray-600 text-sm line-clamp-3">
//                 Author: {t.author}
//               </p>
//               <p className="mt-2 text-gray-600 text-sm line-clamp-3">
//                 Protocol: {t.protocol_title}
//               </p>
//               <div className="mt-4 flex items-center gap-4">
//                 <VoteButton
//                   initialUserVote={t.user_vote}
//                   votableId={t.id}
//                   votableType="thread"
//                   initialVoteScore={t.total_votes}
//                 />
//                 💬 {t.comment_count}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex gap-2 mt-4">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           <span className="px-3 py-1 border rounded">
//             Page {page} of {totalPages}
//           </span>

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editingThread && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Edit Thread</h2>
//             <input
//               type="text"
//               value={editedTitle}
//               onChange={(e) => setEditedTitle(e.target.value)}
//               placeholder="Title"
//               className="border border-gray-300 p-2 mb-3 w-full rounded"
//             />
//             <input
//               type="text"
//               value={editedAuthor}
//               onChange={(e) => setEditedAuthor(e.target.value)}
//               placeholder="Author"
//               className="border border-gray-300 p-2 mb-3 w-full rounded"
//             />
//             <textarea
//               value={editedBody}
//               onChange={(e) => setEditedBody(e.target.value)}
//               placeholder="Body"
//               className="border border-gray-300 p-2 mb-3 w-full rounded"
//               rows={4}
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={() => setEditingThread(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { fetchThreads } from "@/lib/api";
import ItemList from "../components/Layout/ItemList";

type PageProps = {
  searchParams: {
    search?: string;
    sort?: string;
    page?: number;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const perPage = 10;

  const search = searchParams.search ?? "*";
  const sort = searchParams.sort ?? "created_at:desc";
  const page = Number(searchParams.page ?? 1);

  const { threads } = await fetchThreads({ search, sort, page, perPage });

  return (
    <ItemList initialData={threads} perPage={perPage} isProtocolPage={false} />
  );
}
