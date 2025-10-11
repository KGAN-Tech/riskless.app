import React from "react";
import { AlertTriangle, MapPin } from "lucide-react";

interface NearbyStatsCardProps {
  nearIncident: boolean;
  nearHighRiskRoad: boolean;
  accidentCount: number;
  highRiskCount: number;
}

const NearbyStatsCard: React.FC<NearbyStatsCardProps> = ({
  nearIncident,
  nearHighRiskRoad,
  accidentCount,
  highRiskCount,
}) => {
  // Hide component if not near any alert area
  if (!nearIncident && !nearHighRiskRoad) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Accidents Nearby */}
      <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-green-50">
        <AlertTriangle className="w-5 h-5 text-primary mb-1" />
        <div className="text-lg font-semibold text-primary">
          {accidentCount}
        </div>
        <p className="text-[11px] text-muted-foreground">Accidents Nearby</p>
      </div>

      {/* High-Risk Roads */}
      <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-pink-50">
        <MapPin className="w-5 h-5 text-pink-400 mb-1" />
        <div className="text-lg font-semibold text-pink-400">
          {highRiskCount}
        </div>
        <p className="text-[11px] text-muted-foreground">High-Risk Roads</p>
      </div>
    </div>
  );
};

export default NearbyStatsCard;
