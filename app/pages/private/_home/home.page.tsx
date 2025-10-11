import { Leaf } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import WeatherCard from "~/app/components/templates/cards/weather.card";
import { getCurrentLocation } from "~/app/utils/location.utils";
import { DriveReminder } from "~/app/components/templates/cards/reminder.card";
import NearbyStatsCard from "~/app/components/templates/cards/nearbystats.card";
import EmergencyHotlinesList from "~/app/components/templates/cards/emergency.hotlines.card";

export function UserHomePage() {
  const [locationData, setLocationData] = useState<any>(null);

  // ✅ Run once: safely get location
  useEffect(() => {
    getCurrentLocation().then((data) => setLocationData(data));
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

  // ✅ Stable hotlines array
  const emergencyHotlines = useMemo(
    () => [
      { name: "Emergency Rescue", number: "911", available: true },
      { name: "Fire Department", number: "1-800-FIRE", available: true },
      { name: "Medical Emergency", number: "1-800-MED", available: true },
      { name: "Police Department", number: "1-800-POLICE", available: true },
      { name: "Road Assistance", number: "1-800-ROAD", available: false },
    ],
    []
  );

  // ✅ Stable callback (doesn’t recreate every render)
  const handleSaveAll = useCallback(() => {
    const vcfData = emergencyHotlines
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
  }, [emergencyHotlines]);

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
        <NearbyStatsCard
          nearIncident={true}
          nearHighRiskRoad={true}
          accidentCount={0}
          highRiskCount={0}
        />

        {/* Emergency Hotlines */}
        <EmergencyHotlinesList
          emergencyHotlines={emergencyHotlines}
          onSaveAll={handleSaveAll}
        />
      </div>
    </div>
  );
}
