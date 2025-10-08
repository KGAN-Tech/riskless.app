export interface ContactInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  value: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
} 