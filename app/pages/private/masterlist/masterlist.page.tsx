import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Input } from "@/components/atoms/input";
import MemberModal from "@/components/organisms/modal/member.modal";
import { userService } from "~/app/services/user.service";
import { Edit, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { getIdentificationValue } from "~/app/utils/person.helper";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const get = getUserFromLocalStorage();

  const navigate = useNavigate();

  const fetchMembers = async (pageNumber = page) => {
    try {
      setIsLoading(true);
      const res: any = await userService.getAll({
        page: pageNumber,
        limit: 10,
        order: "desc",
        facilityId: get?.user?.facilityId,
        role: "user",
      });

      setMembers(res.users);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  // Helper functions to extract email and phone from contacts
  const getEmail = (person: any) =>
    person.contacts?.find((c: any) => c.type === "email")?.value ?? "N/A";

  const getPhone = (person: any) =>
    person.contacts?.find((c: any) => c.type === "mobile_number")?.value ?? "—";

  const filteredMembers = members.filter((member: any) => {
    const fullName = `${member.person?.firstName ?? ""} ${
      member.person?.lastName ?? ""
    }`.trim();
    const email = getEmail(member.person);
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Members</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div> */}

      {/* Member Modal */}
      <MemberModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => fetchMembers(page)}
      />

      {/* Members Table */}
      <Card className="">
        <div className="flex items-center justify-between w-full  ">
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto -mt-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Member
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  PIN
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Type
                </th>
                {/* <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Status
                </th> */}
                {get?.user?.role === "super_admin" && (
                  <th className="hidden md:table-cell px-6 py-3 text-left font-medium text-gray-600">
                    Facility
                  </th>
                )}
                <th className="hidden xl:table-cell px-6 py-3 text-left font-medium text-gray-600">
                  Joined Date
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
                  <td colSpan={7} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member: any) => {
                  const fullName = `${member.person?.firstName ?? ""} ${
                    member.person?.lastName ?? ""
                  }`.trim();

                  return (
                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-1">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => navigate(`/member/${member.id}`)}
                        >
                          {member.person?.images[0]?.url ? (
                            <img
                              src={member.person?.images[0]?.url}
                              alt={fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                              {member.person?.firstName?.[0] ?? "?"}
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium uppercase">
                              {fullName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="hidden lg:table-cell px-6 py-4 text-gray-600">
                        {getIdentificationValue(
                          member.person?.identifications || [],
                          "philhealth_identification_number",
                          "----"
                        )}
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-gray-600">
                        {member.type === "patient_dependent"
                          ? "Dependent"
                          : "Member"}
                      </td>
                      {/* <td className="hidden xl:table-cell px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td> */}
                      {/* <td className="hidden lg:table-cell px-6 py-4 text-gray-600">
                        {new Date(member.person.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td> */}
                      {get?.user?.role === "super_admin" && (
                        <td className="hidden md:table-cell px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-green-800 text-nowrap text-ellipsis">
                            {member.facility?.name ?? "—"}
                          </span>
                        </td>
                      )}
                      <td
                        className={`hidden xl:table-cell px-6 py-4 ${
                          member.membership.isRegistered
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {member.joinAt
                          ? new Date(member.joinAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => navigate(`/member/${member.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
