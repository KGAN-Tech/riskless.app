// DefaultPatientPage.tsx
import { useState, type JSX } from "react";
import EncounterTab from "@/pages/private/patients/features/defaults/patient.encounter.tab";

interface DefaultPatientPageProps {
  encounters: any[];
  tabs: string[];
  views: { id: string; icon: JSX.Element; page?: string }[];
  member: any;
  facilityId: string;
  selectedView: string;
  onSelectView: (view: string) => void;
}

export default function DefaultPatientPage({
  encounters,
  tabs,
  views,
  member,
  facilityId,
  selectedView,
  onSelectView,
}: DefaultPatientPageProps) {
  const [activeTab, setActiveTab] = useState("Encounters");

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-700 text-blue-700"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-4">
        {activeTab === "Encounters" && (
          <div className="space-y-4">
            <EncounterTab
              encounters={encounters}
              member={member}
              facilityId={facilityId}
            />
          </div>
        )}

        {activeTab !== "Encounters" && (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">{activeTab} content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
