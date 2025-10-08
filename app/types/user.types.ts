// Enums
export enum UserRole {
  user = "user",
  admin = "admin",
  super_admin = "super_admin",
}

export enum UserType {
  admin = "admin",
  patient = "patient",
  patient_member = "patient_member",
  patient_dependent = "patient_dependent",
  presenter = "presenter",
  physician = "physician",
  hci = "hci",
  laboratory = "laboratory",
  pharmacy = "pharmacy",
  encoder = "encoder",
  provider = "provider",
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
}

export enum LegalType {
  privacy_policy = "privacy_policy",
  terms_and_condition = "terms_and_condition",
}

export enum PasswordType {
  text = "text",
  mpin4char = "mpin4char",
  mpin6char = "mpin6char",
}

export enum MembershipType {
  konsulta = "konsulta",
  yakap = "yakap",
}

// Nested types
export interface UserPassword {
  value: string;
  type: PasswordType;
}

export interface Legal {
  value: boolean;
  type: LegalType;
}

export interface Membership {
  type?: MembershipType;
  effectivityYear?: string;
}

// Main User interface
export interface User {
  id: string;
  personId: string;
  person?: any; // Person type (define separately if needed)

  userName?: string | null;
  passwords: UserPassword[];

  role: UserRole;
  type: UserType;
  status: UserStatus;

  isDeleted: boolean;
  legal: Legal[];

  lastLogin?: Date | null;
  loginMethod: string;

  facilityId?: string | null;
  facility?: any; // Facility type

  appId?: string | null;
  app?: any; // App type

  parentId?: string | null;
  parent?: User | null;
  children?: User[];

  joinAt?: Date | null;
  membership?: Membership | null;

  createdAt: Date;
  updatedAt: Date;

  Counter?: any[]; // define type if available
  Access?: any[];
  Queuing?: any[];
  Report?: any[];
  Version?: any[];
  AuditLog?: any[];
}
