import React, { useState } from "react";

interface PatientProfileCardProps {
  patient: {
    name: string;
    initials: string;
    age: number;
    gender: string;
    bloodType: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    lastVisit: string;
    medicalAlerts: string[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  compact?: boolean;
  collapsedByDefault?: boolean;
}

export const PatientProfileCard: React.FC<PatientProfileCardProps> = ({
  patient,
  compact = false,
  collapsedByDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!collapsedByDefault);

  const cardPadding = compact ? "p-4" : "p-6";
  const avatarSize = compact ? "w-10 h-10 text-base" : "w-12 h-12 text-lg";
  const nameSize = compact ? "text-base" : "text-lg";
  const sectionGap = compact ? "gap-4" : "gap-6";
  const gridCols = compact ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-blue-200 ${cardPadding}`}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div
            className={`${avatarSize} bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold`}
          >
            {patient.initials}
          </div>
          <div>
            <div className={`font-semibold text-gray-900 ${nameSize}`}>
              {patient.name}
            </div>
            <div className="text-gray-600 text-xs lg:text-sm">
              {patient.age} years old • {patient.gender}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {patient.bloodType}
          </div>
          {patient.medicalAlerts?.length > 0 && (
            <div className="flex items-center text-xs font-medium text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {patient.medicalAlerts.length} alert
              {patient.medicalAlerts.length > 1 ? "s" : ""}
            </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Details - Collapsible */}
      {isExpanded && (
        <div className={`mt-4 grid grid-cols-1 ${gridCols} ${sectionGap}`}>
          {/* Personal Information */}
          <div className="space-y-3">
            <InfoRow
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              label="Date of Birth"
              value={patient.dateOfBirth}
              iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            <InfoRow
              iconBg="bg-blue-200"
              iconColor="text-blue-700"
              label="Phone"
              value={patient.phone}
              iconPath="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684L10.5 9l2.592-5.28a1 1 0 01.948-.684H19a2 2 0 012 2v10a2 2 0 01-2 2h-3.28a1 1 0 01-.948-.684L13.5 15l-2.592 5.28a1 1 0 01-.948.684H5a2 2 0 01-2-2V5z"
            />
            <InfoRow
              iconBg="bg-blue-300"
              iconColor="text-blue-800"
              label="Address"
              value={patient.address}
              iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              iconPath2="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <InfoRow
              iconBg="bg-blue-400"
              iconColor="text-blue-900"
              label="Last Visit"
              value={patient.lastVisit}
              iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </div>

          {/* Medical Alerts */}
          <div className="space-y-3">
            <SectionHeader title="Medical Alerts" />
            <div className="flex flex-wrap gap-2">
              {patient.medicalAlerts.map((alert, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 text-xs lg:text-sm font-semibold px-2.5 py-1 rounded-full"
                >
                  {alert}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <SectionHeader title="Emergency Contact" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {patient.emergencyContact.name} (
                {patient.emergencyContact.relationship})
              </p>
              <p className="text-xs lg:text-sm text-gray-600">
                {patient.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Small reusable helpers */
const InfoRow = ({
  iconBg,
  iconColor,
  label,
  value,
  iconPath,
  iconPath2,
}: {
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  iconPath: string;
  iconPath2?: string;
}) => (
  <div className="flex items-center space-x-3">
    <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        {iconPath2 && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath2} />
        )}
      </svg>
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-blue-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <p className="text-sm font-semibold text-gray-900">{title}</p>
  </div>
);
