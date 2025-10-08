import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table";
import { Badge } from "@/components/atoms/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, CheckCircle, Building2, Calendar, TrendingDown } from "lucide-react";

// Mock data for different facilities
const facilitiesData = {
  "all": {
    name: "All Facilities",
    totalRevenue: 2450000,
    totalExpenses: 1680000,
    successfulClaims: 1245,
    totalClaims: 1380,
    dailyData: [
      { period: "Sep 15", revenue: 12500, expenses: 8200 },
      { period: "Sep 16", revenue: 14200, expenses: 9100 },
      { period: "Sep 17", revenue: 11800, expenses: 7800 },
      { period: "Sep 18", revenue: 15600, expenses: 10200 },
      { period: "Sep 19", revenue: 13900, expenses: 9500 },
    ],
    monthlyData: [
      { period: "Jan", revenue: 185000, expenses: 125000 },
      { period: "Feb", revenue: 220000, expenses: 148000 },
      { period: "Mar", revenue: 195000, expenses: 132000 },
      { period: "Apr", revenue: 285000, expenses: 195000 },
      { period: "May", revenue: 315000, expenses: 215000 },
      { period: "Jun", revenue: 295000, expenses: 198000 },
    ],
    yearlyData: [
      { period: "2020", revenue: 1850000, expenses: 1320000 },
      { period: "2021", revenue: 2100000, expenses: 1450000 },
      { period: "2022", revenue: 2250000, expenses: 1580000 },
      { period: "2023", revenue: 2380000, expenses: 1620000 },
      { period: "2024", revenue: 2450000, expenses: 1680000 },
    ],
    history: [
      { id: "CLM-2024-001", date: "2024-09-15", type: "Insurance Claim", amount: 15750, status: "approved", facility: "Downtown Medical" },
      { id: "CLM-2024-002", date: "2024-09-14", type: "Medicare", amount: 8900, status: "approved", facility: "Northside Clinic" },
      { id: "CLM-2024-003", date: "2024-09-13", type: "Private Pay", amount: 2300, status: "pending", facility: "Downtown Medical" },
      { id: "CLM-2024-004", date: "2024-09-12", type: "Medicaid", amount: 4200, status: "approved", facility: "Westside Hospital" },
      { id: "CLM-2024-005", date: "2024-09-11", type: "Insurance Claim", amount: 22100, status: "approved", facility: "Downtown Medical" },
      { id: "CLM-2024-006", date: "2024-09-10", type: "Medicare", amount: 6700, status: "rejected", facility: "Northside Clinic" },
      { id: "CLM-2024-007", date: "2024-09-09", type: "Private Pay", amount: 1850, status: "approved", facility: "Eastside Care" },
      { id: "CLM-2024-008", date: "2024-09-08", type: "Insurance Claim", amount: 18900, status: "approved", facility: "Westside Hospital" },
    ]
  },
  "downtown": {
    name: "Downtown Medical",
    totalRevenue: 890000,
    totalExpenses: 610000,
    successfulClaims: 445,
    totalClaims: 490,
    dailyData: [
      { period: "Sep 15", revenue: 4200, expenses: 2800 },
      { period: "Sep 16", revenue: 4800, expenses: 3200 },
      { period: "Sep 17", revenue: 3900, expenses: 2600 },
      { period: "Sep 18", revenue: 5200, expenses: 3500 },
      { period: "Sep 19", revenue: 4600, expenses: 3100 },
    ],
    monthlyData: [
      { period: "Jan", revenue: 65000, expenses: 44000 },
      { period: "Feb", revenue: 78000, expenses: 53000 },
      { period: "Mar", revenue: 72000, expenses: 49000 },
      { period: "Apr", revenue: 95000, expenses: 65000 },
      { period: "May", revenue: 105000, expenses: 72000 },
      { period: "Jun", revenue: 98000, expenses: 67000 },
    ],
    yearlyData: [
      { period: "2020", revenue: 650000, expenses: 450000 },
      { period: "2021", revenue: 720000, expenses: 495000 },
      { period: "2022", revenue: 780000, expenses: 535000 },
      { period: "2023", revenue: 850000, expenses: 580000 },
      { period: "2024", revenue: 890000, expenses: 610000 },
    ],
    history: [
      { id: "CLM-2024-001", date: "2024-09-15", type: "Insurance Claim", amount: 15750, status: "approved", facility: "Downtown Medical" },
      { id: "CLM-2024-003", date: "2024-09-13", type: "Private Pay", amount: 2300, status: "pending", facility: "Downtown Medical" },
      { id: "CLM-2024-005", date: "2024-09-11", type: "Insurance Claim", amount: 22100, status: "approved", facility: "Downtown Medical" },
    ]
  },
  "northside": {
    name: "Northside Clinic",
    totalRevenue: 620000,
    totalExpenses: 420000,
    successfulClaims: 312,
    totalClaims: 345,
    dailyData: [
      { period: "Sep 15", revenue: 3100, expenses: 2100 },
      { period: "Sep 16", revenue: 3500, expenses: 2400 },
      { period: "Sep 17", revenue: 2900, expenses: 1950 },
      { period: "Sep 18", revenue: 3800, expenses: 2600 },
      { period: "Sep 19", revenue: 3400, expenses: 2300 },
    ],
    monthlyData: [
      { period: "Jan", revenue: 45000, expenses: 31000 },
      { period: "Feb", revenue: 52000, expenses: 36000 },
      { period: "Mar", revenue: 48000, expenses: 33000 },
      { period: "Apr", revenue: 68000, expenses: 47000 },
      { period: "May", revenue: 75000, expenses: 52000 },
      { period: "Jun", revenue: 71000, expenses: 49000 },
    ],
    yearlyData: [
      { period: "2020", revenue: 480000, expenses: 330000 },
      { period: "2021", revenue: 520000, expenses: 360000 },
      { period: "2022", revenue: 560000, expenses: 385000 },
      { period: "2023", revenue: 590000, expenses: 405000 },
      { period: "2024", revenue: 620000, expenses: 420000 },
    ],
    history: [
      { id: "CLM-2024-002", date: "2024-09-14", type: "Medicare", amount: 8900, status: "approved", facility: "Northside Clinic" },
      { id: "CLM-2024-006", date: "2024-09-10", type: "Medicare", amount: 6700, status: "rejected", facility: "Northside Clinic" },
    ]
  },
  "westside": {
    name: "Westside Hospital",
    totalRevenue: 1150000,
    totalExpenses: 790000,
    successfulClaims: 578,
    totalClaims: 625,
    dailyData: [
      { period: "Sep 15", revenue: 5800, expenses: 3950 },
      { period: "Sep 16", revenue: 6200, expenses: 4200 },
      { period: "Sep 17", revenue: 5400, expenses: 3680 },
      { period: "Sep 18", revenue: 7100, expenses: 4850 },
      { period: "Sep 19", revenue: 6500, expenses: 4420 },
    ],
    monthlyData: [
      { period: "Jan", revenue: 85000, expenses: 58000 },
      { period: "Feb", revenue: 95000, expenses: 65000 },
      { period: "Mar", revenue: 88000, expenses: 60000 },
      { period: "Apr", revenue: 115000, expenses: 78000 },
      { period: "May", revenue: 125000, expenses: 85000 },
      { period: "Jun", revenue: 118000, expenses: 80000 },
    ],
    yearlyData: [
      { period: "2020", revenue: 890000, expenses: 610000 },
      { period: "2021", revenue: 980000, expenses: 670000 },
      { period: "2022", revenue: 1050000, expenses: 720000 },
      { period: "2023", revenue: 1100000, expenses: 755000 },
      { period: "2024", revenue: 1150000, expenses: 790000 },
    ],
    history: [
      { id: "CLM-2024-004", date: "2024-09-12", type: "Medicaid", amount: 4200, status: "approved", facility: "Westside Hospital" },
      { id: "CLM-2024-008", date: "2024-09-08", type: "Insurance Claim", amount: 18900, status: "approved", facility: "Westside Hospital" },
    ]
  }
};

