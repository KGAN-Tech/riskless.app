import { useEffect, useState, type ChangeEvent } from "react";
import { reportService } from "@/services/report.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/select";
import { Map } from "lucide-react";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { facilityService } from "~/app/services/facility.service";

// Alternative simpler approach
interface ReportTypeDefinition {
  value: string;
  description: string;
  category: string[];
}

// Enhanced ReportType structure with descriptions and categories
const ReportType: Record<string, ReportTypeDefinition> = {
  // Common report types
  road_cracks: {
    value: "road_cracks",
    description: "Cracks or potholes in road surface",
    category: ["common", "road_condition"] as const,
  },
  poor_road_lighting: {
    value: "poor_road_lighting",
    description: "Insufficient or non-functional street lights",
    category: ["common", "infrastructure"] as const,
  },
  blind_curve: {
    value: "blind_curve",
    description: "Dangerous curves with limited visibility",
    category: ["common", "road_design"] as const,
  },
  minor_road_accident: {
    value: "minor_road_accident",
    description: "Small collisions with no major injuries",
    category: ["common", "accident"] as const,
  },
  major_road_accident: {
    value: "major_road_accident",
    description: "Serious collisions with injuries or major damage",
    category: ["common", "accident", "emergency"] as const,
  },
  illegal_parking: {
    value: "illegal_parking",
    description: "Vehicles parked in no-parking zones or blocking traffic",
    category: ["common", "violation"] as const,
  },
  reckless_driving_area: {
    value: "reckless_driving_area",
    description: "Areas with frequent speeding or dangerous driving",
    category: ["common", "violation", "behavior"] as const,
  },

  // Other report types
  uneven_pavement: {
    value: "uneven_pavement",
    description: "Uneven or damaged pavement surfaces",
    category: ["road_condition"] as const,
  },
  muddy_slippery_road: {
    value: "muddy_slippery_road",
    description: "Roads covered in mud or slippery substances",
    category: ["road_condition", "weather"] as const,
  },
  flooded_road: {
    value: "flooded_road",
    description: "Roads submerged in water due to flooding",
    category: ["road_condition", "weather", "emergency"] as const,
  },
  obstructions_on_road: {
    value: "obstructions_on_road",
    description: "Objects blocking the road or pathway",
    category: ["obstruction"] as const,
  },
  sinkhole_formation: {
    value: "sinkhole_formation",
    description: "Sinkholes developing on road surfaces",
    category: ["hazard", "emergency"] as const,
  },
  missing_road_signage: {
    value: "missing_road_signage",
    description: "Missing traffic signs or road markers",
    category: ["signage", "infrastructure"] as const,
  },
  obstructed_road_signage: {
    value: "obstructed_road_signage",
    description: "Signs blocked by vegetation or other objects",
    category: ["signage", "maintenance"] as const,
  },
  broken_traffic_light: {
    value: "broken_traffic_light",
    description: "Non-functional traffic signals",
    category: ["traffic_control", "infrastructure"] as const,
  },
  malfunctioning_traffic_light: {
    value: "malfunctioning_traffic_light",
    description: "Traffic lights with irregular patterns",
    category: ["traffic_control", "infrastructure"] as const,
  },
  missing_lane_markings: {
    value: "missing_lane_markings",
    description: "Faded or missing road lane markings",
    category: ["road_markings", "maintenance"] as const,
  },
  unsecured_construction_zone: {
    value: "unsecured_construction_zone",
    description: "Construction areas without proper safety measures",
    category: ["construction", "safety"] as const,
  },
  construction_debris_on_road: {
    value: "construction_debris_on_road",
    description: "Construction materials left on road",
    category: ["construction", "obstruction"] as const,
  },
  incomplete_road_works: {
    value: "incomplete_road_works",
    description: "Abandoned or unfinished road construction",
    category: ["construction", "maintenance"] as const,
  },
  no_warning_barriers: {
    value: "no_warning_barriers",
    description: "Missing safety barriers in hazardous areas",
    category: ["safety", "infrastructure"] as const,
  },
  unsafe_detour: {
    value: "unsafe_detour",
    description: "Dangerous alternative routes",
    category: ["routing", "safety"] as const,
  },
  abandoned_vehicle: {
    value: "abandoned_vehicle",
    description: "Vehicles left unattended for extended periods",
    category: ["vehicle_issue", "violation"] as const,
  },
  broken_down_vehicle_blocking_road: {
    value: "broken_down_vehicle_blocking_road",
    description: "Disabled vehicles obstructing traffic flow",
    category: ["vehicle_issue", "obstruction"] as const,
  },
  overloaded_truck_hazard: {
    value: "overloaded_truck_hazard",
    description: "Overloaded trucks posing safety risks",
    category: ["vehicle_issue", "violation"] as const,
  },
  smoke_oil_leakage_on_road: {
    value: "smoke_oil_leakage_on_road",
    description: "Oil spills or smoke creating hazardous conditions",
    category: ["hazard", "environment"] as const,
  },
  falling_rocks: {
    value: "falling_rocks",
    description: "Rocks falling onto road from nearby slopes",
    category: ["natural_hazard", "emergency"] as const,
  },
  landslide_risk_area: {
    value: "landslide_risk_area",
    description: "Areas prone to landslides or soil erosion",
    category: ["natural_hazard", "emergency"] as const,
  },
  overflowing_drainage: {
    value: "overflowing_drainage",
    description: "Blocked or overflowing drainage systems",
    category: ["drainage", "infrastructure"] as const,
  },
  fallen_tree: {
    value: "fallen_tree",
    description: "Trees or large branches blocking roads",
    category: ["obstruction", "natural_hazard"] as const,
  },
  animals_crossing: {
    value: "animals_crossing",
    description: "Areas with frequent animal crossings",
    category: ["wildlife", "safety"] as const,
  },
  hit_and_run_incident: {
    value: "hit_and_run_incident",
    description: "Accidents where driver leaves scene",
    category: ["accident", "violation"] as const,
  },
  near_miss_collision: {
    value: "near_miss_collision",
    description: "Close calls that almost resulted in accidents",
    category: ["incident", "safety"] as const,
  },
  vehicle_skidding_report: {
    value: "vehicle_skidding_report",
    description: "Reports of vehicles losing traction",
    category: ["incident", "road_condition"] as const,
  },
  jaywalking_hotspot: {
    value: "jaywalking_hotspot",
    description: "Areas with frequent pedestrian violations",
    category: ["pedestrian", "violation"] as const,
  },
  unauthorize_road_blockade: {
    value: "unauthorize_road_blockade",
    description: "Illegal road closures or blockades",
    category: ["obstruction", "violation"] as const,
  },
  other: {
    value: "other",
    description: "Other types of road issues not listed",
    category: ["other"] as const,
  },
} as const;

