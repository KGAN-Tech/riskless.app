import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Label } from "@/components/atoms/label";
import type { Inventory, InventoryPayload } from "@/types/inventory";
import { type Library, type LibraryFilterState } from "@/types/library";
import { libraryService } from "@/services/library.service";
import { inventoryService } from "~/app/services/inventory.service";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Inventory | null;
  onSubmit: (data: InventoryPayload, id: string) => void;
}

const INVENTORY_TYPES: InventoryPayload["type"][] = [
  "medicine",
  "none",
  "tool",
  "equipment",
  "office_supply",
];
const INVENTORY_STATUS: InventoryPayload["status"][] = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "reserved",
  "on_ordered",
];
const CODE_TYPES: Array<"bar_code" | "qr_code" | "unknown"> = [
  "bar_code",
  "qr_code",
  "unknown",
];

export function EditItemModal({
  open,
  onOpenChange,
  item,
  onSubmit,
}: EditItemModalProps) {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [form, setForm] = useState<InventoryPayload>({
    sku: "",
    name: "",
    type: "none",
    brand: "",
    category: [],
    status: "in_stock",
    quantity: 0,
    price: { srp: undefined, wholesale: undefined, retail: undefined },
    unit: { value: "", code: "" },
    codes: [],
    facilityId: "",
    metadataId: "",
  });

  const fetchLibraries = async (query: string) => {
    setLibraryLoading(true);
    try {
      const res = await libraryService.getAll({
        type: "medicine",
        limit: 10,
        query,
      });
      setLibraries(res.data);
    } catch (error) {
      console.error("Failed to load libraries:", error);
      setLibraries([]);
    } finally {
      setLibraryLoading(false);
    }
  };
  // debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLibraries(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (item) {
      setForm({
        sku: item.sku ?? "",
        name: item.name ?? "",
        type: (item.type as InventoryPayload["type"]) ?? "none",
        brand: item.brand ?? "",
        category: Array.isArray(item.category) ? item.category : [],
        status: (item.status as InventoryPayload["status"]) ?? "in_stock",
        quantity: item.quantity ?? 0,
        price: {
          srp: item.price?.srp,
          wholesale: item.price?.wholesale,
          retail: item.price?.retail,
        },
        unit: {
          value: item.unit?.value ?? "",
          code: item.unit?.code ?? "",
        },
        facilityId: item.facility?.id ?? "",
        metadataId: item.metadataId ?? "",
      });

      // if there’s a metadataId, fetch that library entry to display description
      if (item.metadata) {
        setSelectedLibrary(item.metadata); // Library object from backend
        setSearchQuery(item.metadata.description); // show its description
      } else {
        setSelectedLibrary(null);
        setSearchQuery("");
      }
    }
  }, [item]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (
    field: "srp" | "wholesale" | "retail",
    value: number | undefined
  ) => {
    setForm((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: value,
      },
    }));
  };

  const handleUnitChange = (field: "value" | "code", value: string) => {
    setForm((prev) => ({
      ...prev,
      unit: {
        ...prev.unit,
        [field]: value,
      },
    }));
  };

  const handleAddCode = () => {
    setForm((prev) => ({
      ...prev,
      codes: [
        ...(prev.codes || []),
        { type: "bar_code", code: "", name: "", description: "" },
      ],
    }));
  };

  const handleCodeChange = (
    index: number,
    field: "type" | "code" | "name" | "description",
    value: any
  ) => {
    const newCodes = [...(form.codes || [])];
    newCodes[index][field] = value;
    setForm((prev) => ({ ...prev, codes: newCodes }));
  };

  const handleSubmit = () => {
    if (!item) return;
    onSubmit(form, item.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update the details of this inventory item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <Input
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <Select
                value={form.type}
                onValueChange={(val) =>
                  handleChange("type", val as InventoryPayload["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <Input
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Category (comma-separated)
              </label>
              <Input
                value={
                  Array.isArray(form.category)
                    ? form.category.join(", ")
                    : (form.category as unknown as string) || ""
                }
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  handleChange("status", val as InventoryPayload["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_STATUS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Quantity *
              </label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div>
            {/* Library search only for medicine */}
            {form.type === "medicine" && (
              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Search Medicine Library
                </label>
                <Input
                  placeholder="Search by code or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {libraryLoading && (
                  <p className="text-xs text-gray-400">Loading...</p>
                )}

                {libraries.map((lib: Library) => (
                  <div
                    key={lib.id}
                    className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                      selectedLibrary?.id === lib.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      setSelectedLibrary(lib);
                      setSearchQuery(lib.description);
                      handleChange("metadataId", lib.id);
                      if (form.type === "medicine") {
                        handleChange("name", lib.description);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{lib.description}</span>
                      {selectedLibrary?.id === lib.id && (
                        <span className="text-xs text-blue-500">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            {(["srp", "wholesale", "retail"] as const).map((p) => (
              <div key={p}>
                <Label className="block text-sm font-medium mb-1">
                  {p.toUpperCase()}
                </Label>
                <Input
                  type="number"
                  value={form.price?.[p] ?? ""}
                  onChange={(e) =>
                    handlePriceChange(
                      p,
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </div>
            ))}
          </div>

          {/* Unit / Codes blocks can be uncommented here if needed */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
