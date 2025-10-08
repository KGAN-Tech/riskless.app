import React, { useState } from "react";
import { DraggablePatientQueue } from "./draggable.patient.queue";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string;
  userName?: string;
  contacts?: any[];
  images?: any[];
}

interface Patient {
  id: string;
  number: string; // queue number (e.g. "001")
  status: "waiting" | "next" | "now_serving" | "done" | "skipped";
  patient: PatientDetails;
  tags?: string[];
  date?: string;
  position?: string;
  estimatedWait?: string;
  priority?: "high" | "normal" | "low";
  counter?: any;
  encounter?: any;
  user?: any;
  queueType?: string;
  timestamp?: string;
  metadata?: any;
}

interface EncounterSidebarProps {
  patients: Patient[];
  onPatientsReorder: (patients: Patient[]) => void;
  onServeNext: () => void;
  onSkipPatient: () => void;
  onRecallPatient: () => void;
  currentPatientId?: string;
}

export const EncounterSidebar: React.FC<EncounterSidebarProps> = ({
  patients,
  onPatientsReorder,
  onServeNext,
  onSkipPatient,
  onRecallPatient,
  currentPatientId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const waitingCount = patients.filter((p) => p.status === "waiting" || p.status === "next").length;
  const skippedCount = patients.filter((p) => p.status === "skipped").length;
  const currentPatient =
    patients.find((p) => p.id === currentPatientId) ||
    patients.find((p) => p.status === "now_serving");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Floating button when collapsed
  if (isCollapsed) {
    return (
      <div className="fixed top-4 left-4 z-50 mt-8 ml-5">
        <button
          onClick={toggleSidebar}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl group"
          title="Open Patient Queue"
        >
          <div className="relative">
            {/* Menu (hamburger) icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            {/* Badge showing waiting count */}
            {waitingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {waitingCount > 99 ? "99+" : waitingCount}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  // Full sidebar when expanded
  return (
    <div className="relative">
      <aside className="w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header with collapse button */}
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">Patient Queue</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title="Collapse Sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Queue Statistics */}
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xl font-bold text-blue-700">{waitingCount}</p>
              <p className="text-xs text-blue-600 font-medium">Waiting</p>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xl font-bold text-orange-700">{skippedCount}</p>
              <p className="text-xs text-orange-600 font-medium">Skipped</p>
            </div>
          </div>
        </div>

        {/* Currently Serving */}
        {currentPatient && (
          <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Currently Serving</h3>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {`${currentPatient.patient.firstName?.[0] ?? ""}${
                    currentPatient.patient.lastName?.[0] ?? ""
                  }`.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {`${currentPatient.patient.firstName} ${
                      currentPatient.patient.middleName ?? ""
                    } ${currentPatient.patient.lastName}`.trim()}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-600">Queue #{currentPatient.number}</p>
                    <span className="bg-green-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      Serving
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue Controls */}
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Queue Controls</h3>
          <div className="space-y-2">
            <button
              onClick={onServeNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 text-sm font-medium transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Serve Next Patient</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onSkipPatient}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-2 rounded-lg flex items-center justify-center space-x-1 text-sm transition-colors"
              >
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
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Skip</span>
              </button>

              <button
                onClick={onRecallPatient}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-2 rounded-lg flex items-center justify-center space-x-1 text-sm transition-colors"
              >
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
                    d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 2.21.816 4.21 2.164 5.782m13.87-2.164L19.5 19v-5h-.582"
                  />
                </svg>
                <span>Recall</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Queue List */}
        <div className="flex-1 flex flex-col min-h-0 h-fit">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Patient Queue ({patients.length})
              </h3>
              <span className="text-[10px] text-gray-500">Drag to reorder</span>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 px-3 py-2 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <DraggablePatientQueue
              patients={patients}
              onPatientsReorder={onPatientsReorder}
              currentPatientId={currentPatientId}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};
