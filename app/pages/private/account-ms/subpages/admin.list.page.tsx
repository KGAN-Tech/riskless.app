import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import {
  Search,
  Edit,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { EditAdminDialog } from "./edit.admin.dialog";
import { userService } from "@/services/user.service";
import { useToast } from "@/hooks/use.toast";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

 export interface AdminData {
  id: string;
  userName?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName?: string;
  position: string;
  specialization: string;
  prcId: string;
  philhealthPin?: string;
  email: string;
  phoneNumber: string;
  landline?: string;
  type: string;
  joinedDate: string;
  membershipStatus: "active" | "expired" | "suspended";
  profilePic: string | null;
  expirationDate?: string;
  // Additional details for expanded view
  facilityName?: string;
  facilityId?: string;
  gender?: string;
  sex?: string;
  birthDate?: string;
  birthPlace?: string;
  age?: number | string;
  religion?: string;
  civilStatus?: string;
  citizenship?: string;
  addresses?: any[];
  professional?: any[];
  lastLogin?: string;

}

// Mock data for demonstration

export const AdminList = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const get = getUserFromLocalStorage();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res: any = await userService.getAll({
          page: 1,
          limit: 100,
          order: "desc",
          facilityId: get?.user?.facilityId,
          role: "admin",
          fields:
            "id,userName,role,type,status,createdAt,lastLogin,joinAt,facility.name,person.firstName,person.middleName,person.lastName,person.extensionName,person.identifications,person.contacts,person.images,person.sex,person.gender,person.birthDate,person.birthPlace,person.age,person.religion,person.civilStatus,person.addresses,person.professional,person.citizenship",
        });
        const users = res?.users || [];
        const list = users.map((u: any): AdminData => {
          const person = u?.person || {};
          const images = person?.images || [];
          const professional = person?.professional || [];
          const contacts = person?.contacts || [];
          const identifications = person?.identifications || [];
          return {
            id: u?.id || person?.id || Math.random().toString(36).slice(2),
            userName: u?.userName,
            firstName: person?.firstName || "",
            middleName: person?.middleName || "",
            lastName: person?.lastName || "",
            extensionName: person?.extensionName || "",
            position: (professional?.[0]?.position || u?.type || "").toString(),
            specialization: professional?.[0]?.specialization || "",
            prcId:
              identifications.find((i: any) => i?.issuer === "PRC")?.value ||
              "",
            philhealthPin:
              identifications.find(
                (i: any) => i?.type === "philhealth_identification_number"
              )?.value || "",
            email: contacts.find((c: any) => c?.type === "email")?.value || "",
            phoneNumber:
              contacts.find((c: any) => c?.type === "mobile_number")?.value ||
              "",
            landline:
              contacts.find((c: any) => c?.type === "landline")?.value || "",
            type: (u?.type || "").toString(),
            joinedDate: u?.createdAt || new Date().toISOString(),
            membershipStatus: "active",
            profilePic: images[0]?.url || null,
            expirationDate: undefined,
            facilityName: u?.facility?.name,
            facilityId: u?.facilityId || u?.facility?.id,
            gender: person?.gender,
            sex: person?.sex,
            birthDate: person?.birthDate,
            birthPlace: person?.birthPlace,
            age: person?.age,
            religion: person?.religion,
            civilStatus: person?.civilStatus,
            citizenship: person?.citizenship,
            addresses: person?.addresses,
            professional,
            lastLogin: u?.lastLogin,
          } as AdminData;
        });
        setAdmins(list);
      } catch (error: any) {
        console.error("Failed to fetch users", error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredAdmins = admins.filter(
    (admin) =>
      `${admin.firstName} ${admin.middleName} ${admin.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "physician":
        return "Physician";
      case "presenter":
        return "Presenter (Nurse)";
      case "encode":
        return "Encoder";
      case "it":
        return "IT Staff";
      default:
        return role;
    }
  };

  const handleEditAdmin = (admin: AdminData) => {
    setEditingAdmin(admin);
  };

  const handleUpdateAdmin = (updatedAdmin: AdminData) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === updatedAdmin.id ? updatedAdmin : admin
      )
    );
    setEditingAdmin(null);

    // Optional: Show success toast
    toast({
      title: "Success",
      description: "Administrator updated successfully",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            Registered Administrators
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-muted-foreground">
              List of all registered healthcare staff members
            </p>
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or PRC ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto -mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead> ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access role </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {searchTerm
                        ? "No results found for your search."
                        : "No administrators available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <React.Fragment key={admin.id}>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={admin.profilePic || ""} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {admin.firstName?.[0] || "?"}
                                {admin.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {admin.firstName} {admin.middleName}{" "}
                                {admin.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {admin.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {admin.id || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(admin.membershipStatus)}
                          >
                            {admin.membershipStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {getRoleDisplay(admin.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium capitalize">
                            {admin.position}
                          </div>
                          {admin.specialization && (
                            <div className="text-sm text-muted-foreground">
                              {admin.specialization}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(admin.id)}
                              className="h-8 px-2"
                            >
                              {expandedRows[admin.id] ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-1" /> View
                                  Profile
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-1" /> View
                                  Profile
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAdmin(admin)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="More"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows[admin.id] && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <div className="bg-muted/30 rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">
                                  Email
                                </div>
                                <div>{admin.email}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Phone
                                </div>
                                <div>{admin.phoneNumber || "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Access Role
                                </div>
                                <div>{getRoleDisplay(admin.type)}</div>
                              </div>

                              <div>
                                <div className="text-muted-foreground">
                                  Facility
                                </div>
                                <div>{admin.facilityName || "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Gender/Sex
                                </div>
                                <div>{admin.gender || admin.sex || "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Birth Date
                                </div>
                                <div>
                                  {admin.birthDate
                                    ? new Date(
                                        admin.birthDate
                                      ).toLocaleDateString()
                                    : "—"}
                                </div>
                              </div>

                              <div>
                                <div className="text-muted-foreground">
                                  Birth Place
                                </div>
                                <div>{admin.birthPlace || "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Age</div>
                                <div>{admin.age ?? "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Civil Status
                                </div>
                                <div className="capitalize">
                                  {admin.civilStatus || "—"}
                                </div>
                              </div>

                              <div>
                                <div className="text-muted-foreground">
                                  Citizenship
                                </div>
                                <div className="capitalize">
                                  {admin.citizenship || "—"}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  Religion
                                </div>
                                <div>{admin.religion || "—"}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">
                                  PRC ID
                                </div>
                                <div className="font-mono">
                                  {admin.prcId || "—"}
                                </div>
                              </div>

                              <div className="md:col-span-3">
                                <div className="text-muted-foreground">
                                  Addresses
                                </div>
                                <div className="space-y-1">
                                  {(admin.addresses || []).length === 0 ? (
                                    <div>—</div>
                                  ) : (
                                    (admin.addresses || []).map(
                                      (addr: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex flex-wrap gap-2"
                                        >
                                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                                            {addr.type || "address"}
                                          </span>
                                          <span className="text-gray-800">
                                            {addr.description ||
                                              [
                                                addr.street,
                                                addr.barangay?.value ||
                                                  addr.barangay,
                                                addr.city?.value || addr.city,
                                                addr.province?.value ||
                                                  addr.province,
                                              ]
                                                .filter(Boolean)
                                                .join(", ")}
                                          </span>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-3">
                                <div className="text-muted-foreground">
                                  Activity
                                </div>
                                <div className="text-gray-800">
                                  Last Login:{" "}
                                  {admin.lastLogin
                                    ? new Date(admin.lastLogin).toLocaleString()
                                    : "—"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredAdmins.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No administrators found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <EditAdminDialog
        admin={editingAdmin} // Add this line
        open={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        onSave={handleUpdateAdmin}
      />
    </>
  );
};
