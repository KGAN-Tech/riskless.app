export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  url: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export interface Tip {
  image: string;
  title: string;
  date: string;
  commentsCount: number;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Event {
  id: string;
  image: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface ClinicIntro {
  title: string;
  description: string;
  objectives: string[];
  images: {
    front: string;
    back: string;
  };
}

export interface ContactData {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
} 