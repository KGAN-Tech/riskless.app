import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ClipboardList, File, FileText, FlaskConical, Heart, Pill, User } from "lucide-react";
import { useEffect, useState } from "react";
import { MdNumbers } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { toast } from "sonner";
import AddPatientQueueModal from "~/app/components/organisms/modal/add.patient.queue.modal";
import MovePatientCounterModal from "~/app/components/organisms/modal/move.patient.counter.modal";
import { CounterSidebar } from "~/app/components/templates/sidebar/counter.sidebar";
import { SOCKET_URL } from "~/app/configuration/socket.config";
import { counterService } from "~/app/services/counter.service";
import { queueService } from "~/app/services/queue.service";
import { queuingService } from "~/app/services/queuing.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import PatientRecord from "../patients/patient.records";
import { useEncounter } from "~/app/hooks/use.encounter";

console.log("Socket URL:", SOCKET_URL);

// Enums based on your Prisma schema
enum CounterStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

enum CounterType {
  INTERVIEW = "hs_interview",
  VITALS = "hs_vitals",
  HEALTH_SCREENING = "health_screening",
  CONSULTATION = "consultation",
  PHARMACY = "pharmacy",
}

enum CounterCategory {
  HEALTH_SCREENING = "health_screening",
  CONSULTATION = "consultation",
  PHARMACY = "pharmacy",
}

interface Counter {
  id: string;
  facilityId: string;
  userId: string;
  order: number;
  status: CounterStatus;
  isVisible: boolean;
  name: string;
  type: string[];
  category: CounterCategory;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  Queuing: any[];
}

function getNextCounter(counters: any[], currentCounterId: string) {
  // Sort counters by order to ensure proper sequence
  const sortedCounters = [...counters].sort((a, b) => a.order - b.order);

  // Find the current counter
  const currentIndex = sortedCounters.findIndex((counter) => counter.id === currentCounterId);

  // If current counter not found or it's the last one, return null
  if (currentIndex === -1 || currentIndex === sortedCounters.length - 1) {
    return null;
  }

  // Return the next counter in the sequence
  return sortedCounters[currentIndex + 1];
}

