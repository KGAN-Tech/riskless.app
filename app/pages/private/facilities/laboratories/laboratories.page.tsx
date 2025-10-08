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
  TestTube,
  TrendingUp,
  Calendar,
  Upload,
  Filter,
  Globe,
  Shield,
  Activity,
  Microscope,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockLaboratories } from "@/services/laboratory.service";
import type { Laboratory } from "@/types/laboratory.types";

export default function LaboratoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Filter laboratories based on search and filters
  const filteredLaboratories = mockLaboratories.filter((laboratory) => {
    const matchesSearch = 
      laboratory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laboratory.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laboratory.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laboratory.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || laboratory.status === filterStatus;
    const matchesType = filterType === "all" || laboratory.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      alert("File uploaded successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
          <ol className="list-reset flex gap-2">
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li>/</li>
            <li className="text-gray-700 font-medium">Laboratories</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-800">Laboratory Management</h1>
        <p className="text-sm text-gray-500">Manage all laboratory locations and diagnostic services</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search laboratories..."
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="Clinical Laboratory">Clinical Laboratory</option>
            <option value="Diagnostic Center">Diagnostic Center</option>
            <option value="Research Laboratory">Research Laboratory</option>
            <option value="Hospital Laboratory">Hospital Laboratory</option>
            <option value="Specialized Laboratory">Specialized Laboratory</option>
          </select>
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button variant="outline" className="flex items-center gap-2" disabled={uploading}>
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Import"}
            </Button>
          </label>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Laboratory
          </Button>
        </div>
      </div>

      {/* Laboratory Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading laboratories...</div>
        ) : filteredLaboratories.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No laboratories found.
          </div>
        ) : (
          filteredLaboratories.map((laboratory) => (
            <Card key={laboratory.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {laboratory.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{laboratory.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Phone className="h-4 w-4" />
                    <span>{laboratory.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{laboratory.email}</span>
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
                      onClick={() => navigate(`/laboratories/${laboratory.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Manage Services
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
                    laboratory.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : laboratory.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {laboratory.status}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">Staff</p>
                  <p className="text-sm font-semibold">{laboratory.totalStaff}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TestTube className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500">Tests</p>
                  <p className="text-sm font-semibold">{laboratory.totalTests}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500">Monthly</p>
                  <p className="text-sm font-semibold">{laboratory.monthlyTests}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <span className="font-medium">{laboratory.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{laboratory.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hours:</span>
                  <span className="font-medium">{laboratory.operatingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span className="font-medium">
                    {new Date(laboratory.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Services Preview */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {laboratory.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-blue-50 text-blue-700"
                    >
                      {service}
                    </span>
                  ))}
                  {laboratory.services.length > 3 && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-gray-50 text-gray-600">
                      +{laboratory.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Certifications Preview */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {laboratory.certifications.slice(0, 2).map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-50 text-green-700"
                    >
                      {cert}
                    </span>
                  ))}
                  {laboratory.certifications.length > 2 && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-gray-50 text-gray-600">
                      +{laboratory.certifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* View Details Button */}
              <Button 
                className="w-full mt-4"
                onClick={() => navigate(`/laboratories/${laboratory.id}`)}
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