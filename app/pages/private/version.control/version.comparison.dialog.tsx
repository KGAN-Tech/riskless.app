import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import { Card } from "@/components/atoms/card";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import {
  Calendar,
  User,
  GitBranch,
  Clock,
  Tag,
  ArrowRight,
} from "lucide-react";
import {
  formatDate,
  getVersionTypeColor,
  getInitials,
} from "~/app/utils/version.helper";

interface VersionComparisonDialogProps {
  versions: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionComparisonDialog({
  versions,
  open,
  onOpenChange,
}: VersionComparisonDialogProps) {
  if (versions.length !== 2) return null;

  const [version1, version2] = versions;

  const hasChanged = (field1: any, field2: any) => {
    if (Array.isArray(field1) && Array.isArray(field2)) {
      return [...field1].sort().toString() !== [...field2].sort().toString();
    }
    return JSON.stringify(field1) !== JSON.stringify(field2);
  };

  const ComparisonField = ({
    label,
    value1,
    value2,
    icon: Icon,
    render,
  }: {
    label: string;
    value1: any;
    value2: any;
    icon: React.ComponentType<{ className?: string }>;
    render?: (value: any) => React.ReactNode;
  }) => {
    const changed = hasChanged(value1, value2);

    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium">{label}</h4>
          {changed && (
            <Badge variant="outline" className="text-xs">
              Changed
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`p-4 ${
              changed
                ? "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20"
                : ""
            }`}
          >
            {render ? render(value1) : <p>{String(value1)}</p>}
          </Card>
          <Card
            className={`p-4 ${
              changed
                ? "border-green-500/50 bg-green-50 dark:bg-green-950/20"
                : ""
            }`}
          >
            {render ? render(value2) : <p>{String(value2)}</p>}
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Version Comparison</span>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </DialogTitle>
        </DialogHeader>

        {/* Version Headers */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Badge className={getVersionTypeColor(version1.version)}>
              v{version1.version}
            </Badge>
            <h3 className="truncate">{version1.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getVersionTypeColor(version2.version)}>
              v{version2.version}
            </Badge>
            <h3 className="truncate">{version2.title}</h3>
          </div>
        </div>

        <div className="space-y-6">
          <ComparisonField
            label="Version Number"
            value1={version1.version}
            value2={version2.version}
            icon={GitBranch}
            render={(v) => <p className="font-mono">{v}</p>}
          />

          <ComparisonField
            label="Title"
            value1={version1.title}
            value2={version2.title}
            icon={Tag}
          />

          <Separator />

          <ComparisonField
            label="Description"
            value1={version1.description}
            value2={version2.description}
            icon={Tag}
            render={(v) => (
              <p className="text-muted-foreground whitespace-pre-wrap">{v}</p>
            )}
          />

          <Separator />

          <ComparisonField
            label="Tags"
            value1={version1.tags}
            value2={version2.tags}
            icon={Tag}
            render={(tags: string[]) => (
              <div className="flex flex-wrap gap-2">
                {tags?.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No tags</span>
                )}
              </div>
            )}
          />

          <Separator />

          <ComparisonField
            label="Application"
            value1={version1.app?.name || "N/A"}
            value2={version2.app?.name || "N/A"}
            icon={GitBranch}
          />

          <Separator />

          <ComparisonField
            label="Created By"
            value1={version1.createdBy || null}
            value2={version2.createdBy || null}
            icon={User}
            render={(
              user: { userName?: string | null; email?: string | null } | null
            ) =>
              user ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(user.userName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{user.userName || "N/A"}</p>
                    <p className="text-muted-foreground">
                      {user.email || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">Unknown User</span>
              )
            }
          />

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComparisonField
              label="Created At"
              value1={version1.createdAt}
              value2={version2.createdAt}
              icon={Calendar}
              render={(d) => <p>{formatDate(d)}</p>}
            />

            <ComparisonField
              label="Last Updated"
              value1={version1.updatedAt}
              value2={version2.updatedAt}
              icon={Clock}
              render={(d) => <p>{formatDate(d)}</p>}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
