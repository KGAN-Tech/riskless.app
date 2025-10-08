// components/version-control/VersionDialogs.tsx

import { CreateVersionDialog } from "./create.version.dialog";
import { DeleteConfirmationDialog } from "./delete.confirmation.dialog";
import { VersionComparisonDialog } from "./version.comparison.dialog";

interface Props {
  showCreate: boolean;
  showDeleteId: string | null;
  showCompare: boolean;
  onCreate: (data: any) => void;
  onDelete: () => void;
  onDialogChange: (
    type: "create" | "delete" | "compare",
    open: boolean
  ) => void;
  selectedVersion?: Version;
  versionsToCompare: Version[];
}

export function VersionDialogs({
  showCreate,
  showDeleteId,
  showCompare,
  onCreate,
  onDelete,
  onDialogChange,
  selectedVersion,
  versionsToCompare,
}: Props) {
  return (
    <>
      <CreateVersionDialog
        open={showCreate}
        onOpenChange={(open) => onDialogChange("create", open)}
        onCreateVersion={onCreate}
      />
      <DeleteConfirmationDialog
        open={!!showDeleteId}
        onOpenChange={(open) => !open && onDialogChange("delete", false)}
        onConfirm={onDelete}
        versionTitle={selectedVersion?.title || ""}
        versionNumber={selectedVersion?.version || ""}
      />
      <VersionComparisonDialog
        versions={versionsToCompare}
        open={showCompare}
        onOpenChange={(open) => onDialogChange("compare", open)}
      />
    </>
  );
}
