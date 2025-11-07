import { useState, useCallback } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserFromLocalStorage } from "../utils/auth.helper";
import { roadService as service } from "../services/road.service";

export function useRoad() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const location = useLocation();
  const user = getUserFromLocalStorage();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [limitCount, setLimitCount] = useState<number>(10);
  const [query, setQuery] = useState<string>("");

  /** 📘 Fetch All Roads */
  const {
    data: items,
    isLoading: isFetchingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["roads"],
    queryFn: async () => {
      const res = await service.getAll({
        page: pageNumber,
        limit: limitCount,
        query,
      });

      return res?.data || [];
    },
  });

  /** 📗 Fetch Single Road by ID */
  const {
    data: item,
    isLoading: isFetchingSingle,
    refetch: refetchSingle,
  } = useQuery({
    queryKey: ["road", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await service.getById(id);

      return res?.data || {};
    },
    enabled: !!id, // only run when ID exists
  });

  /** 🟩 Create Road */
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      setLoading(true);
      const res = await service.create(payload);
      setLoading(false);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roads"] });
    },
  });

  /** 🟨 Update Road */
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      setLoading(true);
      const res = await service.update(id, payload);
      setLoading(false);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roads"] });
      queryClient.invalidateQueries({ queryKey: ["road", id] });
    },
  });

  /** 🟥 Delete Road */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      const res = await service.remove(id, {});
      setLoading(false);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roads"] });
    },
  });

  /** 📦 Handlers */
  const create = useCallback(
    (data: any) => createMutation.mutateAsync(data),
    []
  );
  const update = useCallback(
    (id: string, data: any) =>
      updateMutation.mutateAsync({ id, payload: data }),
    []
  );
  const remove = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    []
  );

  return {
    // Data
    item,
    items,
    loading: loading || isFetchingAll || isFetchingSingle,

    // Queries
    refetchAll,
    refetchSingle,

    // Mutations
    create,
    update,
    remove,

    // States
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Pagination
    pageNumber,
    setPageNumber,
    limitCount,
    setLimitCount,
    query,
    setQuery,
  };
}
