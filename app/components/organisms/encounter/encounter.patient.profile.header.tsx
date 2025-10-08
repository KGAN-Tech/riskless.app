import React, { useState } from "react";
import {
  AlertTriangle,
  Pill,
  FlaskConical,
  ScrollText,
  ChevronDown,
  ChevronUp,
  UserX,
} from "lucide-react";
import { PatientProfileWideCard } from "@/components/molecules/PatientProfileWideCard";

interface ProfileData {
  initials: string;
  name: string;
  age: number | string;
  gender: string;
  bloodType: string;
  medicalAlerts?: string[];
}

interface EncounterPatientProfileHeaderProps {
  profileData: ProfileData;
  queueLabel?: string;
  onHistoryClick?: () => void;
  defaultCollapsed?: boolean;
}

export const EncounterPatientProfileHeader: React.FC<
  EncounterPatientProfileHeaderProps
> = ({
  profileData,
  queueLabel,
  onHistoryClick,
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const isEmpty =
    !profileData?.name || profileData.name === "No Patient Selected";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Left - Patient Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 flex items-center justify-center font-semibold">
            {profileData.initials || <UserX className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {profileData.name || "No patient selected"}
              </h3>

              {!isEmpty && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 text-blue-700 text-[11px] font-medium px-2 py-0.5">
                  {profileData.age} • {profileData.gender}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              {!isEmpty && (
                <>
                  <span className="inline-flex items-center rounded-full bg-white text-gray-700 text-xs px-2 py-0.5 ring-1 ring-gray-200">
                    Blood Type:{" "}
                    <span className="ml-1 font-semibold">
                      {profileData.bloodType}
                    </span>
                  </span>

                  {/* Alerts */}
                  {profileData.medicalAlerts &&
                    profileData.medicalAlerts.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/10 text-rose-700 text-[11px] px-2 py-0.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {profileData.medicalAlerts.length} alert
                        {profileData.medicalAlerts.length > 1 ? "s" : ""}
                      </span>
                    )}
                </>
              )}

              {/* Queue label */}
              {queueLabel && (
                <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 text-xs font-medium px-3 py-1">
                  {queueLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <button
            title="History"
            onClick={onHistoryClick}
            disabled={isEmpty}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-700 hover:text-blue-800 bg-white hover:bg-gray-50 ring-1 ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ScrollText className="h-4 w-4" />
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-1 flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
          >
            <span>{isCollapsed ? "Show Details" : "Hide Details"}</span>
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Patient Details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
        }`}
      >
        <div className="p-2">
          {isEmpty ? (
            <div className="text-center text-gray-500 py-8">
              No patient details to display.
            </div>
          ) : (
            <PatientProfileWideCard
              patient={profileData as any}
              queueLabel={queueLabel}
              hideHeader
            />
          )}
        </div>
      </div>
    </div>
  );
};
