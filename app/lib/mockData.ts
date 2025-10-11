// Mock data for demo purposes

export interface HighRiskRoad {
  id: string;
  name: string;
  location: string;
  riskLevel: "high" | "medium" | "low";
  accidents: number;
  verified: boolean;
  reason?: string;
  coordinates: [number, number];
}

export interface IncidentReport {
  id: string;
  userId: string;
  location: string;
  coordinates: [number, number];
  description: string;
  photo?: string;
  timestamp: string;
  status: "pending" | "reviewed" | "resolved";
  notifiedOrganizations: string[];
}

export interface EmergencyContact {
  id: string;
  organization: string;
  phone: string;
  type: "police" | "fire" | "medical" | "rescue";
}

export const mockHighRiskRoads: HighRiskRoad[] = [
  {
    id: "1",
    name: "Highway 101 - Mile 45",
    location: "San Francisco, CA",
    riskLevel: "high",
    accidents: 23,
    verified: true,
    reason: "Sharp curve with poor visibility",
    coordinates: [-122.4194, 37.7749],
  },
  {
    id: "2",
    name: "Mountain Pass Road",
    location: "Boulder, CO",
    riskLevel: "high",
    accidents: 18,
    verified: true,
    reason: "Ice formation in winter, steep grade",
    coordinates: [-105.2705, 40.015],
  },
  {
    id: "3",
    name: "Interstate 95 Junction",
    location: "Miami, FL",
    riskLevel: "medium",
    accidents: 12,
    verified: false,
    reason: "Heavy traffic congestion",
    coordinates: [-80.1918, 25.7617],
  },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: "1", organization: "Emergency Services", phone: "911", type: "police" },
  { id: "2", organization: "Fire Department", phone: "911", type: "fire" },
  { id: "3", organization: "Medical Emergency", phone: "911", type: "medical" },
  {
    id: "4",
    organization: "Highway Patrol",
    phone: "1-800-PATROL",
    type: "police",
  },
  {
    id: "5",
    organization: "Roadside Assistance",
    phone: "1-800-HELP",
    type: "rescue",
  },
];

export const getTodayStats = () => {
  return {
    accidents: Math.floor(Math.random() * 10) + 2,
    highRiskRoads: mockHighRiskRoads.filter((r) => r.verified).length,
    weather: ["Sunny", "Cloudy", "Rainy", "Foggy"][
      Math.floor(Math.random() * 4)
    ],
  };
};
