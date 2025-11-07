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
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  riskStatus: string;
}

interface RiskMapProps {
  currentLocation?: LatLngExpression;
  destination?: LatLngExpression;
  highRiskRoads: HighRiskRoad[];
  onChooseAction?: (action: string, coords: [number, number]) => void;
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

export function RiskMap({
  currentLocation,
  destination,
  highRiskRoads,
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
            <Marker key={road.id} position={[road.latitude, road.longitude]}>
              <Popup>
                <strong>{road.name}</strong>
                <br />
                Risk: {road.riskStatus}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>

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
              You are near <strong>{warning.name}</strong> —{" "}
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
