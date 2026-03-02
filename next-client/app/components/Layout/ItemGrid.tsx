/* eslint-disable @typescript-eslint/no-explicit-any */
import { Protocol } from "@/types/protocol";
import ItemCard from "./ItemCard";

type Props = {
  itemData: Protocol[];
  loading: boolean;
  onDelete: (id: number) => void;
  isProtocolPage: boolean;
};

export default function ItemGrid({
  itemData,
  loading,
  onDelete,
  isProtocolPage,
}: Props) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (itemData?.length === 0) {
    return (
      <div className="col-span-2 text-center text-gray-500 py-6">
        No {isProtocolPage ? "Protocols" : "Threads"} Found
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {itemData?.map((p) => (
        <ItemCard
          key={p.id}
          initialItemData={p}
          onDelete={() => onDelete(p.id)}
          isProtocolPage={isProtocolPage}
        />
      ))}
    </div>
  );
}
