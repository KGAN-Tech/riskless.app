import { api } from "./_api.client";
import type {
  Pharmacy,
  PharmacySearchParams,
  PharmacyFilter,
  UserLocation,
  FavoritePharmacy,
} from "@/types/pharmacy.types";

export class PharmacyService {
  // Search pharmacies based on location and filters
  static async searchPharmacies(
    params: PharmacySearchParams
  ): Promise<Pharmacy[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.query) searchParams.append("query", params.query);
      if (params.location?.lat)
        searchParams.append("lat", params.location.lat.toString());
      if (params.location?.lng)
        searchParams.append("lng", params.location.lng.toString());
      searchParams.append("radius", (params.radius || 10).toString());

      // Add filter params
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, value.toString());
        });
      }

      const queryString = searchParams.toString();
      const url = `/pharmacy/search${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching pharmacies:", error);
      // Return mock data for development
      return this.getMockPharmacies(params);
    }
  }

  // Get all pharmacies
  static async getAllPharmacies(): Promise<Pharmacy[]> {
    try {
      const response = await api.get("/pharmacy");
      return response.data;
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      return this.getMockPharmacies();
    }
  }

  // Get pharmacy by ID
  static async getPharmacyById(id: string): Promise<Pharmacy | null> {
    try {
      const response = await api.get(`/pharmacy/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pharmacy:", error);
      return null;
    }
  }

  // Get user's favorite pharmacies
  static async getFavoritePharmacies(userId: string): Promise<Pharmacy[]> {
    try {
      const response = await api.get(`/pharmacy/favorites/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite pharmacies:", error);
      return [];
    }
  }

  // Add pharmacy to favorites
  static async addToFavorites(
    userId: string,
    pharmacyId: string
  ): Promise<boolean> {
    try {
      await api.post("/pharmacy/favorites", {
        userId,
        pharmacyId,
        dateAdded: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return false;
    }
  }

  // Remove pharmacy from favorites
  static async removeFromFavorites(
    userId: string,
    pharmacyId: string
  ): Promise<boolean> {
    try {
      await api.delete(`/pharmacy/favorites/${userId}/${pharmacyId}`);
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return false;
    }
  }

  // Get user's current location - FRESH DEVICE LOCATION!
  static async getCurrentLocation(): Promise<UserLocation | null> {
    if (!navigator.geolocation) {
      console.error("❌ Geolocation is not supported by this browser.");
      return null;
    }

    console.log("📍 Getting your FRESH device location...");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true, // Use GPS for best accuracy
            timeout: 15000, // 15 seconds to get accurate GPS
            maximumAge: 0, // NO CACHE - always get fresh location!
          });
        }
      );

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const browser = navigator.userAgent.includes("Chrome")
        ? "Chrome"
        : navigator.userAgent.includes("Brave")
        ? "Brave"
        : navigator.userAgent.includes("Firefox")
        ? "Firefox"
        : navigator.userAgent.includes("Safari")
        ? "Safari"
        : "Unknown";

      console.log("✅ Got your FRESH device location:", {
        latitude: location.lat,
        longitude: location.lng,
        accuracy: `${position.coords.accuracy}m`,
        browser: browser,
        speed: "FRESH GPS 📍",
        googleMapsLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`,
        timestamp: new Date().toISOString(),
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        deviceSpeed: position.coords.speed,
      });

      return location;
    } catch (error) {
      console.error("❌ Failed to get fresh location:", error);
      return null;
    }
  }

  // Legacy method - keeping the complex attempts for fallback
  private static async getLocationWithMultipleAttempts(): Promise<UserLocation | null> {
    const locationAttempts = [
      // Attempt 1: High accuracy GPS (best but slowest)
      {
        options: {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0, // Always get fresh location
        },
        description: "High-accuracy GPS",
      },
      // Attempt 2: Balanced approach
      {
        options: {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000, // 30 seconds cache
        },
        description: "Balanced GPS",
      },
      // Attempt 3: Network-based (faster but less accurate)
      {
        options: {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000, // 1 minute cache
        },
        description: "Network-based",
      },
    ];

    for (let i = 0; i < locationAttempts.length; i++) {
      const attempt = locationAttempts[i];
      console.log(`🎯 Attempt ${i + 1}: ${attempt.description}`);

      try {
        const location = await new Promise<UserLocation | null>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                console.log(`✅ ${attempt.description} success:`, {
                  latitude: location.lat,
                  longitude: location.lng,
                  accuracy: `${position.coords.accuracy}m`,
                  altitude: position.coords.altitude
                    ? `${position.coords.altitude}m`
                    : "N/A",
                  speed: position.coords.speed
                    ? `${position.coords.speed}m/s`
                    : "N/A",
                  heading: position.coords.heading
                    ? `${position.coords.heading}°`
                    : "N/A",
                  timestamp: new Date(position.timestamp).toLocaleString(),
                  source: attempt.description,
                  googleMapsLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`,
                });

                // Validate coordinates (basic sanity check)
                if (
                  location.lat >= -90 &&
                  location.lat <= 90 &&
                  location.lng >= -180 &&
                  location.lng <= 180 &&
                  position.coords.accuracy < 50000 // Less than 50km accuracy
                ) {
                  resolve(location);
                } else {
                  console.warn(
                    `⚠️ Invalid coordinates from ${attempt.description}:`,
                    location
                  );
                  reject(new Error("Invalid coordinates"));
                }
              },
              (error) => {
                console.warn(`❌ ${attempt.description} failed:`, {
                  code: error.code,
                  message: error.message,
                  details:
                    error.code === 1
                      ? "Permission denied"
                      : error.code === 2
                      ? "Position unavailable"
                      : error.code === 3
                      ? "Timeout"
                      : "Unknown error",
                });
                reject(error);
              },
              attempt.options
            );
          }
        );

        if (location) {
          console.log(
            `🎉 Location detection successful with ${attempt.description}`
          );
          return location;
        }
      } catch (error) {
        console.log(
          `⚠️ ${attempt.description} attempt failed, trying next method...`
        );
        continue;
      }
    }

    console.error("❌ All location detection methods failed");
    return null;
  }

  // Get multiple location readings and return the most accurate
  static async getCurrentLocationWithValidation(): Promise<UserLocation | null> {
    console.log("🔬 Getting multiple location readings for validation...");

    const readings: Array<{ location: UserLocation; accuracy: number }> = [];
    const maxReadings = 3;

    for (let i = 0; i < maxReadings; i++) {
      try {
        const result = await new Promise<{
          location: UserLocation;
          accuracy: number;
        } | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                accuracy: position.coords.accuracy,
              });
            },
            () => resolve(null),
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 0,
            }
          );
        });

        if (result) {
          readings.push(result);
          console.log(`📍 Reading ${i + 1}:`, {
            lat: result.location.lat,
            lng: result.location.lng,
            accuracy: `${result.accuracy}m`,
          });
        }

        // Small delay between readings
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn(`⚠️ Reading ${i + 1} failed:`, error);
      }
    }

    if (readings.length === 0) {
      console.error("❌ No valid location readings obtained");
      return null;
    }

    // Find the most accurate reading
    const bestReading = readings.reduce((best, current) =>
      current.accuracy < best.accuracy ? current : best
    );

    console.log("🎯 Best location reading:", {
      latitude: bestReading.location.lat,
      longitude: bestReading.location.lng,
      accuracy: `${bestReading.accuracy}m`,
      totalReadings: readings.length,
      googleMapsLink: `https://www.google.com/maps?q=${bestReading.location.lat},${bestReading.location.lng}`,
    });

    return bestReading.location;
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Mock data for development/fallback - will be positioned near user's location
  private static getMockPharmacies(params?: PharmacySearchParams): Pharmacy[] {
    // Get user's location from params to create nearby pharmacies
    let userLat = params?.location?.lat || 14.5995; // Default to Manila, Philippines
    let userLng = params?.location?.lng || 120.9842;

    // CRITICAL: Log what location we're using for mock data
    console.log("🏥 Creating mock pharmacies around:", {
      latitude: userLat,
      longitude: userLng,
      isFromUserLocation: !!params?.location,
      googleMapsLink: `https://www.google.com/maps?q=${userLat},${userLng}`,
    });
    const mockPharmacies: Pharmacy[] = [
      {
        id: "1",
        name: "Mercury Drug Store - SM City",
        type: "chain",
        image: "/assets/imgs/pharmacy-mercury.jpg",
        description:
          "Leading pharmacy chain in the Philippines with wide range of medicines and health products.",
        location: {
          address: "Main Street Pharmacy, Downtown",
          city: "Your City",
          province: "Your Area",
          postalCode: "12345",
          coordinates: { lat: userLat + 0.01, lng: userLng + 0.01 }, // ~1km northeast
        },
        contact: {
          phone: "+63 2 8374 2222",
          email: "smcity@mercurydrug.com",
        },
        schedule: [
          {
            day: "Monday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Tuesday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Wednesday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Thursday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Friday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Saturday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Sunday",
            openTime: "08:00",
            closeTime: "22:00",
            isOpen: true,
          },
        ],
        services: [
          {
            id: "1",
            name: "Prescription Filling",
            description: "Fill your prescriptions",
            isAvailable: true,
          },
          {
            id: "2",
            name: "Blood Pressure Check",
            description: "Free BP monitoring",
            isAvailable: true,
          },
          {
            id: "3",
            name: "Vaccination",
            description: "Various vaccines available",
            isAvailable: true,
          },
        ],
        features: [
          "Air Conditioned",
          "Senior Citizen Discount",
          "PWD Discount",
          "Parking Available",
        ],
        isActive: true,
        isOpen24Hours: false,
        hasDelivery: true,
        acceptsInsurance: true,
        rating: 4.5,
        distance: 2.1,
        isFavorite: false,
      },
      {
        id: "2",
        name: "Watsons - Trinoma",
        type: "chain",
        image: "/assets/imgs/pharmacy-watsons.jpg",
        description:
          "Health and beauty store with pharmacy services and wide selection of wellness products.",
        location: {
          address: "Shopping Center, West Wing",
          city: "Your City",
          province: "Your Area",
          postalCode: "12345",
          coordinates: { lat: userLat - 0.008, lng: userLng + 0.012 }, // ~1km southwest
        },
        contact: {
          phone: "+63 2 8901 3456",
          email: "trinoma@watsons.com.ph",
        },
        schedule: [
          {
            day: "Monday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Tuesday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Wednesday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Thursday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Friday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Saturday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
          {
            day: "Sunday",
            openTime: "10:00",
            closeTime: "22:00",
            isOpen: true,
          },
        ],
        services: [
          {
            id: "1",
            name: "Prescription Filling",
            description: "Fill your prescriptions",
            isAvailable: true,
          },
          {
            id: "2",
            name: "Beauty Consultation",
            description: "Free beauty advice",
            isAvailable: true,
          },
          {
            id: "3",
            name: "Health Screening",
            description: "Basic health checks",
            isAvailable: true,
          },
        ],
        features: [
          "Beauty Products",
          "Health Supplements",
          "Personal Care",
          "Member Discounts",
        ],
        isActive: true,
        isOpen24Hours: false,
        hasDelivery: true,
        acceptsInsurance: true,
        rating: 4.3,
        distance: 1.8,
        isFavorite: true,
      },
      {
        id: "3",
        name: "Rose Pharmacy - 24/7",
        type: "chain",
        image: "/assets/imgs/pharmacy-rose.jpg",
        description:
          "24-hour pharmacy providing round-the-clock medical and pharmaceutical services.",
        location: {
          address: "24/7 Medical Plaza, Main Avenue",
          city: "Your City",
          province: "Your Area",
          postalCode: "12345",
          coordinates: { lat: userLat + 0.015, lng: userLng - 0.005 }, // ~1.5km north
        },
        contact: {
          phone: "+63 2 8456 7890",
          email: "qc24hr@rosepharmacy.com",
        },
        schedule: [
          {
            day: "Monday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Tuesday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Wednesday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Thursday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Friday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Saturday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
          {
            day: "Sunday",
            openTime: "00:00",
            closeTime: "23:59",
            isOpen: true,
          },
        ],
        services: [
          {
            id: "1",
            name: "24/7 Prescription Filling",
            description: "Round-the-clock prescription service",
            isAvailable: true,
          },
          {
            id: "2",
            name: "Emergency Medicine",
            description: "Emergency medications available",
            isAvailable: true,
          },
          {
            id: "3",
            name: "Home Delivery",
            description: "24/7 delivery service",
            isAvailable: true,
          },
        ],
        features: [
          "24/7 Service",
          "Emergency Care",
          "Home Delivery",
          "Drive-Through",
        ],
        isActive: true,
        isOpen24Hours: true,
        hasDelivery: true,
        acceptsInsurance: true,
        rating: 4.7,
        distance: 3.2,
        isFavorite: false,
      },
      {
        id: "4",
        name: "St. Luke's Hospital Pharmacy",
        type: "hospital",
        image: "/assets/imgs/pharmacy-hospital.jpg",
        description:
          "Hospital pharmacy specializing in prescription medications and medical supplies.",
        location: {
          address: "General Hospital, Medical District",
          city: "Your City",
          province: "Your Area",
          postalCode: "12345",
          coordinates: { lat: userLat - 0.012, lng: userLng - 0.008 }, // ~1.5km southeast
        },
        contact: {
          phone: "+63 2 8723 0101",
          email: "pharmacy@stluke.com.ph",
        },
        schedule: [
          {
            day: "Monday",
            openTime: "06:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Tuesday",
            openTime: "06:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Wednesday",
            openTime: "06:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Thursday",
            openTime: "06:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Friday",
            openTime: "06:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Saturday",
            openTime: "08:00",
            closeTime: "18:00",
            isOpen: true,
          },
          {
            day: "Sunday",
            openTime: "08:00",
            closeTime: "18:00",
            isOpen: true,
          },
        ],
        services: [
          {
            id: "1",
            name: "Hospital Prescriptions",
            description: "Specialized hospital medications",
            isAvailable: true,
          },
          {
            id: "2",
            name: "Compounding",
            description: "Custom medication preparation",
            isAvailable: true,
          },
          {
            id: "3",
            name: "Medical Supplies",
            description: "Medical equipment and supplies",
            isAvailable: true,
          },
        ],
        features: [
          "Hospital Grade",
          "Specialized Medications",
          "Medical Equipment",
          "Insurance Accepted",
        ],
        isActive: true,
        isOpen24Hours: false,
        hasDelivery: false,
        acceptsInsurance: true,
        rating: 4.6,
        distance: 4.5,
        isFavorite: true,
      },
      {
        id: "5",
        name: "Family Care Pharmacy",
        type: "independent",
        image: "/assets/imgs/pharmacy-independent.jpg",
        description:
          "Family-owned pharmacy providing personalized care and competitive prices.",
        location: {
          address: "Family Care Center, Residential Area",
          city: "Your City",
          province: "Your Area",
          postalCode: "12345",
          coordinates: { lat: userLat - 0.005, lng: userLng + 0.008 }, // ~800m southwest
        },
        contact: {
          phone: "+63 2 8372 5544",
          email: "info@familycarepharmacy.ph",
        },
        schedule: [
          {
            day: "Monday",
            openTime: "07:00",
            closeTime: "21:00",
            isOpen: true,
          },
          {
            day: "Tuesday",
            openTime: "07:00",
            closeTime: "21:00",
            isOpen: true,
          },
          {
            day: "Wednesday",
            openTime: "07:00",
            closeTime: "21:00",
            isOpen: true,
          },
          {
            day: "Thursday",
            openTime: "07:00",
            closeTime: "21:00",
            isOpen: true,
          },
          {
            day: "Friday",
            openTime: "07:00",
            closeTime: "21:00",
            isOpen: true,
          },
          {
            day: "Saturday",
            openTime: "08:00",
            closeTime: "20:00",
            isOpen: true,
          },
          {
            day: "Sunday",
            openTime: "08:00",
            closeTime: "18:00",
            isOpen: true,
          },
        ],
        services: [
          {
            id: "1",
            name: "Prescription Filling",
            description: "Personal prescription service",
            isAvailable: true,
          },
          {
            id: "2",
            name: "Health Consultation",
            description: "Free pharmacist consultation",
            isAvailable: true,
          },
          {
            id: "3",
            name: "Medicine Delivery",
            description: "Local delivery service",
            isAvailable: true,
          },
        ],
        features: [
          "Personal Service",
          "Competitive Prices",
          "Health Consultation",
          "Local Delivery",
        ],
        isActive: true,
        isOpen24Hours: false,
        hasDelivery: true,
        acceptsInsurance: false,
        rating: 4.8,
        distance: 1.2,
        isFavorite: false,
      },
    ];

    // Filter based on search parameters if provided
    if (params?.query) {
      const query = params.query.toLowerCase();
      return mockPharmacies.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(query) ||
          pharmacy.description.toLowerCase().includes(query) ||
          pharmacy.location.address.toLowerCase().includes(query)
      );
    }

    // Apply filters if provided
    if (params?.filters) {
      return mockPharmacies.filter((pharmacy) => {
        const filters = params.filters!;

        if (filters.type && pharmacy.type !== filters.type) return false;
        if (filters.city && pharmacy.location.city !== filters.city)
          return false;
        if (
          filters.isOpen24Hours !== undefined &&
          pharmacy.isOpen24Hours !== filters.isOpen24Hours
        )
          return false;
        if (
          filters.hasDelivery !== undefined &&
          pharmacy.hasDelivery !== filters.hasDelivery
        )
          return false;
        if (
          filters.acceptsInsurance !== undefined &&
          pharmacy.acceptsInsurance !== filters.acceptsInsurance
        )
          return false;
        if (
          filters.maxDistance &&
          pharmacy.distance &&
          pharmacy.distance > filters.maxDistance
        )
          return false;
        if (
          filters.isActive !== undefined &&
          pharmacy.isActive !== filters.isActive
        )
          return false;

        return true;
      });
    }

    return mockPharmacies;
  }
}
