import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/atoms/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { AddItemModal } from "./add.item.modal";
import { inventoryService } from "@/services/inventory.service";
import { getUserFromLocalStorage } from "@/utils/auth.helper";
import type { Inventory, InventoryPayload } from "@/types/inventory";
import { EditItemModal } from "./edit.item.modal";

export default function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);

  const facilityId = getUserFromLocalStorage()?.user?.facilityId;

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const fetchInventories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await inventoryService.getAll({
        page: 1,
        limit: 50,
        query: searchQuery,
        facilityId,
      });
      setInventories(res.data);
    } catch (err) {
      console.error("Failed to load inventories:", err);
      setInventories([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, facilityId]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const handleAddInventory = async (formData: InventoryPayload) => {
    try {
      const facilityId = getUserFromLocalStorage()?.user?.facilityId;
      if (!facilityId) throw new Error("Missing facilityId");
      await inventoryService.create({ ...formData, facilityId });
      await fetchInventories();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create inventory", error);
    }
  };

  const handleEditInventory = async (
    formData: InventoryPayload,
    id: string
  ) => {
    try {
      const facilityId = getUserFromLocalStorage()?.user?.facilityId;
      if (!facilityId) throw new Error("Missing facilityId");

      const payload = { ...formData, facilityId };
      console.log("updating inventory:", id, payload); // debug

      await inventoryService.update(id, payload);
      await fetchInventories();
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update inventory", error);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      // if your API expects a body with soft delete info, pass it here
      await inventoryService.remove(id, { deleted: true });
      // or whatever your API expects to mark as deleted
      await fetchInventories();
    } catch (error) {
      console.error("Failed to delete inventory", error);
    }
  };

  function renderNestedData(data: any, level = 0): React.ReactNode {
    if (data === null || data === undefined) {
      return <span>-</span>;
    }
    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return <span>{data.toString()}</span>;
    }
    if (Array.isArray(data)) {
      if (data.length === 0) return <span>Empty Array</span>;
      return (
        <ul style={{ marginLeft: level * 16 }}>
          {data.map((item, idx) => (
            <li key={idx}>{renderNestedData(item, level + 1)}</li>
          ))}
        </ul>
      );
    }
    if (typeof data === "object") {
      const keys = Object.keys(data);
      if (keys.length === 0) return <span>{`{}`}</span>;
      return (
        <ul style={{ marginLeft: level * 16 }}>
          {keys.map((key) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {renderNestedData((data as any)[key], level + 1)}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{String(data)}</span>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between w-full">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search inventories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto -mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (SRP)</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Loading…
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : inventories.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No inventories available.
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              inventories.map((item) => (
                <tbody key={item.id}>
                  <TableRow
                    onClick={() => toggleRow(item.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>{item.sku ?? "-"}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.category.join(", ")}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price?.srp ?? "-"}</TableCell>
                    <TableCell>{item.facility?.name ?? "-"}</TableCell>
                    <TableCell className="space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInventory(item.id);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>

                  {expandedRowId === item.id && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-gray-50 p-4">
                        <div className="space-y-2">
                          <div>
                            <strong>Brand:</strong> {item.brand ?? "-"}
                          </div>
                          <div>
                            <strong>Unit:</strong>{" "}
                            {item.unit
                              ? `${item.unit.value ?? "-"} (${
                                  item.unit.code ?? "-"
                                })`
                              : "-"}
                          </div>
                          <div>
                            <strong>Codes:</strong>{" "}
                            {item.codes.length > 0
                              ? item.codes.map((code, i) => (
                                  <div key={i}>
                                    {code.type}: {code.code}{" "}
                                    {code.name ? `(${code.name})` : ""}
                                  </div>
                                ))
                              : "-"}
                          </div>
                          <div>
                            <strong>Metadata:</strong>
                            {item.metadata
                              ? renderNestedData(item.metadata)
                              : "-"}
                          </div>
                          <div>
                            <strong>Created At:</strong>{" "}
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : "-"}
                          </div>
                          <div>
                            <strong>Updated At:</strong>{" "}
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
              ))
            )}
          </Table>
        </div>
      </Card>

      <AddItemModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddInventory}
      />
      <EditItemModal
        open={Boolean(editingItem)}
        onOpenChange={(open) => !open && setEditingItem(null)}
        item={editingItem}
        onSubmit={handleEditInventory}
      />
    </div>
  );
}
