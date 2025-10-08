import { useState, useCallback } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { userService } from "~/app/services/user.service";
import { encounterService } from "~/app/services/encounter.service";
import { getUserFromLocalStorage } from "../utils/auth.helper";
import { PAGE } from "../configuration/const.config";

export function useEncounter(currentPatientId?: string, patientData?: any) {
  const { userId: paramUserId } = useParams<{ userId?: string }>();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const pageParam = searchParams.get("page");
  const transactionId = searchParams.get("transaction");
  const userId: string | undefined = currentPatientId ?? paramUserId;

  const getUserData = getUserFromLocalStorage();

  const [activePage, setActivePage] = useState<string>(() =>
    PAGE.PATIENT_PORTAL.MAIN.some((p) => p.id === pageParam)
      ? pageParam!
      : "records"
  );
  const [selectedView, setSelectedView] = useState("Summary");

  const handleSelectPage = useCallback((id: string) => {
    setActivePage(id);
    const params = new URLSearchParams(window.location.search);
    params.set("page", id);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }, []);

  /** ---------------------------
   * React Query
   ----------------------------*/
  // Fetch member (patient)
  const {
    data: member,
    isLoading: memberLoading,
    error: memberError,
  } = useQuery({
    queryKey: ["member", userId],
    queryFn: async () => {
      const res = await userService.get(userId!, {
        fields: "id,person,type, facility",
      });
      return res.data;
    },
    enabled: !!userId,
  });

  // Fetch encounters
  const {
    data: encounters = [],
    isLoading: encountersLoading,
    error: encountersError,
  } = useQuery({
    queryKey: ["encounters", member?.person?.id],
    queryFn: async () => {
      const res = await encounterService.getAll({
        patientId: member?.person?.id,
        page: 1,
        limit: 10,
        sort: "transactionDate",
        order: "desc",
      });
      return res.data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!member?.person?.id,
  });

  // Fetch single encounter if transactionId exists
  const {
    data: selectedEncounter,
    isLoading: encounterLoading,
    error: encounterError,
  } = useQuery({
    queryKey: ["encounter", transactionId],
    queryFn: async () => {
      const res = await encounterService.get(transactionId!, {});
      return res.data;
    },
    enabled: !!transactionId,
  });

  return {
    activePage,
    setActivePage,
    selectedView,
    setSelectedView,
    handleSelectPage,
    member,
    memberLoading,
    memberError,
    encounters,
    encountersLoading,
    encountersError,
    selectedEncounter,
    encounterLoading,
    encounterError,
    userId,
    transactionId,
    getUserData,
  };
}
