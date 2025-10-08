import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Separator } from "@/components/atoms/separator";
import { Button } from "@/components/atoms/button";
import { Calendar, User, GitBranch, Clock, Tag, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "./delete.confirmation.dialog";
import {
  formatDate,
  getVersionTypeColor,
  getInitials,
} from "~/app/utils/version.helper";

interface VersionDetailsDialogProps {
  version: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (versionId: string) => void;
}

export function VersionDetailsDialog({
  version,
  open,
  onOpenChange,
  onDelete,
}: VersionDetailsDialogProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!version) return null;

  const handleDelete = () => {
    onDelete(version.id);
    setShowDeleteDialog(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Badge className={getVersionTypeColor(version.version)}>
              v{version.version}
            </Badge>
            <DialogTitle>{version.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h4 className="mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {version.description}
            </p>
          </div>

          <Separator />

          {/* Tags */}
          {version.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <h4>Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {version.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <h4>Created By</h4>
              </div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(
                      typeof version?.createdBy?.userName === "string"
                        ? version?.createdBy?.userName
                        : "N/A"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{version?.createdBy?.userName || "N/A"}</p>
                  <p className="text-muted-foreground">
                    {version?.createdBy?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <h4>Application</h4>
              </div>
              <p>{version?.app?.name || "N/A"}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h4>Created At</h4>
              </div>
              <p>{formatDate(version?.createdAt)}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h4>Last Updated</h4>
              </div>
              <p>{formatDate(version.updatedAt)}</p>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version ID</span>
              <span className="font-mono">{version.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">App ID</span>
              <span className="font-mono">{version?.appId || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={version?.isDeleted ? "destructive" : "default"}>
                {version?.isDeleted ? "Deleted" : "Active"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={version?.isDeleted}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Version
          </Button>
        </DialogFooter>
      </DialogContent>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        versionTitle={version.title}
        versionNumber={version.version}
      />
    </Dialog>
  );
}
