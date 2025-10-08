import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { yakapService } from "~/app/services/yakap.service";
import ExtractorModal from "../features/extractor.modal";

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return (
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + d.getDate()).slice(-2) +
    "/" +
    d.getFullYear()
  );
};

const formatForInput = (date: string) => {
  const [month, day, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export default function ExtractMasterlistPage() {
  const today = formatDate(new Date());

  const [members, setMembers] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const get = getUserFromLocalStorage();
  const navigate = useNavigate();

  const fetchMembers = async (pageNumber = page) => {
    try {
      setIsLoading(true);

      const res: any = await yakapService.extractRegistrationList({
        username: get?.user?.facility?.pcb?.username || "",
        password: get?.user?.facility?.pcb?.password || "",
        certificationId: get?.user?.facility?.pcb?.certificationId || "",
        hospitalCode: get?.user?.facility?.pcb?.accreditationNo || "",
        cipherKey: get?.user?.facility?.pcb?.chiperKey || "",
        page: pageNumber,
        limit: 5,
        action: "decrypt_readable",
        startDate,
        endDate,
      });

      const formatted = res.assignments.map((a: any, idx: number) => ({
        id: a.assignedPin ?? idx.toString(),
        person: {
          firstName: a.assignedFirstName,
          middleName: a.assignedMiddleName,
          lastName: a.assignedLastName,
          extensionName: a.assignedExtName,
          dateOfBirth: a.assignedDateOfBirth,
          mobileNumber: a.mobileNumber,
          landlineNumber: a.landlineNumber,
          sex: a.assignedSex,
        },
        facility: { name: res.meta.hciAccreNo ?? "—" },
        membership: {
          isRegistered: a.assignedStatus === "1",
          type: a.assignedType,
          packageType: a.packageType,
          effYear: a.effYear,
          date: a.assignedDate,
        },
      }));

      setMembers(formatted);
      setTotalPages(res.meta?.pagination?.totalPages || 1);
      setTotalCount(res.meta?.pagination?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page, startDate, endDate]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openModal = (data: any[], type: "selected" | "range") => {
    if (type === "selected") setSelectedData(data);
    else if (type === "range") setSelectedData([...data]);

    setIsModalOpen(true);
  };

  // 🔹 Extract all in range (ignores pagination, gets everything)
  const handleExtractRange = async () => {
    try {
      const res: any = await yakapService.extractRegistrationList({
        username: get?.user?.facility?.pcb?.username || "",
        password: get?.user?.facility?.pcb?.password || "",
        certificationId: get?.user?.facility?.pcb?.certificationId || "",
        hospitalCode: get?.user?.facility?.pcb?.accreditationNo || "",
        cipherKey: get?.user?.facility?.pcb?.chiperKey || "",
        page: 1,
        limit: totalCount, // ✅ fetch all
        action: "encrypt_readable",
        startDate,
        endDate,
      });

      const formatted = res.assignments.map((a: any, idx: number) => ({
        id: a.assignedPin ?? idx.toString(),
        person: {
          firstName: a.assignedFirstName,
          middleName: a.assignedMiddleName,
          lastName: a.assignedLastName,
          extensionName: a.assignedExtName,
          dateOfBirth: a.assignedDateOfBirth,
          mobileNumber: a.mobileNumber,
          landlineNumber: a.landlineNumber,
          sex: a.assignedSex,
        },
        facility: { name: res.meta.hciAccreNo ?? "—" },
        membership: {
          isRegistered: a.assignedStatus === "1",
          type: a.assignedType,
          packageType: a.packageType,
          effYear: a.effYear,
          date: a.assignedDate,
        },
      }));

      // ✅ open modal with everything
      openModal(formatted, "range");
    } catch (error) {
      console.error("Error extracting range:", error);
    } finally {
    }
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Member Modal */}
      <ExtractorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedData}
        onSubmit={() => console.log("Extracting:", selectedData)}
        onSuccess={() => fetchMembers(page)}
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={formatForInput(startDate)}
              onChange={(e) => setStartDate(formatDate(e.target.value))}
              className="w-40"
            />
            <Input
              type="date"
              value={formatForInput(endDate)}
              onChange={(e) => setEndDate(formatDate(e.target.value))}
              className="w-40"
            />
          </div>
          <div className="flex gap-2">
            {/* Extract Selected */}
            <Button
              onClick={() =>
                openModal(
                  members.filter((m) => selectedIds.includes(m.id)),
                  "selected"
                )
              }
              disabled={selectedIds.length === 0}
            >
              Extract Selected ({selectedIds.length})
            </Button>

            {/* Extract All in Range */}
            <Button onClick={handleExtractRange} disabled={totalCount === 0}>
              Extract All in Range ({totalCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto -mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-2 py-3">
                  {/* select all */}
                  <input
                    type="checkbox"
                    checked={
                      members.length > 0 &&
                      selectedIds.length === members.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? members.map((m) => m.id) : []
                      )
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Member
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  PIN
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Sex
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Type
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Date of Birth
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Membership Date
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Membership
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const fullName = `${member.person?.firstName ?? ""} ${
                    member.person?.lastName ?? ""
                  }`.trim();
                  return (
                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(member.id)}
                          onChange={() => toggleSelect(member.id)}
                        />
                      </td>
                      <td className="px-6 py-1">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => navigate(`/member/${member.id}`)}
                        >
                          <div>
                            <p className="text-sm font-medium uppercase">
                              {fullName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell px-6 py-4 text-gray-600">
                        {member.id || "—"}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-gray-600">
                        {member.person?.sex === "M" ? "Male" : "Female"}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-gray-600">
                        {member.membership?.type === "MM"
                          ? "Member"
                          : "Dependent"}
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-gray-600">
                        {member.person?.dateOfBirth
                          ? new Date(
                              member.person.dateOfBirth
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      <td className="hidden xl:table-cell px-6 py-4 text-gray-600">
                        {member.membership?.date
                          ? new Date(member.membership.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      <td className="hidden md:table-cell px-6 py-4 text-gray-600">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            member.membership.isRegistered
                              ? "bg-green-100 text-green-500"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {member.membership.isRegistered ? "Registered" : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          onClick={() => openModal([member], "selected")}
                        >
                          Extract
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-1">
          <Button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
