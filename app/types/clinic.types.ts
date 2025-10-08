export interface ClinicService {
  id: string;
  name: string;
  description: string;
}

export interface ClinicSchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface ClinicContact {
  phone: string;
  email: string;
  emergency?: string;
}

export interface ClinicLocation {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Clinic {
  id: string;
  name: string;
  type: "main" | "branch" | "specialty" | "RHU";
  image: string;
  description: string;
  location: ClinicLocation;
  contact: ClinicContact;
  schedule: ClinicSchedule[];
  services: ClinicService[];
  features: string[];
  isActive: boolean;
  capacity: number;
  staffCount: number;
}

export interface ClinicStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface ClinicDescription {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ClinicFilter {
  type?: string;
  city?: string;
  service?: string;
  isActive?: boolean;
} 