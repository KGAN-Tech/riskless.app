import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";
import { Clock, UserCheck, AlertCircle, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { queueService } from "~/app/services/queue.service";
import { counterService } from "~/app/services/counter.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { io } from "socket.io-client";
import { SOCKET_URL } from "~/app/configuration/socket.config";

interface QueueInfo {
  id: string;
  queueNumber: string;
  status: "waiting" | "next" | "now_serving" | "done" | "skipped";
  counterId: string;
  counterName?: string;
  timestamp: string;
  position?: number;
}

interface QueueStatusSectionProps {
  patientId: string;
  onStatusUpdate?: (newStatus: string) => void;
}

export const QueueStatusSection = ({ patientId, onStatusUpdate }: QueueStatusSectionProps) => {
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [counters, setCounters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const getUserData = getUserFromLocalStorage();

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

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !queueInfo) return;

    const handleQueueUpdated = (updatedQueue: any) => {
      const queueData = updatedQueue.data || updatedQueue;

      // Update if this is our patient's queue
      if (queueData.id === queueInfo.id) {
        console.log("🔄 [Queue Status] Real-time update received:", queueData);
        fetchQueueInfo();
      }
    };

    // Listen to queue events
    socket.on("queue:updated", handleQueueUpdated);

    // Listen to facility-specific events
    if (getUserData?.user?.facilityId) {
      const facilityId = getUserData.user.facilityId;
      socket.on(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
    }

    return () => {
      socket.off("queue:updated", handleQueueUpdated);
      if (getUserData?.user?.facilityId) {
        const facilityId = getUserData.user.facilityId;
        socket.off(`facility:${facilityId}:queue:updated`, handleQueueUpdated);
      }
    };
  }, [socket, queueInfo, getUserData?.user?.facilityId]);

  // Fetch patient's current queue information
  const fetchQueueInfo = async () => {
    if (!patientId) return;

    try {
      setLoading(true);

      // Get all queues for this facility and find patient's queue
      const [queueRes, counterRes] = await Promise.all([
        queueService.getAll({
          facilityId: getUserData?.user?.facilityId,
          include: "patient,counter",
        }),
        counterService.getAll({
          facilityId: getUserData?.user?.facilityId,
        }),
      ]);

      setCounters(counterRes.data || []);

      // Find the patient's current queue (active statuses only)
      const activeStatuses = ["waiting", "next", "now_serving"];
      const patientQueue = queueRes.data?.find(
        (queue: any) =>
          queue.metadata?.patientId === patientId && activeStatuses.includes(queue.status)
      );

      if (patientQueue) {
        const counter = counterRes.data?.find((c: any) => c.id === patientQueue.counterId);

        setQueueInfo({
          id: patientQueue.id,
          queueNumber: patientQueue.queueNumber,
          status: patientQueue.status,
          counterId: patientQueue.counterId,
          counterName: counter?.name || `Counter ${patientQueue.counterId}`,
          timestamp: patientQueue.timestamp,
        });

        console.log("📋 [Queue Status] Found patient queue:", patientQueue);
      } else {
        setQueueInfo(null);
        console.log("📋 [Queue Status] No active queue found for patient");
      }
    } catch (error) {
      console.error("Failed to fetch queue information:", error);
      toast.error("Failed to load queue information");
    } finally {
      setLoading(false);
    }
  };

  // Update queue status
  const updateQueueStatus = async (newStatus: "waiting" | "next" | "now_serving") => {
    if (!queueInfo) return;

    try {
      setUpdating(true);

      const statusLabels = {
        waiting: "Waiting",
        next: "Next",
        now_serving: "Now Serving",
      };

      toast.loading(`Updating status to ${statusLabels[newStatus]}...`, {
        id: "status-update",
      });

      const updateData = {
        status: newStatus,
        metadata: {
          patientId: patientId,
          doctorId: null,
          remarks: `Status updated to ${
            statusLabels[newStatus]
          } at ${new Date().toLocaleString()} by ${getUserData?.user?.userName || "User"}`,
        },
      };

      await queueService.update(queueInfo.id, updateData);

      toast.success(`Status updated to ${statusLabels[newStatus]}!`, {
        id: "status-update",
        duration: 3000,
      });

      // Refresh queue info
      await fetchQueueInfo();

      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }

      console.log(`✅ [Queue Status] Updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update queue status:", error);
      toast.error("Failed to update status", {
        id: "status-update",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Load queue info on mount and when patient changes
  useEffect(() => {
    fetchQueueInfo();
  }, [patientId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="w-4 h-4" />;
      case "next":
        return <AlertCircle className="w-4 h-4" />;
      case "now_serving":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 text-blue-800";
      case "next":
        return "bg-orange-100 text-orange-800";
      case "now_serving":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "waiting":
        return "Waiting";
      case "next":
        return "Next";
      case "now_serving":
        return "Now Serving";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="mt-4 p-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Loading queue status...</span>
        </div>
      </Card>
    );
  }

  if (!queueInfo) {
    return (
      <Card className="mt-4 p-4">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Queue Status</h3>
          <p className="text-sm text-gray-500 mb-3">Patient is not currently in any queue</p>
          <Button variant="outline" size="sm" onClick={fetchQueueInfo} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-4 p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Queue Status
        </h3>

        {/* Current Status Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${getStatusColor(queueInfo.status)} border-0`}>
              {getStatusIcon(queueInfo.status)}
              <span className="ml-1 font-semibold">{getStatusLabel(queueInfo.status)}</span>
            </Badge>
            <span className="text-sm font-mono text-gray-600">#{queueInfo.queueNumber}</span>
          </div>

          <div className="text-xs text-gray-600">
            <p className="mb-1">
              <strong>Counter:</strong> {queueInfo.counterName}
            </p>
            <p>
              <strong>Queue Time:</strong> {new Date(queueInfo.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 mb-2">Update Status:</p>

          <div className="grid grid-cols-1 gap-2">
            {queueInfo.status !== "now_serving" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => updateQueueStatus("now_serving")}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Serve Now
              </Button>
            )}

            {queueInfo.status !== "next" && queueInfo.status !== "now_serving" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQueueStatus("next")}
                disabled={updating}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Set as Next
              </Button>
            )}

            {queueInfo.status !== "waiting" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQueueStatus("waiting")}
                disabled={updating}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Back to Waiting
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchQueueInfo}
            disabled={updating}
            className="w-full mt-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${updating ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
        </div>
      </div>
    </Card>
  );
};
