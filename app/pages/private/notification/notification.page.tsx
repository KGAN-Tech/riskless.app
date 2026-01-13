import { useEffect, useState } from "react";
import { notificationService } from "@/services/notification.service";
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

type NotificationType = "unknown" | "app_update" | "promotion" | "news";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    type: "unknown" as NotificationType,
    tags: "",
  });

  // Load notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll({ query, fields: "user" });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Save new or update existing
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        type: formData.type,
      };

      if (formData.id) {
        await notificationService.update(formData.id, data);
      } else {
        await notificationService.create(data);
      }

      setOpen(false);
      setFormData({
        id: "",
        title: "",
        description: "",
        status: "",
        type: "unknown",
        tags: "",
      });
      loadNotifications();
    } catch (err) {
      console.error("Error saving notification:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (n: any) => {
    setFormData({
      id: n.id,
      title: n.title,
      description: n.description,
      status: n.status || "",
      type: n.type,
      tags: n.tags?.join(", ") || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    setDeletingId(id);
    try {
      await notificationService.remove(id, {});
      loadNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notification Management</h1>
        <Button onClick={() => setOpen(true)}>New Notification</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search notifications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={loadNotifications} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-background shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Created By</th>
                <th className="px-4 py-3 font-medium">Created At</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notifications.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr
                    key={n.id}
                    className="border-t transition hover:bg-muted/30"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 font-medium line-clamp-1">
                      {n.title}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 text-xs text-muted-foreground line-clamp-2">
                      {n.description || "No description"}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">{n.type.replace("_", " ")}</td>

                    {/* Created By */}
                    <td className="px-4 py-3">
                      {n.createdBy?.userName || "Unknown"}
                    </td>

                    {/* Created At */}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleEdit(n)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(n.id)}
                          disabled={deletingId === n.id}
                        >
                          {deletingId === n.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Notification" : "Create Notification"}
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
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as NotificationType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="app_update">App Update</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : formData.id ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
