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

export default function RoadMSPage() {
  const [roads, setRoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

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
  // 🔹 Fetch All Roads
  // -----------------------------------------------------
  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await roadService.getAll({ query: "", limit: 999 });
      const list = Array.isArray(res?.data) ? res.data : [];
      setRoads(list);
    } catch (err) {
      console.error("Error fetching roads:", err);
      setRoads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoads();
  }, []);

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
      fetchRoads();
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
      fetchRoads();
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

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Road Management
          </CardTitle>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Road
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading roads...</span>
            </div>
          ) : !roads.length ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No roads found.</p>
              <p className="text-gray-400 text-sm mt-1">
                Get started by adding your first road.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      Risk Level
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roads.map((road) => (
                    <tr
                      key={road.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {road.title}
                        </div>
                        {road.location && (
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {road.location}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-700 max-w-xs line-clamp-2">
                          {road.description}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            Lat: {formatCoordinateDisplay(road.latitude)}
                          </div>
                          <div>
                            Lng: {formatCoordinateDisplay(road.longitude)}
                          </div>
                          {road.mapLink && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs mt-1"
                              onClick={() => handleGoToMap(road)}
                            >
                              <Map className="w-3 h-3 mr-1" />
                              Go to Map
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{renderTypeBadge(road.type)}</td>
                      <td className="p-3">{renderStatusBadge(road.status)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {road.isHighRisk ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-red-700 font-medium">
                                High Risk
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-700">Normal</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGoToMap(road)}
                            className="h-8 px-2 border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Map className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(road)}
                            className="h-8 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(road.id)}
                            className="h-8 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* -----------------------------------------------------
         Create / Edit Dialog
      ------------------------------------------------------ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selected ? "Edit Road" : "Add New Road"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter road title"
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
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  placeholder="Enter road description"
                />
              </div>

              {/* Road Information Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold mb-3">
                    Road Location Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Road Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="General location"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleGoToMap()}
                  className="flex gap-2 text-gray-500 items-center cursor-pointer border px-2 py-1 rounded hover:bg-gray-100"
                >
                  <Map className="w-4 h-4" />
                  <span>Go to Map</span>
                </button>
                <div className="flex-1">
                  <Label htmlFor="mapLink">Map Link *</Label>
                  <Input
                    id="mapLink"
                    name="mapLink"
                    type="text"
                    value={form.mapLink}
                    onChange={handleMapLinkChange}
                    placeholder="Paste Google Maps link to auto-fill coordinates"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a Google Maps link to automatically extract
                    coordinates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="0.000000"
                    required
                  />
                  {form.longitude && (
                    <p className="text-xs text-green-600">
                      Formatted: {formatCoordinate(parseFloat(form.longitude))}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="0.000000"
                    required
                  />
                  {form.latitude && (
                    <p className="text-xs text-green-600">
                      Formatted: {formatCoordinate(parseFloat(form.latitude))}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="isHighRisk"
                  name="isHighRisk"
                  checked={form.isHighRisk}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor="isHighRisk"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Mark as High Risk Area
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status *
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
                    Type *
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
                        {TYPE_CONFIG[t as keyof typeof TYPE_CONFIG]?.label ||
                          t.replaceAll("_", " ")}
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
                    Other Type Specification
                  </Label>
                  <Input
                    id="otherType"
                    name="otherType"
                    value={form.otherType}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Specify the road type"
                  />
                </div>
              )}

              <div>
                <Label
                  htmlFor="tags"
                  className="text-sm font-medium text-gray-700"
                >
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple tags with commas
                </p>
              </div>
            </div>

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
                className="px-6 bg-blue-600 hover:bg-blue-700"
                disabled={submitting || !isFormComplete()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {selected ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{selected ? "Update Road" : "Create Road"}</>
                )}
              </Button>
            </div>

            {/* Form completion status indicator */}
            {!isFormComplete() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2 text-yellow-800 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    Please fill all required fields (marked with *) to create
                    the road.
                  </span>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
