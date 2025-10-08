import { useState } from "react";

import { Plus, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    appointmentId: "APT-2024-001",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Wilson",
    speciality: "Cardiology",
    date: "2024-03-20",
    time: "10:00 AM",
    reason: "Regular Check-up",
    status: "Confirmed",
  },
  {
    id: 2,
    appointmentId: "APT-2024-002",
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Brown",
    speciality: "Pediatrics",
    date: "2024-03-21",
    time: "02:30 PM",
    reason: "Follow-up Consultation",
    status: "Pending",
  },
  {
    id: 3,
    appointmentId: "APT-2024-003",
    patientName: "Mike Johnson",
    doctorName: "Dr. Emily Chen",
    speciality: "Neurology",
    date: "2024-03-22",
    time: "09:15 AM",
    reason: "Initial Consultation",
    status: "Confirmed",
  },
];

export default function ScheduleAppointmentPage() {
  const [searchQuery] = useState("");
  const [appointments] = useState(mockAppointments);

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) =>
    Object.values(appointment).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Schedule Appointment</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Appointment Form */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <Input placeholder="Enter patient name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Doctor
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-wilson">Dr. Sarah Wilson</SelectItem>
                  <SelectItem value="dr-brown">Dr. Michael Brown</SelectItem>
                  <SelectItem value="dr-chen">Dr. Emily Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Speciality
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select speciality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <Input type="time" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason for Visit
              </label>
              <Input placeholder="Enter reason for visit" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Schedule Appointment</Button>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Appointment ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {appointment.appointmentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.patientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.speciality}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {appointment.reason}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
