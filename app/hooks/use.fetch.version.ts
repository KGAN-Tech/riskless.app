import { useState, useEffect, useCallback } from "react";
import { versionControlService } from "~/app/services/version.control.service";

export function useFetchVersion(initialLimit = 10) {
  const [versions, setVersions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchVersions = useCallback(
    async (pageNumber: number, query: string, limitCount: number) => {
      try {
        setLoading(true);
        const res: any = await versionControlService.getAll({
          page: pageNumber,
          limit: limitCount,
          query,
        });

        setVersions(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.error("Error fetching versions:", error);
        setVersions([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchVersions(page, searchQuery, limit);
  }, [page, limit, searchQuery, fetchVersions]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setPage(1);
      fetchVersions(1, searchQuery, limit);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, limit, fetchVersions]);

  return {
    versions,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    loading,
    setQuery: setSearchQuery,
    refetch: () => fetchVersions(page, searchQuery, limit),
  };
}
