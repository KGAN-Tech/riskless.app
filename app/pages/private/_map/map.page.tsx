import { useEffect, useState, type ChangeEvent } from "react";
import type { LatLngTuple } from "leaflet";
import { Compass, Map } from "lucide-react";
import { DestinationSearch } from "~/app/components/templates/cards/destination.search";
import {
  RiskMap,
  type Facility,
} from "~/app/components/templates/cards/risk.map";
import { useRoad } from "~/app/hooks/use.road";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/select";
import { reportService } from "~/app/services/report.service";
import { activityService } from "~/app/services/activity.service";
import { facilityService } from "~/app/services/facility.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// Copy the same ReportType definitions from your admin page
interface ReportTypeDefinition {
  value: string;
  description: string;
  category: string[];
}

const ReportType: Record<string, ReportTypeDefinition> = {
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
  other: {
    value: "other",
    description: "Other types of road issues not listed",
    category: ["other"] as const,
  },
} as const;

type ReportTypeKey = keyof typeof ReportType;
type ReportTypeValue = (typeof ReportType)[ReportTypeKey]["value"];

enum ReportStatus {
  pending = "pending",
  under_review = "under_review",
  in_progress = "in_progress",
  resolved = "resolved",
  closed = "closed",
}

interface ReportForm {
  title: string;
  description: string;
  images: string[];
  status: ReportStatus;
  type: ReportTypeValue;
  tags: string;
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

export function MapPage() {
  const { items: roads = [] } = useRoad();
  const [destination, setDestination] = useState<string>("");
  const [destinationCoords, setDestinationCoords] =
    useState<LatLngTuple | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(
    null
  );
  const [facilitiesMap, setFacilitiesMap] = useState<Facility[]>([]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );

  const [formData, setFormData] = useState<ReportForm>({
    title: "",
    description: "",
    images: [],
    status: ReportStatus.pending,
    type: ReportType.other.value,
    tags: "",
    imageFiles: [],
    createdById: "",
    otherType: "",
    // Road fields - pre-filled with coordinates from map click
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

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMapAction = (action: string, coords: [number, number]) => {
    setClickedCoords(coords);

    // Pre-fill form with coordinates when reporting
    if (action === "reportIncident" || action === "reportHighRisk") {
      const [lat, lng] = coords;

      // Generate map link from coordinates
      const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

      setFormData((prev) => ({
        ...prev,
        roadLongitude: lng,
        roadLatitude: lat,
        roadMapLink: mapLink,
        roadLocation: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        title:
          action === "reportIncident"
            ? "Incident Report"
            : "High-Risk Road Report",
        type:
          action === "reportIncident"
            ? ReportType.minor_road_accident.value
            : ReportType.reckless_driving_area.value,
      }));

      setShowReportModal(true);
    }

    if (action === "startTravel") setDestinationCoords(coords);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Location denied:", err),
      { enableHighAccuracy: true }
    );
  }, []);

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

  const fetchFacilitiesMap = async () => {
    setLoading(true);
    try {
      const res = await facilityService.getAll({ limit: 1000 });
      setFacilitiesMap(res?.data || []);
    } catch (err) {
      console.error("Error fetching facilities for map:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilitiesMap();
  }, []);

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

  const extractCoordinatesFromMapLink = (
    mapLink: string
  ): { latitude: number | undefined; longitude: number | undefined } => {
    try {
      const url = new URL(mapLink);
      const atParams = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atParams) {
        return {
          latitude: parseFloat(atParams[1]),
          longitude: parseFloat(atParams[2]),
        };
      }

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
    } catch (error) {
      console.error("Error parsing map link:", error);
    }

    return { latitude: undefined, longitude: undefined };
  };

  const handleMapLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const mapLink = e.target.value;

    setFormData((prev) => ({
      ...prev,
      roadMapLink: mapLink,
    }));

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

  const handleGoToMap = () => {
    if (formData.roadMapLink) {
      window.open(formData.roadMapLink, "_blank");
    } else if (formData.roadLatitude && formData.roadLongitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${formData.roadLatitude},${formData.roadLongitude}`;
      window.open(googleMapsUrl, "_blank");
    } else if (formData.roadTitle || formData.roadLocation) {
      const searchQuery = encodeURIComponent(
        `${formData.roadTitle} ${formData.roadLocation}`.trim()
      );
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
      window.open(googleMapsUrl, "_blank");
    }
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

  const getSortedReportTypes = () => {
    const commonTypes = Object.values(ReportType).filter((type) =>
      type.category.includes("common")
    );
    const otherTypes = Object.values(ReportType).filter(
      (type) => !type.category.includes("common")
    );
    return [...commonTypes, ...otherTypes];
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        alert("Title and description are required");
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

      // Create report
      const reportResponse = await reportService.create(data);
      const reportId = reportResponse.data?.id;

      // Create activity
      if (reportId) {
        await activityService.create({
          title: `New Report: ${formData.title}`,
          description: formData.description,
          reportId,
          type: "incidents",
          latitude: formData.roadLatitude,
          longitude: formData.roadLongitude,
          createdById: getUserFromLocalStorage()?.user?.id,
        });
      }

      alert("Report submitted successfully!");
      setShowReportModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Error saving report. Please check the console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      images: [],
      status: ReportStatus.pending,
      type: ReportType.other.value,
      tags: "",
      imageFiles: [],
      createdById: "",
      otherType: "",
      // Road fields
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

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4 h-full">
        <h2 className="text-foreground flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" /> Navigate Safely
        </h2>

        {/* <DestinationSearch
          destination={destination}
          setDestination={setDestination}
        /> */}

        <RiskMap
          currentLocation={currentLocation as LatLngTuple}
          destination={destinationCoords as LatLngTuple}
          highRiskRoads={roads}
          onChooseAction={handleMapAction}
          facilities={facilitiesMap}
        />

        {/* Comprehensive Report Modal */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Report</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
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
                      setFormData({
                        ...formData,
                        status: value as ReportStatus,
                      })
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
                      setFormData({
                        ...formData,
                        type: value as ReportTypeValue,
                      })
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
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatReportType(type.value)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {type.description}
                            </span>
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

              {/* Road Information Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Location Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roadTitle">Location Title</Label>
                    <Input
                      id="roadTitle"
                      value={formData.roadTitle || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, roadTitle: e.target.value })
                      }
                      placeholder="Location name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roadLocation">Location Address</Label>
                    <Input
                      id="roadLocation"
                      value={formData.roadLocation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          roadLocation: e.target.value,
                        })
                      }
                      placeholder="General location or address"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4 mt-4">
                  <button
                    onClick={handleGoToMap}
                    className="flex gap-2 text-gray-500 items-center cursor-pointer border px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <Map />
                    <span>View on Map</span>
                  </button>
                  <div className="flex-1">
                    <Label htmlFor="roadMapLink">Map Link</Label>
                    <Input
                      id="roadMapLink"
                      type="text"
                      value={formData.roadMapLink ?? ""}
                      onChange={handleMapLinkChange}
                      placeholder="Paste Google Maps link"
                    />
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
                  </div>
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
              <Button
                variant="outline"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.title || !formData.description}
              >
                Create Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
