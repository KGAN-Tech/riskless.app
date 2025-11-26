import { useEffect, useState } from "react";
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
import { Loader2, Plus, Pencil, Trash2, Trash, Menu, X } from "lucide-react";

export default function FacilityPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    longitude: "",
    latitude: "",
    type: "",
    provider: "",
    tagline: "",
    status: "",
    category: "",
    otherCategory: "",
    contacts: [
      { type: "mobile_number", value: "", provider: "Unknown" },
      { type: "email", value: "", provider: "Unknown" },
    ],
  });

  const facilityTypes = ["private", "public"];
  const facilityStatuses = ["open", "closed"];
  const facilityCategories = [
    "clinic",
    "pharmacy",
    "laboratory",
    "hospital",
    "provider",
    "emergency_facility",
    "others",
  ];

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch all facilities
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await facilityService.getAll();
      const list = res?.data ?? [];
      setFacilities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle contact change
  const handleContactChange = (
    index: number,
    field: "type" | "value",
    value: string
  ) => {
    setForm((prev) => {
      const updatedContacts = [...prev.contacts];
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      return { ...prev, contacts: updatedContacts };
    });
  };

  // Add new contact
  const handleAddContact = () => {
    setForm((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { type: "mobile_number", value: "", provider: "Unknown" },
      ],
    }));
  };

  // Remove contact
  const handleRemoveContact = (index: number) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  // Open create dialog
  const handleCreate = () => {
    setSelected(null);
    setForm({
      name: "",
      location: "",
      longitude: "",
      latitude: "",
      type: "",
      provider: "",
      tagline: "",
      status: "",
      category: "",
      otherCategory: "",
      contacts: [
        { type: "mobile_number", value: "", provider: "Unknown" },
        { type: "email", value: "", provider: "Unknown" },
      ],
    });
    setOpen(true);
  };

  // Open edit dialog
  const handleEdit = (facility: any) => {
    setSelected(facility);
    setForm({
      name: facility.name ?? "",
      location: facility.location ?? "",
      longitude: facility.longitude ?? "",
      latitude: facility.latitude ?? "",
      type: facility.type ?? "",
      provider: facility.provider ?? "",
      tagline: facility.tagline ?? "",
      status: facility.status ?? "",
      category: facility.category ?? "",
      otherCategory: facility.otherCategory ?? "",
      contacts:
        facility.contacts?.length > 0
          ? facility.contacts
          : [
              { type: "mobile_number", value: "", provider: "Unknown" },
              { type: "email", value: "", provider: "Unknown" },
            ],
    });
    setOpen(true);
    setMobileMenuOpen(false);
  };

  // Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
      };

      if (selected) {
        await facilityService.update(selected.id, payload);
      } else {
        await facilityService.create(payload);
      }

      setOpen(false);
      fetchFacilities();
    } catch (err) {
      console.error("Error saving facility:", err);
    }
  };

  // Delete facility
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    try {
      await facilityService.remove(id);
      fetchFacilities();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Error deleting facility:", err);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Mobile facility card component
  const MobileFacilityCard = ({ facility }: { facility: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{facility.name}</h3>
            <p className="text-sm text-gray-600">
              {facility.location || "No location"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(facility.id)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Category:</span>{" "}
            {facility.category || "-"}
          </div>
          <div>
            <span className="font-medium">Type:</span> {facility.type || "-"}
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <span
              className={`ml-1 px-2 py-1 rounded-full text-xs ${
                facility.status === "open"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {facility.status || "-"}
            </span>
          </div>
        </div>

        <div>
          <span className="font-medium text-sm">Contacts:</span>
          {facility.contacts && facility.contacts.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {facility.contacts.map((c: any, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-100"
                >
                  <span className="capitalize">{c.type}</span>: {c.value}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-sm italic">No contacts</span>
          )}
        </div>

        {/* Mobile action menu */}
        {mobileMenuOpen === facility.id && (
          <div className="flex space-x-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(facility)}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(facility.id)}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl">
            Facility Management
          </CardTitle>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Add Facility</span>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : !facilities?.length ? (
            <p className="text-gray-500 text-center py-8">
              No facilities found.
            </p>
          ) : isMobile ? (
            // Mobile view - Card layout
            <div className="space-y-4">
              {facilities.map((facility) => (
                <MobileFacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            // Desktop view - Table layout
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 rounded-md min-w-[800px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-sm font-medium">Name</th>
                    <th className="p-3 border text-sm font-medium">Category</th>
                    <th className="p-3 border text-sm font-medium">Type</th>
                    <th className="p-3 border text-sm font-medium">Status</th>
                    <th className="p-3 border text-sm font-medium">Location</th>
                    <th className="p-3 border text-sm font-medium">Contacts</th>
                    <th className="p-3 border text-sm font-medium text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="p-3 border text-sm">{f.name}</td>
                      <td className="p-3 border text-sm">
                        {f.category || "-"}
                      </td>
                      <td className="p-3 border text-sm">{f.type || "-"}</td>
                      <td className="p-3 border text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            f.status === "open"
                              ? "bg-green-100 text-green-800"
                              : f.status === "closed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {f.status || "-"}
                        </span>
                      </td>
                      <td className="p-3 border text-sm">
                        {f.location || "-"}
                      </td>
                      <td className="p-3 border text-sm">
                        {f.contacts && f.contacts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.contacts.map((c: any, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-100"
                              >
                                <span className="capitalize">{c.type}</span>:{" "}
                                {c.value}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            No contacts
                          </span>
                        )}
                      </td>
                      <td className="p-3 border text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(f)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(f.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selected ? "Edit Facility" : "Add Facility"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select type</option>
                  {facilityTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm"
                >
                  <option value="">Select status</option>
                  {facilityStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm"
              >
                <option value="">Select category</option>
                {facilityCategories.map((c) => (
                  <option key={c} value={c}>
                    {c
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            {form.category === "others" && (
              <div>
                <Label htmlFor="otherCategory">Other Category</Label>
                <Input
                  id="otherCategory"
                  name="otherCategory"
                  value={form.otherCategory}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            )}

            {/* CONTACTS SECTION */}
            <div className="space-y-3">
              <Label>Contacts</Label>
              {form.contacts.map((contact, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <select
                    className="sm:col-span-4 border rounded-md p-2 text-sm"
                    value={contact.type}
                    onChange={(e) =>
                      handleContactChange(i, "type", e.target.value)
                    }
                  >
                    <option value="mobile_number">Mobile</option>
                    <option value="email">Email</option>
                    <option value="landline">Landline</option>
                    <option value="social_media">Social Media</option>
                  </select>
                  <Input
                    className="sm:col-span-7"
                    placeholder="Enter contact"
                    value={contact.value}
                    onChange={(e) =>
                      handleContactChange(i, "value", e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => handleRemoveContact(i)}
                    className="sm:col-span-1 justify-center"
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddContact}
                className="w-full sm:w-auto"
              >
                + Add Contact
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {selected ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
