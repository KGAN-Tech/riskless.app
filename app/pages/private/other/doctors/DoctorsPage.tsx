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

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    docId: "DOC-2024-001",
    type: "Full-time",
    physicianName: "Dr. Sarah Wilson",
    license: "MD-12345",
    speciality: "Cardiology",
    gender: "Female",
    contactNo: "+63 912 345 6789",
    email: "sarah.wilson@hospital.com",
    address: "123 Medical Plaza, Manila",
  },
  {
    id: 2,
    docId: "DOC-2024-002",
    type: "Part-time",
    physicianName: "Dr. Michael Brown",
    license: "MD-12346",
    speciality: "Pediatrics",
    gender: "Male",
    contactNo: "+63 912 345 6790",
    email: "michael.brown@hospital.com",
    address: "456 Health Street, Quezon City",
  },
  {
    id: 3,
    docId: "DOC-2024-003",
    type: "Full-time",
    physicianName: "Dr. Emily Chen",
    license: "MD-12347",
    speciality: "Neurology",
    gender: "Female",
    contactNo: "+63 912 345 6791",
    email: "emily.chen@hospital.com",
    address: "789 Doctor's Lane, Makati",
  },
  {
    id: 4,
    docId: "DOC-2024-004",
    type: "Part-time",
    physicianName: "Dr. James Lee",
    license: "MD-12348",
    speciality: "Orthopedics",
    gender: "Male",
    contactNo: "+63 912 345 6792",
    email: "james.lee@hospital.com",
    address: "321 Medical Center, Taguig",
  },
  {
    id: 5,
    docId: "DOC-2024-005",
    type: "Full-time",
    physicianName: "Dr. Lisa Anderson",
    license: "MD-12349",
    speciality: "Dermatology",
    gender: "Female",
    contactNo: "+63 912 345 6793",
    email: "lisa.anderson@hospital.com",
    address: "654 Health Avenue, Pasig",
  },
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors] = useState(mockDoctors);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    Object.values(doctor).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Doctors Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doc ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Physician Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  License
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Contact #
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Address
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {doctor.docId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.physicianName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.license}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.speciality}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.contactNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doctor.address}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
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
