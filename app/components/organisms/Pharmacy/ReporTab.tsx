import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Package, TrendingUp, Download, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/button';

export function ReportsTab() {
  const [timeFilter, setTimeFilter] = useState('today');

  // Mock data for charts
  const dailyDispensing = [
    { date: '2024-01-15', medicines: 45, amount: 1250.50 },
    { date: '2024-01-14', medicines: 38, amount: 950.25 },
    { date: '2024-01-13', medicines: 52, amount: 1480.75 },
    { date: '2024-01-12', medicines: 41, amount: 1125.00 },
    { date: '2024-01-11', medicines: 35, amount: 875.50 },
    { date: '2024-01-10', medicines: 48, amount: 1320.25 },
    { date: '2024-01-09', medicines: 44, amount: 1180.00 }
  ];

  const monthlyDispensing = [
    { month: 'Jan', medicines: 1250, amount: 35420.50 },
    { month: 'Dec', medicines: 1180, amount: 32850.25 },
    { month: 'Nov', medicines: 1320, amount: 38920.75 },
    { month: 'Oct', medicines: 1285, amount: 36180.00 },
    { month: 'Sep', medicines: 1156, amount: 31250.50 },
    { month: 'Aug', medicines: 1425, amount: 42150.25 }
  ];

  const topMedicines = [
    { name: 'Paracetamol 500mg', dispensed: 185, value: 925.00, color: '#3B82F6' },
    { name: 'Metformin 500mg', dispensed: 142, value: 2130.00, color: '#1D4ED8' },
    { name: 'Amlodipine 5mg', dispensed: 98, value: 1470.00, color: '#1E40AF' },
    { name: 'Amoxicillin 500mg', dispensed: 76, value: 1520.00, color: '#1E3A8A' },
    { name: 'Insulin Glargine', dispensed: 45, value: 2250.00, color: '#172554' }
  ];

  const categoryDispensing = [
    { category: 'Analgesic', value: 35, color: '#3B82F6' },
    { category: 'Antidiabetic', value: 25, color: '#1D4ED8' },
    { category: 'Cardiovascular', value: 20, color: '#1E40AF' },
    { category: 'Antibiotic', value: 15, color: '#1E3A8A' },
    { category: 'Others', value: 5, color: '#172554' }
  ];

  // Calculate summary stats based on time filter
  const getSummaryStats = () => {
    switch (timeFilter) {
      case 'today':
        return {
          totalDispensed: 45,
          totalAmount: 1250.50,
          totalPatients: 28,
          avgPerPatient: 1.6
        };
      case 'week':
        return {
          totalDispensed: 303,
          totalAmount: 8206.25,
          totalPatients: 185,
          avgPerPatient: 1.6
        };
      case 'month':
        return {
          totalDispensed: 1250,
          totalAmount: 35420.50,
          totalPatients: 785,
          avgPerPatient: 1.6
        };
      case 'year':
        return {
          totalDispensed: 14965,
          totalAmount: 425840.25,
          totalPatients: 9350,
          avgPerPatient: 1.6
        };
      default:
        return {
          totalDispensed: 45,
          totalAmount: 1250.50,
          totalPatients: 28,
          avgPerPatient: 1.6
        };
    }
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-blue-900 text-xl font-semibold">Dispensing Reports</h2>
          <p className="text-blue-600">Analytics and insights for medicine dispensing</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40 border-blue-200">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-200 text-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm">Total Dispensed</p>
                <p className="text-blue-900 text-2xl font-semibold">{stats.totalDispensed}</p>
                <p className="text-blue-500 text-xs">medicines</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Total Amount</p>
                <p className="text-green-900 text-2xl font-semibold">${stats.totalAmount.toFixed(2)}</p>
                <p className="text-green-500 text-xs">revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm">Patients Served</p>
                <p className="text-purple-900 text-2xl font-semibold">{stats.totalPatients}</p>
                <p className="text-purple-500 text-xs">unique patients</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm">Avg per Patient</p>
                <p className="text-orange-900 text-2xl font-semibold">{stats.avgPerPatient}</p>
                <p className="text-orange-500 text-xs">medicines</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
  <TabsList className="bg-blue-100 border border-blue-200">
    <TabsTrigger 
      value="trends" 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
    >
      Trends
    </TabsTrigger>
    <TabsTrigger 
      value="medicines" 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
    >
      Top Medicines
    </TabsTrigger>
    <TabsTrigger 
      value="categories" 
      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700"
    >
      Categories
    </TabsTrigger>
  </TabsList>

  {/* Trends */}
  <TabsContent value="trends" className="mt-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-blue-900">Daily Dispensing Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyDispensing}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Line type="monotone" dataKey="medicines" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-blue-900">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyDispensing}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </TabsContent>

  {/* Top Medicines */}
  <TabsContent value="medicines" className="mt-6">
    <Card className="border-blue-100 bg-white">
      <CardHeader>
        <CardTitle className="text-blue-900">Top Dispensed Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMedicines.map((medicine, index) => (
            <div 
              key={medicine.name} 
              className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium" 
                  style={{ backgroundColor: medicine.color }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-blue-900 font-medium">{medicine.name}</p>
                  <p className="text-blue-600 text-sm">{medicine.dispensed} units dispensed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-900 font-medium">${medicine.value.toFixed(2)}</p>
                <p className="text-blue-600 text-sm">total value</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Categories */}
  <TabsContent value="categories" className="mt-6">
    <Card className="border-blue-100 bg-white">
      <CardHeader>
        <CardTitle className="text-blue-900">Dispensing by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDispensing}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.category}: ${entry.value}%`}
                >
                  {categoryDispensing.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 space-y-3">
            {categoryDispensing.map((category) => (
              <div 
                key={category.category} 
                className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-blue-900 font-medium">{category.category}</span>
                </div>
                <span className="text-blue-700">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>

    </div>
  );
}