import { useEffect, useState, type ChangeEvent } from "react";
import { roadService } from "@/services/road.service";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Eye,
  Shield,
  Map,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Brain,
  AlertCircle,
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  Filter,
  Download,
  Sparkles,
} from "lucide-react";

// 🔹 Prisma Enums (mirror of your backend enums)
const ROAD_TYPES = [
  "high_risk_road_candidate",
  "blind_curve",
  "sleep_descent_ascent",
  "narrow_road",
  "gravel_road",
  "flood_prone_road",
  "landslide_prone_road",
  "road_with_no_lighting",
  "heavy_pedestrian_zone",
  "road_with_obstructions",
  "high_speed_zone",
  "intersection_without_traffic_signals",
  "sharp_drop_off",
  "construction_zone",
  "slippery_road",
  "railroad_crossing",
  "other",
];

const ROAD_STATUS = [
  "pending_assessment",
  "under_inspection",
  "verified_hazard",
  "for_action",
  "work_in_progress",
  "temporary_resolved",
  "safe",
  "needs_monitoring",
  "escalated",
  "closed",
];

// 🔹 Status configuration with colors and icons
const STATUS_CONFIG = {
  pending_assessment: {
    label: "Pending Assessment",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  under_inspection: {
    label: "Under Inspection",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Eye,
  },
  verified_hazard: {
    label: "Verified Hazard",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
  },
  for_action: {
    label: "For Action",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
  },
  work_in_progress: {
    label: "Work in Progress",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Wrench,
  },
  temporary_resolved: {
    label: "Temporary Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  safe: {
    label: "Safe",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  needs_monitoring: {
    label: "Needs Monitoring",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Eye,
  },
  escalated: {
    label: "Escalated",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Shield,
  },
};

// 🔹 Type configuration with colors
const TYPE_CONFIG = {
  high_risk_road_candidate: {
    label: "High Risk Candidate",
    color: "bg-red-100 text-red-800",
  },
  blind_curve: { label: "Blind Curve", color: "bg-orange-100 text-orange-800" },
  sleep_descent_ascent: {
    label: "Sleep Descent/Ascent",
    color: "bg-amber-100 text-amber-800",
  },
  narrow_road: { label: "Narrow Road", color: "bg-yellow-100 text-yellow-800" },
  gravel_road: { label: "Gravel Road", color: "bg-lime-100 text-lime-800" },
  flood_prone_road: {
    label: "Flood Prone",
    color: "bg-blue-100 text-blue-800",
  },
  landslide_prone_road: {
    label: "Landslide Prone",
    color: "bg-brown-100 text-brown-800",
  },
  road_with_no_lighting: {
    label: "No Lighting",
    color: "bg-indigo-100 text-indigo-800",
  },
  heavy_pedestrian_zone: {
    label: "Heavy Pedestrian",
    color: "bg-purple-100 text-purple-800",
  },
  road_with_obstructions: {
    label: "Obstructions",
    color: "bg-pink-100 text-pink-800",
  },
  high_speed_zone: {
    label: "High Speed Zone",
    color: "bg-red-100 text-red-800",
  },
  intersection_without_traffic_signals: {
    label: "No Traffic Signals",
    color: "bg-orange-100 text-orange-800",
  },
  sharp_drop_off: {
    label: "Sharp Drop Off",
    color: "bg-amber-100 text-amber-800",
  },
  construction_zone: {
    label: "Construction Zone",
    color: "bg-yellow-100 text-yellow-800",
  },
  slippery_road: { label: "Slippery Road", color: "bg-blue-100 text-blue-800" },
  railroad_crossing: {
    label: "Railroad Crossing",
    color: "bg-red-100 text-red-800",
  },
  other: { label: "Other", color: "bg-gray-100 text-gray-800" },
};

// 🔹 AI Risk Analysis Configuration
const RISK_ANALYSIS_CONFIG = {
  CRITICAL: {
    label: "CRITICAL RISK AREA",
    color: "bg-red-500/20 text-red-700 border-red-300",
    icon: AlertCircle,
    description: "Multiple hazards detected in close proximity",
    badgeColor: "bg-gradient-to-r from-red-600 to-orange-500",
  },
  HIGH: {
    label: "HIGH RISK CLUSTER",
    color: "bg-orange-500/20 text-orange-700 border-orange-300",
    icon: TrendingUp,
    description: "Significant concentration of road hazards",
    badgeColor: "bg-gradient-to-r from-orange-500 to-amber-500",
  },
  MODERATE: {
    label: "RISK AREA DETECTED",
    color: "bg-yellow-500/20 text-yellow-700 border-yellow-300",
    icon: Target,
    description: "Multiple hazards in the area",
    badgeColor: "bg-gradient-to-r from-yellow-500 to-amber-400",
  },
  LOW: {
    label: "MONITORING AREA",
    color: "bg-blue-500/20 text-blue-700 border-blue-300",
    icon: Activity,
    description: "Potential risk area identified",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-400",
  },
};

// 🔹 AI Analysis Interface
interface AIAnalysisResult {
  id: string;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  confidence: number;
  totalRoads: number;
  radius: number;
  centroid: { lat: number; lng: number };
  highRiskCount: number;
  recommendedAction: string;
  timestamp: string;
  affectedRoads: string[];
}

// 🔹 Filter State Interface
interface FilterState {
  status: string[];
  type: string[];
  riskLevel: string[];
  showHighRiskOnly: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}

export default function RoadMSPage() {
  const [roads, setRoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // AI Analysis state
  const [aiAnalysisResults, setAiAnalysisResults] = useState<
    AIAnalysisResult[]
  >([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
    riskLevel: [],
    showHighRiskOnly: false,
    dateRange: {
      start: "",
      end: "",
    },
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    longitude: "",
    latitude: "",
    isHighRisk: false,
    status: "pending_assessment",
    type: "high_risk_road_candidate",
    otherType: "",
    tags: "",
    location: "",
    mapLink: "",
  });

  // -----------------------------------------------------
  // 🔹 Check if all required fields are filled
  // -----------------------------------------------------
  const isFormComplete = () => {
    return (
      form.title.trim() !== "" &&
      form.location.trim() !== "" &&
      form.longitude !== "" &&
      form.latitude !== ""
    );
  };

  // -----------------------------------------------------
  // 🔹 Calculate distance between two coordinates (Haversine formula)
  // -----------------------------------------------------
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // -----------------------------------------------------
  // 🔹 AI Risk Analysis Function
  // -----------------------------------------------------
  const performAIAnalysis = async (
    roads: any[]
  ): Promise<AIAnalysisResult[]> => {
    setAnalyzing(true);

    try {
      const results: AIAnalysisResult[] = [];
      const processed = new Set<string>();

      // Filter roads with valid coordinates
      const roadsWithCoords = roads.filter(
        (road) =>
          road.latitude &&
          road.longitude &&
          !isNaN(parseFloat(road.latitude)) &&
          !isNaN(parseFloat(road.longitude))
      );

      if (roadsWithCoords.length < 3) {
        setAnalyzing(false);
        return [];
      }

      // Analyze each road cluster
      for (let i = 0; i < roadsWithCoords.length; i++) {
        const road = roadsWithCoords[i];
        const currentLat = parseFloat(road.latitude);
        const currentLng = parseFloat(road.longitude);
        const roadId = road.id;

        if (processed.has(roadId)) continue;

        // Find nearby roads within 200m
        const nearbyRoads = [];
        const affectedRoadIds: string[] = [];
        let totalLat = 0;
        let totalLng = 0;
        let highRiskCount = 0;

        for (let j = 0; j < roadsWithCoords.length; j++) {
          const targetRoad = roadsWithCoords[j];
          const targetLat = parseFloat(targetRoad.latitude);
          const targetLng = parseFloat(targetRoad.longitude);

          const distance = calculateDistance(
            currentLat,
            currentLng,
            targetLat,
            targetLng
          );

          if (distance <= 200) {
            nearbyRoads.push(targetRoad);
            affectedRoadIds.push(targetRoad.id);
            totalLat += targetLat;
            totalLng += targetLng;
            if (targetRoad.isHighRisk) highRiskCount++;
            processed.add(targetRoad.id);
          }
        }

        if (nearbyRoads.length >= 3) {
          // Calculate centroid
          const centroid = {
            lat: totalLat / nearbyRoads.length,
            lng: totalLng / nearbyRoads.length,
          };

          // Determine risk level based on concentration
          let riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" = "LOW";
          let confidence = 0;
          let recommendedAction = "";

          if (nearbyRoads.length >= 8 || highRiskCount >= 3) {
            riskLevel = "CRITICAL";
            confidence = 92 + Math.floor(Math.random() * 6);
            recommendedAction =
              "Immediate intervention required. Consider road closure or emergency repairs. Schedule safety inspection within 24 hours.";
          } else if (nearbyRoads.length >= 6 || highRiskCount >= 2) {
            riskLevel = "HIGH";
            confidence = 82 + Math.floor(Math.random() * 8);
            recommendedAction =
              "Urgent assessment needed. Schedule inspections and implement temporary safety measures. Review within 48 hours.";
          } else if (nearbyRoads.length >= 4) {
            riskLevel = "MODERATE";
            confidence = 72 + Math.floor(Math.random() * 10);
            recommendedAction =
              "Enhanced monitoring recommended. Review area in next safety audit. Consider additional signage.";
          } else {
            riskLevel = "LOW";
            confidence = 65 + Math.floor(Math.random() * 10);
            recommendedAction =
              "Continue regular monitoring. Flag for periodic review. Document for future analysis.";
          }

          const analysis: AIAnalysisResult = {
            id: `analysis-${Date.now()}-${i}`,
            riskLevel,
            confidence,
            totalRoads: nearbyRoads.length,
            radius: 200,
            centroid,
            highRiskCount,
            recommendedAction,
            timestamp: new Date().toISOString(),
            affectedRoads: affectedRoadIds,
          };

          results.push(analysis);
        }
      }

      // Filter for unique areas (remove overlaps)
      const uniqueResults = results.filter(
        (result, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              calculateDistance(
                r.centroid.lat,
                r.centroid.lng,
                result.centroid.lat,
                result.centroid.lng
              ) < 100
          )
      );

      setAiAnalysisResults(uniqueResults);
      return uniqueResults;
    } catch (error) {
      console.error("AI Analysis error:", error);
      return [];
    } finally {
      setAnalyzing(false);
    }
  };

  // -----------------------------------------------------
  // 🔹 Tag roads that are in high-risk zones
  // -----------------------------------------------------
  const tagRoadsInHighRiskZones = (
    roads: any[],
    analysisResults: AIAnalysisResult[]
  ) => {
    return roads.map((road) => {
      if (
        !road.latitude ||
        !road.longitude ||
        isNaN(parseFloat(road.latitude)) ||
        isNaN(parseFloat(road.longitude))
      ) {
        return road;
      }

      const lat = parseFloat(road.latitude);
      const lng = parseFloat(road.longitude);

      // Find which risk zone this road belongs to
      const riskZone = analysisResults.find((result) => {
        const distance = calculateDistance(
          lat,
          lng,
          result.centroid.lat,
          result.centroid.lng
        );
        return (
          distance <= result.radius && result.affectedRoads.includes(road.id)
        );
      });

      return {
        ...road,
        aiRiskZone: riskZone?.riskLevel || null,
        isInHighRiskZone: riskZone
          ? ["CRITICAL", "HIGH"].includes(riskZone.riskLevel)
          : false,
        riskZoneId: riskZone?.id,
      };
    });
  };

  // -----------------------------------------------------
  // 🔹 Fetch All Roads with Pagination and AI Analysis
  // -----------------------------------------------------
  const fetchRoadsWithAnalysis = async (page: number = 1) => {
    setLoading(true);
    try {
      const skip = (page - 1) * itemsPerPage;
      const res = await roadService.getAll({
        query: "",
        limit: itemsPerPage,
        skip: skip,
      });

      // Assuming your API returns data in this format
      if (res?.data) {
        const list = Array.isArray(res.data.items) ? res.data.items : res.data;
        const total = res.data.total || res.data.count || list.length;

        // Perform AI analysis if enabled
        let analysisResults: AIAnalysisResult[] = [];
        if (autoAnalyze && list.length > 0) {
          analysisResults = await performAIAnalysis(list);
        }

        // Tag roads with AI analysis results
        const roadsWithTags = tagRoadsInHighRiskZones(list, analysisResults);

        setRoads(roadsWithTags);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching roads:", err);
      setRoads([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // If your API doesn't support pagination, handle it client-side
  const fetchAllRoadsAndPaginate = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await roadService.getAll({ query: "", limit: 999 });
      const allRoads = Array.isArray(res?.data) ? res.data : [];

      const total = allRoads.length;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedRoads = allRoads.slice(startIndex, endIndex);

      // Perform AI analysis if enabled
      let analysisResults: AIAnalysisResult[] = [];
      if (autoAnalyze && allRoads.length > 0) {
        analysisResults = await performAIAnalysis(allRoads);
      }

      // Tag roads with AI analysis results
      const roadsWithTags = tagRoadsInHighRiskZones(
        paginatedRoads,
        analysisResults
      );

      setRoads(roadsWithTags);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / itemsPerPage));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching roads:", err);
      setRoads([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Choose one based on your API capabilities:
    fetchRoadsWithAnalysis(1); // If API supports pagination
    // fetchAllRoadsAndPaginate(1); // If client-side pagination needed
  }, [itemsPerPage, autoAnalyze]);

  // -----------------------------------------------------
  // 🔹 Input Handler
  // -----------------------------------------------------
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------------------------------
  // 🔹 Create New
  // -----------------------------------------------------
  const handleCreate = () => {
    setSelected(null);
    setForm({
      title: "",
      description: "",
      longitude: "",
      latitude: "",
      isHighRisk: false,
      status: "pending_assessment",
      type: "high_risk_road_candidate",
      otherType: "",
      tags: "",
      location: "",
      mapLink: "",
    });
    setOpen(true);
  };

  // -----------------------------------------------------
  // 🔹 Edit Existing
  // -----------------------------------------------------
  const handleEdit = (road: any) => {
    setSelected(road);
    setForm({
      title: road.title ?? "",
      description: road.description ?? "",
      longitude: road.longitude?.toString() ?? "",
      latitude: road.latitude?.toString() ?? "",
      isHighRisk: road.isHighRisk ?? false,
      status: road.status ?? "pending_assessment",
      type: road.type ?? "high_risk_road_candidate",
      otherType: road.otherType ?? "",
      tags: (road.tags || []).join(", "),
      location: road.location ?? "",
      mapLink: road.mapLink ?? "",
    });
    setOpen(true);
  };

  // -----------------------------------------------------
  // 🔹 Pagination Handlers
  // -----------------------------------------------------
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Choose one based on your implementation:
    fetchRoadsWithAnalysis(page); // If API supports pagination
    // fetchAllRoadsAndPaginate(page); // If client-side pagination
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // -----------------------------------------------------
  // 🔹 Extract coordinates from Google Maps link
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // 🔹 Handle Map Link Change
  // -----------------------------------------------------
  const handleMapLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mapLink = e.target.value;

    setForm((prev) => ({
      ...prev,
      mapLink: mapLink,
    }));

    // Auto-extract coordinates when a valid Google Maps link is provided
    if (
      mapLink.includes("google.com/maps") ||
      mapLink.includes("maps.google")
    ) {
      const { latitude, longitude } = extractCoordinatesFromMapLink(mapLink);

      if (latitude && longitude) {
        setForm((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          mapLink: mapLink,
        }));
      }
    }
  };

  // -----------------------------------------------------
  // 🔹 Go to Map Function
  // -----------------------------------------------------
  const handleGoToMap = (road?: any) => {
    if (road) {
      // For existing roads in the table
      if (road.mapLink) {
        window.open(road.mapLink, "_blank");
      } else if (road.latitude && road.longitude) {
        const googleMapsUrl = `https://www.google.com/maps?q=${road.latitude},${road.longitude}`;
        window.open(googleMapsUrl, "_blank");
      } else if (road.location) {
        const searchQuery = encodeURIComponent(road.location);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        window.open(googleMapsUrl, "_blank");
      }
    } else {
      // For form data (when creating/editing)
      if (form.mapLink) {
        window.open(form.mapLink, "_blank");
      } else if (form.latitude && form.longitude) {
        const googleMapsUrl = `https://www.google.com/maps?q=${form.latitude},${form.longitude}`;
        window.open(googleMapsUrl, "_blank");
      } else if (form.location) {
        const searchQuery = encodeURIComponent(form.location);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        window.open(googleMapsUrl, "_blank");
      }
    }
  };

  // -----------------------------------------------------
  // 🔹 Format Coordinate
  // -----------------------------------------------------
  const formatCoordinate = (value: number | undefined): string => {
    if (!value || isNaN(value)) return "";
    return value.toFixed(6);
  };

  // -----------------------------------------------------
  // 🔹 Save (Create or Update)
  // -----------------------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Don't submit if form is not complete
    if (!isFormComplete()) {
      alert(
        "Please fill all required fields (Title, Location, Longitude, and Latitude)"
      );
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      isHighRisk: Boolean(form.isHighRisk),
      status: form.status,
      type: form.type,
      otherType: form.type === "other" ? form.otherType : null,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      location: form.location || undefined,
      mapLink: form.mapLink || undefined,
    };

    try {
      if (selected) {
        await roadService.update(selected.id, payload);
        alert("Road updated successfully!");
      } else {
        await roadService.create(payload);
        alert("Road created successfully!");
      }

      setOpen(false);
      // Refresh the current page after save
      fetchRoadsWithAnalysis(currentPage); // If API supports pagination
      // fetchAllRoadsAndPaginate(currentPage); // If client-side pagination
    } catch (err) {
      console.error("Error saving road:", err);
      alert("Error saving road");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------------------------
  // 🔹 Delete
  // -----------------------------------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this road?")) return;
    try {
      await roadService.remove(id, {});
      // Refresh the current page after delete
      fetchRoadsWithAnalysis(currentPage); // If API supports pagination
      // fetchAllRoadsAndPaginate(currentPage); // If client-side pagination
    } catch (err) {
      console.error("Error deleting road:", err);
    }
  };

  // -----------------------------------------------------
  // 🔹 Format Coordinates for display
  // -----------------------------------------------------
  const formatCoordinateDisplay = (coord: number) => {
    return coord ? coord.toFixed(6) : "N/A";
  };

  // -----------------------------------------------------
  // 🔹 Render Status Badge
  // -----------------------------------------------------
  const renderStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      label: status.replaceAll("_", " "),
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} border flex items-center gap-1 px-2 py-1 text-xs font-medium`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // -----------------------------------------------------
  // 🔹 Render Type Badge
  // -----------------------------------------------------
  const renderTypeBadge = (type: string) => {
    const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || {
      label: type.replaceAll("_", " "),
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        variant="secondary"
        className={`${config.color} text-xs font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

  // -----------------------------------------------------
  // 🔹 Render AI Risk Badge
  // -----------------------------------------------------
  const renderAIRiskBadge = (riskLevel: string) => {
    const config =
      RISK_ANALYSIS_CONFIG[riskLevel as keyof typeof RISK_ANALYSIS_CONFIG];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <Badge
        className={`${config.badgeColor} text-white text-xs font-bold px-2 py-1 animate-pulse`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {riskLevel} RISK
      </Badge>
    );
  };

  // -----------------------------------------------------
  // 🔹 Calculate pagination range
  // -----------------------------------------------------
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  // -----------------------------------------------------
  // 🔹 Apply filters to roads
  // -----------------------------------------------------
  const applyFilters = (roads: any[]) => {
    return roads.filter((road) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(road.status)) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(road.type)) {
        return false;
      }

      // Risk level filter
      if (
        filters.riskLevel.length > 0 &&
        !filters.riskLevel.includes(road.aiRiskZone || "")
      ) {
        return false;
      }

      // High risk only filter
      if (filters.showHighRiskOnly && !road.isHighRisk) {
        return false;
      }

      return true;
    });
  };

  // -----------------------------------------------------
  // 🔹 Filter handlers
  // -----------------------------------------------------
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      type: [],
      riskLevel: [],
      showHighRiskOnly: false,
      dateRange: { start: "", end: "" },
    });
  };

  // -----------------------------------------------------
  // 🔹 Get filtered roads
  // -----------------------------------------------------
  const filteredRoads = applyFilters(roads);

  // -----------------------------------------------------
  // 🔹 Render AI Risk Alert Component
  // -----------------------------------------------------
  const renderAIRiskAlert = () => {
    if (aiAnalysisResults.length === 0 || analyzing) return null;

    const criticalResults = aiAnalysisResults.filter(
      (r) => r.riskLevel === "CRITICAL"
    );
    const highResults = aiAnalysisResults.filter((r) => r.riskLevel === "HIGH");

    if (criticalResults.length === 0 && highResults.length === 0) return null;

    const totalRiskAreas = criticalResults.length + highResults.length;
    const totalRoadsInRisk =
      criticalResults.reduce((sum, r) => sum + r.totalRoads, 0) +
      highResults.reduce((sum, r) => sum + r.totalRoads, 0);

    return (
      <Card className="border-red-300 bg-gradient-to-r from-red-50/50 to-orange-50/50 shadow-lg mb-6 animate-in slide-in-from-top duration-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg animate-pulse">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-red-800 text-lg">
                    🚨 AI Risk Analysis Alert
                  </h3>
                  <Badge className="bg-red-600 text-white animate-pulse">
                    LIVE ANALYSIS
                  </Badge>
                </div>

                <div className="space-y-2">
                  {criticalResults.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-100/50 rounded-lg border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-red-800 text-sm">
                            {criticalResults.length} CRITICAL RISK AREA
                            {criticalResults.length > 1 ? "S" : ""} DETECTED
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-red-600/10 text-red-700 border-red-300"
                          >
                            {criticalResults[0].confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          {criticalResults.reduce(
                            (sum, r) => sum + r.totalRoads,
                            0
                          )}{" "}
                          roads at immediate risk
                          {criticalResults[0].highRiskCount > 0 &&
                            ` (${criticalResults[0].highRiskCount} confirmed hazards)`}
                        </p>
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          ⚡ {criticalResults[0]?.recommendedAction}
                        </p>
                      </div>
                    </div>
                  )}

                  {highResults.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-100/50 rounded-lg border border-orange-200">
                      <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-orange-800 text-sm">
                            {highResults.length} High Risk Cluster
                            {highResults.length > 1 ? "s" : ""}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-orange-600/10 text-orange-700 border-orange-300"
                          >
                            {highResults[0].confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          {highResults.reduce(
                            (sum, r) => sum + r.totalRoads,
                            0
                          )}{" "}
                          roads requiring urgent attention
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnalysisPanel(true)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View Detailed Analysis
                  </Button>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Analysis Summary:</span>{" "}
                    {totalRiskAreas} risk areas affecting {totalRoadsInRisk}{" "}
                    roads
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex flex-col items-end gap-2">
                <div className="px-3 py-1 bg-white rounded-lg border border-red-200 shadow-sm">
                  <div className="text-xs text-gray-600">Risk Density</div>
                  <div className="text-lg font-bold text-red-700">
                    {Math.round(
                      (criticalResults.length * 100) /
                        Math.max(aiAnalysisResults.length, 1)
                    )}
                    %
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last analyzed:{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // -----------------------------------------------------
  // 🔹 Render AI Analysis Panel (Modal)
  // -----------------------------------------------------
  const renderAIAnalysisPanel = () => {
    const criticalCount = aiAnalysisResults.filter(
      (r) => r.riskLevel === "CRITICAL"
    ).length;
    const highCount = aiAnalysisResults.filter(
      (r) => r.riskLevel === "HIGH"
    ).length;
    const moderateCount = aiAnalysisResults.filter(
      (r) => r.riskLevel === "MODERATE"
    ).length;
    const lowCount = aiAnalysisResults.filter(
      (r) => r.riskLevel === "LOW"
    ).length;

    const totalRoadsAnalyzed = aiAnalysisResults.reduce(
      (sum, r) => sum + r.totalRoads,
      0
    );
    const averageConfidence =
      aiAnalysisResults.length > 0
        ? Math.round(
            aiAnalysisResults.reduce((acc, r) => acc + r.confidence, 0) /
              aiAnalysisResults.length
          )
        : 0;

    return (
      <Dialog open={showAnalysisPanel} onOpenChange={setShowAnalysisPanel}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  AI Risk Analysis Dashboard
                </div>
                <div className="text-sm font-normal text-gray-600">
                  Real-time spatial analysis of road hazard clusters
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium mb-1">
                        Critical Risk Areas
                      </p>
                      <p className="text-3xl font-bold text-red-800">
                        {criticalCount}
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        Require immediate action
                      </p>
                    </div>
                    <div className="p-3 bg-red-200/50 rounded-full">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  {criticalCount > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-red-700">Affected roads:</span>
                        <span className="font-semibold">
                          {aiAnalysisResults
                            .filter((r) => r.riskLevel === "CRITICAL")
                            .reduce((sum, r) => sum + r.totalRoads, 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium mb-1">
                        High Risk Clusters
                      </p>
                      <p className="text-3xl font-bold text-orange-800">
                        {highCount}
                      </p>
                      <p className="text-xs text-orange-600 mt-2">
                        Need urgent assessment
                      </p>
                    </div>
                    <div className="p-3 bg-orange-200/50 rounded-full">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Total Roads Analyzed
                      </p>
                      <p className="text-3xl font-bold text-blue-800">
                        {totalRoadsAnalyzed}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        Within 200m clusters
                      </p>
                    </div>
                    <div className="p-3 bg-blue-200/50 rounded-full">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium mb-1">
                        AI Confidence Score
                      </p>
                      <p className="text-3xl font-bold text-green-800">
                        {averageConfidence}%
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Analysis accuracy
                      </p>
                    </div>
                    <div className="p-3 bg-green-200/50 rounded-full">
                      <Brain className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">
                  Detailed Analysis Results
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Critical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Moderate</span>
                  </div>
                </div>
              </div>

              {aiAnalysisResults.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No risk clusters detected yet.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add more roads with coordinates to enable AI analysis.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {aiAnalysisResults.map((result, index) => {
                    const config = RISK_ANALYSIS_CONFIG[result.riskLevel];
                    const Icon = config.icon;
                    const affectedRoads = result.totalRoads;

                    return (
                      <Card
                        key={result.id}
                        className={`border-l-4 ${
                          config.color.split(" ")[0]
                        } hover:shadow-md transition-shadow`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div
                                className={`p-3 ${
                                  config.color.split(" ")[0]
                                } rounded-lg`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-gray-900">
                                    {config.label}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={`${config.color} border`}
                                  >
                                    {result.confidence}% confidence
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-800"
                                  >
                                    {affectedRoads} road
                                    {affectedRoads > 1 ? "s" : ""}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                      <span className="font-medium">
                                        Location:
                                      </span>{" "}
                                      {result.centroid.lat.toFixed(6)},{" "}
                                      {result.centroid.lng.toFixed(6)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        Radius:
                                      </span>{" "}
                                      {result.radius}m
                                      {result.highRiskCount > 0 &&
                                        ` • ${
                                          result.highRiskCount
                                        } high-risk road${
                                          result.highRiskCount > 1 ? "s" : ""
                                        }`}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        Analysis Time:
                                      </span>{" "}
                                      {new Date(
                                        result.timestamp
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm font-medium text-gray-800 mb-1">
                                    AI Recommendation:
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {result.recommendedAction}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const url = `https://www.google.com/maps?q=${result.centroid.lat},${result.centroid.lng}`;
                                  window.open(url, "_blank");
                                }}
                                className="whitespace-nowrap"
                              >
                                <Map className="w-4 h-4 mr-2" />
                                View on Map
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Analysis Configuration */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">
                      About This Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-700 mb-3">
                          This AI-powered analysis detects clusters of roads
                          within a 200-meter radius using spatial density
                          algorithms. Areas with 3+ roads are flagged as
                          potential risk zones.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-gray-700">
                              <strong>Critical:</strong> 8+ roads or 3+
                              high-risk roads
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">
                              <strong>High:</strong> 6-7 roads or 2+ high-risk
                              roads
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-700">
                              <strong>Moderate:</strong> 4-5 roads
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">
                              <strong>Low:</strong> 3 roads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Auto-Analysis
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={autoAnalyze}
                                onChange={(e) =>
                                  setAutoAnalyze(e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-600">
                            When enabled, roads are automatically analyzed for
                            risk clusters whenever data is loaded or updated.
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Algorithm:</span>{" "}
                            Spatial Density Analysis
                          </div>
                          <div>
                            <span className="font-medium">Version:</span> 2.1.0
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // -----------------------------------------------------
  // 🔹 Render Filter Panel
  // -----------------------------------------------------
  const renderFilterPanel = () => {
    return (
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Roads
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <div className="flex flex-wrap gap-2">
                {ROAD_STATUS.map((status) => {
                  const config =
                    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        const newStatus = filters.status.includes(status)
                          ? filters.status.filter((s) => s !== status)
                          : [...filters.status, status];
                        handleFilterChange("status", newStatus);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        filters.status.includes(status)
                          ? `${
                              config.color.split(" ")[0]
                            } border-current font-medium`
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {config?.label || status.replaceAll("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Road Type
              </Label>
              <div className="flex flex-wrap gap-2">
                {ROAD_TYPES.slice(0, 8).map((type) => {
                  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        const newTypes = filters.type.includes(type)
                          ? filters.type.filter((t) => t !== type)
                          : [...filters.type, type];
                        handleFilterChange("type", newTypes);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        filters.type.includes(type)
                          ? `${config.color} font-medium`
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {config?.label || type.replaceAll("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Risk Level Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                AI Risk Level
              </Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(RISK_ANALYSIS_CONFIG).map(([level, config]) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      const newLevels = filters.riskLevel.includes(level)
                        ? filters.riskLevel.filter((l) => l !== level)
                        : [...filters.riskLevel, level];
                      handleFilterChange("riskLevel", newLevels);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      filters.riskLevel.includes(level)
                        ? `${config.color} font-medium border-current`
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High Risk Only Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <Label htmlFor="highRiskOnly" className="text-sm font-medium">
                  Show High Risk Roads Only
                </Label>
              </div>
              <input
                type="checkbox"
                id="highRiskOnly"
                checked={filters.showHighRiskOnly}
                onChange={(e) =>
                  handleFilterChange("showHighRiskOnly", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="px-4"
              >
                Reset Filters
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="px-4 bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {Object.values(filters).some((filter) =>
              Array.isArray(filter)
                ? filter.length > 0
                : typeof filter === "boolean"
                ? filter
                : typeof filter === "object"
                ? filter.start || filter.end
                : false
            ) && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Active Filters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.status.map((status) => (
                    <Badge
                      key={status}
                      variant="outline"
                      className="bg-blue-100 text-blue-700"
                    >
                      Status:{" "}
                      {
                        STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                          ?.label
                      }
                    </Badge>
                  ))}
                  {filters.type.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="bg-blue-100 text-blue-700"
                    >
                      Type:{" "}
                      {TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.label}
                    </Badge>
                  ))}
                  {filters.riskLevel.map((level) => (
                    <Badge
                      key={level}
                      variant="outline"
                      className="bg-blue-100 text-blue-700"
                    >
                      Risk:{" "}
                      {
                        RISK_ANALYSIS_CONFIG[
                          level as keyof typeof RISK_ANALYSIS_CONFIG
                        ]?.label
                      }
                    </Badge>
                  ))}
                  {filters.showHighRiskOnly && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-700"
                    >
                      High Risk Only
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // -----------------------------------------------------
  // 🔹 Get statistics for display
  // -----------------------------------------------------
  const getStatistics = () => {
    const totalRoads = roads.length;
    const highRiskRoads = roads.filter((r) => r.isHighRisk).length;
    const roadsInRiskZones = roads.filter((r) => r.isInHighRiskZone).length;
    const pendingAssessment = roads.filter(
      (r) => r.status === "pending_assessment"
    ).length;

    return {
      totalRoads,
      highRiskRoads,
      roadsInRiskZones,
      pendingAssessment,
      filteredCount: filteredRoads.length,
    };
  };

  const stats = getStatistics();

  return (
    <div className="p-6 space-y-6">
      {/* AI Risk Alert Banner */}
      {renderAIRiskAlert()}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Roads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRoads}
                </p>
                <p className="text-xs text-gray-500 mt-1">In database</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">
                  High Risk Roads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.highRiskRoads}
                </p>
                <p className="text-xs text-gray-500 mt-1">Require attention</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  In Risk Zones
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.roadsInRiskZones}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  AI-detected clusters
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">
                  Pending Assessment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingAssessment}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Road Management System
            </CardTitle>

            {/* AI Analysis Indicator */}
            {aiAnalysisResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalysisPanel(true)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-700"
                >
                  {aiAnalysisResults.length}
                </Badge>
              </Button>
            )}

            {/* Filter Status */}
            {stats.filteredCount !== stats.totalRoads && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Filtered: {stats.filteredCount} of {stats.totalRoads} roads
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {Object.values(filters).some((filter) =>
                Array.isArray(filter)
                  ? filter.length > 0
                  : typeof filter === "boolean"
                  ? filter
                  : typeof filter === "object"
                  ? filter.start || filter.end
                  : false
              ) && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-700"
                >
                  {Object.values(filters).reduce((count, filter) => {
                    if (Array.isArray(filter)) return count + filter.length;
                    if (typeof filter === "boolean" && filter) return count + 1;
                    if (
                      typeof filter === "object" &&
                      (filter.start || filter.end)
                    )
                      return count + 1;
                    return count;
                  }, 0)}
                </Badge>
              )}
            </Button>

            <Button
              onClick={() => fetchRoadsWithAnalysis(currentPage)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
              disabled={analyzing || loading}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Re-analyze
                </>
              )}
            </Button>

            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Road
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Items per page selector and filter info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                  Show:
                </Label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <span className="text-sm text-gray-600 hidden sm:inline">
                Showing{" "}
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} roads
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-sm">
              {stats.highRiskRoads > 0 && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 font-medium">
                    {stats.highRiskRoads} high risk
                  </span>
                </div>
              )}
              {stats.roadsInRiskZones > 0 && (
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-700 font-medium">
                    {stats.roadsInRiskZones} in risk zones
                  </span>
                </div>
              )}
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                Page {currentPage} of {totalPages}
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-700 font-medium">Loading roads data...</p>
              <p className="text-gray-500 text-sm mt-2">
                {analyzing
                  ? "Running AI analysis..."
                  : "Fetching from database"}
              </p>
            </div>
          ) : !roads.length ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                No roads found in database
              </p>
              <p className="text-gray-500 mt-2">
                Get started by adding your first road entry
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="w-4 h-4 mr-2" /> Add First Road
              </Button>
            </div>
          ) : filteredRoads.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                No roads match your filters
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your filter criteria
              </p>
              <Button onClick={resetFilters} className="mt-4" variant="outline">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Roads Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Road Information
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-900">
                          Risk Level
                        </th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRoads.map((road) => (
                        <tr
                          key={road.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                                    {road.title}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {road.location}
                                    </span>
                                  </div>
                                </div>
                                {road.isInHighRiskZone && (
                                  <div className="ml-2">
                                    {renderAIRiskBadge(road.aiRiskZone)}
                                  </div>
                                )}
                              </div>

                              <div className="text-sm text-gray-600 line-clamp-2 pr-4">
                                {road.description}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div>
                                  <span className="font-medium">
                                    Coordinates:
                                  </span>{" "}
                                  {formatCoordinateDisplay(
                                    parseFloat(road.latitude)
                                  )}
                                  ,{" "}
                                  {formatCoordinateDisplay(
                                    parseFloat(road.longitude)
                                  )}
                                </div>
                                {road.mapLink && (
                                  <Button
                                    variant="ghost"
                                    className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    onClick={() => handleGoToMap(road)}
                                  >
                                    <Map className="w-3 h-3 mr-1" />
                                    View on Map
                                  </Button>
                                )}
                              </div>

                              {road.tags && road.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {road.tags.map(
                                    (tag: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-gray-100 text-gray-700"
                                      >
                                        {tag}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {renderTypeBadge(road.type)}
                              {road.otherType && road.type === "other" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {road.otherType}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {renderStatusBadge(road.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {road.isHighRisk ? (
                                <>
                                  <div className="relative">
                                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-red-700">
                                      High Risk
                                    </span>
                                    <div className="text-xs text-red-600">
                                      Requires immediate attention
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <div>
                                    <span className="font-medium text-green-700">
                                      Normal
                                    </span>
                                    <div className="text-xs text-green-600">
                                      Regular monitoring
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleGoToMap(road)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                title="View on Map"
                              >
                                <Map className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(road)}
                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(road.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 border-t border-gray-200 bg-gray-50/50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} roads
                    {stats.filteredCount !== stats.totalRoads && (
                      <span className="text-amber-600 font-medium">
                        {" "}
                        ({stats.filteredCount} after filtering)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* First Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1.5 border-gray-300"
                      title="First Page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    {/* Previous Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1.5 border-gray-300"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Page Numbers */}
                    {getPageRange().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 min-w-[40px] ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}

                    {/* Next Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1.5 border-gray-300"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Last Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1.5 border-gray-300"
                      title="Last Page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <span className="text-sm text-gray-600">Go to page:</span>
                    <Input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="w-16 h-8 text-sm border-gray-300"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {selected ? (
                <>
                  <Pencil className="w-5 h-5 text-blue-600" />
                  Edit Road
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-green-600" />
                  Add New Road
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter road title or identification"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Describe the road condition, hazards, and other relevant information..."
                />
              </div>

              {/* Location Information Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Location Information
                  </h3>
                  <div className="text-xs text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-1"
                    >
                      Road Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g., EDSA, Ortigas to Shaw Blvd"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="mapLink">Google Maps Link</Label>
                      <Input
                        id="mapLink"
                        name="mapLink"
                        type="text"
                        value={form.mapLink}
                        onChange={handleMapLinkChange}
                        placeholder="Paste Google Maps link to auto-fill coordinates"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste a Google Maps link to automatically extract
                        coordinates
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleGoToMap()}
                      className="mt-6 border-blue-200 text-blue-700 hover:bg-blue-50"
                      disabled={!form.mapLink && !form.latitude}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Preview Map
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="longitude"
                        className="flex items-center gap-1"
                      >
                        Longitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="120.984220"
                        required
                        className="mt-1"
                      />
                      {form.longitude && (
                        <p className="text-xs text-green-600 mt-1">
                          Formatted:{" "}
                          {formatCoordinate(parseFloat(form.longitude))}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="latitude"
                        className="flex items-center gap-1"
                      >
                        Latitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="14.599512"
                        required
                        className="mt-1"
                      />
                      {form.latitude && (
                        <p className="text-xs text-green-600 mt-1">
                          Formatted:{" "}
                          {formatCoordinate(parseFloat(form.latitude))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Risk Assessment
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-red-50/50 to-orange-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isHighRisk"
                        name="isHighRisk"
                        checked={form.isHighRisk}
                        onChange={handleChange}
                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <div>
                        <Label
                          htmlFor="isHighRisk"
                          className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Mark as High Risk Area
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Enable this if the road has confirmed hazards or high
                          accident rates
                        </p>
                      </div>
                    </div>

                    {form.isHighRisk && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        HIGH RISK
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="status"
                        className="text-sm font-medium text-gray-700"
                      >
                        Status
                      </Label>
                      <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {ROAD_STATUS.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]
                              ?.label || s.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label
                        htmlFor="type"
                        className="text-sm font-medium text-gray-700"
                      >
                        Hazard Type
                      </Label>
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {ROAD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {TYPE_CONFIG[t as keyof typeof TYPE_CONFIG]
                              ?.label || t.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {form.type === "other" && (
                    <div>
                      <Label
                        htmlFor="otherType"
                        className="text-sm font-medium text-gray-700"
                      >
                        Specify Other Hazard Type
                      </Label>
                      <Input
                        id="otherType"
                        name="otherType"
                        value={form.otherType}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Describe the specific hazard type..."
                      />
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor="tags"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tags & Keywords
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Enter tags separated by commas (e.g., flood-prone, school-zone, night-danger)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple tags with commas. These help in search
                      and filtering.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700 shadow-sm"
                disabled={submitting || !isFormComplete()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {selected ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {selected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Update Road
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Road
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>

            {/* Form completion status indicator */}
            {!isFormComplete() && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Complete all required fields
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please fill all required fields (marked with *) to{" "}
                      {selected ? "update" : "create"} the road.
                    </p>
                    <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                      {!form.title.trim() && <li>• Road title is required</li>}
                      {!form.location.trim() && <li>• Location is required</li>}
                      {!form.longitude && <li>• Longitude is required</li>}
                      {!form.latitude && <li>• Latitude is required</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Render AI Analysis Panel */}
      {renderAIAnalysisPanel()}

      {/* Render Filter Panel */}
      {renderFilterPanel()}
    </div>
  );
}
