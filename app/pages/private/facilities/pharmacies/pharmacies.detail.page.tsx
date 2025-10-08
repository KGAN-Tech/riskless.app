import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table";
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
  Package,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  User,
  Pill,
  Activity,
  BarChart3,
  Settings,
  Shield,
  Award,
} from "lucide-react";

// Mock data for pharmacy details
const mockPharmacyDetails = {
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
  description: "Our flagship pharmacy providing comprehensive pharmaceutical services with state-of-the-art facilities and experienced pharmacists.",
  licenseNumber: "PH-2024-001",
  accreditation: "PhilHealth Accredited",
  services: [
    "Prescription Dispensing",
    "Over-the-Counter Medications",
    "Compounding Services",
    "Medication Counseling",
    "Health Supplements",
    "Medical Equipment",
    "Vaccination Services",
    "Health Screenings"
  ],
  facilities: [
    "Modern Dispensing Area",
    "Consultation Room",
    "Cold Storage",
    "Compounding Lab",
    "Patient Waiting Area",
    "Emergency Supply Storage"
  ],
  staff: [
    {
      id: "1",
      name: "Dr. Maria Santos",
      position: "Pharmacy Manager",
      email: "maria.santos@ftcc.com",
      phone: "+63 917 123 4567",
      status: "Active",
      joinDate: "2020-01-15",
      specialization: "Clinical Pharmacy",
      license: "PRC-12345"
    },
    {
      id: "2",
      name: "John Dela Cruz",
      position: "Senior Pharmacist",
      email: "john.delacruz@ftcc.com",
      phone: "+63 917 234 5678",
      status: "Active",
      joinDate: "2021-03-20",
      specialization: "Drug Information",
      license: "PRC-23456"
    },
    {
      id: "3",
      name: "Sarah Garcia",
      position: "Pharmacist",
      email: "sarah.garcia@ftcc.com",
      phone: "+63 917 345 6789",
      status: "Active",
      joinDate: "2022-06-10",
      specialization: "Compounding",
      license: "PRC-34567"
    },
    {
      id: "4",
      name: "Michael Tan",
      position: "Pharmacy Technician",
      email: "michael.tan@ftcc.com",
      phone: "+63 917 456 7890",
      status: "Active",
      joinDate: "2023-01-15",
      specialization: "Inventory Management",
      license: "PTC-45678"
    }
  ],
  inventory: [
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Analgesics",
      quantity: 500,
      unit: "tablets",
      expiryDate: "2025-12-31",
      supplier: "Unilab",
      price: 0.50,
      status: "In Stock"
    },
    {
      id: "2",
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      quantity: 200,
      unit: "capsules",
      expiryDate: "2024-08-15",
      supplier: "Pfizer",
      price: 2.50,
      status: "Low Stock"
    },
    {
      id: "3",
      name: "Omeprazole 20mg",
      category: "Gastrointestinal",
      quantity: 150,
      unit: "capsules",
      expiryDate: "2025-06-30",
      supplier: "AstraZeneca",
      price: 8.75,
      status: "In Stock"
    },
    {
      id: "4",
      name: "Metformin 500mg",
      category: "Antidiabetic",
      quantity: 300,
      unit: "tablets",
      expiryDate: "2025-03-15",
      supplier: "Merck",
      price: 1.25,
      status: "In Stock"
    }
  ],
  recentTransactions: [
    {
      id: "1",
      date: "2024-03-15",
      patientName: "Juan Dela Cruz",
      items: 3,
      total: 125.50,
      status: "Completed",
      pharmacist: "Dr. Maria Santos"
    },
    {
      id: "2",
      date: "2024-03-15",
      patientName: "Maria Garcia",
      items: 2,
      total: 89.75,
      status: "Completed",
      pharmacist: "John Dela Cruz"
    },
    {
      id: "3",
      date: "2024-03-14",
      patientName: "Pedro Santos",
      items: 5,
      total: 234.00,
      status: "Completed",
      pharmacist: "Sarah Garcia"
    },
    {
      id: "4",
      date: "2024-03-14",
      patientName: "Ana Reyes",
      items: 1,
      total: 45.25,
      status: "Pending",
      pharmacist: "Michael Tan"
    }
  ],
  performance: {
    monthlyRevenue: 85000,
    monthlyTransactions: 1250,
    averageTransactionValue: 68.00,
    customerSatisfaction: 4.8,
    prescriptionAccuracy: 99.5,
    inventoryTurnover: 3.2
  }
};

