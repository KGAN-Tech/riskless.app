import type {
  ContactInfo,
  ContactForm,
  ContactLocation,
} from "@/types/contact.types";
import { api } from "./_api.client";

// Mock data
const mockContactInfo: ContactInfo[] = [
  {
    id: "1",
    title: "Phone",
    description: "Call us for immediate assistance",
    icon: "FaPhone",
    value: "+63 912 345 6789",
  },
  {
    id: "2",
    title: "Email",
    description: "Send us an email anytime",
    icon: "FaEnvelope",
    value: "contact@ftcc.com",
  },
  {
    id: "3",
    title: "Address",
    description: "Visit our main office",
    icon: "FaMapMarkerAlt",
    value: "123 Healthcare Street, Medical District, Manila, Philippines",
  },
];

const mockLocations: ContactLocation[] = [
  {
    id: "1",
    name: "Main Clinic",
    address: "123 Healthcare Street, Medical District, Manila, Philippines",
    phone: "+63 912 345 6789",
    email: "main@ftcc.com",
    hours:
      "Monday - Friday: 8:00 AM - 8:00 PM\nSaturday: 9:00 AM - 5:00 PM\nSunday: Closed",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6504908247!2d121.0144!3d14.5995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM1JzU4LjIiTiAxMjHCsDAwJzUxLjgiRQ!5e0!3m2!1sen!2sph!4v1234567890",
  },
  /* Satellite Clinic
  {
    id: "2",
    name: "Satellite Clinic",
    address: "456 Medical Plaza, Health Center, Quezon City, Philippines",
    phone: "+63 923 456 7890",
    email: "satellite@ftcc.com",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 1:00 PM\nSunday: Closed",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6504908247!2d121.0144!3d14.5995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM1JzU4LjIiTiAxMjHCsDAwJzUxLjgiRQ!5e0!3m2!1sen!2sph!4v1234567890"
  }
    */
];

export const contactService = {
  // API methods
  getContactInfo: () => api.get("/contact/info"),

  getLocations: () => api.get("/contact/locations"),

  submitContactForm: (formData: ContactForm) =>
    api.post("/contact/submit", formData),

  // Development mode methods
  _getMockContactInfo: () => mockContactInfo,
  _getMockLocations: () => mockLocations,
  _submitMockContactForm: (formData: ContactForm) => {
    console.log("Mock form submission:", formData);
    return Promise.resolve({ success: true });
  },
};
