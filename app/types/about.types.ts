export interface Organization {
  id: string;
  name: string;
  description: string;
  image: string;
  stats: {
    value: string;
    label: string;
  }[];
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface BookVisit {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
} 