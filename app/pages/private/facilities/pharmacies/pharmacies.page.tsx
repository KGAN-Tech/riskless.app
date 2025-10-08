import { useState } from "react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";

// Mock data for pharmacies
const mockPharmacies = [
  {
    id: "1",
    name: "FTCC Pharmacy - Main Branch",
    address: "123 Health Street, Quezon City, Metro Manila",
    phone: "+63 2 1234 5678",
    email: "pharmacy@ftcc.com",
    manager: "Dr. Maria Santos",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "24/7",
    totalStaff: 12,
    totalInventory: 1250,
    monthlyRevenue: 85000,
    lastUpdated: "2024-03-15",
  },
  {
    id: "2",
    name: "FTCC Pharmacy - Makati Branch",
    address: "456 Medical Avenue, Makati City, Metro Manila",
    phone: "+63 2 2345 6789",
    email: "makati.pharmacy@ftcc.com",
    manager: "Dr. James Reyes",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "8:00 AM - 8:00 PM",
    totalStaff: 8,
    totalInventory: 890,
    monthlyRevenue: 65000,
    lastUpdated: "2024-03-14",
  },
  {
    id: "3",
    name: "FTCC Pharmacy - Cebu Branch",
    address: "789 Wellness Road, Cebu City, Cebu",
    phone: "+63 32 3456 7890",
    email: "cebu.pharmacy@ftcc.com",
    manager: "Dr. Sarah Tan",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "7:00 AM - 9:00 PM",
    totalStaff: 10,
    totalInventory: 1100,
    monthlyRevenue: 72000,
    lastUpdated: "2024-03-13",
  },
  {
    id: "4",
    name: "FTCC Pharmacy - Davao Branch",
    address: "321 Health Boulevard, Davao City, Davao del Sur",
    phone: "+63 82 4567 8901",
    email: "davao.pharmacy@ftcc.com",
    manager: "Dr. Michael Cruz",
    status: "Maintenance",
    type: "Hospital Pharmacy",
    operatingHours: "8:00 AM - 6:00 PM",
    totalStaff: 6,
    totalInventory: 750,
    monthlyRevenue: 45000,
    lastUpdated: "2024-03-12",
  },
  {
    id: "5",
    name: "FTCC Pharmacy - Iloilo Branch",
    address: "654 Medical Center Drive, Iloilo City, Iloilo",
    phone: "+63 33 5678 9012",
    email: "iloilo.pharmacy@ftcc.com",
    manager: "Dr. Lisa Anderson",
    status: "Active",
    type: "Hospital Pharmacy",
    operatingHours: "7:00 AM - 7:00 PM",
    totalStaff: 9,
    totalInventory: 980,
    monthlyRevenue: 58000,
    lastUpdated: "2024-03-11",
  },
];

export default function PharmaciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Filter pharmacies based on search and status
  const filteredPharmacies = mockPharmacies.filter((pharmacy) => {
    const matchesSearch = 
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || pharmacy.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
          <ol className="list-reset flex gap-2">
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li>/</li>
            <li className="text-gray-700 font-medium">Pharmacies</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-800">Pharmacy Management</h1>
        <p className="text-sm text-gray-500">Manage all pharmacy locations and operations</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search pharmacies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Pharmacy
          </Button>
        </div>
      </div>

      {/* Pharmacy Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading pharmacies...</div>
        ) : filteredPharmacies.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No pharmacies found.
          </div>
        ) : (
          filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {pharmacy.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Phone className="h-4 w-4" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{pharmacy.email}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    pharmacy.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : pharmacy.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pharmacy.status}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">Staff</p>
                  <p className="text-sm font-semibold">{pharmacy.totalStaff}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500">Inventory</p>
                  <p className="text-sm font-semibold">{pharmacy.totalInventory}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm font-semibold">₱{(pharmacy.monthlyRevenue / 1000).toFixed(0)}k</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <span className="font-medium">{pharmacy.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{pharmacy.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hours:</span>
                  <span className="font-medium">{pharmacy.operatingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span className="font-medium">
                    {new Date(pharmacy.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <Button 
                className="w-full mt-4"
                onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
              >
                View Details
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}