export function BillingPage() {
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [timePeriod, setTimePeriod] = useState("monthly");
  const currentData = facilitiesData[selectedFacility as keyof typeof facilitiesData];

  const successRate = Math.round((currentData.successfulClaims / currentData.totalClaims) * 100);
  const profitMargin = Math.round(((currentData.totalRevenue - currentData.totalExpenses) / currentData.totalRevenue) * 100);

  const getChartData = () => {
    switch (timePeriod) {
      case "daily":
        return currentData.dailyData;
      case "yearly":
        return currentData.yearlyData;
      default:
        return currentData.monthlyData;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mb-2">Billing Dashboard</h1>
          <p className="text-muted-foreground">
            Track revenue, claims, and expenses across facilities
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="downtown">Downtown Medical</SelectItem>
                <SelectItem value="northside">Northside Clinic</SelectItem>
                <SelectItem value="westside">Westside Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentData.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {profitMargin}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.successfulClaims.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currentData.totalRevenue - currentData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Revenue performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses Overview</CardTitle>
            <CardDescription>
              Operating expenses tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Claims History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims & Revenue History</CardTitle>
          <CardDescription>
            Latest transactions and claim processing for {currentData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                {selectedFacility === "all" && <TableHead>Facility</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.history.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono">{claim.id}</TableCell>
                  <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>{formatCurrency(claim.amount)}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  {selectedFacility === "all" && <TableCell>{claim.facility}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}