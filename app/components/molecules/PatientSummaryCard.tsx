import React from 'react';

interface PatientSummaryCardProps {
  patient: {
    name: string;
    initials: string;
    age: number;
    gender: string;
    bloodType: string;
    medicalAlerts: string[];
  };
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({ patient }) => {
  const alertsCount = patient.medicalAlerts?.length || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {patient.initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{patient.name}</div>
            <div className="text-xs text-gray-600">{patient.age}y • {patient.gender}</div>
          </div>
          <span className="ml-3 text-[11px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap">
            Blood: {patient.bloodType}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {alertsCount > 0 && (
            <span className="inline-flex items-center text-xs font-medium text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {alertsCount} {alertsCount === 1 ? 'alert' : 'alerts'}
            </span>
          )}
        </div>
      </div>

      {alertsCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {patient.medicalAlerts.map((alert, idx) => (
            <span
              key={idx}
              className="bg-red-100 text-red-800 text-[11px] font-medium px-2 py-0.5 rounded-full"
            >
              {alert}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
