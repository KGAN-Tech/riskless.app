import { TableRow, TableCell } from "@/components/atoms/table";
import { type Inventory } from "@/types/inventory";
import type { JSX } from "react";

interface Props {
  item: Inventory;
  expanded: boolean;
  onToggle: (id: string) => void;
  renderNestedData: (data: any) => JSX.Element;
}

export function InventoryRow({ item, expanded, onToggle, renderNestedData }: Props) {
  return (
    <>
      <TableRow onClick={() => onToggle(item.id)} className="cursor-pointer hover:bg-gray-100">
        <TableCell>{item.sku ?? "-"}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>{item.type}</TableCell>
        <TableCell>{item.category.join(", ")}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{item.price?.srp ?? "-"}</TableCell>
        <TableCell>{item.facility?.name ?? "-"}</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={9} className="bg-gray-50 p-4">
            {/* detailed view */}
            <div className="space-y-2">
              <div><strong>Brand:</strong> {item.brand ?? "-"}</div>
              <div>
                <strong>Unit:</strong> {item.unit ? `${item.unit.value ?? "-"} (${item.unit.code ?? "-"})` : "-"}
              </div>
              <div>
                <strong>Codes:</strong>{" "}
                {item.codes.length > 0
                  ? item.codes.map((code, i) => (
                      <div key={i}>
                        {code.type}: {code.code} {code.name ? `(${code.name})` : ""}
                      </div>
                    ))
                  : "-"}
              </div>
              <div><strong>Metadata:</strong>{item.metadata ? renderNestedData(item.metadata) : "-"}</div>
              <div><strong>Created At:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</div>
              <div><strong>Updated At:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
