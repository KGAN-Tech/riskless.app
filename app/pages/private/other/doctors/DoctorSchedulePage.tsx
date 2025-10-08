import { useState } from "react";

import { Search, Plus, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

// Mock data for doctor schedules
const mockSchedules = [
  {
    id: 1,
    doctorId: "DOC-2024-001",
    doctorName: "Dr. Sarah Wilson",
    speciality: "Cardiology",
    day: "Monday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "Room 101",
    status: "Available",
  },
  {
    id: 2,
    doctorId: "DOC-2024-002",
    doctorName: "Dr. Michael Brown",
    speciality: "Pediatrics",
    day: "Tuesday",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    location: "Room 102",
    status: "Available",
  },
  {
    id: 3,
    doctorId: "DOC-2024-003",
    doctorName: "Dr. Emily Chen",
    speciality: "Neurology",
    day: "Wednesday",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    location: "Room 103",
    status: "Available",
  },
  {
    id: 4,
    doctorId: "DOC-2024-004",
    doctorName: "Dr. James Lee",
    speciality: "Orthopedics",
    day: "Thursday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "Room 104",
    status: "Available",
  },
  {
    id: 5,
    doctorId: "DOC-2024-005",
    doctorName: "Dr. Lisa Anderson",
    speciality: "Dermatology",
    day: "Friday",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    location: "Room 105",
    status: "Available",
  },
];

export default function DoctorSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules] = useState(mockSchedules);

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) =>
    Object.values(schedule).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doctor Schedules</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Schedules Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doctor ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Location
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
              {filteredSchedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {schedule.doctorId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.doctorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.speciality}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.day}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.startTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.endTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {schedule.location}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        schedule.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {schedule.status}
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