export default function PharmaciesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState(mockPharmacyDetails);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, fetch pharmacy details by ID
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPharmacy(mockPharmacyDetails);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading pharmacy details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/pharmacies")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pharmacies
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Pharmacy
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
                Delete Pharmacy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{pharmacy.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{pharmacy.description}</p>
          </div>
          <Badge className={getStatusColor(pharmacy.status)}>
            {pharmacy.status}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-xl font-semibold">{pharmacy.totalStaff}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inventory Items</p>
              <p className="text-xl font-semibold">{pharmacy.totalInventory}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-xl font-semibold">₱{(pharmacy.monthlyRevenue / 1000).toFixed(0)}k</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Satisfaction</p>
              <p className="text-xl font-semibold">{pharmacy.performance.customerSatisfaction}/5.0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{pharmacy.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{pharmacy.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{pharmacy.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Operating Hours</p>
                    <p className="font-medium">{pharmacy.operatingHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Manager</p>
                    <p className="font-medium">{pharmacy.manager}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Services & Facilities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Services & Facilities
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Services Offered</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pharmacy.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Facilities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pharmacy.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-blue-500" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₱{(pharmacy.performance.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{pharmacy.performance.monthlyTransactions}</p>
                <p className="text-sm text-gray-500">Monthly Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">₱{pharmacy.performance.averageTransactionValue}</p>
                <p className="text-sm text-gray-500">Avg. Transaction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{pharmacy.performance.customerSatisfaction}</p>
                <p className="text-sm text-gray-500">Satisfaction Rating</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pharmacy Staff</h3>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacy.staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.specialization}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Inventory Management</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacy.inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.quantity}</p>
                        <p className="text-sm text-gray-500">{item.unit}</p>
                      </div>
                    </TableCell>
                    <TableCell>₱{item.price.toFixed(2)}</TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getInventoryStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pharmacist</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacy.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.patientName}</TableCell>
                    <TableCell>{transaction.items} items</TableCell>
                    <TableCell>₱{transaction.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getTransactionStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.pharmacist}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                            Print Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Monthly Revenue</span>
                  <span className="font-semibold">₱{(pharmacy.performance.monthlyRevenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Average Transaction</span>
                  <span className="font-semibold">₱{pharmacy.performance.averageTransactionValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Transactions</span>
                  <span className="font-semibold">{pharmacy.performance.monthlyTransactions}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Customer Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{pharmacy.performance.customerSatisfaction}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Prescription Accuracy</span>
                  <span className="font-semibold">{pharmacy.performance.prescriptionAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Inventory Turnover</span>
                  <span className="font-semibold">{pharmacy.performance.inventoryTurnover}x</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Performance charts and analytics will be displayed here</p>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pharmacy Settings
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">License Number</label>
                  <p className="text-sm text-gray-500">{pharmacy.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Accreditation</label>
                  <p className="text-sm text-gray-500">{pharmacy.accreditation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Pharmacy Type</label>
                  <p className="text-sm text-gray-500">{pharmacy.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-500">{new Date(pharmacy.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button>Edit Settings</Button>
                <Button variant="outline">Export Configuration</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Permissions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Enhanced security for pharmacy access</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Audit Logs</p>
                  <p className="text-sm text-gray-500">Track all pharmacy activities</p>
                </div>
                <Button variant="outline" size="sm">View Logs</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
