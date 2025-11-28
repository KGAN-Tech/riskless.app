import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { facilityService } from "@/services/facility.service";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Loader2, Plus, Pencil } from "lucide-react";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export default function AccountMSPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const [userFacility, setUserFacility] = useState<any | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    type: "rider",
    facilityId: "",
    facilityName: "",
  });

  // 🔹 Get current user's facility ID for filtering
  const getCurrentUserFacilityId = (): string | undefined => {
    const localUser = getUserFromLocalStorage();
    return localUser?.user?.facility?.id;
  };

  // 🔹 Fetch all users (filtered if facility present)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const currentFacilityId = getCurrentUserFacilityId();

      const res = await userService.getAll({
        ...(currentFacilityId && { facilityId: currentFacilityId }),
        role: "admin",
      });

      setUsers(res?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch facilities for search
  const fetchFacilities = async (query = "") => {
    if (!query) {
      setFacilities([]);
      return;
    }
    try {
      const res = await facilityService.getAll({ search: query });
      setFacilities(res?.data || []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  // 🔹 Input handlers
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilitySelect = (facility: any) => {
    setForm((prev) => ({
      ...prev,
      facilityId: facility.id,
      facilityName: facility.name,
    }));
    setFacilitySearch(facility.name);
    setShowSuggestions(false);
  };

  // 🔹 Create user form
  const handleCreate = () => {
    setSelected(null);

    const currentFacilityId = getCurrentUserFacilityId();
    const initialFacility =
      userFacility?.id && userFacility?.name
        ? {
            facilityId: userFacility.id,
            facilityName: userFacility.name,
          }
        : { facilityId: "", facilityName: "" };

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin", // default to admin
      type: "organization", // default to organization
      ...initialFacility,
    });

    setFacilitySearch(initialFacility.facilityName);
    setOpen(true);
  };

  // 🔹 Edit user
  const handleEdit = (user: any) => {
    setSelected(user);
    setForm({
      firstName: user.person?.firstName ?? "",
      lastName: user.person?.lastName ?? "",
      email: user.person?.contacts?.[0]?.value ?? "",
      password: "",
      confirmPassword: "",
      role: user.role ?? "user",
      type: user.type ?? "rider",
      facilityId: user.facilityId ?? "",
      facilityName: user.facility?.name ?? "",
    });
    setFacilitySearch(user.facility?.name ?? "");
    setOpen(true);
  };

  // 🔹 Submit (create/update)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!selected && form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate facility assignment for non-facility users
    const currentFacilityId = getCurrentUserFacilityId();
    if (currentFacilityId && !form.facilityId) {
      alert("Facility is required for your account type.");
      return;
    }

    try {
      if (selected) {
        const payload = {
          person: {
            firstName: form.firstName,
            lastName: form.lastName,
            contacts: [{ type: "email", provider: "email", value: form.email }],
          },
          role: form.role,
          type: form.type,
          facilityId: form.facilityId || null,
        };
        await userService.update(selected.id, payload);
      } else {
        const formData = new FormData();
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append(
          "contacts",
          JSON.stringify([
            { type: "email", provider: "email", value: form.email },
          ])
        );
        formData.append(
          "passwords",
          JSON.stringify([{ type: "text", value: form.password }])
        );
        formData.append(
          "legal",
          JSON.stringify([
            { type: "privacy_policy", value: true },
            { type: "terms_and_condition", value: true },
          ])
        );
        formData.append("role", form.role);
        formData.append("type", form.type);
        formData.append("facilityId", form.facilityId || "");
        await authService.register(formData);
      }

      alert(
        selected
          ? "User updated successfully!"
          : "User registered successfully!"
      );
      setOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error saving user");
    }
  };

  // 🔹 Load facility from local storage
  useEffect(() => {
    try {
      const localUser = getUserFromLocalStorage();
      const facilityData = localUser?.user?.facility;

      if (facilityData) {
        const parsed =
          typeof facilityData === "string"
            ? JSON.parse(facilityData)
            : facilityData;

        const normalized = {
          ...parsed,
          id: parsed.id || parsed._id || parsed.facilityId,
        };

        setUserFacility(normalized);
        console.log("✅ Loaded facility from local storage:", normalized);
      } else {
        console.log("ℹ️ No facility found — showing all users.");
        setUserFacility(null);
      }
    } catch (err) {
      console.warn("⚠️ Error reading facility from local storage:", err);
      setUserFacility(null);
    }
  }, []);

  // 🔹 Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Facility search debounce
  useEffect(() => {
    const delay = setTimeout(() => fetchFacilities(facilitySearch), 400);
    return () => clearTimeout(delay);
  }, [facilitySearch]);

  const currentFacilityId = getCurrentUserFacilityId();

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Admin & Organization Management</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </CardHeader>

        <CardContent>
          {currentFacilityId && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
              Showing users for your facility only
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : !users.length ? (
            <p className="text-gray-500 text-center py-4">
              {currentFacilityId
                ? "No admins or organizations found for your facility."
                : "No admins or organizations found."}
            </p>
          ) : (
            <table className="w-full text-left border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Facility</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      {u.person?.firstName || "-"} {u.person?.lastName || "-"}
                    </td>
                    <td className="p-2 border">
                      {u.person?.contacts?.[0]?.value || "-"}
                    </td>
                    <td className="p-2 border capitalize">{u.role || "-"}</td>
                    <td className="p-2 border capitalize">{u.type || "-"}</td>
                    <td className="p-2 border">{u.facility?.name || "-"}</td>
                    <td className="p-2 border text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(u)}
                        className="mr-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit remains the same */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2 relative">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {!selected && (
              <>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label>Role</Label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="organization">Organization</option>
              </select>
            </div>

            {/* Facility Section */}
            {currentFacilityId ? (
              <div>
                <Label>Facility</Label>
                <Input
                  value={userFacility?.name || "Current Facility"}
                  disabled
                  className="bg-gray-100"
                />
                <input
                  type="hidden"
                  name="facilityId"
                  value={currentFacilityId}
                />
              </div>
            ) : (
              <div className="relative">
                <Label>Facility</Label>
                <Input
                  placeholder="Search facility..."
                  value={facilitySearch}
                  onChange={(e) => {
                    setFacilitySearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                />

                {showSuggestions && facilities.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto">
                    {facilities.map((f) => (
                      <li
                        key={f.id}
                        onClick={() => handleFacilitySelect(f)}
                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                      >
                        {f.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{selected ? "Update" : "Register"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