export default function CounterViewPage() {
  const { counterId, userId } = useParams<{
    counterId: string;
    userId: string;
  }>();
  const navigate = useNavigate();
  // Removed useToast - now using Sonner toast

  const [counters, setCounters] = useState<Counter[]>([]);
  const [counter, setCounter] = useState<Counter | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [queues, setQueues] = useState<any[]>([]);
  const [currentQueue, setCurrentQueue] = useState<any>(null);
  const [patientRecordKey, setPatientRecordKey] = useState<number>(0);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showMovePatientModal, setShowMovePatientModal] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const {
    activePage,
    selectedView,
    setSelectedView,
    handleSelectPage,
    member,
    memberLoading,
    encounters,
    encountersLoading,
    selectedEncounter,
    encounterLoading,
    getUserData,
    memberError,
    encountersError,
    encounterError,
  } = useEncounter(currentQueue?.user?.id as string, currentQueue?.patient as any);

  const views = [
    {
      id: "Summary",
      icon: <FileText size={16} />,
      page: "Encounter",
      views: ["Encounter"],
    },
    {
      id: "Interview",
      icon: <User size={16} />,
      page: "Encounter",
      views: ["health_screening", "hs_interview", "hs_vitals"],
    },
    {
      id: "Vitals",
      icon: <Heart size={16} />,
      page: "Encounter",
      views: ["health_screening", "hs_interview", "hs_vitals"],
    },
    {
      id: "Consultation",
      page: "Encounter",
      icon: <ClipboardList size={16} />,
      views: ["consultation"],
    },
    {
      id: "Laboratory",
      icon: <FlaskConical size={16} />,
      page: "Encounter",
      views: ["Encounter"],
    },
    {
      id: "Prescription",
      icon: <Pill size={16} />,
      page: "Encounter",
      views: ["Encounter"],
    },
    {
      id: "Documents",
      icon: <File size={16} />,
      page: "Encounter",
      views: ["Encounter"],
    },
    {
      id: "Queue",
      icon: <MdNumbers size={16} />,
      page: "Encounter",
      views: ["Encounter"],
    },
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

  // Helper function to refresh queues for this counter
  const refreshQueues = async () => {
    if (!counterId) return;

    try {
      console.log("🔄 Refreshing queues for counter:", counterId);

      const res: any = await queueService.getAll({
        counterId,
        facilityId: getUserData?.user?.facilityId,
        status: undefined,
        order: "asc",
      });

      const mappedQueues =
        res.data?.map((queue: any) => {
          let patientDetails = {
            id: queue.metadata?.patientId || "",
            firstName: "Patient",
            lastName: `#${queue.queueNumber}`,
            middleName: "",
            birthDate: "",
            sex: null,
            userName: null,
            contacts: [],
            images: [],
          };

          if (queue.patient) {
            patientDetails = {
              id: queue.patient.id,
              firstName: queue.patient.firstName || "Patient",
              lastName: queue.patient.lastName || `#${queue.queueNumber}`,
              middleName: queue.patient.middleName || "",
              birthDate: queue.patient.birthDate || "",
              sex: queue.patient.sex || null,
              userName: queue.patient.userName || null,
              contacts: queue.patient.contacts || [],
              images: queue.patient.images || [],
            };
          }

          return {
            id: queue.id,
            number: queue.queueNumber,
            status: queue.status,
            tags: [],
            date: queue.date,
            position: null,
            patient: patientDetails,
            counter: queue.counter,
            encounter: null,
            user: {
              id: queue.metadata?.patientId || "",
            },
            queueType: queue.queueType,
            timestamp: queue.timestamp,
            metadata: queue.metadata,
          };
        }) || [];

      console.log("✅ Refreshed queues:", mappedQueues);
      setQueues(mappedQueues);

      // Update current queue
      let currentlyServing = mappedQueues.find((q: any) => q.status === "now_serving");
      if (!currentlyServing) {
        currentlyServing = mappedQueues.find(
          (q: any) => q.status === "waiting" || q.status === "next"
        );
      }

      setCurrentQueue(currentlyServing || null);
      if (currentlyServing) {
        setPatientRecordKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Failed to refresh queues:", error);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const mapQueueData = (queueData: any) => {
      return {
        id: queueData.id,
        number: queueData.queueNumber,
        status: queueData.status,
        tags: [],
        date: queueData.date,
        position: null,
        patient: queueData.patient
          ? {
              id: queueData.patient.id,
              firstName: queueData.patient.firstName || "Patient",
              lastName: queueData.patient.lastName || `#${queueData.queueNumber}`,
              middleName: queueData.patient.middleName || "",
              birthDate: queueData.patient.birthDate || "",
              sex: queueData.patient.sex || null,
              userName: queueData.patient.userName || null,
              contacts: queueData.patient.contacts || [],
              images: queueData.patient.images || [],
            }
          : {
              id: queueData.metadata?.patientId || "",
              firstName: "Patient",
              lastName: `#${queueData.queueNumber}`,
              middleName: "",
              birthDate: "",
              sex: null,
              userName: null,
              contacts: [],
              images: [],
            },
        counter: queueData.counter,
        encounter: null,
        user: {
          id: queueData.metadata?.patientId || "",
        },
        queueType: queueData.queueType,
        timestamp: queueData.timestamp,
        metadata: queueData.metadata,
      };
    };

    const handleQueueCreated = (newQueue: any) => {
      const queueData = newQueue.data || newQueue;
      console.log("🆕 Queue Created Event:", queueData);

      // Only add if the queue is for the current counter
      if (queueData.counterId === counterId) {
        const mappedNewQueue = mapQueueData(queueData);

        // Check if queue already exists to prevent duplicates
        setQueues((prev) => {
          const existingQueue = prev.find((q) => q.id === mappedNewQueue.id);
          if (existingQueue) {
            console.log("Queue already exists, skipping duplicate");
            return prev;
          }

          const updatedQueues = [...prev, mappedNewQueue];
          console.log("Added new queue to current counter");

          // If no current patient is set, automatically set this new patient as current
          if (!currentQueue) {
            setCurrentQueue(mappedNewQueue);
            setPatientRecordKey((prev) => prev + 1);
            console.log("Set new patient as current");
          }

          return updatedQueues;
        });

        // Show notification for new patient
        const patientName = queueData.patient
          ? `${queueData.patient.firstName} ${queueData.patient.lastName}`
          : `Patient #${queueData.queueNumber}`;
        toast.success(`New patient added: ${patientName}`, { duration: 3000 });
      }
    };

    const handleQueueUpdated = (updatedQueue: any) => {
      const queueData = updatedQueue.data || updatedQueue;
      const queueId = queueData.id;

      console.log("🔄 Queue Updated Event:", queueData);
      console.log("Current counter ID:", counterId);
      console.log("Updated queue counter ID:", queueData.counterId);

      // For patient movements between counters, trigger a full refresh
      // This ensures we get the complete patient data and handle the movement properly
      const shouldRefreshForMovement = () => {
        const existingQueue = queues.find((q) => q.id === queueId);

        // Check if this queue exists locally but counterId changed (moved away)
        if (existingQueue && existingQueue.counter?.id !== queueData.counterId) {
          return true;
        }

        // Check if this queue doesn't exist locally but is for this counter (moved to)
        if (!existingQueue && queueData.counterId === counterId) {
          return true;
        }

        return false;
      };

      if (shouldRefreshForMovement()) {
        console.log("🔄 Patient movement detected, triggering full refresh");
        refreshQueues();
        return;
      }

      // Handle regular queue updates for current counter
      if (queueData.counterId === counterId) {
        console.log("Updating queue in current counter");

        // If socket data doesn't have patient info, preserve existing patient data
        let queueWithPatientData = queueData;
        if (!queueData.patient && queueData.metadata?.patientId) {
          const existingQueue = queues.find((q) => q.id === queueId);
          if (existingQueue?.patient) {
            queueWithPatientData = {
              ...queueData,
              patient: existingQueue.patient,
            };
          }
        }

        const mappedUpdatedQueue = mapQueueData(queueWithPatientData);

        setQueues((prev) => {
          const existingIndex = prev.findIndex((q) => q.id === queueId);
          if (existingIndex !== -1) {
            const updatedQueues = [...prev];
            updatedQueues[existingIndex] = mappedUpdatedQueue;
            console.log("Updated existing queue in current counter");
            return updatedQueues;
          }
          return prev;
        });

        // Update current queue if it's the one being served
        if (queueData.status === "now_serving") {
          const mappedCurrentQueue = mapQueueData(queueWithPatientData);
          setCurrentQueue(mappedCurrentQueue);
          setPatientRecordKey((prev) => prev + 1);
          console.log("Updated current serving patient");
        }
      }
    };

    const handleQueueDeleted = (deletedQueue: any) => {
      const queueId = deletedQueue.data?.id || deletedQueue.id;
      console.log("🗑️ Queue Deleted Event:", queueId);

      setQueues((prev) => {
        const existingQueue = prev.find((q) => q.id === queueId);
        if (existingQueue) {
          const updatedQueues = prev.filter((q) => q.id !== queueId);

          // Show notification
          const patientName = existingQueue.patient
            ? `${existingQueue.patient.firstName} ${existingQueue.patient.lastName}`
            : `Patient #${existingQueue.number}`;
          toast.error(`Patient queue deleted: ${patientName}`, { duration: 3000 });

          // Clear current queue if it was deleted
          if (currentQueue?.id === queueId) {
            const nextPatient = updatedQueues.find(
              (q) => q.status === "waiting" || q.status === "next" || q.status === "now_serving"
            );
            setCurrentQueue(nextPatient || null);
            setPatientRecordKey((prev) => prev + 1);
          }

          return updatedQueues;
        }
        return prev;
      });
    };

    // Enhanced patient movement handlers
    const handlePatientMoved = (moveData: any) => {
      const data = moveData.data || moveData;
      console.log("🚶 Patient Moved Event:", data);

      // This event is specifically for patient movements
      if (data.fromCounterId === counterId || data.toCounterId === counterId) {
        handleQueueUpdated({ data: data.queue || data });
      }
    };

    const handlePatientTransferred = (transferData: any) => {
      const data = transferData.data || transferData;
      console.log("↔️ Patient Transferred Event:", data);

      // Handle patient transfers between counters
      if (data.sourceCounterId === counterId || data.targetCounterId === counterId) {
        handleQueueUpdated({ data: data.queue || data });
      }
    };

    // Listen to general queue events
    socket.on("queue:created", handleQueueCreated);
    socket.on("queue:updated", handleQueueUpdated);
    socket.on("queue:deleted", handleQueueDeleted);

    // Listen to patient movement specific events
    socket.on("patient:moved", handlePatientMoved);
    socket.on("patient:transferred", handlePatientTransferred);
    socket.on("queue:moved", handleQueueUpdated);
    socket.on("queue:transferred", handleQueueUpdated);

    // Listen for patient movement broadcasts from other counter views
    const handlePatientMovementBroadcast = (movementData: any) => {
      console.log("📡 Received patient movement broadcast:", movementData);

      // Check if this counter is involved in the movement
      if (movementData.fromCounterId === counterId || movementData.toCounterId === counterId) {
        console.log("🔄 This counter is involved in the movement, refreshing queues");

        // Add a small delay to ensure the backend has fully processed the update
        setTimeout(() => {
          refreshQueues();
        }, 300);

        // Show appropriate notification
        if (movementData.toCounterId === counterId) {
          toast.success(`${movementData.patientName} moved to this counter`, { duration: 3000 });
        } else if (movementData.fromCounterId === counterId) {
          toast.info(`${movementData.patientName} moved to another counter`, { duration: 3000 });
        }
      }
    };

    socket.on("patient:movement:broadcast", handlePatientMovementBroadcast);

    // Listen to facility-specific events
    if (getUserData?.user?.facilityId) {
      const facilityId = getUserData.user.facilityId;
      socket.on(`facility:${facilityId}:queue:created`, handleQueueCreated);
      socket.on(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
      socket.on(`facility:${facilityId}:queue:deleted`, handleQueueDeleted);
      socket.on(`facility:${facilityId}:patient:moved`, handlePatientMoved);
      socket.on(`facility:${facilityId}:patient:transferred`, handlePatientTransferred);
      socket.on(`facility:${facilityId}:queue:moved`, handleQueueUpdated);
      socket.on(`facility:${facilityId}:queue:transferred`, handleQueueUpdated);
      socket.on(
        `facility:${facilityId}:patient:movement:broadcast`,
        handlePatientMovementBroadcast
      );
    }

    // Catch-all listener for debugging queue events
    socket.onAny((eventName: string, ...args: any[]) => {
      if (
        (eventName.includes("queue") || eventName.includes("patient")) &&
        (eventName.includes("move") ||
          eventName.includes("transfer") ||
          eventName.includes("updated"))
      ) {
        console.log(`🎯 [Counter ${counterId}] Socket Event: ${eventName}`, args[0]);
      }
    });

    return () => {
      socket.off("queue:created", handleQueueCreated);
      socket.off("queue:updated", handleQueueUpdated);
      socket.off("queue:deleted", handleQueueDeleted);
      socket.off("patient:moved", handlePatientMoved);
      socket.off("patient:transferred", handlePatientTransferred);
      socket.off("queue:moved", handleQueueUpdated);
      socket.off("queue:transferred", handleQueueUpdated);
      socket.off("patient:movement:broadcast", handlePatientMovementBroadcast);

      if (getUserData?.user?.facilityId) {
        const facilityId = getUserData.user.facilityId;
        socket.off(`facility:${facilityId}:queue:created`, handleQueueCreated);
        socket.off(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
        socket.off(`facility:${facilityId}:queue:deleted`, handleQueueDeleted);
        socket.off(`facility:${facilityId}:patient:moved`, handlePatientMoved);
        socket.off(`facility:${facilityId}:patient:transferred`, handlePatientTransferred);
        socket.off(`facility:${facilityId}:queue:moved`, handleQueueUpdated);
        socket.off(`facility:${facilityId}:queue:transferred`, handleQueueUpdated);
        socket.off(
          `facility:${facilityId}:patient:movement:broadcast`,
          handlePatientMovementBroadcast
        );
      }

      socket.offAny();
    };
  }, [socket, counterId, currentQueue, getUserData?.user?.facilityId]);

  // Add localStorage listener as fallback for cross-tab communication
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "patient_movement_broadcast" && event.newValue) {
        try {
          const broadcastData = JSON.parse(event.newValue);
          if (broadcastData.type === "PATIENT_MOVED") {
            console.log("📡 Received localStorage patient movement broadcast:", broadcastData);

            // Check if this counter is involved in the movement
            if (
              broadcastData.fromCounterId === counterId ||
              broadcastData.toCounterId === counterId
            ) {
              console.log(
                "🔄 This counter is involved in the movement (localStorage), refreshing queues"
              );

              setTimeout(() => {
                refreshQueues();
              }, 300);

              // Show appropriate notification
              if (broadcastData.toCounterId === counterId) {
                toast.success(`${broadcastData.patientName} moved to this counter`, {
                  duration: 3000,
                });
              } else if (broadcastData.fromCounterId === counterId) {
                toast.info(`${broadcastData.patientName} moved to another counter`, {
                  duration: 3000,
                });
              }
            }
          }
        } catch (error) {
          console.warn("Failed to parse localStorage broadcast:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [counterId]);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res: any = await counterService.getAll({
          facilityId: getUserData.user.facilityId,
        });
        setCounters(res.data);
      } catch (err) {
        console.error("Failed to fetch counters", err);
      }
    };

    fetchCounters();
  }, []);

  useEffect(() => {
    if (!counterId) return;

    const fetchSelectedCounter = async () => {
      try {
        const res: any = await counterService.get(counterId, {
          fields: "facility,type,category,name,Queuing",
        });
        setCounter(res.data);
      } catch (err) {
        console.error("Failed to fetch counter", err);
      }
    };

    fetchSelectedCounter();
  }, [counterId]);

  // Fetch queues using the new queue service
  useEffect(() => {
    if (!counterId) return;

    const fetchQueues = async () => {
      try {
        // Use the queue service to get queues for this counter
        const res: any = await queueService.getAll({
          counterId,
          facilityId: getUserData?.user?.facilityId,
          status: undefined, // Get all statuses
          order: "asc", // Order by timestamp ascending to maintain queue order
        });

        console.log("Fetched queues for counter:", res);

        // Map the queue response to match the expected format for the sidebar
        const mappedQueues =
          res.data?.map((queue: any) => {
            // Use patient details directly from the API response (now included by backend)
            let patientDetails = {
              id: queue.metadata?.patientId || "",
              firstName: "Patient",
              lastName: `#${queue.queueNumber}`,
              middleName: "",
              birthDate: "",
              sex: null,
              userName: null,
              contacts: [],
              images: [],
            };

            // If the backend provided patient details, use them
            if (queue.patient) {
              patientDetails = {
                id: queue.patient.id,
                firstName: queue.patient.firstName || "Patient",
                lastName: queue.patient.lastName || `#${queue.queueNumber}`,
                middleName: queue.patient.middleName || "",
                birthDate: queue.patient.birthDate || "",
                sex: queue.patient.sex || null,
                userName: queue.patient.userName || null,
                contacts: queue.patient.contacts || [],
                images: queue.patient.images || [], // Include images from backend
              };
            }

            return {
              id: queue.id,
              number: queue.queueNumber, // Map queueNumber to number for display
              status: queue.status,
              tags: [],
              date: queue.date,
              position: null,
              patient: patientDetails,
              counter: queue.counter,
              encounter: null,
              user: {
                id: queue.metadata?.patientId || "",
              },
              // Additional queue-specific properties
              queueType: queue.queueType,
              timestamp: queue.timestamp,
              metadata: queue.metadata,
            };
          }) || [];

        console.log("Mapped queues:", mappedQueues);
        setQueues(mappedQueues);

        // Find the currently serving queue, or use the first waiting/next patient
        let currentlyServing = mappedQueues.find((q: any) => q.status === "now_serving");

        // If no one is currently being served, automatically set the first waiting patient as current
        if (!currentlyServing) {
          currentlyServing = mappedQueues.find(
            (q: any) => q.status === "waiting" || q.status === "next"
          );
        }

        console.log("Current queue selected:", currentlyServing);
        console.log(
          "Patient ID for PatientRecord:",
          currentlyServing?.metadata?.patientId || currentlyServing?.user?.id
        );
        console.log("Full patient metadata:", currentlyServing?.metadata);
        console.log("Full patient user data:", currentlyServing?.user);

        setCurrentQueue(currentlyServing || null);
        // Force refresh PatientRecord when initial queue is set
        if (currentlyServing) {
          setPatientRecordKey((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Failed to fetch queues using queue service", err);

        // Fallback to the old queuing service if needed
        try {
          const res: any = await queuingService.getAll({
            counterId,
            fields: "id,number,status,tags,date,position,patient,counter,encounter,user",
          });

          setQueues(res.data || []);
          const nowServingQueue = res.data?.find((q: any) => q.status === "now_serving");
          setCurrentQueue(nowServingQueue || null);
        } catch (fallbackErr) {
          console.error("Fallback queue fetch also failed", fallbackErr);
        }
      }
    };

    fetchQueues();
  }, [counterId]);

  // Handle queue reordering
  const handlePatientsReorder = async (reorderedPatients: any[]) => {
    try {
      console.log("Reordering patients:", reorderedPatients);

      // Update the local state immediately for responsive UI with new queue numbers
      const reorderedWithNumbers = reorderedPatients.map((patient, index) => ({
        ...patient,
        number: String(index + 1).padStart(3, "0"), // Update queue number immediately for UI
      }));

      setQueues(reorderedWithNumbers);

      // Automatically set the first patient in the reordered list as the current patient
      const firstPatientWithNumber = reorderedWithNumbers.find(
        (p) => p.status === "waiting" || p.status === "next" || p.status === "now_serving"
      );
      if (firstPatientWithNumber) {
        console.log("Setting new current patient after reorder:", firstPatientWithNumber);

        // Check if the current patient is changing
        const isPatientChanging = currentQueue?.id !== firstPatientWithNumber.id;

        setCurrentQueue(firstPatientWithNumber);

        // Force PatientRecord component to re-render by updating the key
        setPatientRecordKey((prev) => prev + 1);

        console.log("New current patient set:", {
          id: firstPatientWithNumber.id,
          patientId: firstPatientWithNumber.metadata?.patientId || firstPatientWithNumber.user?.id,
          name: `${firstPatientWithNumber.patient.firstName} ${firstPatientWithNumber.patient.lastName}`,
          number: firstPatientWithNumber.number,
        });

        // Additional debug info for PatientRecord component
        console.log(
          "PatientRecord will receive currentPatientId:",
          firstPatientWithNumber.metadata?.patientId || firstPatientWithNumber.user?.id
        );
        console.log("Full queue object for debugging:", firstPatientWithNumber);

        // Show notification if the patient changed
        if (isPatientChanging) {
          const patientName = `${firstPatientWithNumber.patient.firstName} ${firstPatientWithNumber.patient.lastName}`;
          toast.success(
            `🎯 Now serving: ${patientName} (Queue #${firstPatientWithNumber.number})`,
            {
              duration: 4000,
            }
          );
        }
      }

      // Update timestamps on the backend to reflect new order
      // We'll set timestamps incrementally to maintain order
      const baseTime = new Date();
      const updatePromises = reorderedPatients.map((patient, index) => {
        // Set timestamps with 10-second intervals to maintain clear ordering
        const newTimestamp = new Date(baseTime.getTime() + index * 10000);

        // Update the queue number to reflect new position (001, 002, 003, etc.)
        const newQueueNumber = String(index + 1).padStart(3, "0");

        return queueService.update(patient.id, {
          timestamp: newTimestamp.toISOString(),
          queueNumber: newQueueNumber,
        });
      });

      await Promise.all(updatePromises);

      toast.success("Queue order updated successfully!");

      console.log("Queue reorder completed successfully");
    } catch (error) {
      console.error("Failed to reorder queues:", error);

      // Revert local state on error by refetching
      if (counterId) {
        try {
          const res: any = await queueService.getAll({
            counterId,
            facilityId: getUserData?.user?.facilityId,
            order: "asc",
          });
          const mappedQueues =
            res.data?.map((queue: any) => {
              let patientDetails = {
                id: queue.metadata?.patientId || "",
                firstName: "Patient",
                lastName: `#${queue.queueNumber}`,
                middleName: "",
                birthDate: "",
              };

              if (queue.patient) {
                patientDetails = {
                  id: queue.patient.id,
                  firstName: queue.patient.firstName || "Patient",
                  lastName: queue.patient.lastName || `#${queue.queueNumber}`,
                  middleName: queue.patient.middleName || "",
                  birthDate: queue.patient.birthDate || "",
                };
              }

              return {
                id: queue.id,
                number: queue.queueNumber,
                status: queue.status,
                tags: [],
                date: queue.date,
                position: null,
                patient: patientDetails,
                counter: queue.counter,
                encounter: null,
                user: {
                  id: queue.metadata?.patientId || "",
                },
                queueType: queue.queueType,
                timestamp: queue.timestamp,
                metadata: queue.metadata,
              };
            }) || [];
          setQueues(mappedQueues);
        } catch (fetchError) {
          console.error("Failed to revert queue order:", fetchError);
        }
      }

      toast.error("Failed to update queue order. Changes reverted.");
    }
  };

  // Refresh queues when a new queue is created
  const handleQueueCreated = async (newQueue: any) => {
    console.log("handleQueueCreated called with:", newQueue);

    // Refresh the queue list to get the latest data
    if (counterId) {
      try {
        // Use the new queue service for fetching
        const res: any = await queueService.getAll({
          counterId,
          facilityId: getUserData?.user?.facilityId,
          order: "asc",
        });

        console.log("Refreshed queues after creation:", res);

        // Map the queue response to match the expected format (same as in useEffect)
        const mappedQueues =
          res.data?.map((queue: any) => {
            // Use patient details directly from the API response (now included by backend)
            let patientDetails = {
              id: queue.metadata?.patientId || "",
              firstName: "Patient",
              lastName: `#${queue.queueNumber}`,
              middleName: "",
              birthDate: "",
              sex: null,
              userName: null,
              contacts: [],
              images: [],
            };

            // If the backend provided patient details, use them
            if (queue.patient) {
              patientDetails = {
                id: queue.patient.id,
                firstName: queue.patient.firstName || "Patient",
                lastName: queue.patient.lastName || `#${queue.queueNumber}`,
                middleName: queue.patient.middleName || "",
                birthDate: queue.patient.birthDate || "",
                sex: queue.patient.sex || null,
                userName: queue.patient.userName || null,
                contacts: queue.patient.contacts || [],
                images: queue.patient.images || [], // Include images from backend
              };
            }

            return {
              id: queue.id,
              number: queue.queueNumber, // Map queueNumber to number for display
              status: queue.status,
              tags: [],
              date: queue.date,
              position: null,
              patient: patientDetails,
              counter: queue.counter,
              encounter: null,
              user: {
                id: queue.metadata?.patientId || "",
              },
              // Additional queue-specific properties
              queueType: queue.queueType,
              timestamp: queue.timestamp,
              metadata: queue.metadata,
            };
          }) || [];

        console.log("Refreshed mapped queues:", mappedQueues);
        setQueues(mappedQueues);

        // Update current queue if needed
        let currentlyServing = mappedQueues.find((q: any) => q.status === "now_serving");

        // If no one is currently being served, automatically set the first waiting patient as current
        if (!currentlyServing) {
          currentlyServing = mappedQueues.find(
            (q: any) => q.status === "waiting" || q.status === "next"
          );
        }

        setCurrentQueue(currentlyServing || null);
        // Force refresh PatientRecord when queue is refreshed
        if (currentlyServing) {
          setPatientRecordKey((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Failed to refresh queues", err);
        // Fallback to the old service if needed
        try {
          const res: any = await queuingService.getAll({
            counterId,
            fields: "id,number,status,tags,date,position,patient,counter,encounter,user",
          });
          setQueues(res.data);
        } catch (fallbackErr) {
          console.error("Fallback queue fetch also failed", fallbackErr);
        }
      }
    }
  };

  const handleAddPatientQueue = () => {
    setShowAddPatientModal(true);
  };

  const handleMovePatient = (patient: any) => {
    console.log("Moving patient:", patient);
    setShowMovePatientModal(true);
  };

  const handleOpenMoveModal = () => {
    console.log("Opening move modal from Serve Next button");
    setShowMovePatientModal(true);
  };

  const handlePatientMoved = async (movedData: any) => {
    console.log("🔄 Patient moved successfully:", movedData);

    // If this is a completed move operation from the modal, trigger refresh
    if (movedData.moveCompleted) {
      console.log("✅ Move operation completed, refreshing queues");

      // Add a small delay to ensure the backend has processed the update
      setTimeout(() => {
        refreshQueues();
      }, 500);

      return;
    }

    // Handle socket-based updates (legacy fallback)
    try {
      console.log("🔄 Fallback: Using socket-based queue refresh");
      await refreshQueues();
    } catch (error) {
      console.error("❌ Failed to handle patient move:", error);
      toast.error("Failed to update queue after patient move");
    }
  };

  const handleServeNext = async (patient: any) => {
    if (!patient?.id) {
      console.error("Patient id is missing", patient);
      return;
    }

    console.log("Serving next patient:", patient);

    const currentCounterId = counterId || patient.counter?.id;
    const nextCounterId = getNextCounter(counters, currentCounterId)?.id;

    try {
      // Mark current queue as done
      await queuingService.update(patient.id, {
        process: "default",
        counterId: currentCounterId,
        status: "done",
      });

      // Create queue for next counter if exists
      if (nextCounterId) {
        await queuingService.create({
          process: "default",
          patientId: patient.patientId,
          facilityId: patient.facilityId,
          counterId: nextCounterId,
          userId: patient.userId,
        });
      }

      // Navigate to patient view
      const patientIdToNavigate = patient.patientId;
      if (!patientIdToNavigate) {
        console.error("Cannot navigate: patientId is missing");
        return;
      }

      navigate(`/counters/${currentCounterId}?page=encounter`);
    } catch (err) {
      console.error("Failed to serve next patient", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-fit bg-white p-2 h-full flex flex-col">
        <div className="max-w-xs flex gap-4 flex-shrink-0">
          {/* Filter by counter type */}
          <Select value={selectedType} onValueChange={(value: string) => setSelectedType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select counter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              {Object.values(CounterType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-4">
            {counters.filter((c) => (selectedType === "all" ? true : c.type.includes(selectedType)))
              .length === 0 ? (
              <p className="text-sm text-muted-foreground text-nowrap bg-gray-100 p-2 rounded">
                No counters found.
              </p>
            ) : (
              <Select
                value={counterId || ""}
                onValueChange={(id: string) => {
                  navigate(`/counters/${id}?page=encounter`); // ✅ navigate to counter page
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a counter" />
                </SelectTrigger>
                <SelectContent>
                  {counters
                    .filter((c) => (selectedType === "all" ? true : c.type.includes(selectedType)))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{c.name}</span>
                          {/* <span className="text-xs text-muted-foreground">
                            {c.category.toUpperCase()} —{" "}
                            {c.type[0]?.replace("_", " ").toUpperCase()}
                          </span> */}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <CounterSidebar
            patients={queues || []}
            onPatientsReorder={handlePatientsReorder}
            onServeNext={(patient: any) => {
              handleServeNext(patient);
            }}
            onSkipPatient={() => {}}
            onRecallPatient={() => {}}
            onAddPatientQueue={handleAddPatientQueue}
            onMovePatient={handleMovePatient}
            onOpenMoveModal={handleOpenMoveModal}
            currentPatientId={currentQueue?.id}
          />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        <main className="p-4 bg-white m-2 rounded-lg shadow-md flex-1 overflow-y-auto">
          {currentQueue ? (
            <PatientRecord
              activePage={activePage}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              handleSelectPage={handleSelectPage}
              member={member}
              memberLoading={memberLoading}
              encounters={encounters}
              encountersLoading={encountersLoading}
              selectedEncounter={selectedEncounter}
              encounterLoading={encounterLoading}
              getUserData={getUserData}
              memberError={memberError}
              encountersError={encountersError}
              encounterError={encounterError}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg">No patient selected</p>
                <p className="text-sm">Select a patient from the queue to view their records</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Patient Queue Modal */}
      <AddPatientQueueModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        counterId={counterId || ""}
        onQueueCreated={handleQueueCreated}
      />

      {/* Move Patient Counter Modal */}
      <MovePatientCounterModal
        isOpen={showMovePatientModal}
        onClose={() => setShowMovePatientModal(false)}
        currentPatient={currentQueue}
        currentCounterId={counterId || ""}
        onPatientMoved={handlePatientMoved}
        patients={queues || []}
      />
    </div>
  );
}
