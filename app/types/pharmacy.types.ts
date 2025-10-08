export interface PharmacyLocation {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  
  export interface PharmacyContact {
    phone: string;
    email?: string;
    landline?: string;
  }
  
  export interface PharmacySchedule {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }
  
  export interface PharmacyService {
    id: string;
    name: string;
    description: string;
    isAvailable: boolean;
  }
  
  export interface Pharmacy {
    id: string;
    name: string;
    type: "chain" | "independent" | "hospital" | "clinic";
    image?: string;
    description: string;
    location: PharmacyLocation;
    contact: PharmacyContact;
    schedule: PharmacySchedule[];
    services: PharmacyService[];
    features: string[];
    isActive: boolean;
    isOpen24Hours: boolean;
    hasDelivery: boolean;
    acceptsInsurance: boolean;
    rating: number;
    distance?: number; // in kilometers
    isFavorite?: boolean;
  }
  
  export interface PharmacyFilter {
    type?: string;
    city?: string;
    service?: string;
    isOpen24Hours?: boolean;
    hasDelivery?: boolean;
    acceptsInsurance?: boolean;
    maxDistance?: number;
    isActive?: boolean;
  }
  
  export interface PharmacySearchParams {
    query?: string;
    location?: {
      lat: number;
      lng: number;
    };
    radius?: number; // in kilometers
    filters?: PharmacyFilter;
  }
  
  export interface UserLocation {
    lat: number;
    lng: number;
    address?: string;
  }
  
  export interface FavoritePharmacy {
    userId: string;
    pharmacyId: string;
    dateAdded: string;
  }
  
  export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
  }
  
  export interface MapCenter {
    lat: number;
    lng: number;
    zoom?: number;
  }
  
  export interface PharmacyMapPin {
    id: string;
    position: {
      lat: number;
      lng: number;
    };
    pharmacy: Pharmacy;
    isSelected?: boolean;
  }