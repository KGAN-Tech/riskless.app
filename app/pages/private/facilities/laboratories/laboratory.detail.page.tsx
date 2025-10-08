import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  TestTube,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Download,
  Printer,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Activity,
  BarChart3,
  Shield,
  Award,
  Microscope,
  Beaker,
  FlaskConical,
} from "lucide-react";
import { getLaboratoryById } from "@/services/laboratory.service";
import type { Laboratory } from "@/types/laboratory.types";

export default function LaboratoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laboratory, setLaboratory] = useState<Laboratory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchLaboratory = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getLaboratoryById(id);
        setLaboratory(data);
      } catch (error) {
        console.error("Error fetching laboratory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaboratory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading laboratory details...</p>
        </div>
      </div>
    );
  }

  if (!laboratory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Laboratory Not Found</h2>
          <p className="text-gray-500 mb-4">The laboratory you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/laboratories")}>
            Back to Laboratories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/laboratories")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{laboratory.name}</h1>
            <p className="text-sm text-gray-500">Laboratory ID: {laboratory.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MoreVertical className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Laboratory
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Report
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-4 w-4" />
                Delete Laboratory
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <Badge
          variant={
            laboratory.status === "Active"
              ? "default"
              : laboratory.status === "Maintenance"
              ? "secondary"
              : "destructive"
          }
          className="flex items-center gap-2"
        >
          {laboratory.status === "Active" && <CheckCircle className="h-3 w-3" />}
          {laboratory.status === "Maintenance" && <AlertCircle className="h-3 w-3" />}
          {laboratory.status === "Inactive" && <XCircle className="h-3 w-3" />}
          {laboratory.status}
        </Badge>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-600">{laboratory.type}</span>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{laboratory.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{laboratory.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{laboratory.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Manager</p>
                    <p className="text-sm text-gray-600">{laboratory.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Operating Hours</p>
                    <p className="text-sm text-gray-600">{laboratory.operatingHours}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{laboratory.totalStaff}</p>
                  <p className="text-sm text-gray-600">Total Staff</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TestTube className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{laboratory.totalTests}</p>
                  <p className="text-sm text-gray-600">Total Tests</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{laboratory.monthlyTests}</p>
                  <p className="text-sm text-gray-600">Monthly Tests</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-orange-600">
                    {new Date(laboratory.lastUpdated).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Last Updated</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Accreditation Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Accreditation & Licensing
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Accreditation Number</p>
                <p className="text-sm text-gray-600">{laboratory.accreditationNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">License Number</p>
                <p className="text-sm text-gray-600">{laboratory.licenseNumber}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-blue-500" />
                Laboratory Services
              </h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {laboratory.services.map((service, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TestTube className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-gray-900">{service}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Microscope className="h-5 w-5 text-green-500" />
                Laboratory Equipment
              </h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {laboratory.equipment.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-gray-900">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Certifications & Accreditations
              </h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Certification
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {laboratory.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span className="font-medium text-gray-900">{cert}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Test Volume Trends
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart placeholder - Test volume over time</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Service Distribution
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart placeholder - Service breakdown</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Performance Metrics
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">98.5%</p>
                <p className="text-sm text-gray-600">Accuracy Rate</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">2.3 hrs</p>
                <p className="text-sm text-gray-600">Average Turnaround</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">99.2%</p>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
