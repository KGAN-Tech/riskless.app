import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star,
  Heart,
  Minimize2,
  RotateCcw
} from "lucide-react";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { InfoCard, ActionCard } from "@/components/organisms/cards";
import PharmacyMap from "@/components/molecules/map/pharmacy.map";
import LocationPermissionPrompt from "@/components/molecules/location/LocationPermissionPrompt";
import { usePharmacySearch, usePharmacyFavorites } from "@/hooks/use.pharamacy";
import type { Pharmacy, PharmacyMapPin, MapCenter } from "@/types/pharmacy.types";
import AOS from "aos";
import "aos/dist/aos.css";

const PharmacyMapPage = () => {
  const navigate = useNavigate();

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [mapCenter, setMapCenter] = useState<MapCenter>({
    lat: 0, // Will be set to user's actual location
    lng: 0,
    zoom: 14
  });
  const [showDetails, setShowDetails] = useState(false);
  const [mapPins, setMapPins] = useState<PharmacyMapPin[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const {
    pharmacies,
    loading,
    userLocation,
    getCurrentLocation,
    searchPharmacies
  } = usePharmacySearch();

  const {
    toggleFavorite,
    isFavorite
  } = usePharmacyFavorites("current-user-id");

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });

    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      return;
    }

    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          setHasLocationPermission(true);
          setLocationPermissionGranted(true);
          loadPharmaciesAndMap();
        } else {
          setHasLocationPermission(false);
        }
      } catch (err) {
        setHasLocationPermission(false);
      }
    } else {
      setHasLocationPermission(false);
    }
  };

  const loadPharmaciesAndMap = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setMapCenter({
        lat: location.lat,
        lng: location.lng,
        zoom: 14
      });
      await searchPharmacies({ location, radius: 10 });
    } else {
      // Use default location and load all pharmacies
      await searchPharmacies({ 
        location: { lat: mapCenter.lat, lng: mapCenter.lng },
        radius: 10 
      });
    }
  };

  const handleRecenterMap = useCallback(async () => {
    if (userLocation) {
      setMapCenter({
        lat: userLocation.lat,
        lng: userLocation.lng,
        zoom: 14
      });
    } else {
      const location = await getCurrentLocation();
      if (location) {
        setMapCenter({
          lat: location.lat,
          lng: location.lng,
          zoom: 14
        });
      }
    }
  }, [userLocation, getCurrentLocation]);

  // Convert pharmacies to map pins
  useEffect(() => {
    const pins: PharmacyMapPin[] = pharmacies
      .filter(pharmacy => pharmacy.location.coordinates)
      .map(pharmacy => ({
        id: pharmacy.id,
        position: {
          lat: pharmacy.location.coordinates!.lat,
          lng: pharmacy.location.coordinates!.lng
        },
        pharmacy,
        isSelected: selectedPharmacy?.id === pharmacy.id
      }));
    
    setMapPins(pins);
  }, [pharmacies, selectedPharmacy]);

  const handlePinClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowDetails(true);
    setMapCenter({
      lat: pharmacy.location.coordinates!.lat,
      lng: pharmacy.location.coordinates!.lng,
      zoom: 16
    });
  };

  const handleToggleFavorite = async (pharmacy: Pharmacy) => {
    await toggleFavorite(pharmacy);
  };

  const handleLocationGranted = async (location: { lat: number; lng: number }) => {
    setLocationPermissionGranted(true);
    setHasLocationPermission(true);
    
    // Debug: Log the actual coordinates
    console.log("🗺️ Map centering on your location:", {
      latitude: location.lat,
      longitude: location.lng,
      googleMapsLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`
    });
    
    setMapCenter({ lat: location.lat, lng: location.lng, zoom: 14 });
    await searchPharmacies({ location, radius: 10 });
  };

  const handleLocationDenied = async () => {
    setLocationPermissionGranted(false);
    setHasLocationPermission(false);
    await searchPharmacies({ 
      location: { lat: mapCenter.lat, lng: mapCenter.lng },
      radius: 10 
    });
  };

  const formatSchedule = (pharmacy: Pharmacy) => {
    if (pharmacy.isOpen24Hours) return "24/7";
    
    const today = new Date().getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todaySchedule = pharmacy.schedule.find(s => s.day === days[today]);
    
    if (todaySchedule && todaySchedule.isOpen) {
      return `${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
    }
    
    return "Closed";
  };

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

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // Real map component using Leaflet
  const RealMap = () => (
    <div className="relative w-full h-full">
      <PharmacyMap
        center={mapCenter}
        pharmacies={pharmacies}
        userLocation={userLocation}
        selectedPharmacy={selectedPharmacy}
        onPharmacySelect={handlePinClick}
        className="rounded-lg"
      />
      
      {/* Map Stats Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 z-[1000] shadow-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">
            {pharmacies.length} pharmacies found
          </span>
        </div>
      </div>

      {/* Recenter Map Button */}
      <button
        onClick={handleRecenterMap}
        className="absolute bottom-20 right-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg z-[1000] hover:shadow-xl transition-shadow"
      >
        <RotateCcw className="h-6 w-6" />
      </button>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 text-xs z-[1000] shadow-lg">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
          <span>Open Pharmacy</span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-gray-500 rounded-full border border-white"></div>
          <span>Closed Pharmacy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <Headerbackbutton 
        title="Pharmacy Map" 
        onBackClick={() => navigate("/pharmacy")}
      />

      <div className="px-4 pb-8 max-w-md mx-auto">
        {/* Location Permission Prompt */}
        {hasLocationPermission === false && !locationPermissionGranted && (
          <div className="mb-6">
            <LocationPermissionPrompt
              onLocationGranted={handleLocationGranted}
              onLocationDenied={handleLocationDenied}
              isRequired={true}
              title="Location Required for Map"
              description="We need your location to center the map on your area and show accurate distances to nearby pharmacies."
            />
          </div>
        )}

        {/* Map Container - Only show if location is handled */}
        {(hasLocationPermission === true || locationPermissionGranted) && (
          <>
            <div className="relative mb-4">
              <div 
                className="w-full bg-white rounded-2xl shadow-md overflow-hidden"
                style={{ height: showDetails ? '300px' : '400px' }}
                data-aos="fade-down"
                data-aos-delay="100"
              >
                <RealMap />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <InfoCard className="mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Loading pharmacies...</span>
                </div>
              </InfoCard>
            )}

            {/* Selected Pharmacy Details */}
            {selectedPharmacy && showDetails && (
              <ActionCard
                className="mb-4"
                dataAos="fade-up"
                dataAosDelay="200"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-blue-900">
                          {selectedPharmacy.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(selectedPharmacy)}
                          className="h-8 w-8 hover:bg-red-50"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              isFavorite(selectedPharmacy.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-gray-400 hover:text-red-500"
                            }`} 
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowDetails(false)}
                          className="h-8 w-8"
                        >
                          <Minimize2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={selectedPharmacy.type === "chain" ? "default" : "secondary"}>
                          {selectedPharmacy.type.charAt(0).toUpperCase() + selectedPharmacy.type.slice(1)}
                        </Badge>
                        <Badge variant={isCurrentlyOpen(selectedPharmacy) ? "default" : "secondary"}>
                          {isCurrentlyOpen(selectedPharmacy) ? "Open" : "Closed"}
                        </Badge>
                        {selectedPharmacy.distance && (
                          <Badge variant="outline">
                            {formatDistance(selectedPharmacy.distance)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedPharmacy.rating}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{selectedPharmacy.location.address}</p>
                      <p>{selectedPharmacy.location.city}, {selectedPharmacy.location.province}</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{formatSchedule(selectedPharmacy)}</span>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{selectedPharmacy.contact.phone}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${selectedPharmacy.contact.phone}`)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        if (selectedPharmacy.location.coordinates) {
                          const { lat, lng } = selectedPharmacy.location.coordinates;
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
                        }
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </ActionCard>
            )}

            {/* Pharmacy List (Collapsed) */}
            {!showDetails && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Nearby Pharmacies ({pharmacies.length})
                </h3>
                {pharmacies.slice(0, 3).map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    onClick={() => handlePinClick(pharmacy)}
                    className="bg-white rounded-xl p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{pharmacy.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={isCurrentlyOpen(pharmacy) ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {isCurrentlyOpen(pharmacy) ? "Open" : "Closed"}
                          </Badge>
                          {pharmacy.distance && (
                            <span className="text-xs text-gray-500">
                              {formatDistance(pharmacy.distance)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{pharmacy.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {pharmacies.length > 3 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/pharmacy")}
                    >
                      View all {pharmacies.length} pharmacies
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!loading && pharmacies.length === 0 && (
              <InfoCard className="text-center" dataAos="fade-up">
                <div className="py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pharmacies found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your location or search radius.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/pharmacy")}
                  >
                    Back to Search
                  </Button>
                </div>
              </InfoCard>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacyMapPage;