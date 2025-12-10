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
import {
  Compass,
  AlertTriangle,
  MapPin,
  Navigation,
  Flag,
  X,
} from "lucide-react";

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

// Utility function to filter out facilities with invalid coordinates
export const filterValidFacilities = (facilities: Facility[]): Facility[] => {
  return facilities.filter((facility) => {
    const lat = facility.latitude;
    const lng = facility.longitude;

    return (
      lat != null &&
      lng != null &&
      !isNaN(Number(lat)) &&
      !isNaN(Number(lng)) &&
      Number(lat) >= -90 &&
      Number(lat) <= 90 &&
      Number(lng) >= -180 &&
      Number(lng) <= 180
    );
  });
};

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

// 🎤 Enhanced Text-to-speech function with user interaction check
const speakWarning = (warning: HighRiskRoad) => {
  if (!("speechSynthesis" in window)) {
    console.error("Speech synthesis not supported");
    return;
  }

  try {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance();
    speech.text = `Warning! High risk area ahead. ${warning.title}. Please proceed with caution.`;
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1;

    console.log("🔊 Attempting to speak:", speech.text);

    // Better voice handling with fallback
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoice = voices.find((voice) => voice.lang.includes("en"));
        if (englishVoice) {
          speech.voice = englishVoice;
        }
        return true;
      }
      return false;
    };

    // Try to load voices immediately
    if (!loadVoices()) {
      // If voices aren't loaded, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = null; // Clean up
      };
    }

    speech.onstart = () => console.log("🔊 Speech started");
    speech.onend = () => console.log("🔊 Speech ended");
    speech.onerror = (event) => {
      console.error("🔊 Speech error:", event.error);
      if (event.error === "not-allowed") {
        console.log("🔊 Speech blocked: user interaction required");
      }
    };

    // Add a small delay to ensure cleanup is complete
    setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 50);
  } catch (error) {
    console.error("Error in speakWarning:", error);
  }
};

