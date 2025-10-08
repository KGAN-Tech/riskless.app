import React from "react";

interface EncounterTopBarProps {
  title: string;
  onBack: () => void;
  providers?: string[];
  selectedProvider?: string;
  onProviderChange?: (provider: string) => void;
  time?: string;
}

export const EncounterTopBar: React.FC<EncounterTopBarProps> = ({
  title,
  onBack,
  providers = [],
  selectedProvider,
  onProviderChange,
  time,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="p-3 flex items-center justify-between">
        {/* Left side - Back + Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right side - Provider + Time */}
        <div className="flex items-center space-x-6">
          {/* Provider */}
          {providers.length > 0 && (
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <select
                className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0"
                value={selectedProvider}
                onChange={(e) => onProviderChange?.(e.target.value)}
              >
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time */}
          {time && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
