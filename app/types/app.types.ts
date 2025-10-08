// Enums
export enum AppStatus {
  active = "active",
  inactive = "inactive",
}

export enum AppType {
  emr = "emr",
  his = "his",
  cms = "cms",
  erp = "erp",
  unknown = "unknown",
}

export enum AppEnv {
  local = "local",
  development = "development",
  sandbox = "sandbox",
  production = "production",
  other = "other",
}

// Nested types
export interface AppPath {
  environment?: AppEnv;
  url?: string;
}

// Main App interface
export interface App {
  id: string;
  name: string;
  description?: string | null;
  version: string;
  developer: string[];
  path: AppPath[];
  logo?: string | null;
  company?: string | null;
  status: AppStatus;
  type: AppType;
  date?: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  providerId?: string | null;

  // Relations (optional, can be expanded with their own interfaces if needed)
  provider?: any; // Facility
  User?: any[]; // User[]
  Report?: any[]; // Report[]
  Version?: any[]; // Version[]
  AuditLog?: any[]; // AuditLog[]
}
