import type {
  Clinic,
  ClinicStat,
  ClinicDescription,
  ClinicFilter,
} from "@/types/clinic.types";
import { api } from "./_api.client";

// Mock data for development
const mockClinics: Clinic[] = [
  {
    id: "1",
    name: "Super Rural Health Unit (RHU) of Alegria, SDN",
    type: "RHU",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "Our flagship clinic offering comprehensive healthcare services in the heart of Manila. State-of-the-art facilities with experienced medical professionals.",
    location: {
      address: "Brgy. Alegria, San Antonio, Zambales",
      city: "San Antonio",
      province: "Zambales",
      postalCode: "2200",
      coordinates: { lat: 9.464636463631754, lng: 125.57473811097091 },
    },
    contact: {
      phone: "+63 917 123 4567",
      email: "alegria@ftcc.com",
      emergency: "+63 917 123 4567",
    },
    schedule: [
      { day: "Monday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Tuesday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Wednesday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Thursday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Friday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Saturday", openTime: "08:00", closeTime: "16:00", isOpen: true },
      { day: "Sunday", openTime: "09:00", closeTime: "14:00", isOpen: true },
    ],
    services: [
      {
        id: "1",
        name: "Primary Care",
        description: "General consultations and health check-ups",
      },
      {
        id: "2",
        name: "Cardiology",
        description: "Heart health and cardiovascular care",
      },
      { id: "3", name: "Dental Care", description: "Complete dental services" },
      {
        id: "4",
        name: "Laboratory",
        description: "Diagnostic testing and blood work",
      },
    ],
    features: [
      "24/7 Emergency Care",
      "Modern Equipment",
      "Wheelchair Accessible",
      "Parking Available",
    ],
    isActive: true,
    capacity: 200,
    staffCount: 45,
  },
  {
    id: "2",
    name: "Bacuag Poblacion RHU",
    type: "RHU",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "Conveniently located in Bacuag, offering quality healthcare services to the local community with a focus on family medicine.",
    location: {
      address: "Brgy. Bacuag, San Antonio, Zambales",
      city: "San Antonio",
      province: "Zambales",
      postalCode: "2200",
      coordinates: { lat: 9.606421717421036, lng: 125.62353966915761 },
    },
    contact: {
      phone: "+63 917 123 4568",
      email: "bacuag@ftcc.com",
    },
    schedule: [
      { day: "Monday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Tuesday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Wednesday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Thursday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Friday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Saturday", openTime: "08:00", closeTime: "15:00", isOpen: true },
      { day: "Sunday", openTime: "Closed", closeTime: "Closed", isOpen: false },
    ],
    services: [
      {
        id: "1",
        name: "Primary Care",
        description: "Family medicine and general consultations",
      },
      {
        id: "2",
        name: "Pediatrics",
        description: "Child health and development",
      },
      { id: "3", name: "Vaccination", description: "Immunization services" },
      {
        id: "4",
        name: "Health Screening",
        description: "Preventive health checks",
      },
    ],
    features: [
      "Family-Friendly",
      "Child Care Area",
      "Easy Parking",
      "Public Transport Access",
    ],
    isActive: true,
    capacity: 150,
    staffCount: 25,
  },
  {
    id: "3",
    name: "FTCC Specialty Clinic - Makati",
    type: "specialty",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "Specialized medical services in the business district of Makati, focusing on executive health and specialized treatments.",
    location: {
      address: "789 Medical Plaza, Ayala Avenue",
      city: "Makati",
      province: "Metro Manila",
      postalCode: "1226",
      coordinates: { lat: 14.5547, lng: 121.0244 },
    },
    contact: {
      phone: "+63 2 8123 4569",
      email: "makati@ftcc.com",
    },
    schedule: [
      { day: "Monday", openTime: "07:00", closeTime: "19:00", isOpen: true },
      { day: "Tuesday", openTime: "07:00", closeTime: "19:00", isOpen: true },
      { day: "Wednesday", openTime: "07:00", closeTime: "19:00", isOpen: true },
      { day: "Thursday", openTime: "07:00", closeTime: "19:00", isOpen: true },
      { day: "Friday", openTime: "07:00", closeTime: "19:00", isOpen: true },
      { day: "Saturday", openTime: "08:00", closeTime: "16:00", isOpen: true },
      { day: "Sunday", openTime: "Closed", closeTime: "Closed", isOpen: false },
    ],
    services: [
      {
        id: "1",
        name: "Executive Health",
        description: "Comprehensive health assessments for executives",
      },
      {
        id: "2",
        name: "Cardiology",
        description: "Advanced cardiac care and diagnostics",
      },
      { id: "3", name: "Dermatology", description: "Skin care and treatments" },
      {
        id: "4",
        name: "Mental Health",
        description: "Professional counseling and therapy",
      },
    ],
    features: [
      "Executive Lounge",
      "Private Consultation Rooms",
      "Advanced Diagnostics",
      "Concierge Service",
    ],
    isActive: true,
    capacity: 100,
    staffCount: 30,
  },
  {
    id: "4",
    name: "FTCC Community Clinic - Pasig",
    type: "branch",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "Community-focused clinic serving the Pasig area with affordable healthcare and preventive medicine programs.",
    location: {
      address: "321 Community Health Center, Pasig City",
      city: "Pasig",
      province: "Metro Manila",
      postalCode: "1600",
      coordinates: { lat: 14.5764, lng: 121.0851 },
    },
    contact: {
      phone: "+63 2 8123 4570",
      email: "pasig@ftcc.com",
    },
    schedule: [
      { day: "Monday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Tuesday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Wednesday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Thursday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Friday", openTime: "08:00", closeTime: "17:00", isOpen: true },
      { day: "Saturday", openTime: "08:00", closeTime: "14:00", isOpen: true },
      { day: "Sunday", openTime: "Closed", closeTime: "Closed", isOpen: false },
    ],
    services: [
      {
        id: "1",
        name: "Primary Care",
        description: "General health consultations",
      },
      {
        id: "2",
        name: "Maternal Care",
        description: "Prenatal and postnatal care",
      },
      { id: "3", name: "Child Health", description: "Pediatric services" },
      {
        id: "4",
        name: "Community Health",
        description: "Health education and outreach",
      },
    ],
    features: [
      "Community Programs",
      "Affordable Care",
      "Health Education",
      "Local Partnerships",
    ],
    isActive: true,
    capacity: 120,
    staffCount: 20,
  },
  {
    id: "5",
    name: "FTCC Urgent Care - Taguig",
    type: "specialty",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "24/7 urgent care facility in Taguig providing immediate medical attention for non-life-threatening emergencies and walk-in patients.",
    location: {
      address: "555 Emergency Care Center, Bonifacio Global City",
      city: "Taguig",
      province: "Metro Manila",
      postalCode: "1634",
      coordinates: { lat: 14.5547, lng: 121.0244 },
    },
    contact: {
      phone: "+63 2 8123 4571",
      email: "urgent@ftcc.com",
      emergency: "+63 917 123 4571",
    },
    schedule: [
      { day: "Monday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Tuesday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Wednesday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Thursday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Friday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Saturday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      { day: "Sunday", openTime: "00:00", closeTime: "23:59", isOpen: true },
    ],
    services: [
      {
        id: "1",
        name: "Urgent Care",
        description: "Immediate treatment for minor injuries and illnesses",
      },
      {
        id: "2",
        name: "Emergency Services",
        description: "24/7 emergency medical care",
      },
      {
        id: "3",
        name: "X-Ray & Imaging",
        description: "On-site diagnostic imaging",
      },
      {
        id: "4",
        name: "Minor Procedures",
        description: "Sutures, wound care, and minor surgeries",
      },
    ],
    features: [
      "24/7 Operation",
      "No Appointment Needed",
      "Emergency Services",
      "On-site Lab",
    ],
    isActive: true,
    capacity: 80,
    staffCount: 35,
  },
  {
    id: "6",
    name: "FTCC Wellness Center - Marikina",
    type: "branch",
    image:
      "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1161&auto=format&fit=crop",
    description:
      "Holistic wellness center in Marikina focusing on preventive care, wellness programs, and alternative medicine approaches.",
    location: {
      address: "777 Wellness Avenue, Marikina Heights",
      city: "Marikina",
      province: "Metro Manila",
      postalCode: "1800",
      coordinates: { lat: 14.6507, lng: 121.1029 },
    },
    contact: {
      phone: "+63 2 8123 4572",
      email: "wellness@ftcc.com",
    },
    schedule: [
      { day: "Monday", openTime: "07:00", closeTime: "20:00", isOpen: true },
      { day: "Tuesday", openTime: "07:00", closeTime: "20:00", isOpen: true },
      { day: "Wednesday", openTime: "07:00", closeTime: "20:00", isOpen: true },
      { day: "Thursday", openTime: "07:00", closeTime: "20:00", isOpen: true },
      { day: "Friday", openTime: "07:00", closeTime: "20:00", isOpen: true },
      { day: "Saturday", openTime: "08:00", closeTime: "18:00", isOpen: true },
      { day: "Sunday", openTime: "08:00", closeTime: "16:00", isOpen: true },
    ],
    services: [
      {
        id: "1",
        name: "Wellness Programs",
        description: "Comprehensive wellness and lifestyle programs",
      },
      {
        id: "2",
        name: "Nutrition Counseling",
        description: "Dietary guidance and meal planning",
      },
      {
        id: "3",
        name: "Fitness Assessment",
        description: "Physical fitness evaluation and training",
      },
      {
        id: "4",
        name: "Alternative Medicine",
        description: "Acupuncture, massage therapy, and holistic treatments",
      },
    ],
    features: [
      "Wellness Programs",
      "Fitness Center",
      "Meditation Room",
      "Organic Cafe",
    ],
    isActive: true,
    capacity: 60,
    staffCount: 18,
  },
];

const mockStats: ClinicStat[] = [
  { id: "1", icon: "FaUsers", value: "6", label: "Clinic Locations" },
  { id: "2", icon: "FaClock", value: "24/7", label: "Emergency Care" },
  { id: "3", icon: "FaCheckCircle", value: "50+", label: "Medical Services" },
  { id: "4", icon: "FaChartLine", value: "15,000+", label: "Patients Served" },
];

const mockDescription: ClinicDescription = {
  id: "1",
  title: "Our Network of Healthcare Clinics",
  description:
    "FTCC operates a network of strategically located clinics across Metro Manila, each designed to serve the unique healthcare needs of their communities. From our flagship main clinic to specialized facilities, we bring quality healthcare closer to you with modern facilities, experienced professionals, and comprehensive services.",
  image:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop",
};

export const clinicService = {
  // API methods
  getAllClinics: (params?: Record<string, any>) =>
    api.getAll("/clinics", params ?? {}),

  getClinicById: (id: string) => api.get(`/clinics/${id}`),

  getClinicsByType: (type: string) => api.get(`/clinics/type/${type}`),

  getClinicsByCity: (city: string) => api.get(`/clinics/city/${city}`),

  getClinicStats: () => api.get("/clinics/stats"),

  getClinicDescription: () => api.get("/clinics/description"),

  filterClinics: (filters: ClinicFilter) => api.getAll("/clinics", filters),

  // Development mode methods
  _getMockClinics: () => mockClinics,
  _getMockClinicById: (id: string) =>
    mockClinics.find((clinic) => clinic.id === id),
  _getMockClinicsByType: (type: string) =>
    mockClinics.filter((clinic) => clinic.type === type),
  _getMockClinicsByCity: (city: string) =>
    mockClinics.filter((clinic) => clinic.location.city === city),
  _getMockClinicStats: () => mockStats,
  _getMockClinicDescription: () => mockDescription,
  _filterMockClinics: (filters: ClinicFilter) => {
    return mockClinics.filter((clinic) => {
      const matchesType = !filters.type || clinic.type === filters.type;
      const matchesCity =
        !filters.city || clinic.location.city === filters.city;
      const matchesService =
        !filters.service ||
        clinic.services.some((service) => service.name === filters.service);
      const matchesActive =
        filters.isActive === undefined || clinic.isActive === filters.isActive;

      return matchesType && matchesCity && matchesService && matchesActive;
    });
  },
};
