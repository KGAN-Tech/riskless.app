import { useState, useEffect } from "react";
import QueueDisplay from "./queue.display";
import { Button } from "@/components/atoms/button";
import { Maximize, Minimize } from "lucide-react";
import { io } from "socket.io-client";
import { counterService } from "~/app/services/counter.service";
import { queueService } from "~/app/services/queue.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { SOCKET_URL } from "~/app/configuration/socket.config";
import { playAnnouncement } from "~/app/utils/sound.helper";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string;
  userName?: string;
}

interface WaitingPatient {
  id: string;
  number: string;
  status: "waiting" | "next" | "now_serving";
  patient: PatientDetails;
}

interface Counter {
  id: string;
  title: string;
  counterNumber: string;
  currentNumber: number | null;
  waitingCount: number;
  isVisible: boolean;
  isActive: boolean;
  lastCalled?: number | null;
  nextPatient?: number | null;
  isProcessing?: boolean;
  processingStartTime?: number;
  estimatedProcessingTime?: number;
  stepOrder: number;
  currentPatient?: PatientDetails | null;
  waitingPatients?: WaitingPatient[];
}

export default function QueueStandalonePage() {
  const getUserData = getUserFromLocalStorage();
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [previousServingPatients, setPreviousServingPatients] = useState<
    Record<string, string | null>
  >({});

  // Play queue announcement sound using the new sound system
  const playQueueSound = (queueNumber: string, patientName: string, counterName?: string) => {
    try {
      playAnnouncement(queueNumber, patientName, counterName);
      console.log(`🔊 [Queue Sound] Playing announcement for #${queueNumber} - ${patientName}`);
    } catch (error) {
      console.error("Error playing queue sound:", error);
    }
  };

  // Fetch counters and queues from backend
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch counters and all queues separately for better data control
      const [counterRes, queueRes] = await Promise.all([
        counterService.getAll({
          facilityId: getUserData?.user?.facilityId,
        }),
        queueService.getAll({
          facilityId: getUserData?.user?.facilityId,
          include: "patient,counter",
        }),
      ]);

      console.log("🔍 [Queue Standalone] Fetched counters:", counterRes.data);
      console.log("🔍 [Queue Standalone] Fetched queues:", queueRes.data);

      // Group queues by counter ID
      const queuesByCounter: Record<string, any[]> = {};
      if (queueRes.data && Array.isArray(queueRes.data)) {
        queueRes.data.forEach((queue: any) => {
          const counterId = queue.counterId;
          if (!queuesByCounter[counterId]) {
            queuesByCounter[counterId] = [];
          }
          queuesByCounter[counterId].push(queue);
        });
      }

      // Map API response to Counter interface
      const mappedCounters: Counter[] = counterRes.data.map((c: any) => {
        const counterQueues = queuesByCounter[c.id] || [];

        // Sort all queues by queue number to find who should be served first
        const sortedQueues = counterQueues
          .filter(
            (q: any) => q.status === "waiting" || q.status === "next" || q.status === "now_serving"
          )
          .sort((a: any, b: any) => parseInt(a.queueNumber) - parseInt(b.queueNumber));

        // Separate queues by status for proper handling
        const currentServingQueue = sortedQueues.find((q: any) => q.status === "now_serving");
        const nextQueue = sortedQueues.find((q: any) => q.status === "next");
        const waitingQueues = sortedQueues.filter((q: any) => q.status === "waiting");

        // Create waiting patients list that includes both "waiting" and "next" status
        // but excludes currently serving patient
        const waitingAndNextQueues = sortedQueues.filter(
          (q: any) => q.status === "waiting" || q.status === "next"
        );

        const waitingCount = waitingAndNextQueues.length;

        // Map waiting patients with their details and status
        const waitingPatients: WaitingPatient[] = waitingAndNextQueues.map((q: any) => ({
          id: q.id,
          number: q.queueNumber,
          status: q.status, // Add status to track next vs waiting
          patient: {
            id: q.patient?.id || "",
            firstName: q.patient?.firstName || "Patient",
            lastName: q.patient?.lastName || `#${q.queueNumber}`,
            middleName: q.patient?.middleName || "",
            sex: q.patient?.sex,
            birthDate: q.patient?.birthDate,
            userName: q.patient?.userName,
          },
        }));

        // Use the actual status-based queues we found above
        const currentNumber = currentServingQueue
          ? parseInt(currentServingQueue.queueNumber)
          : null;

        // Next patient is the one with "next" status
        const nextPatient = nextQueue ? parseInt(nextQueue.queueNumber) : null;

        // Extract current patient details if someone is being served
        const currentPatient = currentServingQueue?.patient
          ? {
              id: currentServingQueue.patient.id,
              firstName: currentServingQueue.patient.firstName || "Patient",
              lastName:
                currentServingQueue.patient.lastName || `#${currentServingQueue.queueNumber}`,
              middleName: currentServingQueue.patient.middleName || "",
              sex: currentServingQueue.patient.sex,
              birthDate: currentServingQueue.patient.birthDate,
              userName: currentServingQueue.patient.userName,
            }
          : null;

        console.log(`🏥 [Counter ${c.code}] Status: ${c.status}, Visible: ${c.isVisible}`);
        console.log(
          `🏥 [Counter ${c.code}] All queues:`,
          counterQueues.map((q) => `#${q.queueNumber} (${q.status})`)
        );
        console.log(
          `🏥 [Counter ${c.code}] Waiting: ${waitingCount}, Current: ${currentNumber}, Next: ${nextPatient}`
        );
        console.log(
          `📋 [Counter ${c.code}] Waiting patients:`,
          waitingPatients.map(
            (wp) => `#${wp.number} (${wp.status}) ${wp.patient.firstName} ${wp.patient.lastName}`
          )
        );

        return {
          id: c.id,
          title: c.name,
          counterNumber: c.code,
          currentNumber: currentNumber,
          waitingCount: waitingCount,
          isVisible: c.isVisible,
          isActive: c.status === "active",
          lastCalled: currentNumber, // Use current number as last called for now
          nextPatient: nextPatient,
          isProcessing: !!currentNumber,
          processingStartTime: currentServingQueue ? Date.now() : undefined,
          estimatedProcessingTime: null,
          stepOrder: c.order ?? 0,
          currentPatient: currentPatient,
          waitingPatients: waitingPatients,
        };
      });

      // Check for changes in serving patients and play sound
      mappedCounters.forEach((counter) => {
        const currentServingKey = `${counter.id}-${counter.currentNumber}`;
        const previousServingKey = previousServingPatients[counter.id];

        // If there's a new patient being served (and it's different from previous)
        if (
          counter.currentPatient &&
          counter.currentNumber &&
          currentServingKey !== previousServingKey
        ) {
          const queueNumber = String(counter.currentNumber).padStart(3, "0");
          const patientName = `${counter.currentPatient.firstName} ${counter.currentPatient.lastName}`;

          console.log(
            `🔔 [Queue Change] Counter ${counter.counterNumber}: New patient serving #${queueNumber} - ${patientName}`
          );

          // Only play sound if this is not the initial load (previousServingKey exists)
          if (previousServingKey !== undefined) {
            setTimeout(() => {
              playQueueSound(queueNumber, patientName, counter.title);
            }, 500); // Small delay to ensure UI updates first
          }
        }
      });

      // Update the previous serving patients tracking
      const newPreviousServing: Record<string, string | null> = {};
      mappedCounters.forEach((counter) => {
        newPreviousServing[counter.id] = counter.currentNumber
          ? `${counter.id}-${counter.currentNumber}`
          : null;
      });
      setPreviousServingPatients(newPreviousServing);

      setCounters(mappedCounters);
    } catch (error) {
      console.error("Failed to fetch counters or queues", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Socket event listeners for real-time queue updates
  useEffect(() => {
    if (!socket) return;

    // Universal handler that triggers immediate refresh
    const handleAnyQueueChange = (eventData: any, eventType: string) => {
      console.log(`� [Queue Standalone] ${eventType}:`, eventData);
      console.log("🚀 [Queue Standalone] Triggering immediate refresh...");
      fetchData();
    };

    const handleQueueCreated = (newQueue: any) => handleAnyQueueChange(newQueue, "Queue Created");
    const handleQueueUpdated = (updatedQueue: any) =>
      handleAnyQueueChange(updatedQueue, "Queue Updated");
    const handleQueueDeleted = (deletedQueue: any) =>
      handleAnyQueueChange(deletedQueue, "Queue Deleted");
    const handleQueueReordered = (reorderData: any) =>
      handleAnyQueueChange(reorderData, "Queue Reordered");
    const handlePatientServed = (servedData: any) =>
      handleAnyQueueChange(servedData, "Patient Served");
    const handlePatientSkipped = (skippedData: any) =>
      handleAnyQueueChange(skippedData, "Patient Skipped");
    const handlePatientRecalled = (recallData: any) =>
      handleAnyQueueChange(recallData, "Patient Recalled");

    // Listen to ALL possible queue-related events
    const eventTypes = [
      "queue:created",
      "queue:updated",
      "queue:deleted",
      "queue:reordered",
      "queue:served",
      "queue:skipped",
      "patient:served",
      "patient:skipped",
      "patient:recalled",
      "patient:next",
      "patient:called",
      "counter:updated",
      "queue:position:changed",
      "queue:order:changed",
    ];

    // Add listeners for all event types
    eventTypes.forEach((eventType) => {
      socket.on(eventType, (data: any) => handleAnyQueueChange(data, eventType));
    });

    // Listen to facility-specific events
    if (getUserData?.user?.facilityId) {
      const facilityId = getUserData.user.facilityId;
      eventTypes.forEach((eventType) => {
        socket.on(`facility:${facilityId}:${eventType}`, (data: any) =>
          handleAnyQueueChange(data, `facility:${eventType}`)
        );
      });

      // Also listen for counter-specific events for the current facility
      socket.on(`facility:${facilityId}:counter:queue:updated`, (data: any) =>
        handleAnyQueueChange(data, "counter:queue:updated")
      );
    }

    // Catch-all listener for debugging
    socket.onAny((eventName: string, ...args: any[]) => {
      if (
        eventName.includes("queue") ||
        eventName.includes("patient") ||
        eventName.includes("counter")
      ) {
        console.log(`🎯 [Socket Event] ${eventName}:`, args);
        // Trigger refresh for any queue-related event
        handleAnyQueueChange(args[0], eventName);
      }
    });

    return () => {
      // Remove all event listeners
      eventTypes.forEach((eventType) => {
        socket.off(eventType);
      });

      if (getUserData?.user?.facilityId) {
        const facilityId = getUserData.user.facilityId;
        eventTypes.forEach((eventType) => {
          socket.off(`facility:${facilityId}:${eventType}`);
        });
        socket.off(`facility:${facilityId}:counter:queue:updated`);
      }

      // Remove catch-all listener
      socket.offAny();
    };
  }, [socket, getUserData?.user?.facilityId]);

  useEffect(() => {
    fetchData();

    // More frequent polling as backup for real-time updates - every 3 seconds
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen logic (same as your original code)
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Error entering fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Error exiting fullscreen:", err);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const [showButton, setShowButton] = useState(true);
  useEffect(() => {
    if (isFullscreen) {
      const timer = setTimeout(() => setShowButton(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowButton(true);
    }
  }, [isFullscreen]);

  return (
    <div className="h-screen w-full relative bg-background overflow-hidden">
      <QueueDisplay counters={counters} isFullscreen={true} />

      {showButton && (
        <div
          className="absolute top-4 right-4 z-50 transition-opacity duration-300 space-x-2 flex"
          onMouseEnter={() => setShowButton(true)}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="bg-background/90 backdrop-blur-sm"
            disabled={loading}
            title="Refresh Data"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356-2A8.001 8.001 0 004.582 12m0 0a8.003 8.003 0 0015.356-2M12 4.5v7l2.5 2.5"
                />
              </svg>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-background/90 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {isFullscreen && !showButton && (
        <div className="absolute inset-0 z-40" onMouseMove={() => setShowButton(true)} />
      )}
    </div>
  );
}
