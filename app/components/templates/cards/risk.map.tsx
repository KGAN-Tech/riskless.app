import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Card } from "@/components/atoms/card";
import "leaflet/dist/leaflet.css";
import L, {
  type LatLngExpression,
  LatLngBounds,
  Map as LeafletMap,
} from "leaflet";
import { Button } from "@/components/atoms/button";
import { Compass } from "lucide-react";

interface HighRiskRoad {
  name: string;
  risk: string;
  reason: string;
  position: LatLngExpression;
}

interface RiskMapProps {
  currentLocation?: LatLngExpression;
  destination?: LatLngExpression;
  highRiskRoads: HighRiskRoad[];
}

// 👇 Auto-fit helper
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

export function RiskMap({
  currentLocation,
  highRiskRoads,
  destination,
}: RiskMapProps) {
  const [isTravelling, setIsTravelling] = useState(false);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [liveLocation, setLiveLocation] = useState<LatLngExpression | null>(
    currentLocation || null
  );

  // ✅ useRef for the map instance
  const mapRef = useRef<LeafletMap | null>(null);

  // Fix Leaflet default icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const destinationIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });

  // Fetch route from OSRM
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

  // 🧭 Compass click handler
  const handleCompassClick = () => {
    const map = mapRef.current;
    if (!map) return;

    if (route.length > 1) {
      const bounds = new LatLngBounds(route as [number, number][]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (liveLocation) {
      map.setView(liveLocation, 15);
    }
  };

  return (
    <div className="space-y-3 relative">
      <Card className="h-64 rounded-3xl calm-shadow border-border overflow-hidden relative">
        <MapContainer
          ref={mapRef}
          center={liveLocation || currentLocation || [14.5995, 120.9842]}
          zoom={13}
          className="h-full w-full z-[1]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {isTravelling && route.length > 0 && <FitToRoute route={route} />}

          {liveLocation && (
            <Marker position={liveLocation}>
              <Popup>Your location</Popup>
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

          {highRiskRoads.map((road, index) => (
            <Marker key={index} position={road.position}>
              <Popup>
                <strong>{road.name}</strong>
                <br />
                Risk: {road.risk}
                <br />
                {road.reason}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 🧭 Compass Button */}
        <button
          onClick={handleCompassClick}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-[500]"
          title="Recenter Map"
        >
          <Compass className="w-5 h-5 text-primary" />
        </button>
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
    </div>
  );
}
