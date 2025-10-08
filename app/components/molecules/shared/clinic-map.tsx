import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Clinic } from "@/types/clinic.types";

// Fix for default markers in react-leaflet
const DefaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ClinicMapProps {
  clinics: Clinic[];
  height?: string;
  showRadius?: boolean;
  radiusKm?: number;
}

export const ClinicMap = ({ clinics, height = "500px", showRadius = false, radiusKm = 5 }: ClinicMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate center point of all clinics
  const getMapCenter = () => {
    if (clinics.length === 0) {
      return [14.5995, 120.9842]; // Default to Manila
    }

    const totalLat = clinics.reduce((sum, clinic) => sum + clinic.location.coordinates!.lat, 0);
    const totalLng = clinics.reduce((sum, clinic) => sum + clinic.location.coordinates!.lng, 0);
    
    return [totalLat / clinics.length, totalLng / clinics.length];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      main: "#2563eb", // blue
      branch: "#16a34a", // green
      specialty: "#9333ea" // purple
    };
    return colors[type as keyof typeof colors] || "#6b7280"; // gray
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      main: "Main Clinic",
      branch: "Branch",
      specialty: "Specialty"
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!isClient) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MapContainer
        center={getMapCenter() as [number, number]}
        zoom={10}
        style={{ height, width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {clinics.map((clinic) => {
          const position: [number, number] = [clinic.location.coordinates!.lat, clinic.location.coordinates!.lng];
          return (
            <>
              <Marker
                key={clinic.id}
                position={position}
                icon={DefaultIcon}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getTypeColor(clinic.type) }}
                      ></div>
                      <span className="text-xs font-medium text-gray-600">
                        {getTypeLabel(clinic.type)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {clinic.location.address}
                    </p>
                    <div className="text-xs text-gray-500">
                      <p>📞 {clinic.contact.phone}</p>
                      <p>📧 {clinic.contact.email}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      clinic.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {clinic.isActive ? "Open" : "Closed"}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.location.address + ', ' + clinic.location.city + ', ' + clinic.location.province)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-block px-3 py-1 rounded bg-blue-600 text-xs font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
                      style={{ color: "#fff" }}
                    >
                      Visit
                    </a>
                  </div>
                </Popup>
              </Marker>
              {showRadius && (
                <Circle
                  key={clinic.id + "-circle"}
                  center={position}
                  radius={radiusKm * 1000}
                  pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1 }}
                />
              )}
            </>
          );
        })}
      </MapContainer>
    </div>
  );
}; 