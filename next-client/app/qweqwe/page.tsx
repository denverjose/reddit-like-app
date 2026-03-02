import { collectSegmentData } from "next/dist/server/app-render/collect-segment-data";
import ProtocolList from "../components/Layout/ItemList";
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
    <ItemList
      initialData={threads}
      perPage={perPage}
      isProtocolPage={false}
    />
  );
}
