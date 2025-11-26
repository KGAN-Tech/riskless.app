import { Leaf } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import WeatherCard from "~/app/components/templates/cards/weather.card";
import { getCurrentLocation } from "~/app/utils/location.utils";
import { DriveReminder } from "~/app/components/templates/cards/reminder.card";
import NearbyStatsCard from "~/app/components/templates/cards/nearbystats.card";
import EmergencyHotlinesList from "~/app/components/templates/cards/emergency.hotlines.card";

import { facilityService } from "~/app/services/facility.service";

interface Hotline {
  name: string;
  number: string;
  available: boolean;
}

export function UserHomePage() {
  const [locationData, setLocationData] = useState<any>(null);
  const [hotlines, setHotlines] = useState<Hotline[]>([]);

  // ✅ Run once: safely get location
  useEffect(() => {
    getCurrentLocation().then((data) => setLocationData(data));
  }, []);

  // ✅ Fetch facilities and extract hotlines
  useEffect(() => {
    const fetchHotlines = async () => {
      try {
        const res = await facilityService.getAll();
        const facilities = res.data || [];

        const extractedHotlines: Hotline[] = facilities.flatMap(
          (facility: any) =>
            facility.contacts
              ?.filter((c: any) => c.type === "mobile_number" && c.value)
              .map((c: any) => ({
                name: facility.name || "Unknown",
                number: c.value,
                available: facility.status === "open",
              })) || []
        );

        setHotlines(extractedHotlines);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    fetchHotlines();
  }, []);

  // ✅ Stable date string (won’t re-render every second)
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  // ✅ Stable callback to save VCF
  const handleSaveAll = useCallback(() => {
    const vcfData = hotlines
      .map(
        (hotline) => `
BEGIN:VCARD
VERSION:3.0
FN:${hotline.name}
TEL;TYPE=CELL:${hotline.number}
END:VCARD
`
      )
      .join("\n");

    const blob = new Blob([vcfData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "emergency_hotlines.vcf";
    link.click();
    URL.revokeObjectURL(url);
  }, [hotlines]);

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-primary">Riskless</h1>
          </div>
          <p className="text-muted-foreground text-sm">{currentDate}</p>
          <DriveReminder />
        </div>

        {/* Weather Widget */}
        <WeatherCard
          latitude={locationData?.latitude}
          longitude={locationData?.longitude}
          location={locationData?.location}
        />

        {/* Stats Grid */}
        {/* <NearbyStatsCard
          nearIncident={true}
          nearHighRiskRoad={true}
          accidentCount={0}
          highRiskCount={0}
        /> */}

        {/* Emergency Hotlines */}
        <EmergencyHotlinesList
          emergencyHotlines={hotlines}
          onSaveAll={handleSaveAll}
        />
      </div>
    </div>
  );
}
