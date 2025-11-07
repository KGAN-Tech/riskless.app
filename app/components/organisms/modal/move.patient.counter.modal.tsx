import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { X, ArrowRight, Loader2, CheckCircle, Building } from "lucide-react";
import { counterService } from "~/app/services/counter.service";
import { queueService } from "~/app/services/queue.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { SOCKET_URL } from "~/app/configuration/socket.config";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string;
}

interface CurrentPatient {
  id: string;
  number: string;
  status: string;
  patient: PatientDetails;
  patientId?: string;
  userId?: string;
  facilityId?: string;
  user?: {
    id: string;
    userName?: string;
  };
  encounter?: {
    id: string;
  };
  counter?: {
    id: string;
    name: string;
  };
}

interface Counter {
  id: string;
  name: string;
  type: string[];
  category: string;
  code: string;
  status: string;
  isVisible: boolean;
  order: number;
}

interface MovePatientCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPatient: CurrentPatient | null;
  currentCounterId: string;
  onPatientMoved?: (movedData: any) => void;
  patients?: any[]; // Add patients array to get next patient
}

export default function MovePatientCounterModal({
  isOpen,
  onClose,
  currentPatient,
  currentCounterId,
  onPatientMoved,
  patients = [],
}: MovePatientCounterModalProps) {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("waiting");
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const getUserData = getUserFromLocalStorage();

  // Get the next patient to be served (lowest queue number that's waiting)
  const getNextPatient = () => {
    const waitingPatients = patients.filter((p) => p.status === "waiting" || p.status === "next");

    // Sort by queue number (convert to number for proper sorting)
    const sortedPatients = waitingPatients.sort((a, b) => {
      const numA = parseInt(a.number) || 0;
      const numB = parseInt(b.number) || 0;
      return numA - numB;
    });

    return sortedPatients[0] || currentPatient;
  };

  const patientToMove = getNextPatient();

  // Status options for the patient (using QueueStatus enum values)
  const statusOptions = [
    { value: "waiting", label: "Waiting", description: "Patient will wait in queue" },
    { value: "next", label: "Next", description: "Patient will be next in line" },
    { value: "now_serving", label: "Now Serving", description: "Start serving immediately" },
    { value: "done", label: "Done", description: "Mark as completed" },
    { value: "skipped", label: "Skipped", description: "Skip this patient" },
  ];

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Socket event listeners for queue updates and movement confirmation
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdated = (updatedQueue: any) => {
      const queueData = updatedQueue.data || updatedQueue;

      console.log("🔄 [Move Modal] Queue Updated:", queueData);

      // If this is the patient we're moving and the move is complete
      if (queueData.id === patientToMove?.id && queueData.counterId === selectedCounter?.id) {
        console.log("✅ [Move Modal] Patient move confirmed via socket");

        // Call the callback to update parent components
        if (onPatientMoved && !moving && selectedCounter) {
          onPatientMoved({
            ...queueData,
            fromCounterId: currentCounterId,
            toCounterId: selectedCounter.id,
            targetCounter: selectedCounter,
          });
        }
      }
    };

    const handleQueueCreated = (newQueue: any) => {
      const queueData = newQueue.data || newQueue;

      console.log("🆕 [Move Modal] Queue Created:", queueData);

      // If this is for the target counter and matches our patient
      if (
        queueData.counterId === selectedCounter?.id &&
        (queueData.metadata?.patientId === patientToMove?.metadata?.patientId ||
          queueData.patient?.id === patientToMove?.patient?.id)
      ) {
        console.log("✅ [Move Modal] New queue created for moved patient");

        if (onPatientMoved && !moving && selectedCounter) {
          onPatientMoved({
            ...queueData,
            fromCounterId: currentCounterId,
            toCounterId: selectedCounter.id,
            targetCounter: selectedCounter,
          });
        }
      }
    };

    const handlePatientMoved = (moveData: any) => {
      const data = moveData.data || moveData;

      console.log("🚶 [Move Modal] Patient Moved Event:", data);

      // Check if this is our patient being moved
      if (
        data.queueId === patientToMove?.id ||
        data.patientId === patientToMove?.metadata?.patientId ||
        data.patient?.id === patientToMove?.patient?.id
      ) {
        console.log("✅ [Move Modal] Patient movement confirmed");

        if (onPatientMoved && !moving) {
          onPatientMoved({
            ...data,
            fromCounterId: currentCounterId,
            toCounterId: selectedCounter?.id,
            targetCounter: selectedCounter,
          });
        }
      }
    };

    const handlePatientTransferred = (transferData: any) => {
      const data = transferData.data || transferData;

      console.log("↔️ [Move Modal] Patient Transferred Event:", data);

      // Check if this involves our patient
      if (
        data.queueId === patientToMove?.id ||
        data.sourceCounterId === currentCounterId ||
        data.targetCounterId === selectedCounter?.id
      ) {
        console.log("✅ [Move Modal] Patient transfer confirmed");

        if (onPatientMoved && !moving) {
          onPatientMoved({
            ...data,
            fromCounterId: currentCounterId,
            toCounterId: selectedCounter?.id,
            targetCounter: selectedCounter,
          });
        }
      }
    };

    // Listen to queue events
    socket.on("queue:updated", handleQueueUpdated);
    socket.on("queue:created", handleQueueCreated);

    // Listen to patient movement specific events
    socket.on("patient:moved", handlePatientMoved);
    socket.on("patient:transferred", handlePatientTransferred);
    socket.on("queue:moved", handleQueueUpdated);
    socket.on("queue:transferred", handleQueueUpdated);

    // Listen to facility-specific events if we have facility ID
    if (getUserData?.user?.facilityId) {
      const facilityId = getUserData.user.facilityId;
      socket.on(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
      socket.on(`facility:${facilityId}:queue:created`, handleQueueCreated);
      socket.on(`facility:${facilityId}:patient:moved`, handlePatientMoved);
      socket.on(`facility:${facilityId}:patient:transferred`, handlePatientTransferred);
      socket.on(`facility:${facilityId}:queue:moved`, handleQueueUpdated);
      socket.on(`facility:${facilityId}:queue:transferred`, handleQueueUpdated);
    }

    return () => {
      socket.off("queue:updated", handleQueueUpdated);
      socket.off("queue:created", handleQueueCreated);
      socket.off("patient:moved", handlePatientMoved);
      socket.off("patient:transferred", handlePatientTransferred);
      socket.off("queue:moved", handleQueueUpdated);
      socket.off("queue:transferred", handleQueueUpdated);

      if (getUserData?.user?.facilityId) {
        const facilityId = getUserData.user.facilityId;
        socket.off(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
        socket.off(`facility:${facilityId}:queue:created`, handleQueueCreated);
        socket.off(`facility:${facilityId}:patient:moved`, handlePatientMoved);
        socket.off(`facility:${facilityId}:patient:transferred`, handlePatientTransferred);
        socket.off(`facility:${facilityId}:queue:moved`, handleQueueUpdated);
        socket.off(`facility:${facilityId}:queue:transferred`, handleQueueUpdated);
      }
    };
  }, [
    socket,
    selectedCounter?.id,
    onPatientMoved,
    moving,
    getUserData?.user?.facilityId,
    patientToMove?.id,
    currentCounterId,
  ]);

  // Fetch available counters on modal open
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, patient to move:", patientToMove);
      console.log("Current counter ID:", currentCounterId);
      console.log("User data:", getUserData);
      fetchCounters();
    }
  }, [isOpen, patientToMove]);

  const fetchCounters = async () => {
    try {
      setLoading(true);

      // Add authentication check
      if (!getUserData?.user?.facilityId) {
        throw new Error("No facility ID found for current user");
      }

      const response = await counterService.getAll({
        facilityId: getUserData.user.facilityId,
        status: "active",
        limit: 100, // Get more counters
      });

      console.log("Counter API response:", response);

      const allCounters = response.data || response || [];

      // Filter out the current counter and only show active, visible counters
      const availableCounters = allCounters.filter(
        (counter: Counter) =>
          counter.id !== currentCounterId && counter.status === "active" && counter.isVisible
      );

      // Sort by order
      availableCounters.sort((a: Counter, b: Counter) => a.order - b.order);

      console.log("Available counters:", availableCounters);
      setCounters(availableCounters);
    } catch (error) {
      console.error("Failed to fetch counters:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to load available counters: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMovePatient = async () => {
    if (!selectedCounter || !patientToMove) {
      toast.error("Please select a counter to move the patient to");
      return;
    }

    console.log("🚀 Starting patient move process...");
    console.log("Patient to move:", patientToMove);
    console.log("Selected counter:", selectedCounter);
    console.log("Selected status:", selectedStatus);

    try {
      setMoving(true);

      // Show immediate feedback
      const patientName = `${patientToMove.patient.firstName} ${patientToMove.patient.lastName}`;
      toast.loading(`Moving ${patientName} to ${selectedCounter.name}...`, {
        id: "patient-move",
        duration: 3000,
      });

      // Get current counter name for remarks
      const currentCounterName = patientToMove.counter?.name || `Counter ${currentCounterId}`;

      // Update the existing queue's counter and status
      const updateData = {
        counterId: selectedCounter.id,
        status: selectedStatus,
        process: "default",
        // Replace metadata entirely with proper structure for QueueMetadata type
        metadata: {
          patientId: patientToMove.metadata?.patientId || patientToMove.user?.id || null,
          doctorId: patientToMove.metadata?.doctorId || null,
          remarks: `Moved from ${currentCounterName} to ${
            selectedCounter.name
          } at ${new Date().toLocaleString()} by ${getUserData?.user?.userName || "User"}`,
        },
      };

      console.log("📤 Updating existing queue with data:", updateData);

      const updatedQueue = await queueService.update(patientToMove.id, updateData);
      console.log("✅ Queue updated successfully:", updatedQueue);

      // Success notification
      toast.success(
        `Patient ${patientName} moved to ${selectedCounter.name} with status: ${selectedStatus}`,
        {
          id: "patient-move",
          duration: 4000,
        }
      );

      // Broadcast patient movement to all counter views
      // Note: We're using direct socket.emit which will be relayed by the server to all connected clients
      if (socket) {
        const movementData = {
          action: "patient_moved",
          queueId: patientToMove.id,
          fromCounterId: currentCounterId,
          toCounterId: selectedCounter.id,
          patientName,
          facilityId: getUserData?.user?.facilityId,
          movedAt: new Date().toISOString(),
          movedBy: getUserData?.user?.id,
        };

        console.log("📡 Broadcasting patient movement to all counter views:", movementData);

        // Emit events that will be broadcast to all clients
        socket.emit("patient:movement:broadcast", movementData);

        // Also emit facility-specific event for better targeting
        if (getUserData?.user?.facilityId) {
          socket.emit(
            `facility:${getUserData.user.facilityId}:patient:movement:broadcast`,
            movementData
          );
        }
      }

      // Additional fallback: Use localStorage to communicate between tabs/windows
      try {
        const broadcastData = {
          type: "PATIENT_MOVED",
          fromCounterId: currentCounterId,
          toCounterId: selectedCounter.id,
          patientName,
          timestamp: Date.now(),
        };
        localStorage.setItem("patient_movement_broadcast", JSON.stringify(broadcastData));
        // Remove after a short time to prevent stale data
        setTimeout(() => {
          localStorage.removeItem("patient_movement_broadcast");
        }, 2000);
      } catch (error) {
        console.warn("Failed to broadcast via localStorage:", error);
      }

      // Immediate callback to update parent state
      if (onPatientMoved) {
        const moveResult = {
          ...(updatedQueue.data || updatedQueue),
          fromCounterId: currentCounterId,
          toCounterId: selectedCounter.id,
          targetCounter: selectedCounter,
          sourceCounter: { id: currentCounterId },
          patientName,
          movedAt: new Date().toISOString(),
          // Flag to indicate this was a successful move operation
          moveCompleted: true,
        };

        console.log("📞 Calling onPatientMoved callback with:", moveResult);
        onPatientMoved(moveResult);
      }

      // Close modal after successful move
      setTimeout(() => {
        handleClose();
      }, 500); // Small delay to let user see the success message
    } catch (error) {
      console.error("❌ Failed to move patient:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Error notification
      toast.error(`Failed to move patient: ${errorMessage}`, {
        id: "patient-move",
        duration: 5000,
      });
    } finally {
      setMoving(false);
    }
  };
  const handleClose = () => {
    setSelectedCounter(null);
    onClose();
  };

  const formatPatientName = (patient: PatientDetails) => {
    return `${patient.firstName} ${patient.middleName || ""} ${patient.lastName}`.trim();
  };

  const getCounterTypeDisplay = (types: string[]) => {
    return types.map((type) => type.replace("_", " ").toUpperCase()).join(", ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Move Patient to Another Counter
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 overflow-y-auto min-h-0 pr-2">
          {/* Patient to Move Info */}
          {patientToMove && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex-shrink-0">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Patient to Move:
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {`${patientToMove.patient.firstName?.[0] || ""}${
                    patientToMove.patient.lastName?.[0] || ""
                  }`}
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {formatPatientName(patientToMove.patient)}
                  </p>
                  <p className="text-sm text-blue-700">
                    Queue #{patientToMove.number} • Status: {patientToMove.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Selection */}
          <div className="flex-shrink-0">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Status for New Queue
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((option) => {
                const isSelected = selectedStatus === option.value;
                return (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Counters */}
          <div className="flex-1 min-h-0">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Target Counter ({counters.length} available)
            </Label>

            <div className="border rounded-lg overflow-hidden h-64 flex-shrink-0">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading counters...</span>
                </div>
              ) : counters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Building className="h-8 w-8 mb-2" />
                  <p className="text-center">
                    No available counters found
                    <br />
                    <span className="text-sm">
                      All other counters may be inactive or unavailable
                    </span>
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto h-full">
                  {counters.map((counter) => {
                    const isSelected = selectedCounter?.id === counter.id;

                    return (
                      <div
                        key={counter.id}
                        className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                          isSelected ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedCounter(counter)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  isSelected ? "bg-green-600" : "bg-gray-300"
                                }`}
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 flex items-center">
                                  {counter.name}
                                  {isSelected && (
                                    <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                                  )}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {counter.code}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {getCounterTypeDisplay(counter.type)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {isSelected && <ArrowRight className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Counter Info */}
          {selectedCounter && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex-shrink-0">
              <h4 className="font-medium text-green-900 mb-1 flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Moving to:
              </h4>
              <p className="text-green-800 font-medium">{selectedCounter.name}</p>
              <p className="text-green-700 text-sm">
                {selectedCounter.code} • {getCounterTypeDisplay(selectedCounter.type)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end space-x-3 pt-4 border-t flex-shrink-0 bg-white">
          <Button variant="outline" onClick={handleClose} disabled={moving}>
            Cancel
          </Button>
          <Button
            onClick={handleMovePatient}
            disabled={!selectedCounter || moving || !patientToMove}
            className="bg-green-600 hover:bg-green-700"
          >
            {moving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Moving Patient...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Move Patient ({selectedStatus})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
