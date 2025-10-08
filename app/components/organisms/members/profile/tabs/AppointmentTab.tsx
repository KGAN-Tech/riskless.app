import { useState } from "react";

import {
  Calendar,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  department: string;
  location: string;
  type: "consultation" | "follow-up" | "procedure" | "check-up";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reason?: string;
}

interface AppointmentTabProps {
  appointments: Appointment[];
}

export function AppointmentTab({ appointments }: AppointmentTabProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    appointments.find((a) => a.status === "scheduled")?.id || null
  );

  const currentAppointment = appointments.find(
    (a) => a.id === selectedAppointment
  );

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "no-show":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "no-show":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Appointments List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Appointments</h3>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
        <div className="space-y-2">
          {appointments.map((appointment) => (
            <button
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-gray-50",
                selectedAppointment === appointment.id ? "bg-blue-50" : ""
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {appointment.date}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                    getStatusColor(appointment.status)
                  )}
                >
                  {getStatusIcon(appointment.status)}
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-600">{appointment.doctor}</p>
                <p className="text-xs text-gray-500">{appointment.type}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Appointment Details */}
      <Card className="p-6 md:col-span-2">
        {currentAppointment ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {currentAppointment.type}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentAppointment.date}
                </p>
              </div>
              {currentAppointment.status === "scheduled" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{currentAppointment.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{currentAppointment.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{currentAppointment.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{currentAppointment.status}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{currentAppointment.location}</p>
              </div>
            </div>

            {currentAppointment.reason && (
              <div>
                <h4 className="text-sm font-medium mb-2">Reason for Visit</h4>
                <p className="text-sm text-gray-600">
                  {currentAppointment.reason}
                </p>
              </div>
            )}

            {currentAppointment.notes && (
              <div>
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <p className="text-sm text-gray-600">
                  {currentAppointment.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
