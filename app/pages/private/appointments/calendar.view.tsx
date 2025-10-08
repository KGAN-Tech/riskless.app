import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isValid,
} from "date-fns";
import { useMemo } from "react";

// Use a more generic interface that matches your API response
interface CalendarAppointment {
  id: string;
  patientId: string;
  facilityId: string;
  status: "rescheduled" | "on_going" | "done" | "canceled" | "pending";
  date: string | Date;
  patient?: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  patientName?: string;
  time?: string;
}

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  appointments: CalendarAppointment[];
}

export function CalendarView({
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  appointments = [],
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Memoize the appointment processing to improve performance
  const processedAppointments = useMemo(() => {
    console.log(
      "📅 Processing appointments for calendar:",
      appointments.length
    );
    return appointments.map((apt) => {
      let appointmentDate;

      try {
        if (typeof apt.date === "string") {
          // Handle both ISO string and YYYY-MM-DD format
          if (apt.date.includes("T")) {
            appointmentDate = parseISO(apt.date);
          } else {
            appointmentDate = parseISO(apt.date + "T00:00:00");
          }
        } else {
          appointmentDate = new Date(apt.date);
        }

        // Validate the date
        if (!isValid(appointmentDate)) {
          console.warn("Invalid appointment date:", apt.date);
          appointmentDate = new Date();
        }
      } catch (error) {
        console.error("Error parsing appointment date:", apt.date, error);
        appointmentDate = new Date();
      }

      return {
        ...apt,
        parsedDate: appointmentDate,
      };
    });
  }, [appointments]);

  const getAppointmentsForDate = (date: Date) => {
    const dayAppointments = processedAppointments.filter((apt) =>
      isSameDay(apt.parsedDate, date)
    );

    // Sort appointments by time for consistent display
    return dayAppointments.sort((a, b) => {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });
  };

  // Count appointments for the current month
  const appointmentsThisMonth = useMemo(() => {
    return processedAppointments.filter((apt) =>
      isSameMonth(apt.parsedDate, currentMonth)
    ).length;
  }, [processedAppointments, currentMonth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500";
      case "done":
        return "bg-green-500";
      case "on_going":
        return "bg-yellow-500";
      case "rescheduled":
        return "bg-amber-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatPatientName = (appointment: CalendarAppointment) => {
    if (appointment.patientName) {
      return appointment.patientName;
    }

    if (appointment.patient) {
      const firstName = appointment.patient.firstName || "";
      const lastName = appointment.patient.lastName || "";
      const middleName = appointment.patient.middleName || "";
      return `${firstName} ${middleName} ${lastName}`
        .replace(/\s+/g, " ")
        .trim();
    }

    return "Unknown Patient";
  };

  const getAppointmentTime = (appointment: CalendarAppointment) => {
    if (appointment.time) {
      return appointment.time;
    }

    try {
      const appointmentDate =
        typeof appointment.date === "string"
          ? parseISO(appointment.date)
          : new Date(appointment.date);

      if (isValid(appointmentDate)) {
        return format(appointmentDate, "HH:mm");
      }
    } catch (error) {
      console.error("Error formatting appointment time:", error);
    }

    return "00:00";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {format(currentMonth, "MMMM yyyy")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedDate
                ? `Selected: ${format(selectedDate, "MMMM d, yyyy")}`
                : "Select a date to view appointments"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {appointmentsThisMonth} appointment(s) this month
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthChange(subMonths(currentMonth, 1))}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthChange(new Date())}
              className="px-4"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthChange(addMonths(currentMonth, 1))}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="h-12 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={index}
                className={`
                  min-h-[120px] bg-white p-2 cursor-pointer transition-all hover:bg-gray-50
                  ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                  ${!isCurrentMonth ? "opacity-40" : ""}
                `}
                onClick={() => onDateSelect(day)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`
                      text-sm font-medium
                      ${
                        isCurrentDay
                          ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                          : "text-gray-900"
                      }
                      ${!isCurrentMonth ? "text-gray-400" : ""}
                    `}
                    >
                      {format(day, "d")}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 font-medium">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    {dayAppointments.slice(0, 3).map((appointment) => {
                      const patientName = formatPatientName(appointment);
                      const appointmentTime = getAppointmentTime(appointment);

                      return (
                        <div
                          key={appointment.id}
                          className={`
                            text-xs px-2 py-1 rounded text-white truncate
                            ${getStatusColor(appointment.status)}
                            transition-all hover:opacity-80
                          `}
                          title={`${appointmentTime} - ${patientName} (${appointment.status})`}
                        >
                          <div className="truncate">{patientName}</div>
                        </div>
                      );
                    })}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 px-2 font-medium">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
            Debug: {appointments.length} total appointments loaded
          </div>
        </div>
      )}
    </div>
  );
}
