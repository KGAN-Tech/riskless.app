import React, { useState, useEffect } from "react";
import { DraggablePatientQueue } from "../../organisms/draggable.patient.queue";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Clock, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { queueService } from "~/app/services/queue.service";
import {
  playAnnouncement,
  playSuccessChime,
  playStatusUpdateSound,
  soundService,
} from "~/app/utils/sound.helper";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string; // ISO string from API
}

interface Patient {
  id: string;
  number: string; // queue number (e.g. "001")
  status: "waiting" | "next" | "now_serving" | "done" | "skipped";
  tags?: string[];
  date?: string;
  position?: string;
  patient: PatientDetails;
  estimatedWait?: string;
  priority?: "high" | "normal" | "low";
}

interface CounterSidebarProps {
  patients: Patient[];
  onPatientsReorder: (patients: Patient[]) => void;
  onServeNext: (patient: any) => void;
  onSkipPatient: () => void;
  onRecallPatient: () => void;
  onAddPatientQueue: () => void;
  onMovePatient?: (patient: any) => void;
  onOpenMoveModal?: () => void; // New prop for opening move modal
  currentPatientId?: string;
}

export const CounterSidebar = ({
  patients,
  onPatientsReorder,
  onServeNext,
  onSkipPatient,
  onRecallPatient,
  onAddPatientQueue,
  onMovePatient,
  onOpenMoveModal,
  currentPatientId,
}: CounterSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localPatientOrder, setLocalPatientOrder] = useState<any[]>([]);

  // Update local patient order when patients prop changes
  useEffect(() => {
    if (patients.length > 0) {
      setLocalPatientOrder(patients);
    }
  }, [patients]);

  // Local reorder function that only updates visual order without backend calls
  const handleLocalPatientsReorder = (reorderedPatients: any[]) => {
    console.log("📋 [Counter Sidebar] Visual reorder only - no backend update");
    console.log(
      "Reordered patients:",
      reorderedPatients.map((p) => `#${p.number} ${p.patient.firstName}`)
    );

    // Update local state to maintain visual order
    setLocalPatientOrder(reorderedPatients);

    toast.info("Patient order updated visually (queue numbers unchanged)", {
      duration: 2000,
    });
  };

  // Status update function
  const updatePatientStatus = async (
    patient: any,
    newStatus: "waiting" | "next" | "now_serving"
  ) => {
    if (!patient) return;

    try {
      setUpdatingStatus(true);

      const statusLabels = {
        waiting: "Waiting",
        next: "Next",
        now_serving: "Now Serving",
      };

      toast.loading(`Updating ${patient.patient.firstName} to ${statusLabels[newStatus]}...`, {
        id: "status-update",
      });

      const updateData = {
        status: newStatus,
        metadata: {
          patientId: patient.metadata?.patientId || patient.user?.id,
          doctorId: null,
          remarks: `Status updated to ${statusLabels[newStatus]} at ${new Date().toLocaleString()}`,
        },
      };

      await queueService.update(patient.id, updateData);

      // Update local state immediately to reflect the change
      setLocalPatientOrder((prevOrder) => {
        const updatedOrder = prevOrder.map((p) =>
          p.id === patient.id ? { ...p, status: newStatus } : p
        );
        console.log(
          `🔄 [Counter Sidebar] Updated local state - Patient ${patient.patient.firstName} status: ${newStatus}`
        );
        return updatedOrder;
      });

      // Play appropriate sound based on status
      if (newStatus === "now_serving") {
        // Play announcement for now serving
        const queueNumber = patient.number.toString().padStart(3, "0");
        const patientName = `${patient.patient.firstName} ${patient.patient.lastName}`;
        playAnnouncement(queueNumber, patientName, "the counter");
      } else if (newStatus === "next") {
        // Play success chime for setting as next
        playSuccessChime();
      } else {
        // Play status update sound for other changes
        playStatusUpdateSound();
      }

      toast.success(`${patient.patient.firstName} is now ${statusLabels[newStatus]}!`, {
        id: "status-update",
        duration: 3000,
      });

      console.log(`✅ [Counter Sidebar] Updated ${patient.patient.firstName} to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update patient status:", error);
      toast.error("Failed to update status", {
        id: "status-update",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Test sound function
  const testSound = async () => {
    try {
      toast.loading("Testing audio...", { id: "sound-test" });
      await soundService.testAudio();
      toast.success("Audio test successful! 🔊", {
        id: "sound-test",
        duration: 2000,
      });
    } catch (error) {
      toast.error("Audio test failed. Please check your speakers.", {
        id: "sound-test",
        duration: 3000,
      });
    }
  };

  // ✅ waitingCount now includes "waiting" and "next" - use local order
  const waitingCount = localPatientOrder.filter(
    (p) => p.status === "waiting" || p.status === "next"
  ).length;

  const queueCount = localPatientOrder.filter(
    (p) => p.status === "waiting" || p.status === "next" || p.status === "now_serving"
  ).length;

  // Enhanced current patient logic with better selection priority - use local order
  const currentPatient: any = (() => {
    // First priority: explicitly selected patient by ID
    if (currentPatientId) {
      const selectedPatient = localPatientOrder.find((p) => p.id === currentPatientId);
      if (selectedPatient) return selectedPatient;
    }

    // Second priority: patient currently being served
    const servingPatient = localPatientOrder.find((p) => p.status === "now_serving");
    if (servingPatient) return servingPatient;

    // Third priority: next patient in line
    const nextPatient = localPatientOrder.find((p) => p.status === "next");
    if (nextPatient) return nextPatient;

    // Fourth priority: first waiting patient (use visual order from dragging)
    const waitingPatients = localPatientOrder.filter((p) => p.status === "waiting");

    return waitingPatients[0] || null;
  })();

  // Debug: Log currentPatient status changes
  useEffect(() => {
    if (currentPatient) {
      console.log(
        `🔄 [Counter Sidebar] Current patient status: ${currentPatient.status} - ${currentPatient.patient.firstName}`
      );
    }
  }, [currentPatient?.status, currentPatient?.id]);

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
    <div className="relative h-full">
      <aside className="w-72 bg-white border-gray-200 flex flex-col h-full">
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
          <div className="">
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xl font-bold text-blue-700">{waitingCount}</p>
              <p className="text-xs text-blue-600 font-medium">Waiting</p>
            </div>
          </div>
        </div>

        {/* Dynamic Patient Status Section */}
        {currentPatient && (
          <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {currentPatient.status === "now_serving"
                ? "Currently Serving"
                : currentPatient.status === "next"
                ? "Next Patient"
                : "Selected Patient"}
            </h3>
            <div
              className={`p-3 rounded-lg border relative ${
                currentPatient.status === "now_serving"
                  ? "bg-green-50 border-green-200"
                  : currentPatient.status === "next"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Dynamic Status Initials */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold relative ${
                    currentPatient.status === "now_serving"
                      ? "bg-green-500"
                      : currentPatient.status === "next"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                >
                  {`${currentPatient.patient.firstName?.[0] || ""}${
                    currentPatient.patient.lastName?.[0] || ""
                  }`}
                  {/* Real-time indicator - only for serving */}
                  {currentPatient.status === "now_serving" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse">
                      <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>

                {/* Name + Queue Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {`${currentPatient.patient.firstName} ${
                      currentPatient.patient.middleName ?? ""
                    } ${currentPatient.patient.lastName}`}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-600">Queue #{currentPatient.number}</p>
                    {currentPatient.status === "now_serving" && (
                      <span className="bg-green-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
                        Serving
                      </span>
                    )}
                    {currentPatient.status === "next" && (
                      <span className="bg-blue-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        Next
                      </span>
                    )}
                    {currentPatient.status === "waiting" && (
                      <span className="bg-yellow-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        Waiting
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Movement indicator */}
              {currentPatient.metadata?.movedAt && (
                <div className="mt-2 text-[10px] text-green-600 bg-green-100 px-2 py-1 rounded">
                  Recently moved to this counter
                </div>
              )}

              {/* Status Update Buttons */}
              <div
                className={`mt-3 pt-2 border-t ${
                  currentPatient.status === "now_serving"
                    ? "border-green-200"
                    : currentPatient.status === "next"
                    ? "border-orange-200"
                    : "border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Update Status:</span>
                  {updatingStatus && (
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Dynamic button layout based on current status */}
                {currentPatient.status === "waiting" ? (
                  // Waiting status - show prominent Serve button and smaller Next button
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "now_serving")}
                      disabled={updatingStatus}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 h-8"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Serve Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "next")}
                      disabled={updatingStatus}
                      className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 text-xs py-1 px-2 h-7"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Set as Next
                    </Button>
                  </div>
                ) : currentPatient.status === "next" ? (
                  // Next status - show Serve and Back to Waiting
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "now_serving")}
                      disabled={updatingStatus}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 h-7"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Serve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "waiting")}
                      disabled={updatingStatus}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs py-1 px-2 h-7"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Wait
                    </Button>
                  </div>
                ) : (
                  // Now serving status - show Next and Back to Waiting
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "next")}
                      disabled={updatingStatus}
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 text-xs py-1 px-2 h-7"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePatientStatus(currentPatient, "waiting")}
                      disabled={updatingStatus}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs py-1 px-2 h-7"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Wait
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Queue Controls */}
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Queue Controls</h3>
          <div className="space-y-2">
            {/* Serve Next Button - Full Width */}
            <div className="w-full">
              <button
                onClick={() => {
                  if (onOpenMoveModal) {
                    onOpenMoveModal();
                  } else {
                    onServeNext(currentPatient);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-colors"
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
                <span>Serve Next</span>
              </button>
            </div>

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

            {/* Add Patient Queue Button */}
            <div className="mt-2">
              <button
                onClick={onAddPatientQueue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm transition-colors font-medium"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Patient Queue</span>
              </button>
            </div>

            {/* Sound Test Button */}
            <div className="mt-2">
              <button
                onClick={testSound}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm transition-colors font-medium"
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
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728m-9.9-2.828a5 5 0 010-7.072M4.336 4.336a9 9 0 000 12.728"
                  />
                </svg>
                <span>Test Sound 🔊</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Queue List */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Patient Queue ({queueCount})</h3>
              <span className="text-[10px] text-gray-500">Drag to reorder (visual only)</span>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 px-3 py-2 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <DraggablePatientQueue
              patients={localPatientOrder as any[]}
              onPatientsReorder={handleLocalPatientsReorder}
              currentPatientId={currentPatientId}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};
