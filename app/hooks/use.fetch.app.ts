import { useEffect, useState } from "react";
import { appService } from "@/services/app.service"; // adjust path
import type { App } from "@/types/app.types";

type FetchAppsResponse = {
  data: App[];
  total: number;
  page: number;
  totalPages: number;
};

export function useFetchApps(
  page: number = 1,
  limit: number = 10,
  order: "asc" | "desc" = "desc",
  query?: string
) {
  const [apps, setApps] = useState<App[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: FetchAppsResponse = await appService.getAll({
          page,
          limit,
          order,
          ...(query ? { query } : {}),
        });

        setApps(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [page, limit, order, query]);

  return { apps, total, totalPages, loading, error };
}
