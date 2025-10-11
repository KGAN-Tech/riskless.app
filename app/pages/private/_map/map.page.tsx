import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { type LatLngExpression, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Label } from "@/components/atoms/label";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  MapPin,
  Navigation,
  AlertCircle,
  Camera,
  Send,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { DestinationSearch } from "~/app/components/templates/cards/destination.search";
import { RiskMap } from "~/app/components/templates/cards/risk.map";

// --- Fix default marker icon paths for Leaflet ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});

// ✅ Utility: Get current geolocation + reverse geocode
export const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        }
      );

      const { latitude, longitude, accuracy } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Failed to fetch location data");

      const data = await response.json();
      const address = data.address || {};

      resolve({
        latitude,
        longitude,
        accuracy,
        location: data.display_name,
        metadata: {
          street: address.road || null,
          barangay: address.suburb || address.neighbourhood || null,
          city: address.city || address.town || address.village || null,
          region:
            address.state || address.region || address.state_district || null,
          country: address.country || null,
          postalCode: address.postcode || null,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      reject(error);
    }
  });
};

// ✅ Forward geocode (text → coordinates)
const getDestinationCoords = async (place: string) => {
  if (!place) return null;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const results = await response.json();
    if (results.length === 0) return null;
    const { lat, lon } = results[0];
    return [parseFloat(lat), parseFloat(lon)] as LatLngTuple;
  } catch (err) {
    console.error("Error fetching destination coordinates:", err);
    return null;
  }
};

// ✅ Map Page
export function MapPage() {
  const [destination, setDestination] = useState<string>("");
  const [destinationCoords, setDestinationCoords] =
    useState<LatLngTuple | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showRoadReportModal, setShowRoadReportModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(
    null
  );
  const [locationInfo, setLocationInfo] = useState<string>(
    "Fetching current location..."
  );

  // Fetch current location
  useEffect(() => {
    getCurrentLocation()
      .then((res: any) => {
        setCurrentLocation([res.latitude, res.longitude]);
        setLocationInfo(res.location || "Unknown location");
      })
      .catch((err) => {
        console.warn("Location access denied or failed:", err);
        setLocationInfo("Unable to fetch location");
      });
  }, []);

  // Convert destination text to coordinates when it changes
  useEffect(() => {
    if (!destination) return;
    getDestinationCoords(destination).then((coords) => {
      setDestinationCoords(coords);
    });
  }, [destination]);

  const highRiskRoads = [
    {
      name: "Highway 101 North",
      risk: "High",
      reason: "Frequent accidents",
      position: [14.6091, 121.0223] as LatLngTuple,
    },
    {
      name: "Main Street Junction",
      risk: "Medium",
      reason: "Poor visibility",
      position: [14.615, 121.05] as LatLngTuple,
    },
    {
      name: "Route 66 Exit 23",
      risk: "High",
      reason: "Sharp curves",
      position: [14.58, 121.035] as LatLngTuple,
    },
  ];

  const emergencyServices = [
    { name: "Fire Department", distance: "2.3 km" },
    { name: "Police Station", distance: "1.8 km" },
    { name: "Medical Center", distance: "3.5 km" },
    { name: "Road Rescue", distance: "4.2 km" },
  ];

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-foreground flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Navigate Safely
          </h2>
        </div>

        {/* Destination Input */}
        <DestinationSearch
          destination={destination}
          setDestination={setDestination}
        />

        {/* Map */}
        <RiskMap
          currentLocation={currentLocation as LatLngExpression}
          destination={destinationCoords as LatLngExpression}
          highRiskRoads={highRiskRoads}
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Report Incident Dialog */}
          <Dialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 h-auto py-4 flex-col gap-2 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
                <span className="text-sm">Report Incident</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] rounded-3xl calm-shadow">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Report Incident
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>What happened?</Label>
                  <Textarea
                    placeholder="Describe the incident..."
                    className="border-border rounded-2xl mt-1"
                  />
                </div>
                <div>
                  <Label>Upload Photo (Optional)</Label>
                  <Button
                    variant="outline"
                    className="w-full mt-1 border-border rounded-2xl hover:bg-green-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take/Upload Photo
                  </Button>
                </div>
                <div>
                  <Label className="mb-2 block">Send to:</Label>
                  <div className="space-y-2">
                    {emergencyServices.map((service, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${idx}`}
                          className="border-primary rounded"
                        />
                        <label htmlFor={`service-${idx}`} className="text-sm">
                          {service.name} ({service.distance})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-2xl">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Report High-Risk Road Dialog */}
          <Dialog
            open={showRoadReportModal}
            onOpenChange={setShowRoadReportModal}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 h-auto py-4 flex-col gap-2 rounded-2xl"
              >
                <MapPin className="w-6 h-6" />
                <span className="text-sm">Report High-Risk Road</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] rounded-3xl calm-shadow">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Report High-Risk Road
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Road Location</Label>
                  <Input
                    placeholder="Street name or coordinates"
                    className="border-border rounded-2xl mt-1"
                  />
                </div>
                <div>
                  <Label>Reason for Risk</Label>
                  <Textarea
                    placeholder="Why is this road dangerous?"
                    className="border-border rounded-2xl mt-1"
                  />
                </div>
                <div>
                  <Label>Upload Photo (Optional)</Label>
                  <Button
                    variant="outline"
                    className="w-full mt-1 border-border rounded-2xl hover:bg-green-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take/Upload Photo
                  </Button>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 rounded-2xl">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* High Risk Roads Nearby */}
        <div className="space-y-3">
          <h3 className="text-foreground">High-Risk Roads Nearby</h3>
          {highRiskRoads.map((road, index) => (
            <Card
              key={index}
              className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-1">{road.name}</p>
                  <p className="text-xs text-muted-foreground">{road.reason}</p>
                </div>
                <Badge
                  className={
                    road.risk === "High"
                      ? "bg-red-100 text-red-700 hover:bg-red-100 rounded-full border-0"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-full border-0"
                  }
                >
                  {road.risk}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
