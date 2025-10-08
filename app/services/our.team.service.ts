import type {
  TeamMember,
  Department,
  OrganizationPerson,
  TeamMemberFilter,
} from "@/types/our-team.types";
import { api } from "./_api.client";

// Mock data for development
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Maria Santos",
    role: "General Medicine",
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
    isDoctor: true,
    departmentId: "1",
    schedule: {
      monday: ["09:00-12:00", "14:00-17:00"],
      wednesday: ["09:00-12:00", "14:00-17:00"],
      friday: ["09:00-12:00", "14:00-17:00"],
    },
  },
  {
    id: "2",
    name: "Dr. James Reyes",
    role: "Cardiology",
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
    isDoctor: true,
    departmentId: "2",
    schedule: {
      tuesday: ["09:00-12:00", "14:00-17:00"],
      thursday: ["09:00-12:00", "14:00-17:00"],
    },
  },
  {
    id: "3",
    name: "Dr. Sarah Tan",
    role: "Pediatrics",
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
    isDoctor: true,
    departmentId: "6",
    schedule: {
      monday: ["09:00-12:00"],
      wednesday: ["09:00-12:00"],
      friday: ["09:00-12:00"],
    },
  },
  {
    id: "4",
    name: "Dr. Michael Cruz",
    role: "Dental Care",
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
    isDoctor: true,
    departmentId: "3",
    schedule: {
      tuesday: ["09:00-12:00", "14:00-17:00"],
      thursday: ["09:00-12:00", "14:00-17:00"],
    },
  },
  {
    id: "5",
    name: "Nurse Ana Garcia",
    role: "Senior Nurse",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "8 years",
    education: "BSN, University of the Philippines",
    description:
      "Experienced registered nurse specializing in patient care and health education.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "nurse.garcia@ftcc.com",
    },
    isActive: true,
    isDoctor: false,
    departmentId: "1",
  },
  {
    id: "6",
    name: "Lab Tech Carlos Mendoza",
    role: "Laboratory Technician",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    experience: "5 years",
    education: "BS Medical Technology, University of Santo Tomas",
    description:
      "Skilled laboratory technician with expertise in diagnostic testing and quality assurance.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "lab.mendoza@ftcc.com",
    },
    isActive: true,
    isDoctor: false,
    departmentId: "7",
  },
];

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "General Medicine",
    icon: "FaStethoscope",
    description: "Comprehensive primary care services for all ages",
    memberCount: 5,
  },
  {
    id: "2",
    name: "Cardiology",
    icon: "FaHeartbeat",
    description: "Expert care for heart conditions and cardiovascular health",
    memberCount: 3,
  },
  {
    id: "3",
    name: "Dental Care",
    icon: "FaTooth",
    description: "Complete dental services for optimal oral health",
    memberCount: 4,
  },
  {
    id: "4",
    name: "Eye Care",
    icon: "FaEye",
    description: "Comprehensive vision care and eye health services",
    memberCount: 2,
  },
  {
    id: "5",
    name: "Mental Health",
    icon: "FaBrain",
    description: "Professional mental health support and counseling",
    memberCount: 3,
  },
  {
    id: "6",
    name: "Pediatrics",
    icon: "FaChild",
    description: "Specialized care for children's health and development",
    memberCount: 4,
  },
  {
    id: "7",
    name: "Laboratory Services",
    icon: "FaFlask",
    description: "Comprehensive diagnostic and laboratory testing services",
    memberCount: 3,
  },
  {
    id: "8",
    name: "Administration",
    icon: "FaUsers",
    description: "Administrative and support services for smooth operations",
    memberCount: 6,
  },
];

