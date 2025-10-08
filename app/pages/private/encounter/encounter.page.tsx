import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Search, InfoIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { getIdentificationValue } from "~/app/utils/person.helper";
import { encounterService } from "~/app/services/encounter.service";
import { TrancheModal } from "./features/tranche.info.modal";
import EncounterExpandFeature from "./features/encounter.expand.feature";

export default function EncounterPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isTrancheModalOpen, setIsTrancheModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [encounters, setEncounters] = useState<any[]>([]);
  const [selectedEncounter, setSelectedEncounter] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const user = getUserFromLocalStorage();

  const navigate = useNavigate();

  const fetchEncounters = async (pageNumber = page) => {
    try {
      setIsLoading(true);
      const res: any = await encounterService.getAll({
        page: pageNumber,
        limit: 5, // Increased from 1 to show more records
        order: "",
        facilityId: user?.user?.facilityId,
        search: searchQuery, // Add search parameter
      });

      setEncounters(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Error fetching encounters:", error);
      setEncounters([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters(page);
  }, [page]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchEncounters(1);
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "initial":
        return "bg-green-100 text-green-800";
      case "follow_up":
        return "bg-yellow-100 text-yellow-800";
      case "self_answered":
        return "bg-blue-100 text-blue-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEncounters = encounters.filter((encounter) => {
    const patientName = `${encounter.patient?.firstName || ""} ${
      encounter.patient?.lastName || ""
    }`.toLowerCase();
    const transactionNo = encounter.transactionNo?.toLowerCase() || "";
    const chiefComplaints =
      encounter.interview?.reviews?.chiefComplaint?.join(" ").toLowerCase() ||
      "";

    return (
      patientName.includes(searchQuery.toLowerCase()) ||
      transactionNo.includes(searchQuery.toLowerCase()) ||
      chiefComplaints.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Encounters Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search encounters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        <div
          className={`overflow-x-auto ${
            expandedRow ? "grid grid-cols-10 gap-2" : ""
          }`}
        >
          <table className="w-full text-sm col-span-6">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Patient
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Transaction No
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Case No
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Type
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Date
                </th>

                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600 ">
                  <div className="flex items-center">
                    <p>Tranche</p>
                    <button
                      onClick={() => setIsTrancheModalOpen(true)}
                      className="ml-1 text-gray-400 hover:text-blue-600 "
                    >
                      <InfoIcon size={14} />
                    </button>
                    <TrancheModal
                      isOpen={isTrancheModalOpen}
                      onClose={() => setIsTrancheModalOpen(false)}
                    />
                  </div>
                </th>

                <th className="px-6 py-3 text-right font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    Loading encounters...
                  </td>
                </tr>
              ) : filteredEncounters.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No encounters found.
                  </td>
                </tr>
              ) : (
                filteredEncounters.map((encounter: any) => {
                  const patientName =
                    `${encounter.patient?.firstName || ""} ${
                      encounter.patient?.lastName || ""
                    }`.trim() || "Unknown Patient";

                  return (
                    <>
                      <tr
                        key={encounter.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 cursor-pointer">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600  uppercase">
                              {encounter.patient?.firstName?.[0] || "?"}
                              {encounter.patient?.lastName?.[0] || ""}
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium uppercase hover:underline hover:text-blue-500"
                                onClick={() =>
                                  navigate(
                                    `/member/${encounter?.patient?.User[0]?.id}?page=encounter&transaction=${encounter?.id}`
                                  )
                                }
                              >
                                {patientName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {getIdentificationValue(
                                  encounter.patient?.identifications || [],
                                  "philhealth_identification_number",
                                  "No PIN"
                                )}
                              </p>

                              {user?.user?.role === "super_admin" && (
                                <div className="max-w-xs truncate text-[8px] text-gray-400">
                                  {encounter.facility?.name || "—"}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Transaction No */}
                        <td className="hidden lg:table-cell px-6 py-4 text-gray-600 font-mono text-xs">
                          {encounter.transactionNo || "—"}
                        </td>

                        {/* Case No */}
                        <td className="hidden lg:table-cell px-6 py-4 text-gray-600 font-mono text-xs">
                          {getIdentificationValue(
                            encounter.patient?.identifications || [],
                            "hci_case_number",
                            "---"
                          )}
                        </td>

                        {/* Type */}
                        <td className="hidden xl:table-cell px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              encounter.type?.transaction || "unknown"
                            )}`}
                          >
                            {encounter.type?.transaction
                              .replace("_", " ")
                              .toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="hidden md:table-cell px-6 py-4 text-gray-600">
                          {encounter.transactionDate
                            ? formatDate(encounter.transactionDate)
                            : encounter.createdAt
                            ? formatDate(encounter.createdAt)
                            : "—"}
                        </td>

                        <td className="hidden xl:table-cell px-6 py-4 text-gray-600 text-xs mx-auto">
                          <p className="flex items-center gap-2">
                            <span className="font-mono bg-gray-200 text-gray-600 rounded-full w-fit px-2 py-1">
                              1
                            </span>
                            <span className="font-mono bg-gray-200 text-gray-600 rounded-full w-fit px-2 py-1">
                              2
                            </span>
                          </p>
                        </td>

                        {/* Expand Button */}
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => {
                              setExpandedRow(
                                expandedRow === encounter.id
                                  ? null
                                  : encounter.id
                              );
                              setSelectedEncounter(encounter);
                            }}
                          >
                            {expandedRow === encounter.id ? (
                              <EyeOffIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {/* {expandedRow === encounter.id && (
                        <tr className="bg-gray-50 border-b">
                          <td colSpan={7} className="py-2">
                            <div className="flex gap-4 w-full ">
                              <EncounterExpandFeature encounter={encounter} />
                            </div>
                          </td>
                        </tr>
                      )} */}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
          {expandedRow && (
            <div className="p-4 border rounded-lg bg-gray-50 col-span-4">
              <EncounterExpandFeature encounter={selectedEncounter} />
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 mt-4 border-t">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * 10 + 1} to{" "}
            {Math.min(page * 10, encounters.length)} of {encounters.length}{" "}
            encounters
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
