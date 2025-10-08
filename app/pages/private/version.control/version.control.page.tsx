import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  GitBranch,
  Calendar,
  User,
  Trash2,
  GitCompare,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Separator } from "@/components/atoms/separator";
import { ScrollArea } from "@/components/atoms/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/atoms/pagination";
import { CreateVersionDialog } from "./create.version.dialog";
import { DeleteConfirmationDialog } from "./delete.confirmation.dialog";
import { VersionComparisonDialog } from "./version.comparison.dialog";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  formatDate,
  formatDateTime,
  getVersionTypeColor,
  getInitials,
} from "~/app/utils/version.helper";
import { versionControlService } from "@/services/version.control.service";
import { toast } from "~/app/components/atoms/use-toast";

export function VersionControlPage() {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    []
  );
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);

  const [deleteVersionId, setDeleteVersionId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await versionControlService.getAll();
        const data = resp.data;

        const formatted = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setVersions(formatted);

        if (!selectedVersionId) {
          const first = formatted.find((v: any) => !v.isDeleted);
          if (first) {
            setSelectedVersionId(first.id);
          }
        }
      } catch (err: any) {
        console.error("Error fetching versions:", err);
        setError(err.message || "Failed to load versions");
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  const selectedVersion = versions.find(
    (v) => v.id === selectedVersionId && !v.isDeleted
  );

  const filteredVersions = versions
    .filter((version) => {
      if (version.isDeleted) return false;
      const matchesSearch =
        version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        version.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        version.version.includes(searchQuery) ||
        version.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSearch;
    })
    .sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const totalPages = Math.ceil(filteredVersions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVersions = filteredVersions.slice(startIndex, endIndex);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(parseInt(val));
    setCurrentPage(1);
  };

  const handleCreateVersion = async (newVersionData: any) => {
    try {
      const resp = await versionControlService.create(newVersionData);
      const created = resp.data;

      const versionObj = {
        ...created,
        createdAt: new Date(created.createdAt),
        updatedAt: new Date(created.updatedAt),
      };

      setVersions((prev) => [versionObj, ...prev]);
      setSelectedVersionId(versionObj.id);

      toast({
        title: "Version Created",
        description: `Version "${versionObj.title}" (v${versionObj.version}) has been successfully created.`,
        variant: "success",
      });
    } catch (err: any) {
      console.error("Error creating version:", err);
      toast({
        title: "Error",
        description: "Failed to create version. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSoftDelete = async (
    action: "softDelete" | "restore",
    items: string[]
  ) => {
    try {
      await versionControlService.softDelete(action, items);
      console.log(`Soft delete response for action: ${action}, items:`, items);

      setVersions((prev) =>
        prev.map((v) => {
          if (items.includes(v.id)) {
            console.log(
              `Marking version ${v.id} as isDeleted: ${action === "softDelete"}`
            );
            return {
              ...v,
              isDeleted: action === "softDelete",
              updatedAt: new Date(),
            };
          }
          return v;
        })
      );

      if (action === "softDelete" && deleteVersionId) {
        if (selectedVersionId === deleteVersionId) {
          const stillAvailable = filteredVersions.filter(
            (v) => !items.includes(v.id)
          );
          if (stillAvailable.length > 0) {
            setSelectedVersionId(stillAvailable[0].id);
          } else {
            setSelectedVersionId(null);
          }
        }
      }
    } catch (err: any) {
      console.error("Error soft deleting versions:", err);
      toast({
        title: "Error",
        description: "Failed to delete version. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await versionControlService.remove(id);
      setVersions((prev) => prev.filter((v) => v.id !== id));

      if (selectedVersionId === id) {
        const remaining = filteredVersions.filter((v) => v.id !== id);
        if (remaining.length > 0) {
          setSelectedVersionId(remaining[0].id);
        } else {
          setSelectedVersionId(null);
        }
      }
    } catch (err: any) {
      console.error("Error removing version:", err);
    }
  };

  // Bulk remove
  const handleBulkRemove = async (items: string[]) => {
    try {
      await versionControlService.bulkRemove(items);
      setVersions((prev) => prev.filter((v) => !items.includes(v.id)));
      if (items.includes(selectedVersionId || "")) {
        const remaining = filteredVersions.filter((v) => !items.includes(v.id));
        if (remaining.length > 0) {
          setSelectedVersionId(remaining[0].id);
        } else {
          setSelectedVersionId(null);
        }
      }
    } catch (err: any) {
      console.error("Error in bulk remove:", err);
    }
  };

  // Toggle items for comparison selection
  const toggleVersionSelection = (versionId: string) => {
    if (selectedForComparison.includes(versionId)) {
      setSelectedForComparison((prev) => prev.filter((id) => id !== versionId));
    } else if (selectedForComparison.length < 2) {
      setSelectedForComparison((prev) => [...prev, versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setShowComparisonDialog(true);
    }
  };

  const handleCancelComparison = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading versions...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex bg-background">
      <div className="flex-1">
        {selectedVersion ? (
          <div className="flex flex-col">
            <div className="border-b bg-card px-8 py-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge
                    className={getVersionTypeColor(selectedVersion.version)}
                  >
                    v{selectedVersion.version}
                  </Badge>
                  <h1 className="truncate">{selectedVersion.title}</h1>
                </div>
                <div className="flex gap-2 ml-4">
                  {!comparisonMode ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setComparisonMode(true)}
                      >
                        <GitCompare className="w-4 h-4 mr-2" />
                        Compare
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Version
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleCompare}
                        disabled={selectedForComparison.length !== 2}
                      >
                        Compare Selected ({selectedForComparison.length}/2)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelComparison}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {selectedVersion.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedVersion.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{selectedVersion?.createdBy?.userName || "N/A"}</span>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="max-w-4xl px-8 py-8">
                <div className="mb-8">
                  <h3 className="mb-4">Release Notes</h3>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedVersion.description}
                    </p>
                  </div>
                </div>

                <Separator className="mb-8" />

                <div className="mb-8">
                  <h3 className="mb-4">Version Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <h4>Released By</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {getInitials(
                              typeof selectedVersion?.createdBy?.userName ===
                                "string"
                                ? selectedVersion?.createdBy?.userName
                                : "N/A"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{selectedVersion?.createdBy?.userName || "N/A"}</p>
                          <p className="text-muted-foreground">
                            {selectedVersion?.createdBy?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <h4>System</h4>
                      </div>
                      <p>{selectedVersion?.app?.name || "N/A"}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <h4>Release Date</h4>
                      </div>
                      <p>{formatDateTime(selectedVersion.createdAt)}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h4>Last Updated</h4>
                      </div>
                      <p>{formatDateTime(selectedVersion.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <Separator className="mb-8" />

                <div className="mb-8">
                  <h3 className="mb-4">Technical Details</h3>
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Version ID</span>
                      <code className="font-mono bg-background px-2 py-1 rounded">
                        {selectedVersion?.id || "N/A"}
                      </code>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Application ID
                      </span>
                      <code className="font-mono bg-background px-2 py-1 rounded">
                        {selectedVersion?.appId || "N/A"}
                      </code>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Creator ID</span>
                      <code className="font-mono bg-background px-2 py-1 rounded">
                        {selectedVersion?.createdById || "N/A"}
                      </code>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          selectedVersion.isDeleted ? "destructive" : "default"
                        }
                      >
                        {selectedVersion.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-destructive">Danger Zone</h3>
                  <div className="border border-destructive/50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="mb-2">Delete this version</h4>
                        <p className="text-muted-foreground">
                          Once deleted, this version will be removed from the
                          active list and cannot be recovered.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setDeleteVersionId(selectedVersion.id)}
                        className="ml-4"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <GitBranch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="mb-2">No Version Selected</h2>
              <p className="text-muted-foreground">
                Select a version from the history to view details
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-96 border-l flex flex-col bg-muted/30">
        <div className="p-6 border-b bg-card">
          <h3 className="mb-4">Version History</h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search versions..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">items</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {paginatedVersions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  comparisonMode
                    ? selectedForComparison.includes(version.id)
                      ? "border-primary bg-accent"
                      : "border-transparent hover:border-border hover:bg-accent/50"
                    : selectedVersionId === version.id
                    ? "border-primary bg-accent"
                    : "border-transparent hover:border-border hover:bg-accent/50"
                }`}
                onClick={() => {
                  if (comparisonMode) {
                    toggleVersionSelection(version.id);
                  } else {
                    setSelectedVersionId(version.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {comparisonMode && (
                    <div className="pt-0.5">
                      <Checkbox
                        checked={selectedForComparison.includes(version.id)}
                        disabled={
                          !selectedForComparison.includes(version.id) &&
                          selectedForComparison.length >= 2
                        }
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge
                        className={getVersionTypeColor(version.version)}
                        variant="secondary"
                      >
                        v{version.version}
                      </Badge>
                      {selectedVersionId === version.id && !comparisonMode && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <h4 className="truncate mb-1">{version.title}</h4>
                    <p className="text-muted-foreground line-clamp-2 mb-2">
                      {version.description.split("\n")[0]}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(version.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredVersions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No versions found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {filteredVersions.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t bg-card">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsisBefore =
                      page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter =
                      page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-center mt-2">
              <p className="text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredVersions.length)} of{" "}
                {filteredVersions.length}
              </p>
            </div>
          </div>
        )}
      </div>

      <CreateVersionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateVersion={handleCreateVersion}
      />

      <DeleteConfirmationDialog
        open={!!deleteVersionId}
        onOpenChange={(open) => !open && setDeleteVersionId(null)}
        onConfirm={() => {
          if (deleteVersionId) {
            handleSoftDelete("softDelete", [deleteVersionId]);
            toast({
              title: "Version Deleted",
              description: `The version has been successfully deleted.`,
              variant: "success",
            });
            setDeleteVersionId(null);
          }
        }}
        versionTitle={selectedVersion?.title || ""}
        versionNumber={selectedVersion?.version || ""}
      />

      <VersionComparisonDialog
        versions={versions.filter((v) => selectedForComparison.includes(v.id))}
        open={showComparisonDialog}
        onOpenChange={(open) => {
          setShowComparisonDialog(open);
          if (!open) {
            setComparisonMode(false);
            setSelectedForComparison([]);
          }
        }}
      />
    </div>
  );
}
