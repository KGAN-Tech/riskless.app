import type {
  Service,
  ServiceStat,
  ServiceDescription,
} from "@/types/service.types";
import { api } from "./_api.client";

// Mock data for development
const mockServices: Service[] = [
  {
    id: "1",
    icon: "FaStethoscope",
    title: "Primary Care",
    description:
      "Comprehensive health check-ups, consultations, and preventive care services.",
    features: [
      { id: "1-1", text: "Regular health check-ups" },
      { id: "1-2", text: "Preventive care" },
      { id: "1-3", text: "Health screenings" },
      { id: "1-4", text: "Vaccinations" },
    ],
  },
  {
    id: "2",
    icon: "FaHeartbeat",
    title: "Cardiology",
    description:
      "Expert care for heart conditions and cardiovascular health management.",
    features: [
      { id: "2-1", text: "Heart disease prevention" },
      { id: "2-2", text: "Cardiac monitoring" },
      { id: "2-3", text: "Blood pressure management" },
      { id: "2-4", text: "Heart health consultations" },
    ],
  },
  {
    id: "3",
    icon: "FaTooth",
    title: "Dental Care",
    description:
      "Complete dental services for maintaining optimal oral health.",
    features: [
      { id: "3-1", text: "Regular check-ups" },
      { id: "3-2", text: "Dental cleaning" },
      { id: "3-3", text: "Cavity treatment" },
      { id: "3-4", text: "Oral health education" },
    ],
  },
  {
    id: "4",
    icon: "FaEye",
    title: "Eye Care",
    description: "Comprehensive vision care and eye health services.",
    features: [
      { id: "4-1", text: "Vision screening" },
      { id: "4-2", text: "Eye examinations" },
      { id: "4-3", text: "Glasses prescriptions" },
      { id: "4-4", text: "Eye health consultations" },
    ],
  },
  {
    id: "5",
    icon: "FaBrain",
    title: "Mental Health",
    description: "Professional mental health support and counseling services.",
    features: [
      { id: "5-1", text: "Mental health consultations" },
      { id: "5-2", text: "Stress management" },
      { id: "5-3", text: "Anxiety treatment" },
      { id: "5-4", text: "Depression support" },
    ],
  },
  {
    id: "6",
    icon: "FaChild",
    title: "Pediatrics",
    description: "Specialized care for children's health and development.",
    features: [
      { id: "6-1", text: "Child health check-ups" },
      { id: "6-2", text: "Growth monitoring" },
      { id: "6-3", text: "Vaccination services" },
      { id: "6-4", text: "Pediatric consultations" },
    ],
  },
  {
    id: "7",
    icon: "FaWheelchair",
    title: "Physical Therapy",
    description:
      "Rehabilitation and physical therapy services for recovery and mobility.",
    features: [
      { id: "7-1", text: "Injury rehabilitation" },
      { id: "7-2", text: "Mobility improvement" },
      { id: "7-3", text: "Pain management" },
      { id: "7-4", text: "Physical therapy sessions" },
    ],
  },
];

const mockStats: ServiceStat[] = [
  { id: "1", icon: "FaUsers", value: "10,000+", label: "Happy Patients" },
  { id: "2", icon: "FaClock", value: "24/7", label: "Service Available" },
  { id: "3", icon: "FaCheckCircle", value: "98%", label: "Success Rate" },
  { id: "4", icon: "FaChartLine", value: "15+", label: "Years Experience" },
];

const mockDescription: ServiceDescription = {
  id: "1",
  title: "Comprehensive Healthcare Services",
  description:
    "FTCC offers a wide range of primary and specialized healthcare services, delivered by experienced professionals using modern technology and a patient-centered approach. We are committed to making quality healthcare accessible, affordable, and compassionate for every Filipino.",
  image: "./assets/imgs/about-slider/MOA-AlphaSure.jpg",
};

class ServiceService {
  // API methods
  async getAllServices(): Promise<Service[]> {
    return api.get("/services");
  }

  async getServiceById(id: string): Promise<Service> {
    return api.get(`/services/${id}`);
  }

  async getServiceStats(): Promise<ServiceStat[]> {
    return api.get("/services/stats");
  }

  async getServiceDescription(): Promise<ServiceDescription> {
    return api.get("/services/description");
  }

  // Mock data methods for development
  async _getMockServices(): Promise<Service[]> {
    return Promise.resolve(mockServices);
  }

  async _getMockServiceById(id: string): Promise<Service | undefined> {
    return Promise.resolve(mockServices.find((service) => service.id === id));
  }

  async _getMockServiceStats(): Promise<ServiceStat[]> {
    return Promise.resolve(mockStats);
  }

  async _getMockServiceDescription(): Promise<ServiceDescription> {
    return Promise.resolve(mockDescription);
  }
}

export const serviceService = new ServiceService();
