// app/threads/[id]/page.tsx
import ItemCard from "@/app/components/Layout/ItemCard";
import ThreadSection from "@/app/components/Thread/ThreadSection";
import ReviewsList from "@/app/components/ReviewsList/ReviewLists";
import { getProtocol, getThreads, getReviews } from "@/lib/api";

export default async function ProtocolDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const protocol = await getProtocol(Number(id));
  const initialThreads = await getThreads(Number(id));
  const initialReviews = await getReviews(Number(id));

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <ItemCard initialItemData={protocol} />
      <ThreadSection protocolId={Number(id)} initialThreads={initialThreads} />
      <ReviewsList
        protocolId={Number(id)}
        initialReviews={initialReviews} // pass server-fetched reviews
      />
    </main>
  );
}
