import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  Check,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PatientJourneyModal } from "./patient.journey.modal";
import { RescheduleAppointmentModal } from "./appointment.edit.modal";
import { appointmentService } from "@/services/appointment.service";

interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  status: "rescheduled" | "on_going" | "done" | "canceled" | "pending";
  date: string;
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

interface AppointmentsTableProps {
  selectedDate: Date;
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const statusColors = {
  pending: "bg-blue-100 text-blue-800 border-blue-200",
  rescheduled: "bg-orange-100 text-orange-800 border-orange-200",
  on_going: "bg-yellow-100 text-yellow-800 border-yellow-200",
  done: "bg-green-100 text-green-800 border-green-200",
  canceled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  rescheduled: "Rescheduled",
  on_going: "On Going",
  done: "Done",
  canceled: "Canceled",
};

export function AppointmentsTable({
  selectedDate,
  appointments,
  onUpdateAppointment,
  onDeleteAppointment,
}: AppointmentsTableProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [acceptingAppointment, setAcceptingAppointment] = useState<
    string | null
  >(null);
  const [cancelingAppointment, setCancelingAppointment] = useState<
    string | null
  >(null);
  const [reschedulingAppointment, setReschedulingAppointment] =
    useState<Appointment | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Changed default to 6

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    console.log(`Toast: ${title} - ${description} - ${variant}`);
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleAcceptAppointment = async (appointment: Appointment) => {
    try {
      setAcceptingAppointment(appointment.id);

      const updateData = {
        status: "on_going",
      };

      await appointmentService.patch(appointment.id, updateData);

      // Update the local state
      const updatedAppointment: Appointment = {
        ...appointment,
        status: "on_going",
      };
      onUpdateAppointment(updatedAppointment);

      // Show success toast
      showToast(
        "Appointment Accepted",
        `Appointment for ${appointment.patientName} has been accepted and is now ongoing.`,
        "default"
      );
    } catch (error) {
      console.error("Failed to accept appointment:", error);

      // Show error toast
      showToast(
        "Error",
        "Failed to accept appointment. Please try again.",
        "destructive"
      );
    } finally {
      setAcceptingAppointment(null);
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      setCancelingAppointment(appointment.id);

      const updateData = {
        status: "canceled",
      };

      await appointmentService.patch(appointment.id, updateData);

      // Update the local state
      const updatedAppointment: Appointment = {
        ...appointment,
        status: "canceled",
      };
      onUpdateAppointment(updatedAppointment);

      // Show success toast
      showToast(
        "Appointment Canceled",
        `Appointment for ${appointment.patientName} has been canceled.`,
        "default"
      );
    } catch (error) {
      console.error("Failed to cancel appointment:", error);

      // Show error toast
      showToast(
        "Error",
        "Failed to cancel appointment. Please try again.",
        "destructive"
      );
    } finally {
      setCancelingAppointment(null);
    }
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setReschedulingAppointment(appointment);
  };

  const handleRescheduleComplete = (
    originalAppointment: Appointment,
    newAppointmentData: any
  ) => {
    // Update the original appointment status to "rescheduled" in the local state
    const updatedOriginalAppointment: Appointment = {
      ...originalAppointment,
      status: "rescheduled",
    };
    onUpdateAppointment(updatedOriginalAppointment);

    // Show success toast
    showToast(
      "Appointment Rescheduled",
      `Appointment for ${originalAppointment.patientName} has been rescheduled successfully.`,
      "default"
    );

    // Close the modal
    setReschedulingAppointment(null);
  };

  // Helper function to check if appointment can be canceled
  const canCancelAppointment = (appointment: Appointment) => {
    return ["pending", "on_going", "rescheduled"].includes(appointment.status);
  };

  // Pagination calculations
  const totalItems = appointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (appointments.length === 0) {
    return (
      <div className="px-6 pb-6 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments scheduled
            </h3>
            <p className="text-gray-600">
              No appointments found for this date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 h-full flex flex-col">
      {/* Pagination Controls - Top */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={6}>6</option> {/* Added option for 6 */}
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="font-semibold text-gray-900">
                Patient
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Time
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="border-gray-100 hover:bg-gray-50"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                    {appointment.phone && (
                      <div className="text-sm text-gray-500">
                        {appointment.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 font-medium">
                  {appointment.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${
                      statusColors[appointment.status]
                    } border font-medium capitalize`}
                  >
                    {statusLabels[appointment.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatient(appointment.patientId)}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {appointment.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleAcceptAppointment(appointment)}
                            disabled={acceptingAppointment === appointment.id}
                            className="text-green-600 focus:text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {acceptingAppointment === appointment.id
                              ? "Accepting..."
                              : "Accept Appointment"}
                          </DropdownMenuItem>
                        )}

                        {canCancelAppointment(appointment) && (
                          <DropdownMenuItem
                            onClick={() => handleCancelAppointment(appointment)}
                            disabled={cancelingAppointment === appointment.id}
                            className="text-red-600 focus:text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {cancelingAppointment === appointment.id
                              ? "Canceling..."
                              : "Cancel Appointment"}
                          </DropdownMenuItem>
                        )}

                        {(appointment.status === "pending" ||
                          appointment.status === "on_going") && (
                          <DropdownMenuItem
                            onClick={() => handleRescheduleClick(appointment)}
                            className="text-orange-600 focus:text-orange-600"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule Appointment
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - Bottom */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`min-w-[40px] ${
                  page === "..." ? "cursor-default" : ""
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Patient Journey Modal */}
      {selectedPatient && (
        <PatientJourneyModal
          patientId={selectedPatient}
          patientName={
            appointments.find((a) => a.patientId === selectedPatient)
              ?.patientName || ""
          }
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* Reschedule Appointment Modal */}
      {reschedulingAppointment && (
        <RescheduleAppointmentModal
          isOpen={!!reschedulingAppointment}
          onClose={() => setReschedulingAppointment(null)}
          appointment={reschedulingAppointment}
          onRescheduleComplete={handleRescheduleComplete}
        />
      )}
    </div>
  );
}
