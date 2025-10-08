import { useState, useEffect } from "react";
import { CalendarView } from "./calendar.view";
import { AppointmentPanel } from "./appointment.panel";
import { appointmentService } from "@/services/appointment.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  status: "rescheduled" | "on_going" | "done" | "canceled" | "pending";
  date: string; // Use string to match your API
  patient?: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  patientName?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user's facility ID
  const getCurrentFacilityId = () => {
    const currentUser = getUserFromLocalStorage();
    return currentUser?.user?.facilityId;
  };

  // Fetch all appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const facilityId = getCurrentFacilityId();

      if (!facilityId) {
        throw new Error("No facility ID found for current user");
      }

      // Pass required parameters to the service
      const params = {
        facilityId: facilityId,
        page: 1,
        limit: 100, // Get enough appointments for the calendar
        order: "desc" as const,
      };

      const response = await appointmentService.getAll(params);

      // Transform the API response to match your Appointment interface
      const transformedAppointments: Appointment[] = response.data.map(
        (item: any) => ({
          id: item.id,
          patientId: item.patientId,
          facilityId: item.facilityId,
          patientName: item.patient
            ? `${item.patient.firstName} ${item.patient.lastName}`
            : "Unknown Patient",
          date: item.date, // Keep as string from API
          status: item.status,
          phone: item.phone,
          email: item.email,
          notes: item.notes,
          patient: item.patient, // Include the full patient object if available
        })
      );

      setAppointments(transformedAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time from ISO date string
  const formatTimeFromDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "00:00 AM";
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = async (
    appointmentData: Omit<Appointment, "id">
  ) => {
    try {
      console.log("🚀 Adding appointment to main state:", appointmentData);

      // Create the appointment via API
      const apiData = {
        patientId: appointmentData.patientId,
        facilityId: appointmentData.facilityId,
        status: appointmentData.status,
        date: appointmentData.date,
      };

      const response = await appointmentService.create(apiData);
      console.log("✅ API Response:", response);

      // Get the created appointment data
      const createdAppointment = response.data || response;

      // Create the full appointment object for state update
      const newAppointment: Appointment = {
        id: createdAppointment.id || `temp-${Date.now()}`, // Fallback ID
        patientId: appointmentData.patientId,
        facilityId: appointmentData.facilityId,
        status: appointmentData.status,
        date: appointmentData.date,
        patientName: appointmentData.patientName || "New Patient",
        patient: appointmentData.patient,
        phone: appointmentData.phone || "",
        email: appointmentData.email || "",
        notes: appointmentData.notes || "",
      };

      // Update the appointments state immediately
      setAppointments((prevAppointments) => {
        const updatedAppointments = [...prevAppointments, newAppointment];
        console.log("📊 Updated appointments state:", updatedAppointments);
        return updatedAppointments;
      });

      console.log("✅ Appointment added successfully to state");
    } catch (err) {
      console.error("❌ Failed to create appointment:", err);

      // Optionally refresh appointments from server if local update fails
      // This ensures consistency even if there's an issue
      await fetchAppointments();

      throw new Error("Failed to create appointment");
    }
  };

  const handleUpdateAppointment = async (updatedAppointment: Appointment) => {
    try {
      // Transform data for API
      const apiData = {
        status: updatedAppointment.status,
        date: updatedAppointment.date,
        notes: updatedAppointment.notes,
        // Include other fields that can be updated
      };

      await appointmentService.patch(updatedAppointment.id, apiData);

      // Update local state immediately
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        )
      );

      console.log("✅ Appointment updated successfully");
    } catch (err) {
      console.error("❌ Failed to update appointment:", err);

      // Refresh from server on error
      await fetchAppointments();
      throw new Error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      // If your API supports delete, you might want to add it to the service
      // await appointmentService.delete(appointmentId);

      // Update local state
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));

      console.log("✅ Appointment deleted successfully");
    } catch (err) {
      console.error("❌ Failed to delete appointment:", err);

      // Refresh from server on error
      await fetchAppointments();
      throw new Error("Failed to delete appointment");
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const filtered = appointments.filter((apt) => {
      try {
        const appointmentDate = new Date(apt.date);
        const match = appointmentDate.toDateString() === date.toDateString();
        return match;
      } catch (error) {
        console.error("Error filtering appointments for date:", error);
        return false;
      }
    });

    console.log(`📅 Appointments for ${date.toDateString()}:`, filtered);
    return filtered;
  };

  // Add loading and error states to your UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchAppointments}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Calendar Section */}
        <div
          className={`transition-all duration-300 ${
            selectedDate
              ? isPanelExpanded
                ? "w-0 overflow-hidden"
                : "w-3/5"
              : "w-full"
          }`}
        >
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            appointments={appointments}
          />
        </div>

        {/* Appointment Panel */}
        {selectedDate && (
          <AppointmentPanel
            selectedDate={selectedDate}
            isExpanded={isPanelExpanded}
            onToggleExpand={() => setIsPanelExpanded(!isPanelExpanded)}
            appointments={getAppointmentsForDate(selectedDate)}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}
      </div>
    </div>
  );
}