// 🏥 Facility type to icon mapping
const getFacilityIcon = (category: string, status: string) => {
  const size = [25, 25] as [number, number];
  const anchor = [12, 25] as [number, number];

  let iconUrl = "";

  switch (category) {
    case "emergency_facility":
    case "police_station":

    case "fire_station":
    case "evacuation_center":
    case "hospital":
    case "clinic":
    case "pharmacy":
      iconUrl = `https://cdn-icons-png.flaticon.com/512/9195/9195850.png`; // Hospital icon
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
  facilities = [],
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [travelStartLocation, setTravelStartLocation] =
    useState<LatLngExpression | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const mapRef = useRef<LeafletMap | null>(null);
  const highRiskIcon = L.icon({
    iconUrl:
      "https://uxwing.com/wp-content/themes/uxwing/download/signs-and-symbols/risk-icon.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  // Filter facilities to only include valid ones
  const validFacilities = filterValidFacilities(facilities);

  console.log("Original facilities count:", facilities?.length);
  console.log("Valid facilities count:", validFacilities.length);
  if (facilities?.length !== validFacilities.length) {
    console.warn(
      "Some facilities were filtered out due to invalid coordinates"
    );
  }

  // ✅ Fix default Leaflet marker icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

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

  // ✅ Check speech synthesis support
  useEffect(() => {
    setIsSpeechSupported("speechSynthesis" in window);

    // Load voices when they become available
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log("Speech synthesis voices loaded:", voices.length);
      }
    };

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices(); // Initial load
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

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

  const handleStartTravel = (startLocation?: LatLngExpression) => {
    const start = startLocation || liveLocation || currentLocation;
    if (!start || !destination) return;

    setIsTravelling(true);
    setTravelStartLocation(start);
    fetchRoute(start, destination);
  };

  const handleStopTravel = () => {
    setIsTravelling(false);
    setRoute([]);
    setTravelStartLocation(null);
    // Stop any ongoing speech when travel stops
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Force map to re-render and properly resize
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
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
        (pos) => {
          const newLocation: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setLiveLocation(newLocation);

          // Update map view to follow user during travel
          if (mapRef.current) {
            mapRef.current.setView(newLocation, mapRef.current.getZoom());
          }
        },
        (err) => console.error("Tracking error:", err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTravelling]);

  // ✅ Warning detection with immediate check and periodic updates
  useEffect(() => {
    if (!liveLocation) return;

    const checkWarnings = () => {
      const [lat, lng] = liveLocation as [number, number];
      const now = Date.now();

      for (const road of highRiskRoads) {
        const distance = getDistanceMeters(
          [lat, lng],
          [road.latitude, road.longitude]
        );

        const lastAlert = cooldowns[road.id] || 0;
        const cooldownPassed = now - lastAlert >= 60_000; // 1 min

        // Check if road is within 200 meters
        if (distance <= 200 && cooldownPassed) {
          setWarning(road);
          setCooldowns((prev) => ({ ...prev, [road.id]: now }));

          // 🔊 Trigger text-to-speech warning
          if (isSpeechSupported) {
            speakWarning(road);
          }
          break;
        }
      }
    };

    // Check immediately
    checkWarnings();

    // Set up periodic checking every 3 seconds while travelling
    let interval: NodeJS.Timeout;
    if (isTravelling) {
      interval = setInterval(checkWarnings, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveLocation, highRiskRoads, cooldowns, isSpeechSupported, isTravelling]);

  // ✅ Handle choice modal actions
  const handleChoiceAction = (action: string, coords: [number, number]) => {
    setShowChoiceModal(false);

    if (action === "startTravel") {
      // Set the pinned location as starting point for travel
      handleStartTravel(coords);
    }

    onChooseAction?.(action, coords);
  };

  return (
    <div className="space-y-3 relative">
      <Card
        className={`${
          isFullScreen ? "h-[80vh] rounded-2xl" : "h-[80vh] rounded-2xl"
        } calm-shadow border-border overflow-hidden relative transition-all duration-300`}
      >
        <div className="absolute bottom-3 right-3 z-[1000] flex gap-2">
          {destination && (
            <div className="flex justify-center gap-3">
              {!isTravelling ? (
                <Button
                  onClick={() => handleStartTravel()}
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
          )}
        </div>
        <div className="absolute top-3 right-3 z-[1000] flex gap-2">
          {/* 🏥 Facilities Legend - Only show when not in full screen */}
          {validFacilities.length > 0 && (
            <Card className="p-3 rounded-2xl calm-shadow border-border">
              <h3 className="text-sm font-semibold ">Legend</h3>
              <div className="grid grid-cols-2 gap-2 text-xs -mt-4">
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
                    src="https://uxwing.com/wp-content/themes/uxwing/download/signs-and-symbols/risk-icon.png"
                    className="w-4 h-4"
                    alt="High Risk Road"
                  />
                  <span>High Risk Road</span>
                </div>
              </div>
            </Card>
          )}
        </div>

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

          {/* Current location marker */}
          {liveLocation && (
            <Marker position={liveLocation} icon={currentLocationIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {/* Travel start location marker (if different from current location) */}
          {travelStartLocation &&
            isTravelling &&
            travelStartLocation !== liveLocation && (
              <Marker position={travelStartLocation} icon={destinationIcon}>
                <Popup>Travel start point</Popup>
              </Marker>
            )}

          {/* Destination marker */}
          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* Route polyline */}
          {route.length > 0 && (
            <Polyline positions={route} color="blue" weight={4} />
          )}

          {/* Pinned location marker */}
          {pinnedLocation && (
            <Marker position={pinnedLocation}>
              <Popup>Pinned Location</Popup>
            </Marker>
          )}

          {/* High risk roads markers */}
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
                Coordinates: {road.latitude?.toFixed(5)},{" "}
                {road.longitude?.toFixed(5) || "N/A"}
                <br />
                Type: {road.type === "other" ? road.otherType : road.type}
                <br />
                Risk: {road.status}
              </Popup>
            </Marker>
          ))}

          {/* 🏥 Facilities Markers - Only render valid facilities */}
          {validFacilities.length > 0 ? (
            validFacilities.map((facility) => {
              const lat = Number(facility.latitude);
              const lng = Number(facility.longitude);
              const icon = getFacilityIcon(facility.category, facility.status);

              return (
                <Marker key={facility.id} position={[lat, lng]} icon={icon}>
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
                      {/* Show coordinates in popup for debugging */}
                      <div className="mt-1 text-xs text-gray-400">
                        Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          ) : facilities && facilities.length > 0 ? (
            <div className="leaflet-top leaflet-left">
              <div className="leaflet-control leaflet-bar p-2 bg-white text-xs">
                No facilities with valid coordinates to display
              </div>
            </div>
          ) : null}
        </MapContainer>
      </Card>

      {/* Travel Controls - Only show when not in full screen */}

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
            {!isSpeechSupported && (
              <p className="text-xs text-amber-600">
                🔊 Voice alerts not supported in your browser
              </p>
            )}
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
                onClick={() =>
                  handleChoiceAction("startTravel", pinnedLocation)
                }
              >
                <Navigation className="w-4 h-4 mr-2" /> Choose this as
                Destination
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 rounded-xl"
                onClick={() =>
                  handleChoiceAction("reportIncident", pinnedLocation)
                }
              >
                <AlertTriangle className="w-4 h-4 mr-2" /> Report Incident
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-600 rounded-xl"
                onClick={() =>
                  handleChoiceAction("reportHighRisk", pinnedLocation)
                }
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
