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

  const [protocolResult, threadsResult, reviewsResult] =
    await Promise.allSettled([
      getProtocol(Number(id)),
      getThreads(Number(id)),
      getReviews(Number(id)),
    ]);

  if (protocolResult.status === "rejected") {
    console.error("Failed to fetch protocol:", protocolResult.reason);
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>Failed to load protocol details.</p>
      </div>
    );
  }

  if (
    threadsResult.status === "rejected" ||
    reviewsResult.status === "rejected"
  ) {
    console.error("Failed to fetch threads or reviews:", {
      threadsError:
        threadsResult.status === "rejected" ? threadsResult.reason : null,
      reviewsError:
        reviewsResult.status === "rejected" ? reviewsResult.reason : null,
    });
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>Failed to load threads or reviews.</p>
      </div>
    );
  }

  const protocol = protocolResult.value;
  const initialThreads = threadsResult.value;
  const initialReviews = reviewsResult.value;

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <ItemCard initialItemData={protocol} />
      <ThreadSection protocolId={Number(id)} initialThreads={initialThreads} />
      <ReviewsList protocolId={Number(id)} initialReviews={initialReviews} />
    </main>
  );
}
