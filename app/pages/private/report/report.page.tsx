import { useEffect, useState, type ChangeEvent } from "react";
import { reportService } from "@/services/report.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/select";

enum ReportType {
  unknown = "unknown",
  incidents = "incidents",
  road_reports = "road_reports",
  other = "other",
}

interface Report {
  id?: string;
  title: string;
  description: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  images?: string[];
  status?: string;
  tags?: string[];
  type: ReportType;
  createdAt?: string;
  updatedAt?: string;
}

// Form data type (tags and images are string + File[] for input)
type ReportForm = Omit<Report, "tags" | "images"> & {
  tags: string;
  imageFiles: File[];
};

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [formData, setFormData] = useState<ReportForm>({
    id: "",
    title: "",
    description: "",
    location: "",
    longitude: undefined,
    latitude: undefined,
    status: "",
    type: ReportType.unknown,
    tags: "",
    imageFiles: [],
  });
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getAll({ query });
      setReports(res.data || []);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async () => {
    try {
      const tags = formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("status", formData.status || "");
      data.append("type", formData.type);
      data.append("location", formData.location || "");
      if (formData.longitude)
        data.append("longitude", String(formData.longitude));
      if (formData.latitude) data.append("latitude", String(formData.latitude));
      data.append("tags", JSON.stringify(tags));
      formData.imageFiles.forEach((file) => data.append("files", file));

      if (formData.id) {
        await reportService.update(formData.id, data);
      } else {
        await reportService.create(data);
      }

      setOpen(false);
      setFormData({
        id: "",
        title: "",
        description: "",
        location: "",
        longitude: undefined,
        latitude: undefined,
        status: "",
        type: ReportType.unknown,
        tags: "",
        imageFiles: [],
      });
      loadReports();
    } catch (err) {
      console.error("Error saving report:", err);
    }
  };

  const handleEdit = (r: Report) => {
    setFormData({
      id: r.id || "",
      title: r.title,
      description: r.description,
      location: r.location || "",
      longitude: r.longitude,
      latitude: r.latitude,
      status: r.status || "",
      type: r.type,
      tags: r.tags?.join(", ") || "",
      imageFiles: [],
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    await reportService.remove(id, {});
    loadReports();
  };

  const handleView = (r: Report) => {
    setSelected(r);
    setViewOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Report Management</h1>
        <Button onClick={() => setOpen(true)}>New Report</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search report..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={loadReports} disabled={loading}>
          Search
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          reports.map((r) => (
            <Card key={r.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {r.description || "No description"}
                </p>
                <p className="text-xs text-gray-500">
                  <b>Type:</b> {r.type} <br />
                  <b>Status:</b> {r.status || "N/A"} <br />
                  <b>Location:</b> {r.location || "N/A"} <br />
                  <b>Tags:</b> {r.tags?.join(", ") || "None"}
                </p>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => handleView(r)}>
                    View
                  </Button>
                  <Button size="sm" onClick={() => handleEdit(r)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(r.id!)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Report" : "Create Report"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  value={formData.longitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  value={formData.latitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Input
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as ReportType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="incidents">Incidents</SelectItem>
                  <SelectItem value="road_reports">Road Reports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Upload Images</Label>
              <Input type="file" multiple onChange={handleFileChange} />
              {formData.imageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.imageFiles.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {formData.id ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VIEW REPORT DIALOG */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Report Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-3">
              <p>
                <b>Title:</b> {selected.title}
              </p>
              <p>
                <b>Description:</b> {selected.description}
              </p>
              <p>
                <b>Type:</b> {selected.type}
              </p>
              <p>
                <b>Status:</b> {selected.status || "N/A"}
              </p>
              <p>
                <b>Location:</b> {selected.location || "N/A"}
              </p>
              <p>
                <b>Longitude:</b> {selected.longitude ?? "N/A"}
              </p>
              <p>
                <b>Latitude:</b> {selected.latitude ?? "N/A"}
              </p>
              <p>
                <b>Tags:</b> {selected.tags?.join(", ") || "None"}
              </p>
              {selected.images?.length ? (
                <div>
                  <b>Images:</b>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selected.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Report image ${i}`}
                        className="w-28 h-28 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p>No images uploaded.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
