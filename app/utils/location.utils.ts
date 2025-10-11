export const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Get user's coordinates
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        }
      );

      const { latitude, longitude, accuracy } = position.coords;

      // Step 2: Reverse geocode using OpenStreetMap (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Failed to fetch location data");

      const data = await response.json();
      const address = data.address || {};

      // Step 3: Extract readable location info
      resolve({
        latitude,
        longitude,
        accuracy,
        location: data.display_name,
        metadata: {
          street: address.road || null,
          barangay: address.suburb || address.neighbourhood || null,
          city: address.city || address.town || address.village || null,
          region:
            address.state || address.region || address.state_district || null,
          country: address.country || null,
          postalCode: address.postcode || null,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      reject(error);
    }
  });
};
