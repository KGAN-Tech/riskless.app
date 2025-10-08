export interface Laboratory {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "Active" | "Maintenance" | "Inactive";
  type: "Clinical Laboratory" | "Diagnostic Center" | "Research Laboratory" | "Hospital Laboratory" | "Specialized Laboratory";
  operatingHours: string;
  totalStaff: number;
  totalTests: number;
  monthlyTests: number;
  lastUpdated: string;
  accreditationNumber: string;
  licenseNumber: string;
  services: string[];
  equipment: string[];
  certifications: string[];
}

export interface LaboratoryStats {
  totalLaboratories: number;
  activeLaboratories: number;
  totalTests: number;
  monthlyTests: number;
  averageTurnaroundTime: string;
  accuracyRate: number;
}

export interface LaboratoryService {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  turnaroundTime: string;
  isAvailable: boolean;
}

export interface LaboratoryEquipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  lastMaintenance: string;
  status: "Operational" | "Maintenance" | "Out of Service";
  location: string;
}

export interface LaboratoryCertification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Pending Renewal";
  certificateNumber: string;
}
