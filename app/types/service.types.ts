export interface ServiceFeature {
  id: string;
  text: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: ServiceFeature[];
}

export interface ServiceStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface ServiceDescription {
  id: string;
  title: string;
  description: string;
  image: string;
} 