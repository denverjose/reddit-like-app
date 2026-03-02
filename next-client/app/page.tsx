import ItemList from "./components/Layout/ItemList";
import { fetchProtocols } from "@/lib/api";

type PageProps = {
  searchParams: {
    q?: string;
    sort?: string;
    page?: number;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const perPage = 10;
  const query = params.q ?? "";
  const sort = params.sort ?? "recent";
  const page = params.page ?? 1;

  const data = await fetchProtocols({
    query,
    sort,
    page,
    perPage,
  }).catch((err) => {
    console.error("Failed to fetch protocols:", err);
    return {
      protocols: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  });

  if (!data.protocols) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error fetching protocols</h2>
        <p>{data.error}</p>
      </div>
    );
  }

  return <ItemList initialData={data.protocols} perPage={perPage} />;
}
