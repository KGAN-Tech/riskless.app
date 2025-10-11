import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";

interface DestinationSearchProps {
  destination: string;
  setDestination: (value: string) => void;
}

export function DestinationSearch({
  destination,
  setDestination,
}: DestinationSearchProps) {
  const [suggestions, setSuggestions] = useState<
    { name: string; lat: number; lon: number }[]
  >([]);

  // Fetch suggestions from OpenStreetMap Nominatim
  useEffect(() => {
    const handler = setTimeout(() => {
      if (destination.trim().length >= 2) {
        fetchSuggestions(destination);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [destination]);

  async function fetchSuggestions(query: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      const mapped =
        data?.map((item: any) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        })) || [];
      setSuggestions(mapped);
    } catch (err) {
      console.error("Error fetching destination suggestions:", err);
    }
  }

  const handleSelect = (name: string) => {
    setDestination(name);
    setSuggestions([]);
  };

  return (
    <Card className="p-4 rounded-2xl calm-shadow border-border relative">
      <Label className="text-foreground mb-2 block">Where are you going?</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <Input
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10 border-border rounded-2xl"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-md">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s.name)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
          <Navigation className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
