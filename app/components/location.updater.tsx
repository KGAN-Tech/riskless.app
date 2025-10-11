import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function LocationUpdater() {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
      });
    }
  }, [map]);

  return null;
}
