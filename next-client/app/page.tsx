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
  
  const { protocols } = await fetchProtocols({
    query,
    sort,
    page,
    perPage,
  }); 

  return <ItemList initialData={protocols} perPage={perPage} />;
}
