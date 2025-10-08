export interface TeamMemberSocial {
  linkedin: string;
  twitter: string;
  email: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  image: string;
  experience: string;
  education: string;
  description: string;
  social: TeamMemberSocial;
  isActive?: boolean;
  schedule?: TeamMemberSchedule;
  departmentId?: string;
  isDoctor?: boolean;
  position?: string;
}

export interface TeamMemberSchedule {
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
  memberCount: number;
}

export interface OrganizationPerson {
  id: string;
  name: string;
  position: string;
  image: string;
  description: string;
  social: TeamMemberSocial;
  departmentId?: string;
  isLeadership?: boolean;
}

export interface TeamMemberFilter {
  specialty?: string;
  searchQuery?: string;
  isActive?: boolean;
  departmentId?: string;
  isDoctor?: boolean;
  isLeadership?: boolean;
} 