import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { Card } from "@/components/atoms/card";
import "leaflet/dist/leaflet.css";
import L, {
  type LatLngExpression,
  LatLngBounds,
  Map as LeafletMap,
} from "leaflet";
import { Button } from "@/components/atoms/button";
import { Compass, AlertTriangle, MapPin, Navigation, Flag } from "lucide-react";

interface HighRiskRoad {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  type?: string;
  otherType?: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  longitude: number;
  latitude: number;
  type: string;
  category: string;
  status: string;
  contacts?: Array<{
    type: string;
    provider: string;
    value: string;
  }>;
  logo?: string | null;
  provider?: string;
  tagline?: string;
  otherCategory?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

interface RiskMapProps {
  currentLocation?: LatLngExpression;
  destination?: LatLngExpression;
  highRiskRoads: HighRiskRoad[];
  onChooseAction?: (action: string, coords: [number, number]) => void;
  facilities?: Facility[];
}

// 👇 Fit map to route automatically
function FitToRoute({ route }: { route: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 1) {
      const bounds = new LatLngBounds(route as [number, number][]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [route, map]);
  return null;
}

// 🧮 Distance formula
function getDistanceMeters(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 🏥 Facility type to icon mapping
const getFacilityIcon = (category: string, status: string) => {
  const baseIconUrl = "https://cdn-icons-png.flaticon.com/512/";
  const size = [25, 25] as [number, number];
  const anchor = [12, 25] as [number, number];

  // Color based on status
  const color =
    status === "open" ? "green" : status === "closed" ? "red" : "gray";

  let iconUrl = "";

  switch (category) {
    case "emergency_facility":
    case "hospital":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/9195/9195850.png`; // Hospital icon
      break;
    case "police_station":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/4320/4320648.png`; // Police icon
      break;
    case "fire_station":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/1060/1060984.png`; // Fire station icon
      break;
    case "evacuation_center":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/3096/3096970.png`; // Shelter icon
      break;
    case "clinic":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/2966/2966455.png`; // Clinic icon
      break;
    case "pharmacy":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/3142/3142945.png`; // Pharmacy icon
      break;
    default:
      iconUrl = `https://cdn-icons-png.flaticon.com/512/684/684908.png`; // Default map pin
  }

  return L.icon({
    iconUrl: iconUrl,
    iconSize: size,
    iconAnchor: anchor,
    className: `facility-icon ${status === "closed" ? "facility-closed" : ""}`,
  });
};

export function RiskMap({
  currentLocation,
  destination,
  highRiskRoads,
  facilities,
  onChooseAction,
}: RiskMapProps) {
  const [isTravelling, setIsTravelling] = useState(false);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [liveLocation, setLiveLocation] = useState<LatLngExpression | null>(
    currentLocation || null
  );
  const [warning, setWarning] = useState<HighRiskRoad | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [pinnedLocation, setPinnedLocation] = useState<[number, number] | null>(
    null
  );
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const mapRef = useRef<LeafletMap | null>(null);
  const highRiskIcon = L.icon({
    iconUrl:
      "https://uxwing.com/wp-content/themes/uxwing/download/signs-and-symbols/risk-icon.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  console.log("Facilities loaded in RiskMap:", facilities);

  // ✅ Fix default Leaflet marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const currentLocationIcon = L.divIcon({
    className: "current-location-icon",
    html: `<div style="
      width: 14px; height: 14px;
      background-color: #007bff; border-radius: 50%;
      border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const destinationIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  // ✅ Fetch route from OSRM
  const fetchRoute = async (start: LatLngExpression, end: LatLngExpression) => {
    try {
      const [startLat, startLng] = start as [number, number];
      const [endLat, endLng] = end as [number, number];
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data?.routes?.length) {
        const coords = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] as LatLngExpression
        );
        setRoute(coords);
      }
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  const handleStartTravel = () => {
    if (!currentLocation || !destination) return;
    setIsTravelling(true);
    fetchRoute(currentLocation, destination);
  };

  const handleStopTravel = () => {
    setIsTravelling(false);
    setRoute([]);
  };

  // ✅ Detect double-click
  const MapClickHandler = () => {
    useMapEvent("dblclick", (e) => {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPinnedLocation(coords);
      setShowChoiceModal(true);
    });
    return null;
  };

  // ✅ Track location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setLiveLocation(loc);
        mapRef.current?.setView(loc, 15);
      },
      (err) => console.error("Error getting location:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // ✅ Live tracking
  useEffect(() => {
    let watchId: number;
    if (isTravelling) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => setLiveLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("Tracking error:", err),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTravelling]);

  // ✅ Warning detection
  useEffect(() => {
    if (!liveLocation) return;
    const [lat, lng] = liveLocation as [number, number];
    const now = Date.now();

    for (const road of highRiskRoads) {
      const distance = getDistanceMeters(
        [lat, lng],
        [road.latitude, road.longitude]
      );

      const lastAlert = cooldowns[road.id] || 0;
      const cooldownPassed = now - lastAlert >= 60_000; // 1 min

      if (distance <= 100 && cooldownPassed) {
        setWarning(road);
        setCooldowns((prev) => ({ ...prev, [road.id]: now }));
        break;
      }
    }
  }, [liveLocation, highRiskRoads, cooldowns]);

  return (
    <div className="space-y-3 relative">
      <Card className="h-64 rounded-3xl calm-shadow border-border overflow-hidden relative">
        <MapContainer
          ref={mapRef}
          center={liveLocation || currentLocation || [14.5995, 120.9842]}
          zoom={13}
          className="h-full w-full z-[1]"
          doubleClickZoom={false}
        >
          <MapClickHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {isTravelling && route.length > 0 && <FitToRoute route={route} />}
          {liveLocation && (
            <Marker position={liveLocation} icon={currentLocationIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          {route.length > 0 && (
            <Polyline positions={route} color="blue" weight={4} />
          )}
          {pinnedLocation && (
            <Marker position={pinnedLocation}>
              <Popup>Pinned Location</Popup>
            </Marker>
          )}
          {highRiskRoads.map((road) => (
            <Marker
              key={road.id}
              icon={highRiskIcon}
              position={[road.latitude, road.longitude]}
            >
              <Popup>
                <strong>{road.title}</strong>
                <br />
                {road.description}
                <br />
                Coordinates: {road.latitude.toFixed(5)},{" "}
                {road.longitude.toFixed(5)}
                <br />
                Type: {road.type === "other" ? road.otherType : road.type}
                <br />
                Risk: {road.status}
              </Popup>
            </Marker>
          ))}
          {/* 🏥 Facilities Markers */}

          {facilities && facilities.length > 0 ? (
            facilities.map((facility) => {
              try {
                // Validate coordinates
                if (!facility.latitude || !facility.longitude) {
                  console.warn(
                    `Facility ${facility.id} missing coordinates:`,
                    facility
                  );
                  return null;
                }

                if (isNaN(facility.latitude) || isNaN(facility.longitude)) {
                  console.warn(
                    `Facility ${facility.id} has invalid coordinates:`,
                    facility
                  );
                  return null;
                }

                const icon = getFacilityIcon(
                  facility.category,
                  facility.status
                );

                return (
                  <Marker
                    key={facility.id}
                    position={[facility.latitude, facility.longitude]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <strong className="text-sm">{facility.name}</strong>
                        <div className="mt-1 text-xs text-gray-600">
                          <div>
                            <strong>Type:</strong> {facility.type}
                          </div>
                          <div>
                            <strong>Category:</strong> {facility.category}
                          </div>
                          <div>
                            <strong>Status:</strong>
                            <span
                              className={`ml-1 ${
                                facility.status === "open"
                                  ? "text-green-600"
                                  : facility.status === "closed"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {facility.status}
                            </span>
                          </div>
                        </div>
                        {facility.location && (
                          <div className="mt-2 text-xs">
                            <strong>Location:</strong> {facility.location}
                          </div>
                        )}
                        {facility.contacts && facility.contacts.length > 0 && (
                          <div className="mt-2">
                            <strong className="text-xs">Contacts:</strong>
                            {facility.contacts.map(
                              (contact, index) =>
                                contact.value && (
                                  <div key={index} className="text-xs">
                                    {contact.type}: {contact.value}
                                  </div>
                                )
                            )}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              } catch (error) {
                console.error(
                  `Error rendering facility ${facility.id}:`,
                  error,
                  facility
                );
                return null;
              }
            })
          ) : (
            <div className="leaflet-top leaflet-left">
              <div className="leaflet-control leaflet-bar p-2 bg-white text-xs">
                No facilities to display
              </div>
            </div>
          )}
        </MapContainer>
      </Card>

      {/* 🏥 Facilities Legend */}
      {facilities && facilities.length > 0 && (
        <Card className="p-3 rounded-2xl calm-shadow border-border">
          <h3 className="text-sm font-semibold mb-2">Facilities Legend</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9195/9195850.png"
                className="w-4 h-4"
                alt="Emergency Facility"
              />
              <span>Emergency Facility</span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4320/4320648.png"
                className="w-4 h-4"
                alt="Police Station"
              />
              <span>Police Station</span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1060/1060984.png"
                className="w-4 h-4"
                alt="Fire Station"
              />
              <span>Fire Station</span>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3096/3096970.png"
                className="w-4 h-4"
                alt="Evacuation Center"
              />
              <span>Evacuation Center</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        {!isTravelling ? (
          <Button
            onClick={handleStartTravel}
            className="bg-green-600 hover:bg-green-700 rounded-2xl"
          >
            Start Travel
          </Button>
        ) : (
          <Button
            onClick={handleStopTravel}
            className="bg-red-600 hover:bg-red-700 rounded-2xl"
          >
            Stop Travel
          </Button>
        )}
      </div>

      {/* 🚨 Warning Modal */}
      {warning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center space-y-3">
            <AlertTriangle className="mx-auto text-yellow-500 w-12 h-12" />
            <h2 className="text-lg font-bold text-red-600">
              Warning: High-Risk Area Ahead!
            </h2>
            <p className="text-sm text-gray-700">
              You are near <strong>{warning.title}</strong> —{" "}
              {warning.description}
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl mt-2"
              onClick={() => setWarning(null)}
            >
              OK, Stay Alert
            </Button>
          </div>
        </div>
      )}

      {/* 📍 Choice Modal */}
      {showChoiceModal && pinnedLocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center space-y-4">
            <h2 className="text-lg font-bold text-primary">
              Choose an action for this location
            </h2>
            <p className="text-sm text-gray-600">
              Latitude: {pinnedLocation[0].toFixed(5)} <br />
              Longitude: {pinnedLocation[1].toFixed(5)}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-xl"
                onClick={() => {
                  onChooseAction?.("startTravel", pinnedLocation);
                  setShowChoiceModal(false);
                }}
              >
                <Navigation className="w-4 h-4 mr-2" /> Start Travel
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 rounded-xl"
                onClick={() => {
                  onChooseAction?.("reportIncident", pinnedLocation);
                  setShowChoiceModal(false);
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" /> Report Incident
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-600 rounded-xl"
                onClick={() => {
                  onChooseAction?.("reportHighRisk", pinnedLocation);
                  setShowChoiceModal(false);
                }}
              >
                <Flag className="w-4 h-4 mr-2" /> Report High-Risk Road
              </Button>
            </div>
            <Button
              variant="outline"
              className="mt-2 rounded-xl"
              onClick={() => setShowChoiceModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
