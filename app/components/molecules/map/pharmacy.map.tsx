import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Pharmacy, UserLocation, PharmacyMapPin } from '@/types/pharmacy.types';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PharmacyMapProps {
  center: { lat: number; lng: number; zoom?: number };
  pharmacies: Pharmacy[];
  userLocation?: UserLocation | null;
  selectedPharmacy?: Pharmacy | null;
  onPharmacySelect: (pharmacy: Pharmacy) => void;
  className?: string;
}

const PharmacyMap = ({
  center,
  pharmacies,
  userLocation,
  selectedPharmacy,
  onPharmacySelect,
  className = ""
}: PharmacyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([center.lat, center.lng], center.zoom || 14);
    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], center.zoom || 14);
    }
  }, [center]);

  // Add/update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Add new user marker if location exists
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 40px;
              height: 40px;
              background: rgba(59, 130, 246, 0.3);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              animation: pulse 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
          </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      userMarkerRef.current.bindPopup('Your Location');
    }
  }, [userLocation]);

  // Add/update pharmacy markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Add pharmacy markers
    pharmacies.forEach(pharmacy => {
      if (!pharmacy.location.coordinates) return;

      const isSelected = selectedPharmacy?.id === pharmacy.id;
      const isOpen = isCurrentlyOpen(pharmacy);
      
      // Create custom icon based on pharmacy status
      const pharmacyIcon = L.divIcon({
        className: 'pharmacy-marker',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            background: ${isSelected ? '#ef4444' : isOpen ? '#22c55e' : '#6b7280'};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
          ">
            <svg width="${isSelected ? '16' : '12'}" height="${isSelected ? '16' : '12'}" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 32 : 24]
      });

      const marker = L.marker(
        [pharmacy.location.coordinates.lat, pharmacy.location.coordinates.lng],
        { 
          icon: pharmacyIcon,
          zIndexOffset: isSelected ? 1000 : 0
        }
      ).addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${pharmacy.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              background: ${isOpen ? '#22c55e' : '#6b7280'};
              color: white;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            ">
              ${isOpen ? 'Open' : 'Closed'}
            </span>
            <span style="
              display: inline-block;
              margin-left: 4px;
              padding: 2px 8px;
              background: #e5e7eb;
              color: #374151;
              border-radius: 12px;
              font-size: 12px;
              text-transform: capitalize;
            ">
              ${pharmacy.type}
            </span>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
            ${pharmacy.location.address}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
            📞 ${pharmacy.contact.phone}
          </p>
          ${pharmacy.distance ? `
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              📍 ${pharmacy.distance < 1 ? `${Math.round(pharmacy.distance * 1000)}m` : `${pharmacy.distance.toFixed(1)}km`} away
            </p>
          ` : ''}
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button 
              onclick="window.open('tel:${pharmacy.contact.phone}')"
              style="
                flex: 1;
                padding: 6px 12px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
              "
            >
              📞 Call
            </button>
            <button 
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.coordinates.lat},${pharmacy.location.coordinates.lng}')"
              style="
                flex: 1;
                padding: 6px 12px;
                background: #10b981;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
              "
            >
              🧭 Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click event
      marker.on('click', () => {
        onPharmacySelect(pharmacy);
      });

      markersRef.current.push(marker);
    });
  }, [pharmacies, selectedPharmacy, onPharmacySelect]);

  // Helper function to check if pharmacy is open
  const isCurrentlyOpen = (pharmacy: Pharmacy) => {
    if (pharmacy.isOpen24Hours) return true;
    
    const now = new Date();
    const today = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todaySchedule = pharmacy.schedule.find(s => s.day === days[today]);
    
    if (!todaySchedule || !todaySchedule.isOpen) return false;
    
    const openTime = parseInt(todaySchedule.openTime.replace(":", ""));
    const closeTime = parseInt(todaySchedule.closeTime.replace(":", ""));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};

export default PharmacyMap;