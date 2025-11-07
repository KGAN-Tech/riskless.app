import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { X, Search, User, Loader2, CheckCircle } from "lucide-react";
import { userService } from "~/app/services/user.service";
import { queueService } from "~/app/services/queue.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { SOCKET_URL } from "~/app/configuration/socket.config";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  userName?: string;
  contactNumber?: string;
}

interface AddPatientQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterId: string;
  onQueueCreated?: (queue: any) => void;
}

export default function AddPatientQueueModal({
  isOpen,
  onClose,
  counterId,
  onQueueCreated,
}: AddPatientQueueModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const getUserData = getUserFromLocalStorage();
  // Removed useToast - now using Sonner toast

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

  // Socket event listeners for queue creation
  useEffect(() => {
    if (!socket) return;

    const handleQueueCreated = (newQueue: any) => {
      // Check if the created queue is for the current counter
      const queueData = newQueue.data || newQueue;
      if (queueData.counterId === counterId) {
        // Only call the parent callback if we haven't already done immediate refresh
        // This handles cases where socket events arrive after modal closure
        if (onQueueCreated && !creating) {
          onQueueCreated(queueData);
        }
      }
    };

    // Listen to queue creation events
    socket.on("queue:created", handleQueueCreated);

    // Listen to facility-specific events if we have facility ID
    if (getUserData?.user?.facilityId) {
      socket.on(`facility:${getUserData.user.facilityId}:queue:created`, handleQueueCreated);
    }

    return () => {
      socket.off("queue:created", handleQueueCreated);
      if (getUserData?.user?.facilityId) {
        socket.off(`facility:${getUserData.user.facilityId}:queue:created`, handleQueueCreated);
      }
    };
  }, [socket, counterId, onQueueCreated, toast, getUserData?.user?.facilityId]);

  // Fetch patients on modal open
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients.slice(0, 20)); // Show first 20 patients initially
      return;
    }

    const filtered = patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.middleName || ""} ${
        patient.lastName
      }`.toLowerCase();
      const userName = patient.userName?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || userName.includes(search);
    });

    setFilteredPatients(filtered.slice(0, 50)); // Limit to 50 results
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({
        facilityId: getUserData?.user?.facilityId,
        fields: "id,person,userName,type",
        limit: 100, // Fetch more patients initially
      });

      // Based on the network response, the structure should be response.users
      const users = response.users || response.data || response || [];

      // Ensure users is an array before filtering
      if (!Array.isArray(users)) {
        console.error("Users is not an array:", typeof users, users);
        throw new Error("Invalid response format - users should be an array");
      }

      // Filter and map only patient types
      const patientUsers = users.filter((user: any) =>
        ["patient", "patient_member", "patient_dependent"].includes(user.type)
      );

      // Map the response to Patient interface
      const mappedPatients: Patient[] = patientUsers.map((user: any) => ({
        id: user.id,
        firstName: user.person?.firstName || "",
        lastName: user.person?.lastName || "",
        middleName: user.person?.middleName || "",
        birthDate: user.person?.birthDate || "",
        userName: user.userName || "",
        contactNumber:
          user.person?.contacts?.find((c: any) => c.type === "mobile_number")?.value || "",
      }));
      setPatients(mappedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);

      // Safeguard to prevent infinite toast loops
      if (!error?.toString().includes("Maximum call stack")) {
        toast.error("Failed to fetch patients. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQueue = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient to add to the queue.");
      return;
    }

    try {
      setCreating(true);

      const queueData = {
        queueType: "walkin", // Always walkin as requested
        counterId: counterId,
        facilityId: getUserData?.user?.facilityId,
        status: "waiting",
        metadata: {
          patientId: selectedPatient.id, // This is the userId from the User model
          doctorId: null, // Optional doctor assignment
          remarks: `Added by ${
            getUserData?.user?.userName || "system"
          } at ${new Date().toLocaleString()}`,
        },
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      const createdQueue = await queueService.create(queueData);

      // Immediately call the callback to refresh the queue list
      // This ensures instant update even if socket events have a delay
      if (onQueueCreated) {
        onQueueCreated(createdQueue);
      }

      // Show immediate success feedback
      toast.success(
        `${selectedPatient.firstName} ${selectedPatient.lastName} has been added to the queue.`
      );

      // Reset and close modal
      setSelectedPatient(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Failed to create queue:", error);

      // Safeguard to prevent infinite toast loops
      if (!error?.toString().includes("Maximum call stack")) {
        toast.error("Failed to create queue. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setSearchTerm("");
    onClose();
  };

  const formatPatientInfo = (patient: Patient) => {
    const fullName = `${patient.firstName} ${patient.middleName || ""} ${patient.lastName}`.trim();
    const info = [];

    if (patient.userName) info.push(`Username: ${patient.userName}`);
    if (patient.birthDate) {
      const birthDate = new Date(patient.birthDate);
      if (!isNaN(birthDate.getTime())) {
        info.push(`DOB: ${birthDate.toLocaleDateString()}`);
      }
    }
    if (patient.contactNumber) info.push(`Contact: ${patient.contactNumber}`);

    return { fullName, info: info.join(" • ") };
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Patient to Queue
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

        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Patient</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="flex-1 overflow-hidden">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Patient ({filteredPatients.length} found)
            </Label>

            <div className="border rounded-lg overflow-hidden h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading patients...</span>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <User className="h-8 w-8 mb-2" />
                  <p>No patients found</p>
                </div>
              ) : (
                <div className="overflow-y-auto h-full">
                  {filteredPatients.map((patient) => {
                    const { fullName, info } = formatPatientInfo(patient);
                    const isSelected = selectedPatient?.id === patient.id;

                    return (
                      <div
                        key={patient.id}
                        className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? "bg-blue-600" : "bg-gray-300"
                                }`}
                              />
                              <h4 className="font-medium text-gray-900">{fullName}</h4>
                              {isSelected && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                            {info && <p className="text-sm text-gray-500 mt-1 ml-4">{info}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-1">Selected Patient:</h4>
              <p className="text-blue-800">{formatPatientInfo(selectedPatient).fullName}</p>
              {formatPatientInfo(selectedPatient).info && (
                <p className="text-blue-700 text-sm">{formatPatientInfo(selectedPatient).info}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={creating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateQueue}
              disabled={!selectedPatient || creating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding to Queue...
                </>
              ) : (
                "Add to Queue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
