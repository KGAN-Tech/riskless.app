import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { X } from "lucide-react";
import { useFetchApps } from "@/hooks/use.fetch.app";
import type { App } from "@/types/app.types";
import { getUserFromLocalStorage } from "@/utils/auth.helper";
import { RichTextEditor } from "./rich.text.editor";

interface CreateVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVersion: (version: any) => void;
}

export function CreateVersionDialog({
  open,
  onOpenChange,
  onCreateVersion,
}: CreateVersionDialogProps) {
  const { apps, loading, error } = useFetchApps(1, 50, "asc");

  const [formData, setFormData] = useState({
    appId: "", // selected app
    createdById: "", // logged in user
    title: "",
    description: "",
    version: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getUserFromLocalStorage();
    const userId = auth?.user?.id ?? null;

    onCreateVersion({
      ...formData,
      createdById: userId, // ✅ ensures it’s always there
    });

    // reset
    setFormData({
      title: "",
      description: "",
      version: "",
      appId: "",
      tags: [],
      createdById: "",
    });
    setTagInput("");
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* App Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="app">Select App</Label>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading apps...</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <select
                  id="app"
                  className="w-full border rounded-md p-2"
                  value={formData.appId}
                  onChange={(e) =>
                    setFormData({ ...formData, appId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select an app --</option>
                  {apps.map((app: App) => (
                    <option key={app.id} value={app.id}>
                      {app.name} ({app.version})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Version number */}
            <div className="space-y-2">
              <Label htmlFor="version">Version Number</Label>
              <Input
                id="version"
                placeholder="e.g., 1.0.0"
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                required
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Version Title</Label>
              <Input
                id="title"
                placeholder="e.g., Major UI Redesign"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Describe the changes and improvements in this version..."
              />
            </div>

            {/* Tags (kept from your original code) */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Version</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
