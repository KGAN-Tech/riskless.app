import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Heart, 
  Filter,
  Navigation,
  Truck,
  Shield,
  X,
  ChevronDown,
  Sliders,
  SortAsc,
  List,
  Grid3X3,
  RefreshCw
} from "lucide-react";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { InfoCard, ActionCard } from "@/components/organisms/cards";
import { usePharmacySearch, usePharmacyFavorites } from "@/hooks/use.pharamacy";
import type { Pharmacy, PharmacyFilter } from "@/types/pharmacy.types";
import AOS from "aos";
import "aos/dist/aos.css";

const PharmacyPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filters, setFilters] = useState<PharmacyFilter>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  
  const {
    pharmacies,
    loading,
    error,
    userLocation,
    getCurrentLocation,
    searchPharmacies,
    loadAllPharmacies
  } = usePharmacySearch();

  const {
    favorites,
    toggleFavorite,
    isFavorite
  } = usePharmacyFavorites("current-user-id");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });

    requestLocationAndLoad();
  }, []);

  const requestLocationAndLoad = async () => {
    console.log("🔍 Requesting location permission...");
    
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported");
      await handleInitialLoad();
      return;
    }

    try {
      const userLocation = await getCurrentLocation();
      
      if (userLocation) {
        console.log("🎯 Using location for pharmacy search:", userLocation);
        await searchPharmacies({ location: userLocation, radius: 10 });
      } else {
        throw new Error("No location obtained");
      }

    } catch (error) {
      console.log("❌ Location permission denied or failed:", error);
      await handleInitialLoad();
    }
  };

  const handleInitialLoad = async () => {
    const location = await getCurrentLocation();
    if (location) {
      await searchPharmacies({ location, radius: 10 });
    } else {
      await loadAllPharmacies();
    }
  };

  const handleSearch = async () => {
    const searchParams = {
      query: searchQuery,
      location: userLocation || undefined,
      radius: 10,
      filters
    };
    await searchPharmacies(searchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof PharmacyFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setShowFavoritesOnly(false);
  };

  const handleToggleFavorite = async (pharmacy: Pharmacy) => {
    await toggleFavorite(pharmacy);
  };

  const getDisplayedPharmacies = () => {
    let displayPharmacies = pharmacies;
    
    if (showFavoritesOnly) {
      displayPharmacies = pharmacies.filter(pharmacy => isFavorite(pharmacy.id));
    }
    
    // Apply sorting
    displayPharmacies.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return displayPharmacies;
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
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

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof PharmacyFilter]).length;
  };

  const PharmacyCard = ({ pharmacy, isListView = false }: { pharmacy: Pharmacy, isListView?: boolean }) => (
    <ActionCard
      className={`${isListView ? 'mb-3' : 'mb-4'} hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500`}
      dataAos={isListView ? "fade-right" : "fade-up"}
      dataAosDelay="50"
    >
      <div className={`flex ${isListView ? 'flex-row space-x-4' : 'flex-col space-y-4'}`}>
        {/* Pharmacy Info */}
        <div className={`${isListView ? 'flex-1' : ''} space-y-3`}>
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors">
                  {pharmacy.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(pharmacy)}
                  className="h-8 w-8 hover:bg-red-50 transition-colors"
                >
                  <Heart 
                    className={`h-4 w-4 transition-all duration-200 ${
                      isFavorite(pharmacy.id) 
                        ? "fill-red-500 text-red-500 scale-110" 
                        : "text-gray-400 hover:text-red-500 hover:scale-105"
                    }`} 
                  />
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge 
                  variant={pharmacy.type === "chain" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {pharmacy.type.charAt(0).toUpperCase() + pharmacy.type.slice(1)}
                </Badge>
                <Badge 
                  variant={isCurrentlyOpen(pharmacy) ? "default" : "secondary"}
                  className={`text-xs ${isCurrentlyOpen(pharmacy) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  {isCurrentlyOpen(pharmacy) ? "Open Now" : "Closed"}
                </Badge>
                {pharmacy.distance && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {formatDistance(pharmacy.distance)}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{pharmacy.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{pharmacy.description}</p>

          {/* Quick Info Grid */}
          <div className={`grid ${isListView ? 'grid-cols-1' : 'grid-cols-1'} gap-2`}>
            {/* Location */}
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">{pharmacy.location.address}</p>
                <p className="text-xs text-gray-500">{pharmacy.location.city}, {pharmacy.location.province}</p>
              </div>
            </div>

            {/* Schedule & Contact */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">{formatSchedule(pharmacy)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">{pharmacy.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {pharmacy.isOpen24Hours && (
              <div className="flex items-center space-x-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span>24/7</span>
              </div>
            )}
            {pharmacy.hasDelivery && (
              <div className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <Truck className="h-3 w-3" />
                <span>Delivery</span>
              </div>
            )}
            {pharmacy.acceptsInsurance && (
              <div className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                <Shield className="h-3 w-3" />
                <span>Insurance</span>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Available Services:</p>
            <div className="flex flex-wrap gap-1">
              {pharmacy.services.slice(0, 4).map(service => (
                <Badge key={service.id} variant="outline" className="text-xs">
                  {service.name}
                </Badge>
              ))}
              {pharmacy.services.length > 4 && (
                <Badge variant="outline" className="text-xs bg-gray-50">
                  +{pharmacy.services.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`${isListView ? 'w-48 flex flex-col justify-center' : ''} flex ${isListView ? 'flex-col' : 'flex-row'} gap-2 pt-3 border-t border-gray-100`}>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isListView ? 'w-full' : 'flex-1'} hover:bg-blue-50 hover:border-blue-300 transition-colors`}
            onClick={() => window.open(`tel:${pharmacy.contact.phone}`)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isListView ? 'w-full' : 'flex-1'} hover:bg-green-50 hover:border-green-300 transition-colors`}
            onClick={() => {
              if (pharmacy.location.coordinates) {
                const { lat, lng } = pharmacy.location.coordinates;
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
              }
            }}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
        </div>
      </div>
    </ActionCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <Headerbackbutton title="Find Pharmacy" />
  
      <div className="px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Section */}
            <InfoCard className="shadow-sm" dataAos="fade-down" dataAosDelay="100">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Search Pharmacies
                </h3>
                
                <div className="relative">
                  <Input
                    placeholder="Search by name, location, or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSearch}
                    className="absolute right-1 top-1 h-8 w-8 hover:bg-blue-50"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant={showFilters ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 relative"
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleInitialLoad()}
                    className="px-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="text-xs"
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    Favorites
                  </Button>
                  <Button
                    variant={filters.isOpen24Hours ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('isOpen24Hours', !filters.isOpen24Hours)}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    24/7
                  </Button>
                  <Button
                    variant={filters.hasDelivery ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('hasDelivery', !filters.hasDelivery)}
                    className="text-xs"
                  >
                    <Truck className="h-3 w-3 mr-1" />
                    Delivery
                  </Button>
                </div>

                {(getActiveFilterCount() > 0 || showFavoritesOnly) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </InfoCard>
  
            {/* Location Status */}
            {userLocation && (
              <InfoCard className="bg-green-50 border-green-200" dataAos="fade-right" dataAosDelay="150">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Using your current location</span>
                </div>
              </InfoCard>
            )}
  
            {/* Favorites Summary */}
            {favorites.length > 0 && (
              <InfoCard className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200" dataAos="fade-up" dataAosDelay="200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">Quick access to your preferred pharmacies</p>
                    </div>
                  </div>
                  {!showFavoritesOnly && (
                    <Button variant="ghost" size="sm" onClick={() => setShowFavoritesOnly(true)}>
                      View
                    </Button>
                  )}
                </div>
              </InfoCard>
            )}
          </div>
  
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {showFavoritesOnly ? "Your Favorite Pharmacies" : "Available Pharmacies"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {getDisplayedPharmacies().length} pharmacy{getDisplayedPharmacies().length !== 1 ? 's' : ''} found
                  {userLocation && !showFavoritesOnly && " near you"}
                </p>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center space-x-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none border-r"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <InfoCard className="mb-6 bg-red-50 border-red-200">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </InfoCard>
            )}
  
            {/* Loading State */}
            {loading && (
              <InfoCard className="mb-6">
                <div className="flex items-center justify-center space-x-3 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Finding pharmacies near you...</p>
                    <p className="text-xs text-gray-500">This may take a moment</p>
                  </div>
                </div>
              </InfoCard>
            )}
  
            {/* Pharmacy Results */}
            {!loading && getDisplayedPharmacies().length > 0 && (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 xl:grid-cols-2 gap-6" 
                : "space-y-4"
              }>
                {getDisplayedPharmacies().map((pharmacy) => (
                  <PharmacyCard 
                    key={pharmacy.id} 
                    pharmacy={pharmacy} 
                    isListView={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
  
            {/* Empty State */}
            {!loading && getDisplayedPharmacies().length === 0 && (
              <InfoCard className="text-center py-12" dataAos="fade-up">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {showFavoritesOnly ? "No favorite pharmacies yet" : "No pharmacies found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {showFavoritesOnly
                      ? "Start adding pharmacies to your favorites for quick access later."
                      : searchQuery 
                        ? "Try adjusting your search terms or clearing filters."
                        : "We couldn't find any pharmacies in your area. Try expanding your search radius."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {showFavoritesOnly ? (
                      <Button onClick={() => setShowFavoritesOnly(false)}>
                        Browse All Pharmacies
                      </Button>
                    ) : (
                      <>
                        {(searchQuery || getActiveFilterCount() > 0) && (
                          <Button variant="outline" onClick={clearFilters}>
                            Clear Search & Filters
                          </Button>
                        )}
                        <Button onClick={() => handleInitialLoad()}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Results
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;