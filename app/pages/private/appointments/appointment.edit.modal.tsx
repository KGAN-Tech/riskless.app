import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/atoms/toast";
import { format } from "date-fns";
import { Calendar, User, Clock } from "lucide-react";
import { appointmentService } from "@/services/appointment.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// In appointment.edit.modal.tsx - Update the interface
interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  status: "rescheduled" | "on_going" | "done" | "canceled" | "pending";
  date: string; // Change from Date to string
  patient?: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  patientName?: string;
  time?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onRescheduleComplete?: (
    originalAppointment: Appointment,
    newAppointmentData: any
  ) => void;
}

interface ToastState {
  open: boolean;
  title: string;
  description: string;
  variant: "default" | "destructive";
}

export function RescheduleAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onRescheduleComplete,
}: RescheduleAppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: "",
    description: "",
    variant: "default",
  });

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    setToast({ open: true, title, description, variant });
  };

  const handleReschedule = async () => {
    if (!appointment) {
      showToast(
        "Missing Appointment",
        "No appointment selected for rescheduling.",
        "destructive"
      );
      return;
    }

    if (!selectedDate) {
      showToast(
        "Missing Date",
        "Please select a new date for the appointment.",
        "destructive"
      );
      return;
    }

    setIsRescheduling(true);

    try {
      const currentUser = getUserFromLocalStorage();
      const facilityId = currentUser?.user?.facilityId;

      if (!facilityId) {
        showToast(
          "Missing Facility",
          "No facility is associated with the current user. Please log in again or contact support.",
          "destructive"
        );
        return;
      }

      // Step 1: Update the original appointment status to "rescheduled"
      console.log(
        "📤 Updating original appointment status to 'rescheduled':",
        appointment.id
      );

      const updateData = {
        status: "rescheduled",
      };

      await appointmentService.patch(appointment.id, updateData);
      console.log("✅ Original appointment status updated to 'rescheduled'");

      // Step 2: Create a new appointment with only the date (no time field)
      const newAppointmentData = {
        patientId: appointment.patientId,
        facilityId,
        status: "pending" as const,
        date: selectedDate, // Only the date in YYYY-MM-DD format
        // Remove the time field if the API doesn't accept it
      };

      console.log("📤 Creating new appointment with data:", newAppointmentData);

      const response = await appointmentService.create(newAppointmentData);
      console.log("✅ New appointment created successfully:", response);

      showToast(
        "Appointment Rescheduled Successfully!",
        `${
          appointment.patientName
        }'s appointment has been rescheduled to ${format(
          new Date(selectedDate),
          "MMMM d, yyyy"
        )}.`
      );

      // Call the callback function if provided
      if (onRescheduleComplete) {
        onRescheduleComplete(appointment, newAppointmentData);
      }

      handleClose();

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("❌ Appointment rescheduling failed:", {
        message: error?.message,
        status: error?.status,
        data: error?.data,
      });

      // Check if the error is due to the time field
      const errorMessage = error?.data?.message || error?.message || "";

      if (errorMessage.includes("time") || error?.status === 400) {
        // Try again without the time field
        try {
          console.log("🔄 Retrying without time field...");

          const currentUser = getUserFromLocalStorage();
          const facilityId = currentUser?.user?.facilityId;

          const newAppointmentDataWithoutTime = {
            patientId: appointment.patientId,
            facilityId,
            status: "pending" as const,
            date: selectedDate, // Only date, no time
          };

          const retryResponse = await appointmentService.create(
            newAppointmentDataWithoutTime
          );
          console.log(
            "✅ New appointment created successfully without time field:",
            retryResponse
          );

          showToast(
            "Appointment Rescheduled Successfully!",
            `${
              appointment.patientName
            }'s appointment has been rescheduled to ${format(
              new Date(selectedDate),
              "MMMM d, yyyy"
            )}.`
          );

          if (onRescheduleComplete) {
            onRescheduleComplete(appointment, newAppointmentDataWithoutTime);
          }

          handleClose();

          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return;
        } catch (retryError: any) {
          console.error("❌ Retry also failed:", retryError);
          showToast(
            "Reschedule Failed",
            "Failed to reschedule appointment. Please try again.",
            "destructive"
          );
        }
      } else {
        const message =
          error?.status === 500
            ? "A server error occurred. Please try again later."
            : errorMessage ||
              "Failed to reschedule appointment. Please try again.";

        showToast("Reschedule Failed", message, "destructive");
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  const resetForm = () => {
    setSelectedDate("");
    setIsRescheduling(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!appointment) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <p className="text-sm text-gray-600">
              Select a new date for this appointment
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Appointment Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User size={16} />
                Current Appointment Details
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{appointment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Date:</span>
                  <span className="font-medium">
                    {format(new Date(appointment.date), "MMMM d, yyyy")}
                  </span>
                </div>
                {appointment.time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Time:</span>
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                )}
                {appointment.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{appointment.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full capitalize">
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* New Date Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newDate" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Select New Date
                </Label>
                <Input
                  id="newDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTodayDate()}
                  className="w-full"
                  disabled={isRescheduling}
                />
              </div>

              {/* Optional: Keep time selection for display purposes, but don't send to API */}
              {/* <div className="space-y-2">
                <Label htmlFor="newTime" className="flex items-center gap-2">
                  <Clock size={16} />
                  Select New Time (Optional)
                </Label>
                <select
                  id="newTime"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isRescheduling}
                >
                  <option value="">Select a time (optional)...</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
                <p className="text-xs text-gray-500">
                  Time selection is for reference only and won't be saved to the system.
                </p>
              </div> */}
            </div>

            {/* Preview of New Appointment */}
            {selectedDate && (
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">
                  New Appointment Preview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Patient:</span>
                    <span className="font-medium text-blue-900">
                      {appointment.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">New Date:</span>
                    <span className="font-medium text-blue-900">
                      {format(new Date(selectedDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                  {/* {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">Preferred Time:</span>
                      <span className="font-medium text-blue-900">{selectedTime}</span>
                    </div>
                  )} */}
                  <div className="flex justify-between">
                    <span className="text-blue-600">Status:</span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isRescheduling}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleReschedule}
                disabled={isRescheduling || !selectedDate}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isRescheduling ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Rescheduling...
                  </div>
                ) : (
                  "Confirm Reschedule"
                )}
              </Button>
            </div>

            {/* Process Information */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">
                What happens when you reschedule:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>The current appointment will be marked as "rescheduled"</li>
                <li>A new appointment will be created for the selected date</li>
                <li>
                  The patient will need to be notified about the new schedule
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Component */}
    </>
  );
}
