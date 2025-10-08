import type {
  Organization,
  Doctor,
  Partner,
  BookVisit,
} from "@/types/about.types";
import { api } from "./_api.client";

// Mock data
const mockOrganization: Organization = {
  id: "1",
  name: "Filipino Trusted Care Company",
  description:
    "FTCC is a leading healthcare provider in the Philippines, committed to delivering exceptional medical services with compassion and innovation. Our state-of-the-art facilities and expert medical professionals ensure the highest quality of care for our patients.",
  image:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop",
  stats: [
    { value: "15+", label: "Years of Experience" },
    { value: "50+", label: "Expert Doctors" },
    { value: "10k+", label: "Happy Patients" },
    { value: "24/7", label: "Service Available" },
  ],
};

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Maria Santos",
    role: "Chief Medical Officer",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    description:
      "With over 20 years of experience in healthcare management, Dr. Santos leads our medical team with expertise and compassion.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.santos@ftcc.com",
    },
  },
  {
    id: "2",
    name: "Dr. James Reyes",
    role: "Head of Cardiology",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    description:
      "A renowned cardiologist with extensive experience in treating complex heart conditions.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.reyes@ftcc.com",
    },
  },
  {
    id: "3",
    name: "Dr. Sarah Tan",
    role: "Pediatric Specialist",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    description:
      "Dedicated to providing the best care for children with a gentle and understanding approach.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "dr.tan@ftcc.com",
    },
  },
];

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "BIDS AND AWARD",
    logo: "/assets/imgs/partners/BIDS-AND-AWARD.png",
    website: "https://www.philippinemedicalassociation.org",
  },
  {
    id: "2",
    name: "LGU Mountain Province",
    logo: "/assets/imgs/partners/mountain-prov.png",
    website: "https://www.who.int",
  },
  {
    id: "3",
    name: "LGU Basilan",
    logo: "/assets/imgs/partners/Ph_seal_basilan.png",
    website: "https://www.doh.gov.ph",
  },
  {
    id: "4",
    name: "LGU Ilocos Sur",
    logo: "/assets/imgs/partners/Ph_seal_ilocos_sur.png",
    website: "https://www.doh.gov.ph",
  },
  {
    id: "5",
    name: "LGU Palawan",
    logo: "/assets/imgs/partners/Ph_seal_palawan.png",
    website: "https://www.doh.gov.ph",
  },
];

const mockBookVisit: BookVisit = {
  title: "Experience World-Class Healthcare",
  description:
    "Book your visit with FTCC today and take the first step towards better health. Our team is ready to provide you with exceptional care.",
  buttonText: "Book a Visit",
  backgroundImage:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop",
};

export const aboutService = {
  // API methods
  getOrganization: () => api.get("/about/organization"),

  getDoctors: () => api.get("/about/doctors"),

  getPartners: () => api.get("/about/partners"),

  getBookVisit: () => api.get("/about/book-visit"),

  // Development mode methods
  _getMockOrganization: () => mockOrganization,
  _getMockDoctors: () => mockDoctors,
  _getMockPartners: () => mockPartners,
  _getMockBookVisit: () => mockBookVisit,
};