// Helper types
type ReportTypeKey = keyof typeof ReportType;
type ReportTypeValue = (typeof ReportType)[ReportTypeKey]["value"];
type ReportTypeCategory =
  (typeof ReportType)[ReportTypeKey]["category"][number];

// Helper function to get report types by category
const getReportTypesByCategory = (
  category?: string
): ReportTypeDefinition[] => {
  const types = Object.values(ReportType);
  if (category) {
    return types.filter((type) => type.category.includes(category));
  }
  return types;
};

// Helper function to get common report types
const getCommonReportTypes = () => {
  return getReportTypesByCategory("common");
};

// Helper function to get all report types sorted (common first, then others)
const getSortedReportTypes = () => {
  const commonTypes = getCommonReportTypes();
  const otherTypes = Object.values(ReportType).filter(
    (type) => !type.category.includes("common")
  );
  return [...commonTypes, ...otherTypes];
};

// Helper function to get all unique categories
const getAllCategories = (): string[] => {
  const allCategories = Object.values(ReportType).flatMap(
    (type) => type.category
  );
  return Array.from(new Set(allCategories));
};

// Helper function to get display name for category
const getCategoryDisplayName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    common: "Common Issues",
    road_condition: "Road Conditions",
    infrastructure: "Infrastructure",
    road_design: "Road Design",
    accident: "Accidents",
    emergency: "Emergencies",
    violation: "Violations",
    behavior: "Driver Behavior",
    weather: "Weather Related",
    obstruction: "Obstructions",
    hazard: "Hazards",
    signage: "Signage",
    maintenance: "Maintenance",
    traffic_control: "Traffic Control",
    road_markings: "Road Markings",
    construction: "Construction",
    safety: "Safety Issues",
    routing: "Routing",
    vehicle_issue: "Vehicle Issues",
    environment: "Environmental",
    natural_hazard: "Natural Hazards",
    drainage: "Drainage",
    wildlife: "Wildlife",
    incident: "Incidents",
    pedestrian: "Pedestrian Issues",
    other: "Other",
  };

  return (
    categoryNames[category] ||
    category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

enum ReportStatus {
  pending = "pending",
  under_review = "under_review",
  in_progress = "in_progress",
  resolved = "resolved",
  closed = "closed",
}

interface User {
  id: string;
  userName?: string;
  email?: string;
  role?: string;
  facilityId?: string;
}

interface Road {
  id: string;
  title: string;
  location?: string;
  mapLink?: string;
  longitude?: number;
  latitude?: number;
  description?: string;
  status?: string;
  tags?: string[];
  type?: string;
  otherType?: string;
  isHighRisk?: boolean;
}

interface Facility {
  id: string;
  name: string;
  location?: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: ReportStatus;
  tags: string[];
  type: ReportTypeValue;
  otherType?: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: User;
  reportToId?: string;
  reportTo?: User;
  roadId?: string;
  road?: Road;
  facilityId?: string;
  facility?: Facility;
}

// Fixed ReportForm type - properly define all properties
interface ReportForm {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: ReportStatus;
  type: ReportTypeValue;
  tags: string; // string for form input, will be converted to string[]
  imageFiles: File[];
  createdById: string;
  otherType?: string;
  reportToId?: string;
  roadId?: string;
  facilityId?: string;
  // Road creation fields
  roadTitle?: string;
  roadDescription?: string;
  roadLocation?: string;
  roadLongitude?: number;
  roadLatitude?: number;
  roadStatus?: string;
  roadTags?: string;
  roadType?: string;
  roadOtherType?: string;
  roadMapLink?: string;
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState<ReportForm>({
    id: "",
    title: "",
    description: "",
    images: [],
    status: ReportStatus.pending,
    type: ReportType.other.value,
    tags: "",
    imageFiles: [],
    createdById: "",
    otherType: "",
    roadTitle: "",
    roadDescription: "",
    roadLocation: "",
    roadLongitude: undefined,
    roadLatitude: undefined,
    roadStatus: "",
    roadTags: "",
    roadType: "",
    roadOtherType: "",
    roadMapLink: "",
  });
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentUser = getUserFromLocalStorage()?.user;

  const loadReports = async () => {
    setLoading(true);
    try {
      const user = getUserFromLocalStorage()?.user;
      const params: any = { query };
      if (query) params.query = query;

      // Server-side filtering approach (recommended)
      if (user?.role === "admin" && user?.facilityId) {
        params.facilityId = user.facilityId;
      }

      const res = await reportService.getAll(params);

      // Client-side filtering as fallback
      let filteredReports = res.data || [];

      if (user?.role === "admin" && user?.facilityId && !params.facilityId) {
        // Only apply client-side filtering if server doesn't support facilityId param
        filteredReports = filteredReports.filter(
          (report: Report) => report.facilityId === user.facilityId
        );
      }

      setReports(filteredReports);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page]);

  const fetchFacilities = async (searchQuery = "") => {
    if (!searchQuery) {
      setFacilities([]);
      return;
    }
    try {
      const res = await facilityService.getAll({ query: searchQuery });
      setFacilities(res?.data || []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  // Add useEffect to fetch facilities when search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (facilitySearch) {
        fetchFacilities(facilitySearch);
      } else {
        setFacilities([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [facilitySearch]);

  const handleFacilitySelect = (facility: Facility) => {
    setFormData((prev) => ({
      ...prev,
      facilityId: facility.id,
    }));
    setFacilitySearch(facility.name);
    setShowSuggestions(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.roadMapLink ||
        !formData.roadLocation ||
        !formData.roadLongitude ||
        !formData.roadLatitude ||
        !formData.roadTitle
      ) {
        alert(
          "Title, description, road location, road title, road longitude, road latitude and road map link are required"
        );
        return;
      }

      const tags = formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const roadTags = formData.roadTags
        ? formData.roadTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("status", formData.status);
      data.append("type", formData.type);
      data.append("createdById", getUserFromLocalStorage()?.user?.id || "");
      data.append("tags", JSON.stringify(tags));

      // Optional fields
      if (formData.otherType) data.append("otherType", formData.otherType);
      if (formData.reportToId) data.append("reportToId", formData.reportToId);
      if (formData.roadId) data.append("roadId", formData.roadId);
      if (formData.facilityId) data.append("facilityId", formData.facilityId);

      // Road creation fields
      if (formData.roadTitle) data.append("roadTitle", formData.roadTitle);
      if (formData.roadDescription)
        data.append("roadDescription", formData.roadDescription);
      if (formData.roadLocation)
        data.append("roadLocation", formData.roadLocation);
      if (formData.roadLongitude)
        data.append("roadLongitude", formData.roadLongitude.toString());
      if (formData.roadLatitude)
        data.append("roadLatitude", formData.roadLatitude.toString());
      if (formData.roadStatus) data.append("roadStatus", formData.roadStatus);
      if (formData.roadTags) data.append("roadTags", JSON.stringify(roadTags));
      if (formData.roadType) data.append("roadType", formData.roadType);
      if (formData.roadOtherType)
        data.append("roadOtherType", formData.roadOtherType);
      if (formData.roadMapLink)
        data.append("roadMapLink", formData.roadMapLink);

      // Append files
      formData.imageFiles.forEach((file) => data.append("files", file));

      if (formData.id) {
        await reportService.update(formData.id, data);
      } else {
        await reportService.create(data);
      }

      setOpen(false);
      resetForm();
      loadReports();
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Error saving report. Please check the console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      images: [],
      status: ReportStatus.pending,
      type: ReportType.other.value,
      tags: "",
      imageFiles: [],
      createdById: "",
      otherType: "",
      roadTitle: "",
      roadDescription: "",
      roadLocation: "",
      roadLongitude: undefined,
      roadLatitude: undefined,
      roadStatus: "",
      roadTags: "",
      roadType: "",
      roadOtherType: "",
      roadMapLink: "",
    });
    setFacilitySearch("");
    setFacilities([]);
  };

  const handleEdit = (r: Report) => {
    console.log("Editing report:", r);
    console.log("Road data:", r.road);
    console.log("Road coordinates:", {
      longitude: r.road?.longitude,
      latitude: r.road?.latitude,
    });

    // Use the direct coordinates from the road object if available
    // Otherwise try to extract from map link as fallback
    const coordinates = {
      longitude: r.road?.longitude,
      latitude: r.road?.latitude,
    };

    // If direct coordinates are not available, try to extract from map link
    if ((!coordinates.longitude || !coordinates.latitude) && r.road?.mapLink) {
      const extractedCoords = extractCoordinatesFromMapLink(r.road.mapLink);
      coordinates.longitude = extractedCoords.longitude;
      coordinates.latitude = extractedCoords.latitude;
    }

    console.log("Final coordinates to use:", coordinates);

    setFormData({
      id: r.id,
      title: r.title,
      description: r.description,
      images: r.images,
      status: r.status,
      type: r.type,
      tags: r.tags?.join(", ") || "",
      imageFiles: [],
      createdById: r.createdById || "",
      otherType: r.otherType || "",
      reportToId: r.reportToId,
      roadId: r.roadId,
      facilityId: r.facilityId,
      // Preserve ALL road data from the existing report
      roadTitle: r.road?.title || "",
      roadDescription: r.road?.description || "",
      roadLocation: r.road?.location || "",
      roadLongitude: coordinates.longitude,
      roadLatitude: coordinates.latitude,
      roadStatus: r.road?.status || "",
      roadTags: r.road?.tags?.join(", ") || "",
      roadType: r.road?.type || "",
      roadOtherType: r.road?.otherType || "",
      roadMapLink: r.road?.mapLink || "",
    });

    console.log("Form data after setting - coordinates:", {
      roadLongitude: coordinates.longitude,
      roadLatitude: coordinates.latitude,
    });

    setFacilitySearch(r.facility?.name || "");
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await reportService.remove(id);
      loadReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Error deleting report");
    }
  };

  const handleView = (r: Report) => {
    setSelected(r);
    setViewOpen(true);
  };

  const formatReportType = (typeValue: string) => {
    const typeEntry = Object.values(ReportType).find(
      (t) => t.value === typeValue
    );
    if (typeEntry) {
      return typeEntry.value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return typeValue;
  };

  // Add this function to extract coordinates from Google Maps link
  const extractCoordinatesFromMapLink = (
    mapLink: string
  ): { latitude: number | undefined; longitude: number | undefined } => {
    try {
      // Parse the URL
      const url = new URL(mapLink);

      // Method 1: Check for @lat,lng format (most common in Google Maps links)
      const atParams = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atParams) {
        return {
          latitude: parseFloat(atParams[1]),
          longitude: parseFloat(atParams[2]),
        };
      }

      // Method 2: Check for query parameters
      const queryParams = new URLSearchParams(url.search);
      const query = queryParams.get("query");
      if (query) {
        const coords = query.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coords) {
          return {
            latitude: parseFloat(coords[1]),
            longitude: parseFloat(coords[2]),
          };
        }
      }

      // Method 3: Check for data parameters in the path
      const dataParams = url.pathname.match(/data=([^/]+)/);
      if (dataParams) {
        const decodedData = decodeURIComponent(dataParams[1]);
        const coords = decodedData.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coords) {
          return {
            latitude: parseFloat(coords[1]),
            longitude: parseFloat(coords[2]),
          };
        }
      }
    } catch (error) {
      console.error("Error parsing map link:", error);
    }

    return { latitude: undefined, longitude: undefined };
  };

  // Update your form change handler for the map link field
  const handleMapLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mapLink = e.target.value;

    setFormData((prev) => ({
      ...prev,
      roadMapLink: mapLink,
    }));

    // Auto-extract coordinates when a valid Google Maps link is provided
    if (
      mapLink.includes("google.com/maps") ||
      mapLink.includes("maps.google")
    ) {
      const { latitude, longitude } = extractCoordinatesFromMapLink(mapLink);

      if (latitude && longitude) {
        setFormData((prev) => ({
          ...prev,
          roadLatitude: latitude,
          roadLongitude: longitude,
          roadMapLink: mapLink,
        }));
      }
    }
  };

  const handleGoToMap = (link?: string) => {
    if (link) {
      window.open(link, "_blank");
      return;
    } else {
      if (formData.roadMapLink) {
        // If we have a direct map link, use it
        window.open(formData.roadMapLink, "_blank");
      } else if (formData.roadLatitude && formData.roadLongitude) {
        // If we have coordinates, create a map link
        const googleMapsUrl = `https://www.google.com/maps?q=${formData.roadLatitude},${formData.roadLongitude}`;
        window.open(googleMapsUrl, "_blank");
      } else if (formData.roadTitle || formData.roadLocation) {
        // If we have address info, search for it
        const searchQuery = encodeURIComponent(
          `${formData.roadTitle} ${formData.roadLocation}`.trim()
        );
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        window.open(googleMapsUrl, "_blank");
      }
    }
  };

  const isValidCoordinate = (value: number): boolean => {
    return !isNaN(value) && value >= -180 && value <= 180;
  };

  const formatCoordinate = (value: number | undefined): string => {
    if (!value || !isValidCoordinate(value)) return "";
    return value.toFixed(6);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Report Management</h1>
        <div className="flex items-center gap-4">
          {/* {currentUser && (
            <div className="text-sm text-gray-600">
              Logged in as:{" "}
              <span className="font-medium">{currentUser.userName}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {currentUser.role === "super_admin" ? "Super Admin" : "Admin"}
              </span>
              {currentUser.role === "admin" && currentUser.facilityId && (
                <span className="ml-2 text-xs text-gray-500">
                  (Viewing reports from your facility only)
                </span>
              )}
            </div>
          )} */}
          <Button onClick={() => setOpen(true)}>New Report</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search reports by title, description, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && loadReports()}
        />
        <Button onClick={loadReports} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {loading && <div className="text-center">Loading reports...</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.length === 0 && !loading ? (
          <p className="text-gray-500 col-span-full text-center">
            No reports found.
          </p>
        ) : (
          reports.map((r) => (
            <Card key={r.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {r.description}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <b>Type:</b> {formatReportType(r.type)}
                  </p>
                  <p>
                    <b>Status:</b> {r.status.replace("_", " ")}
                  </p>
                  <p>
                    <b>Created by:</b> {r.createdBy?.userName || "Unknown"}
                  </p>
                  <p>
                    <b>Road:</b> {r.road?.title || "Not assigned"}
                  </p>
                  <p>
                    <b>Facility:</b> {r.facility?.name || "Not assigned"}
                  </p>
                  <p>
                    <b>Tags:</b> {r.tags?.join(", ") || "None"}
                  </p>
                  <p>
                    <b>Created:</b> {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {r.images?.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {r.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Preview ${i + 1}`}
                          className="w-8 h-8 object-cover rounded border"
                        />
                      ))}
                      {r.images.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs">
                          +{r.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleGoToMap(r.road?.mapLink)}
                  >
                    Go to Map
                  </Button>
                  <Button size="sm" onClick={() => handleView(r)}>
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(r)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Report" : "Create Report"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter report title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter detailed description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ReportStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReportStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as ReportTypeValue })
                  }
                >
                  <SelectTrigger>
                    <span>{formatReportType(formData.type)}</span>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {getSortedReportTypes().map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="bg-white hover:bg-gray-50 p-2 rounded"
                      >
                        <div className="flex flex-col ">
                          <span className="font-medium">
                            {formatReportType(type.value)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {type.description}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.category.map((cat) => (
                              <span
                                key={cat}
                                className={`text-xs px-1 py-0.5 rounded ${
                                  cat === "common"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {getCategoryDisplayName(cat)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === ReportType.other.value && (
              <div>
                <Label htmlFor="otherType">Other Type Description</Label>
                <Input
                  id="otherType"
                  value={formData.otherType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, otherType: e.target.value })
                  }
                  placeholder="Describe the report type"
                />
              </div>
            )}

            <div className="relative">
              <Label>Facility</Label>
              <Input
                placeholder="Search facility..."
                value={facilitySearch}
                onChange={(e) => {
                  setFacilitySearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />

              {showSuggestions && facilities.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto">
                  {facilities.map((f) => (
                    <li
                      key={f.id}
                      onClick={() => handleFacilitySelect(f)}
                      className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {/* Road Creation Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold mb-3">
                  Road Information (Optional)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roadTitle">Road Title</Label>
                  <Input
                    id="roadTitle"
                    value={formData.roadTitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, roadTitle: e.target.value })
                    }
                    placeholder="Road name"
                  />
                </div>
                <div>
                  <Label htmlFor="roadLocation">Road Location</Label>
                  <Input
                    id="roadLocation"
                    value={formData.roadLocation || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, roadLocation: e.target.value })
                    }
                    placeholder="General location"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => handleGoToMap("")}
                className="flex gap-2 text-gray-500 items-center cursor-pointer border px-2 py-1 rounded hover:bg-gray-100"
              >
                <Map />
                <span>Go to Map</span>
              </button>
              <div className="flex-1">
                <Label htmlFor="roadMapLink">Map Link</Label>
                <Input
                  id="roadMapLink"
                  type="text"
                  value={formData.roadMapLink ?? ""}
                  onChange={handleMapLinkChange}
                  placeholder="Paste Google Maps link to auto-fill coordinates"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste a Google Maps link to automatically extract coordinates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="roadLongitude">Longitude</Label>
                <Input
                  id="roadLongitude"
                  type="number"
                  step="any"
                  value={formData.roadLongitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roadLongitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0.000000"
                />
                {formData.roadLongitude && (
                  <p className="text-xs text-green-600">
                    Formatted: {formatCoordinate(formData.roadLongitude)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="roadLatitude">Latitude</Label>
                <Input
                  id="roadLatitude"
                  type="number"
                  step="any"
                  value={formData.roadLatitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roadLatitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0.000000"
                />
                {formData.roadLatitude && (
                  <p className="text-xs text-green-600">
                    Formatted: {formatCoordinate(formData.roadLatitude)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.imageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.imageFiles.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.roadMapLink ||
                !formData.roadLocation ||
                !formData.roadLongitude ||
                !formData.roadLatitude ||
                !formData.roadTitle
              }
            >
              {formData.id ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VIEW REPORT DIALOG */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Title</p>
                  <p>{selected.title}</p>
                </div>
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{selected.status.replace("_", " ")}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Description</p>
                <p className="whitespace-pre-wrap">{selected.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Type</p>
                  <p>{formatReportType(selected.type)}</p>
                </div>
                {selected.otherType && (
                  <div>
                    <p className="font-semibold">Other Type</p>
                    <p>{selected.otherType}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Created By</p>
                  <p>
                    {selected.createdBy?.userName ||
                      selected.createdBy?.email ||
                      "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Assigned To</p>
                  <p>
                    {selected.reportTo?.userName ||
                      selected.reportTo?.email ||
                      "Not assigned"}
                  </p>
                </div>
              </div>

              {selected.road && (
                <div>
                  <p className="font-semibold">Road</p>
                  <p>
                    {selected.road.title}{" "}
                    {selected.road.location && `- ${selected.road.location}`}
                  </p>
                </div>
              )}

              {selected.facility && (
                <div>
                  <p className="font-semibold">Facility</p>
                  <p>{selected.facility.name}</p>
                </div>
              )}

              <div>
                <p className="font-semibold">Tags</p>
                <p>{selected.tags?.join(", ") || "None"}</p>
              </div>

              {selected.images?.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">
                    Images ({selected.images.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Report image ${i + 1}`}
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p className="font-semibold">Created</p>
                  <p>{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Updated</p>
                  <p>{new Date(selected.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
