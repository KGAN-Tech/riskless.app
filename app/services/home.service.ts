import type {
  HeroSlide,
  Service,
  Step,
  Testimonial,
  Tip,
  Feature,
  ClinicIntro,
  ContactData,
  Event
} from "@/types/home.types";

class HomeService {
  private heroSlides: HeroSlide[] = [
    {
      image: "https://1bataan.com/wp-content/uploads/2023/06/Bataan-folks-to-register-with-Konsulta-Package.jpg",
      title: "Your Trusted Healthcare Partner",
      subtitle: "Experience world-class medical care with Filipino warmth and expertise at FTCC",
      cta: "Register to Konsulta",
      url: "/0/register"
    },
    {
      image: "https://pia.gov.ph/wp-content/uploads/2024/06/448269039_1486750558893377_4026166547364534419_n.jpg?w=1920&h=1080&fit=crop",
      title: "Comprehensive Medical Services",
      subtitle: "From primary care to specialized treatments, FTCC has got you covered",
      cta: "Our Services",
      url: "/services"
    },
    {
      image: "https://thevoicenewsweekly.com/wp-content/uploads/2025/05/PhilHealth-Ayta-2.jpeg?w=1920&h=1080&fit=crop",
      title: "Expert Medical Professionals",
      subtitle: "Our team of experienced doctors at FTCC is dedicated to your health",
      cta: "Meet Our Team",
      url: "/doctors"
    },
  ];

  private clinicIntro: ClinicIntro = {
    title: "Welcome to Filipino Trusted Care Company (FTCC)",
    description: "FTCC is a recognized and accredited of PhilHealth's Konsulta Package Provider, offering a comprehensive range of primary care services to ensure accessible and quality healthcare for its members.",
    objectives: [
      "Protect the health of every Filipinos against chronic illnesses",
      "Avoid complications through early detection",
      "To provide affordable drugs and medicines",
    ],
    images: {
      front: "https://pia.gov.ph/uploads/2022/09/09ba4159814277d82a242511e454138d.png",
      back: "/philhealth-banner.png"
    }
  };

  private services: Service[] = [
    {
      title: "Primary Care",
      description: "Comprehensive healthcare services for individuals and families, including routine check-ups and preventive care.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      title: "Specialized Care",
      description: "Expert medical care for specific conditions and diseases, provided by our team of specialists.",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency medical services for urgent healthcare needs and critical situations.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Laboratory Services",
      description: "State-of-the-art diagnostic testing and analysis for accurate medical assessments.",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    },
    {
      title: "Telemedicine",
      description: "Virtual healthcare consultations for convenient access to medical advice and care.",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
    {
      title: "Health Screenings",
      description: "Comprehensive health assessments and preventive screenings for early detection.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
  ];

  private steps: Step[] = [
    {
      number: 1,
      title: "Book an Appointment",
      description: "Schedule your visit through our easy online booking system",
      icon: "M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14",
    },
    {
      number: 2,
      title: "Visit Our Clinic",
      description: "Meet our healthcare professionals at your scheduled time",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    },
    {
      number: 3,
      title: "Get Treatment",
      description: "Receive personalized care and treatment from our experts",
      icon: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7Z",
    },
    {
      number: 4,
      title: "Follow-up Care",
      description: "Stay connected with our team for ongoing support",
      icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v6",
    },
  ];

  private features: Feature[] = [
    {
      title: "Expert Medical Team",
      description: "Our experienced doctors and healthcare professionals are dedicated to providing the best care.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      title: "Modern Facilities",
      description: "State-of-the-art equipment and comfortable facilities for your care.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      title: "Comprehensive Care",
      description: "From preventive care to specialized treatments, we've got you covered.",
      icon: "M4.5 12.75l6 6 9-13.5",
    },
  ];

  private testimonials: Testimonial[] = [
    {
      name: "John Doe",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5,
      text: "The care I received at FTCC was exceptional. The staff was professional and caring.",
    },
    {
      name: "Jane Smith",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      text: "I'm grateful for the personalized attention and quality healthcare services.",
    },
    {
      name: "Mike Johnson",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 5,
      text: "The doctors here are knowledgeable and take time to explain everything clearly.",
    },
  ];

  private tips: Tip[] = [
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      title: "The Importance of Annual Checkups",
      date: "March 15, 2024",
      commentsCount: 12,
      description: "Regular health checkups are essential for maintaining good health and catching potential issues early.",
    },
    {
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
      title: "Healthy Eating Habits for Better Health",
      date: "March 10, 2024",
      commentsCount: 8,
      description: "Learn about the importance of a balanced diet and how it contributes to your overall well-being.",
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      title: "Exercise Tips for Busy Professionals",
      date: "March 5, 2024",
      commentsCount: 15,
      description: "Simple and effective exercise routines that can fit into your busy schedule.",
    },
  ];

  private events: Event[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      title: "Medical Conference 2024",
      date: "March 15, 2024",
      location: "Main Conference Hall",
      description: "Join us for a day of medical innovation and networking"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
      title: "Health Awareness Workshop",
      date: "March 20, 2024",
      location: "Training Center",
      description: "Learn about preventive healthcare and wellness practices"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      title: "Free Medical Check-up Day",
      date: "March 25, 2024",
      location: "Main Clinic",
      description: "Free health screenings and consultations for the community"
    }
  ];

  private contactData: ContactData = {
    title: "Get in Touch",
    description: "Have questions? We're here to help. Contact us today.",
    email: "contact@ftcc.com",
    phone: "+63 123 456 7890",
    address: "123 Medical Center Drive, Manila, Philippines",
    hours: "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM",
  };

  getHeroSlides(): HeroSlide[] {
    return this.heroSlides;
  }

  getClinicIntro(): ClinicIntro {
    return this.clinicIntro;
  }

  getServices(): Service[] {
    return this.services;
  }

  getSteps(): Step[] {
    return this.steps;
  }

  getFeatures(): Feature[] {
    return this.features;
  }

  getTestimonials(): Testimonial[] {
    return this.testimonials;
  }

  getTips(): Tip[] {
    return this.tips;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getContactData(): ContactData {
    return this.contactData;
  }
}

export const homeService = new HomeService(); 