import { api } from "./_api.client";

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "Active" | "Maintenance" | "Inactive";
  type: string;
  operatingHours: string;
  totalStaff: number;
  totalInventory: number;
  monthlyRevenue: number;
  lastUpdated: string;
};

const mockPharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "FTCC Pharmacy - Main Branch",
    address: "123 Health Street, Quezon City, Metro Manila",
    phone: "+63 2 1234 5678",
    email: "pharmacy@ftcc.com",
    manager: "Dr. Maria Santos",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "24/7",
    totalStaff: 12,
    totalInventory: 1250,
    monthlyRevenue: 85000,
    lastUpdated: "2024-03-15",
  },
  {
    id: "2",
    name: "FTCC Pharmacy - Makati Branch",
    address: "456 Medical Avenue, Makati City, Metro Manila",
    phone: "+63 2 2345 6789",
    email: "makati.pharmacy@ftcc.com",
    manager: "Dr. James Reyes",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "8:00 AM - 8:00 PM",
    totalStaff: 8,
    totalInventory: 890,
    monthlyRevenue: 65000,
    lastUpdated: "2024-03-14",
  },
  {
    id: "3",
    name: "FTCC Pharmacy - Cebu Branch",
    address: "789 Wellness Road, Cebu City, Cebu",
    phone: "+63 32 3456 7890",
    email: "cebu.pharmacy@ftcc.com",
    manager: "Dr. Sarah Tan",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "7:00 AM - 9:00 PM",
    totalStaff: 10,
    totalInventory: 1100,
    monthlyRevenue: 72000,
    lastUpdated: "2024-03-13",
  },
  {
    id: "4",
    name: "FTCC Pharmacy - Davao Branch",
    address: "321 Health Boulevard, Davao City, Davao del Sur",
    phone: "+63 82 4567 8901",
    email: "davao.pharmacy@ftcc.com",
    manager: "Dr. Michael Cruz",
    status: "Maintenance",
    type: "Hospital Pharmacy",
    operatingHours: "8:00 AM - 6:00 PM",
    totalStaff: 6,
    totalInventory: 750,
    monthlyRevenue: 45000,
    lastUpdated: "2024-03-12",
  },
  {
    id: "5",
    name: "FTCC Pharmacy - Iloilo Branch",
    address: "654 Medical Center Drive, Iloilo City, Iloilo",
    phone: "+63 33 5678 9012",
    email: "iloilo.pharmacy@ftcc.com",
    manager: "Dr. Lisa Anderson",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "7:00 AM - 7:00 PM",
    totalStaff: 9,
    totalInventory: 980,
    monthlyRevenue: 58000,
    lastUpdated: "2024-03-11",
  },
];

export const pharmacyService = {
  // API methods
  getAll: (params?: Record<string, any>) =>
    api.getAll("/pharmacies", params ?? {}),
  get: (id: string) => api.get(`/pharmacies/${id}`),

  // Dev helpers
  _getMockPharmacies: (): Pharmacy[] => mockPharmacies,
  _getMockPharmacyById: (id: string): Pharmacy | undefined =>
    mockPharmacies.find((p) => p.id === id),
};
