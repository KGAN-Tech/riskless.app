import type { Laboratory } from "@/types/laboratory.types";

// Mock data for laboratories

// Mock data for laboratories
export const mockLaboratories: Laboratory[] = [
  {
    id: "1",
    name: "FTCC Clinical Laboratory - Main Branch",
    address: "123 Health Street, Quezon City, Metro Manila",
    phone: "+63 2 1234 5678",
    email: "lab@ftcc.com",
    manager: "Dr. Maria Santos",
    status: "Active",
    type: "Clinical Laboratory",
    operatingHours: "7:00 AM - 8:00 PM",
    totalStaff: 15,
    totalTests: 2500,
    monthlyTests: 450,
    lastUpdated: "2024-03-15",
    accreditationNumber: "LAB-ACC-001",
    licenseNumber: "DOH-LAB-2024-001",
    services: ["Blood Chemistry", "Hematology", "Microbiology", "Immunology", "Molecular Diagnostics"],
    equipment: ["Automated Analyzers", "Microscopes", "Centrifuges", "Incubators", "PCR Machines"],
    certifications: ["ISO 15189", "DOH Accreditation", "CAP Certification"],
  },
  {
    id: "2",
    name: "FTCC Diagnostic Center - Makati",
    address: "456 Medical Avenue, Makati City, Metro Manila",
    phone: "+63 2 2345 6789",
    email: "makati.lab@ftcc.com",
    manager: "Dr. James Reyes",
    status: "Active",
    type: "Diagnostic Center",
    operatingHours: "6:00 AM - 9:00 PM",
    totalStaff: 12,
    totalTests: 1800,
    monthlyTests: 320,
    lastUpdated: "2024-03-14",
    accreditationNumber: "LAB-ACC-002",
    licenseNumber: "DOH-LAB-2024-002",
    services: ["Radiology", "Ultrasound", "CT Scan", "MRI", "X-Ray"],
    equipment: ["CT Scanner", "MRI Machine", "X-Ray Machines", "Ultrasound Units"],
    certifications: ["ISO 13485", "DOH Accreditation", "PhilHealth Accreditation"],
  },
  {
    id: "3",
    name: "FTCC Research Laboratory - Cebu",
    address: "789 Research Road, Cebu City, Cebu",
    phone: "+63 32 3456 7890",
    email: "cebu.lab@ftcc.com",
    manager: "Dr. Sarah Tan",
    status: "Active",
    type: "Research Laboratory",
    operatingHours: "8:00 AM - 6:00 PM",
    totalStaff: 8,
    totalTests: 1200,
    monthlyTests: 180,
    lastUpdated: "2024-03-13",
    accreditationNumber: "LAB-ACC-003",
    licenseNumber: "DOH-LAB-2024-003",
    services: ["Clinical Trials", "Drug Testing", "Biomarker Analysis", "Genetic Testing"],
    equipment: ["HPLC", "Mass Spectrometers", "PCR Machines", "Sequencers"],
    certifications: ["ISO 17025", "FDA Registration", "Clinical Trial Registration"],
  },
  {
    id: "4",
    name: "FTCC Hospital Laboratory - Davao",
    address: "321 Medical Center Drive, Davao City, Davao del Sur",
    phone: "+63 82 4567 8901",
    email: "davao.lab@ftcc.com",
    manager: "Dr. Michael Cruz",
    status: "Maintenance",
    type: "Hospital Laboratory",
    operatingHours: "24/7",
    totalStaff: 20,
    totalTests: 3000,
    monthlyTests: 550,
    lastUpdated: "2024-03-12",
    accreditationNumber: "LAB-ACC-004",
    licenseNumber: "DOH-LAB-2024-004",
    services: ["Emergency Lab Tests", "Blood Bank", "Pathology", "Toxicology", "Emergency Chemistry"],
    equipment: ["Point-of-Care Analyzers", "Blood Bank Equipment", "Pathology Equipment"],
    certifications: ["ISO 15189", "DOH Accreditation", "Blood Bank License"],
  },
  {
    id: "5",
    name: "FTCC Specialized Laboratory - Iloilo",
    address: "654 Specialized Drive, Iloilo City, Iloilo",
    phone: "+63 33 5678 9012",
    email: "iloilo.lab@ftcc.com",
    manager: "Dr. Lisa Anderson",
    status: "Active",
    type: "Specialized Laboratory",
    operatingHours: "8:00 AM - 7:00 PM",
    totalStaff: 10,
    totalTests: 1600,
    monthlyTests: 280,
    lastUpdated: "2024-03-11",
    accreditationNumber: "LAB-ACC-005",
    licenseNumber: "DOH-LAB-2024-005",
    services: ["Cardiac Markers", "Tumor Markers", "Hormone Testing", "Allergy Testing", "Autoimmune Testing"],
    equipment: ["Specialized Analyzers", "Immunoassay Systems", "Allergy Testing Equipment"],
    certifications: ["ISO 15189", "DOH Accreditation", "Specialized Testing License"],
  },
];

// Service functions
export const getLaboratories = async (): Promise<Laboratory[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLaboratories);
    }, 500);
  });
};

export const getLaboratoryById = async (id: string): Promise<Laboratory | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const laboratory = mockLaboratories.find(lab => lab.id === id);
      resolve(laboratory || null);
    }, 300);
  });
};

export const createLaboratory = async (laboratory: Omit<Laboratory, 'id'>): Promise<Laboratory> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLaboratory: Laboratory = {
        ...laboratory,
        id: (mockLaboratories.length + 1).toString(),
      };
      resolve(newLaboratory);
    }, 500);
  });
};

export const updateLaboratory = async (id: string, updates: Partial<Laboratory>): Promise<Laboratory> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const laboratory = mockLaboratories.find(lab => lab.id === id);
      if (!laboratory) {
        throw new Error('Laboratory not found');
      }
      const updatedLaboratory = { ...laboratory, ...updates };
      resolve(updatedLaboratory);
    }, 500);
  });
};

export const deleteLaboratory = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};
