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
  RotateCcw,
  Search,
  Filter,
  List,
  Grid
} from "lucide-react";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { InfoCard, ActionCard } from "@/components/organisms/cards";
import PharmacyMap from "@/components/molecules/map/pharmacy.map";
import LocationPermissionPrompt from "@/components/molecules/location/LocationPermissionPrompt";
import { usePharmacySearch, usePharmacyFavorites } from "@/hooks/use.pharamacy";
import type { Pharmacy, PharmacyMapPin, MapCenter } from "@/types/pharmacy.types";
import AOS from "aos";
import "aos/dist/aos.css";

export const PharmacyMapPage = () => {
  const navigate = useNavigate();

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [mapCenter, setMapCenter] = useState<MapCenter>({
    lat: 0,
    lng: 0,
    zoom: 14
  });
  const [mapPins, setMapPins] = useState<PharmacyMapPin[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [sidebarView, setSidebarView] = useState<'list' | 'details'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

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
    setSidebarView('details');
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
    
    console.log("Map centering on your location:", {
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

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Desktop Map Component
  const DesktopMap = () => (
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
      <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{pharmacies.length}</p>
            <p className="text-sm text-gray-600">pharmacies found</p>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3">
        <button
          onClick={handleRecenterMap}
          className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-xl shadow-lg border transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
        <h4 className="font-medium text-gray-900 mb-3">Map Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Open Pharmacy</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Closed Pharmacy</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header using existing component */}
      <Headerbackbutton 
        title="Pharmacy Map" 
        onBackClick={() => navigate("/pharmacy")}
      />
      
      {/* Desktop Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {pharmacies.length} pharmacies found
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pharmacies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Location Permission Prompt */}
          {hasLocationPermission === false && !locationPermissionGranted && (
            <div className="p-6 border-b border-gray-200">
              <LocationPermissionPrompt
                onLocationGranted={handleLocationGranted}
                onLocationDenied={handleLocationDenied}
                isRequired={true}
                title="Location Required"
                description="Enable location to see nearby pharmacies and accurate distances."
              />
            </div>
          )}

          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {sidebarView === 'details' && selectedPharmacy ? 'Pharmacy Details' : 'Nearby Pharmacies'}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={sidebarView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                {selectedPharmacy && (
                  <Button
                    variant={sidebarView === 'details' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSidebarView('details')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading pharmacies...</span>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarView === 'details' && selectedPharmacy ? (
              /* Pharmacy Details View */
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedPharmacy.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
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
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedPharmacy.rating}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(selectedPharmacy)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            isFavorite(selectedPharmacy.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-400 hover:text-red-500"
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{selectedPharmacy.location.address}</p>
                      <p>{selectedPharmacy.location.city}, {selectedPharmacy.location.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{formatSchedule(selectedPharmacy)}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">{selectedPharmacy.contact.phone}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`tel:${selectedPharmacy.contact.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      if (selectedPharmacy.location.coordinates) {
                        const { lat, lng } = selectedPharmacy.location.coordinates;
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>

                {/* Schedule Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Operating Hours</h4>
                  <div className="space-y-2">
                    {selectedPharmacy.schedule.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className="font-medium">
                          {schedule.isOpen ? `${schedule.openTime} - ${schedule.closeTime}` : 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Pharmacy List View */
              <div className="p-6 space-y-4">
                {filteredPharmacies.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No pharmacies found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or location.
                    </p>
                  </div>
                ) : (
                  filteredPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      onClick={() => handlePinClick(pharmacy)}
                      className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                        selectedPharmacy?.id === pharmacy.id 
                          ? 'ring-2 ring-blue-500 border-blue-200' 
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{pharmacy.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{pharmacy.location.address}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{pharmacy.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={isCurrentlyOpen(pharmacy) ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {isCurrentlyOpen(pharmacy) ? "Open" : "Closed"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {pharmacy.type.charAt(0).toUpperCase() + pharmacy.type.slice(1)}
                          </Badge>
                          {pharmacy.distance && (
                            <span className="text-xs text-gray-500">
                              {formatDistance(pharmacy.distance)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatSchedule(pharmacy)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{pharmacy.contact.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1">
          {(hasLocationPermission === true || locationPermissionGranted) ? (
            <DesktopMap />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Location Permission Required
                </h3>
                <p className="text-gray-600">
                  Please enable location access to view the pharmacy map.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyMapPage;