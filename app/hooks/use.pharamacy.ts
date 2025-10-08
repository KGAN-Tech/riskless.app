import { useState, useEffect, useCallback } from "react";
import { PharmacyService } from "@/services/location.pharmacy";
import type { 
  Pharmacy, 
  PharmacySearchParams, 
  UserLocation,
  PharmacyFilter 
} from "@/types/pharmacy.types";

export const usePharmacySearch = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Get user's current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      const location = await PharmacyService.getCurrentLocation();
      setUserLocation(location);
      return location;
    } catch (err) {
      setError("Failed to get current location");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search pharmacies
  const searchPharmacies = useCallback(async (params: PharmacySearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // If no location provided, try to get current location
      let searchParams = { ...params };
      if (!searchParams.location && userLocation) {
        searchParams.location = userLocation;
      }

      const results = await PharmacyService.searchPharmacies(searchParams);
      
      // Calculate distances if user location is available
      if (searchParams.location) {
        const pharmaciesWithDistance = results.map(pharmacy => ({
          ...pharmacy,
          distance: pharmacy.location.coordinates 
            ? PharmacyService.calculateDistance(
                searchParams.location!.lat,
                searchParams.location!.lng,
                pharmacy.location.coordinates.lat,
                pharmacy.location.coordinates.lng
              )
            : undefined
        }));
        
        // Sort by distance
        pharmaciesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        setPharmacies(pharmaciesWithDistance);
      } else {
        setPharmacies(results);
      }
    } catch (err) {
      setError("Failed to search pharmacies");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  // Load all pharmacies
  const loadAllPharmacies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await PharmacyService.getAllPharmacies();
      setPharmacies(results);
    } catch (err) {
      setError("Failed to load pharmacies");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter pharmacies
  const filterPharmacies = useCallback((filters: PharmacyFilter) => {
    setPharmacies(prevPharmacies => 
      prevPharmacies.filter(pharmacy => {
        if (filters.type && pharmacy.type !== filters.type) return false;
        if (filters.city && pharmacy.location.city !== filters.city) return false;
        if (filters.isOpen24Hours !== undefined && pharmacy.isOpen24Hours !== filters.isOpen24Hours) return false;
        if (filters.hasDelivery !== undefined && pharmacy.hasDelivery !== filters.hasDelivery) return false;
        if (filters.acceptsInsurance !== undefined && pharmacy.acceptsInsurance !== filters.acceptsInsurance) return false;
        if (filters.maxDistance && pharmacy.distance && pharmacy.distance > filters.maxDistance) return false;
        if (filters.isActive !== undefined && pharmacy.isActive !== filters.isActive) return false;
        
        return true;
      })
    );
  }, []);

  return {
    pharmacies,
    loading,
    error,
    userLocation,
    getCurrentLocation,
    searchPharmacies,
    loadAllPharmacies,
    filterPharmacies
  };
};

export const usePharmacyFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's favorite pharmacies
  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await PharmacyService.getFavoritePharmacies(userId);
      setFavorites(results);
    } catch (err) {
      setError("Failed to load favorites");
      console.error("Load favorites error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add pharmacy to favorites
  const addToFavorites = useCallback(async (pharmacy: Pharmacy) => {
    if (!userId) {
      setError("User not authenticated");
      return false;
    }

    try {
      const success = await PharmacyService.addToFavorites(userId, pharmacy.id);
      if (success) {
        setFavorites(prev => [...prev, { ...pharmacy, isFavorite: true }]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to add to favorites");
      console.error("Add to favorites error:", err);
      return false;
    }
  }, [userId]);

  // Remove pharmacy from favorites
  const removeFromFavorites = useCallback(async (pharmacyId: string) => {
    if (!userId) {
      setError("User not authenticated");
      return false;
    }

    try {
      const success = await PharmacyService.removeFromFavorites(userId, pharmacyId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== pharmacyId));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to remove from favorites");
      console.error("Remove from favorites error:", err);
      return false;
    }
  }, [userId]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (pharmacy: Pharmacy) => {
    const isFavorite = favorites.some(fav => fav.id === pharmacy.id);
    
    if (isFavorite) {
      return await removeFromFavorites(pharmacy.id);
    } else {
      return await addToFavorites(pharmacy);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Check if pharmacy is favorite
  const isFavorite = useCallback((pharmacyId: string) => {
    return favorites.some(fav => fav.id === pharmacyId);
  }, [favorites]);

  // Load favorites when userId changes
  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId, loadFavorites]);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
};

export const usePharmacyLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const location = await PharmacyService.getCurrentLocation();
      setUserLocation(location);
      return location;
    } catch (err) {
      setError("Failed to get current location");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateDistance = useCallback((pharmacy: Pharmacy) => {
    if (!userLocation || !pharmacy.location.coordinates) return null;
    
    return PharmacyService.calculateDistance(
      userLocation.lat,
      userLocation.lng,
      pharmacy.location.coordinates.lat,
      pharmacy.location.coordinates.lng
    );
  }, [userLocation]);

  return {
    userLocation,
    loading,
    error,
    getCurrentLocation,
    calculateDistance
  };
};