const mockOrganizationPeople: OrganizationPerson[] = [
  {
    id: "1",
    name: "Atty. Joeshias B. Tambago",
    position: "President",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    description:
      "Guiding businesses and organizations through regulatory, operational, and strategic challenges in the Philippines with expert, tailored solutions.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "ceo@ftcc.com",
    },
    departmentId: "8",
    isLeadership: true,
  },
  {
    id: "2",
    name: "Nelso L. Cheng",
    position: "Treasurer",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    description:
      "Board-certified physician with extensive experience in healthcare quality improvement and patient safety.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "cmo@ftcc.com",
    },
    departmentId: "1",
    isLeadership: true,
  },
  {
    id: "3",
    name: "Att. Cyrus S. Cunanan, CPA",
    position: "Corporate Secretary",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop",
    description:
      "Finance professional with expertise in healthcare financial management and strategic planning.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "cfo@ftcc.com",
    },
    departmentId: "8",
    isLeadership: true,
  },
];

export const ourTeamService = {
  // Get all team members
  getAllTeamMembers: (params?: Record<string, any>) =>
    api.getAll("/team-members", params ?? {}),

  // Get featured team members (for homepage)
  getFeaturedTeamMembers: (limit: number = 4) =>
    api.get(`/team-members/featured?limit=${limit}`),

  // Get team members by department
  getTeamMembersByDepartment: (departmentId: string) =>
    api.get(`/team-members/department/${departmentId}`),

  // Get all departments
  getAllDepartments: () => api.get("/departments"),

  // Get organization people (leadership, admin, etc.)
  getOrganizationPeople: (params?: Record<string, any>) =>
    api.getAll("/organization-people", params ?? {}),

  // Get leadership team
  getLeadershipTeam: () => api.get("/organization-people/leadership"),

  // Filter team members
  filterTeamMembers: (filters: TeamMemberFilter) =>
    api.getAll("/team-members", filters),

  // Get team member by ID
  getTeamMember: (id: string) => api.get(`/team-members/${id}`),

  // Get team member schedule
  getTeamMemberSchedule: (memberId: string) =>
    api.get(`/team-members/${memberId}/schedule`),

  // Get organization person by ID
  getOrganizationPerson: (id: string) => api.get(`/organization-people/${id}`),

  // Development mode methods
  _getMockTeamMembers: () => mockTeamMembers,
  _getMockDepartments: () => mockDepartments,
  _getMockOrganizationPeople: () => mockOrganizationPeople,
  _getMockFeaturedTeamMembers: (limit: number = 4) =>
    mockTeamMembers.slice(0, limit),
  _getMockTeamMembersByDepartment: (departmentId: string) => {
    return mockTeamMembers.filter(
      (member) => member.departmentId === departmentId
    );
  },
  _getMockLeadershipTeam: () =>
    mockOrganizationPeople.filter((person) => person.isLeadership),
  _filterMockTeamMembers: (filters: TeamMemberFilter) => {
    return mockTeamMembers.filter((member) => {
      const matchesSpecialty =
        !filters.specialty || member.specialty === filters.specialty;
      const matchesSearch =
        !filters.searchQuery ||
        member.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (member.specialty &&
          member.specialty
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()));
      const matchesActive =
        filters.isActive === undefined || member.isActive === filters.isActive;
      const matchesDepartment =
        !filters.departmentId || member.departmentId === filters.departmentId;
      const matchesDoctor =
        filters.isDoctor === undefined || member.isDoctor === filters.isDoctor;

      return (
        matchesSpecialty &&
        matchesSearch &&
        matchesActive &&
        matchesDepartment &&
        matchesDoctor
      );
    });
  },
  _getMockTeamMemberById: (id: string) =>
    mockTeamMembers.find((m) => m.id === id),
  _getMockTeamMemberSchedule: (memberId: string) => {
    const member = mockTeamMembers.find((m) => m.id === memberId);
    return member?.schedule;
  },
  _getMockOrganizationPersonById: (id: string) =>
    mockOrganizationPeople.find((p) => p.id === id),
  _getMockDoctors: () => mockTeamMembers.filter((member) => member.isDoctor),
  _getMockFeaturedDoctors: (limit: number = 4) =>
    mockTeamMembers.filter((member) => member.isDoctor).slice(0, limit),
};
