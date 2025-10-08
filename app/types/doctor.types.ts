export interface DoctorSocial {
  linkedin: string;
  twitter: string;
  email: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  education: string;
  description: string;
  social: DoctorSocial;
  isActive?: boolean;
  schedule?: DoctorSchedule;
}

export interface DoctorSchedule {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  doctorCount: number;
}

export interface DoctorFilter {
  specialty?: string;
  searchQuery?: string;
  isActive?: boolean;
} 