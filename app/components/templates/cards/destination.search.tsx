import { useState, useEffect } from "react";
import type { LatLngTuple } from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";

interface DestinationSearchProps {
  destination: string;
  setDestination: (value: string) => void;
  setDestinationCoords: (coords: LatLngTuple | null) => void;
}

interface Suggestion {
  name: string;
  lat: number;
  lon: number;
}

export function DestinationSearch({
  destination,
  setDestination,
  setDestinationCoords,
}: DestinationSearchProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (destination.trim().length >= 2) {
        fetchSuggestions(destination);
      } else {
        setSuggestions([]);
        setDestinationCoords(null);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [destination]);

  async function fetchSuggestions(query: string) {
    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );

      const data = await res.json();

      const mapped: Suggestion[] =
        data?.map((item: any) => ({
          name: item.display_name,
          lat: Number(item.lat),
          lon: Number(item.lon),
        })) ?? [];

      setSuggestions(mapped);
    } catch (err) {
      console.error("Error fetching destination suggestions:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (suggestion: Suggestion) => {
    setDestination(suggestion.name);
    setDestinationCoords([suggestion.lat, suggestion.lon]);
    setSuggestions([]);
  };

  const handleNavigate = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <Card className="p-4 rounded-2xl calm-shadow border-border relative">
      <Label className="text-foreground  block">Where are you going?</Label>

      <div className="flex gap-2 -mt-4">
        <div className="relative flex-1 ">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />

          <Input
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10 border-border rounded-2xl "
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-md max-h-60 overflow-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}

          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Searching…
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleNavigate}
          disabled={suggestions.length === 0}
          className="bg-primary hover:bg-primary/90 rounded-2xl"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
