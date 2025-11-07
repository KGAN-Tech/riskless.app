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
import { Loader2, Plus, Pencil, Trash2, Trash } from "lucide-react";

export default function FacilityPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

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
      await facilityService.remove(id, {});
      fetchFacilities();
    } catch (err) {
      console.error("Error deleting facility:", err);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Facility Management</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Facility
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : !facilities?.length ? (
            <p className="text-gray-500">No facilities found.</p>
          ) : (
            <table className="w-full text-left border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Location</th>
                  <th className="p-2 border">Contacts</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{f.name}</td>
                    <td className="p-2 border">{f.category || "-"}</td>
                    <td className="p-2 border">{f.type || "-"}</td>
                    <td className="p-2 border">{f.status || "-"}</td>
                    <td className="p-2 border">{f.location || "-"}</td>
                    <td className="p-2 border">
                      {f.contacts && f.contacts.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
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

                    <td className="p-2 border text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(f)}
                        className="mr-2"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected ? "Edit Facility" : "Add Facility"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Longitude</Label>
                <Input
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select type</option>
                {facilityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Category</Label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select category</option>
                {facilityCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {form.category === "others" && (
              <div>
                <Label>Other Category</Label>
                <Input
                  name="otherCategory"
                  value={form.otherCategory}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* CONTACTS SECTION */}
            <div className="space-y-2">
              <Label>Contacts</Label>
              {form.contacts.map((contact, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                  <select
                    className="col-span-2 border rounded-md p-2"
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
                    className="col-span-3"
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
              >
                + Add Contact
              </Button>
            </div>

            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select status</option>
                {facilityStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{selected ? "Update" : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
