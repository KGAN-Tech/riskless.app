import { useEffect, useState } from "react";
import { roadService } from "@/services/road.service";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export default function RoadMSPage() {
  const [roads, setRoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    longitude: "",
    latitude: "",
    isHighRisk: false,
    status: "",
    type: "unknown",
    otherType: "",
    tags: "",
  });

  // 🔹 Fetch all roads
  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await roadService.getAll();
      const list = Array.isArray(res?.data) ? res.data : [];
      setRoads(list);
    } catch (err) {
      console.error("Error fetching roads:", err);
      setRoads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoads();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Open Create Dialog
  const handleCreate = () => {
    setSelected(null);
    setForm({
      title: "",
      description: "",
      longitude: "",
      latitude: "",
      isHighRisk: false,
      status: "",
      type: "unknown",
      otherType: "",
      tags: "",
    });
    setOpen(true);
  };

  // 🔹 Open Edit Dialog
  const handleEdit = (road: any) => {
    setSelected(road);
    setForm({
      title: road.title ?? "",
      description: road.description ?? "",
      longitude: road.longitude ?? "",
      latitude: road.latitude ?? "",
      isHighRisk: road.isHighRisk ?? false,
      status: road.status ?? "",
      type: road.type ?? "unknown",
      otherType: road.otherType ?? "",
      tags: (road.tags || []).join(", "),
    });
    setOpen(true);
  };

  // 🔹 Create or Update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      isHighRisk: Boolean(form.isHighRisk),
      status: form.status,
      type: form.type,
      otherType: form.otherType || null,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (selected) {
        await roadService.update(selected.id, payload);
        alert("Road updated successfully!");
      } else {
        await roadService.create(payload);
        alert("Road created successfully!");
      }
      setOpen(false);
      fetchRoads();
    } catch (err) {
      console.error("Error saving road:", err);
      alert("Error saving road");
    }
  };

  // 🔹 Delete road (soft delete)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this road?")) return;
    try {
      await roadService.remove(id, {});
      fetchRoads();
    } catch (err) {
      console.error("Error deleting road:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Road Management</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Road
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : !roads.length ? (
            <p className="text-gray-500 text-center py-4">No roads found.</p>
          ) : (
            <table className="w-full text-left border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">High Risk</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roads.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{r.title}</td>
                    <td className="p-2 border truncate max-w-xs">
                      {r.description}
                    </td>
                    <td className="p-2 border capitalize">{r.type}</td>
                    <td className="p-2 border">{r.status || "-"}</td>
                    <td className="p-2 border text-center">
                      {r.isHighRisk ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(r)}
                        className="mr-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(r.id)}
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

      {/* 🔹 Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Road" : "Add Road"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  step="any"
                />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  step="any"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isHighRisk"
                name="isHighRisk"
                checked={form.isHighRisk}
                onChange={handleChange}
              />
              <Label htmlFor="isHighRisk">High Risk Area</Label>
            </div>

            <div>
              <Label>Status</Label>
              <Input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="e.g., active, closed, under repair"
              />
            </div>

            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="unknown">Unknown</option>
                <option value="incidents">Incident</option>
                <option value="road_reports">Road Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            {form.type === "other" && (
              <div>
                <Label>Other Type</Label>
                <Input
                  name="otherType"
                  value={form.otherType}
                  onChange={handleChange}
                  placeholder="Specify other type"
                />
              </div>
            )}

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g., flood, pothole, traffic"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{selected ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
