import type { Doctor, Department, DoctorFilter } from "@/types/doctor.types";
import { api } from "./_api.client";

// Mock data for development
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Maria Santos",
    specialty: "General Medicine",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "15 years",
    education: "MD, University of the Philippines",
    description:
      "Experienced general practitioner with expertise in preventive care and chronic disease management.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.santos@ftcc.com",
    },
    isActive: true,
    schedule: {
      monday: ["09:00-12:00", "14:00-17:00"],
      wednesday: ["09:00-12:00", "14:00-17:00"],
      friday: ["09:00-12:00", "14:00-17:00"],
    },
  },
  {
    id: "2",
    name: "Dr. James Reyes",
    specialty: "Cardiology",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "12 years",
    education: "MD, Cardiology Fellowship, Philippine Heart Center",
    description:
      "Board-certified cardiologist specializing in preventive cardiology and heart disease management.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.reyes@ftcc.com",
    },
    isActive: true,
    schedule: {
      tuesday: ["09:00-12:00", "14:00-17:00"],
      thursday: ["09:00-12:00", "14:00-17:00"],
    },
  },
  {
    id: "3",
    name: "Dr. Sarah Tan",
    specialty: "Pediatrics",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "10 years",
    education: "MD, Pediatrics, University of Santo Tomas",
    description:
      "Dedicated pediatrician with a passion for child development and preventive care.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.tan@ftcc.com",
    },
    isActive: true,
    schedule: {
      monday: ["09:00-12:00"],
      wednesday: ["09:00-12:00"],
      friday: ["09:00-12:00"],
    },
  },
  {
    id: "4",
    name: "Dr. Michael Cruz",
    specialty: "Dental Care",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "8 years",
    education: "DMD, University of the East",
    description:
      "Experienced dentist specializing in cosmetic and restorative dentistry.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.cruz@ftcc.com",
    },
    isActive: true,
    schedule: {
      tuesday: ["09:00-12:00", "14:00-17:00"],
      thursday: ["09:00-12:00", "14:00-17:00"],
    },
  },
];

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "General Medicine",
    icon: "FaStethoscope",
    description: "Comprehensive primary care services for all ages",
    doctorCount: 5,
  },
  {
    id: "2",
    name: "Cardiology",
    icon: "FaHeartbeat",
    description: "Expert care for heart conditions and cardiovascular health",
    doctorCount: 3,
  },
  {
    id: "3",
    name: "Dental Care",
    icon: "FaTooth",
    description: "Complete dental services for optimal oral health",
    doctorCount: 4,
  },
  {
    id: "4",
    name: "Eye Care",
    icon: "FaEye",
    description: "Comprehensive vision care and eye health services",
    doctorCount: 2,
  },
  {
    id: "5",
    name: "Mental Health",
    icon: "FaBrain",
    description: "Professional mental health support and counseling",
    doctorCount: 3,
  },
  {
    id: "6",
    name: "Pediatrics",
    icon: "FaChild",
    description: "Specialized care for children's health and development",
    doctorCount: 4,
  },
];

export const doctorService = {
  // Get all doctors
  getAll: (params?: Record<string, any>) =>
    api.getAll("/doctors", params ?? {}),

  // Get featured doctors (for homepage)
  getFeatured: (limit: number = 4) =>
    api.get(`/doctors/featured?limit=${limit}`),

  // Get doctors by department
  getByDepartment: (departmentId: string) =>
    api.get(`/doctors/department/${departmentId}`),

  // Get all departments
  getAllDepartments: () => api.get("/departments"),

  // Filter doctors
  filter: (filters: DoctorFilter) => api.getAll("/doctors", filters),

  // Get doctor by ID
  get: (id: string) => api.get(`/doctors/${id}`),

  // Get doctor schedule
  getSchedule: (doctorId: string) => api.get(`/doctors/${doctorId}/schedule`),

  // Development mode methods
  _getMockDoctors: () => mockDoctors,
  _getMockDepartments: () => mockDepartments,
  _getMockFeaturedDoctors: (limit: number = 4) => mockDoctors.slice(0, limit),
  _getMockDoctorsByDepartment: (departmentId: string) => {
    const department = mockDepartments.find((d) => d.id === departmentId);
    return mockDoctors.filter((d) => d.specialty === department?.name);
  },
  _filterMockDoctors: (filters: DoctorFilter) => {
    return mockDoctors.filter((doctor) => {
      const matchesSpecialty =
        !filters.specialty || doctor.specialty === filters.specialty;
      const matchesSearch =
        !filters.searchQuery ||
        doctor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        doctor.specialty
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());
      const matchesActive =
        filters.isActive === undefined || doctor.isActive === filters.isActive;

      return matchesSpecialty && matchesSearch && matchesActive;
    });
  },
  _getMockDoctorById: (id: string) => mockDoctors.find((d) => d.id === id),
  _getMockDoctorSchedule: (doctorId: string) => {
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    return doctor?.schedule;
  },
};
