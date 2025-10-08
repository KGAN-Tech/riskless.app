export interface InventoryPrice {
  srp?: number;
  wholesale?: number;
  retail?: number;
}

export interface InventoryUnit {
  value?: string;
  code?: string;
}

export interface InventoryCode {
  name?: string;
  description?: string;
  type?: string;
  code?: string;
}

export interface Facility {
  id: string;
  name?: string;
}

export interface Inventory {
  id: string;
  sku?: string | null;
  name: string;
  type: string;
  brand?: string | null;
  category: string[];
  status: string;
  quantity: number;
  price: InventoryPrice;
  unit?: InventoryUnit | null;
  codes: InventoryCode[];
  metadataId? : string;
  metadata?: any;
  facility?: Facility | null;
  createdAt?: string;
  updatedAt?: string;
}

export type InventoryPayload = {
  sku?: string;
  name: string;
  type: "medicine" | "none" | "tool" | "equipment" | "office_supply";
  brand?: string;
  category: string[];
  status: "in_stock" | "low_stock" | "out_of_stock" | "reserved" | "on_ordered";
  quantity: number;
  price: InventoryPrice;
  unit?: InventoryUnit;
  codes?: (InventoryCode & { type: "bar_code" | "qr_code" | "unknown" })[];
  metadataId?: string;
  facilityId: string;
};
