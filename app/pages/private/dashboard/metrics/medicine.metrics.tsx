import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const medicineSpendingData = [
  { month: 'Jan', spending: 845000, members: 2340, avgPerMember: 361 },
  { month: 'Feb', spending: 920000, members: 2680, avgPerMember: 343 },
  { month: 'Mar', spending: 1050000, members: 2890, avgPerMember: 363 },
  { month: 'Apr', spending: 980000, members: 2750, avgPerMember: 356 },
  { month: 'May', spending: 1120000, members: 3120, avgPerMember: 359 },
  { month: 'Jun', spending: 1240000, members: 3450, avgPerMember: 359 }
];

const drugTypeData = [
  { category: 'Cardiovascular', prescriptions: 1240, value: 420000, percentage: 33.9 },
  { category: 'Diabetes', prescriptions: 890, value: 280000, percentage: 22.6 },
  { category: 'Respiratory', prescriptions: 720, value: 180000, percentage: 14.5 },
  { category: 'Pain Relief', prescriptions: 650, value: 130000, percentage: 10.5 },
  { category: 'Antibiotics', prescriptions: 520, value: 120000, percentage: 9.7 },
  { category: 'Others', prescriptions: 430, value: 110000, percentage: 8.8 }
];

const topMedicinesData = [
  { medicine: 'Amlodipine', prescriptions: 420, stockouts: 2, availability: 97 },
  { medicine: 'Metformin', prescriptions: 380, stockouts: 1, availability: 98 },
  { medicine: 'Losartan', prescriptions: 350, stockouts: 3, availability: 95 },
  { medicine: 'Atorvastatin', prescriptions: 290, stockouts: 0, availability: 100 },
  { medicine: 'Omeprazole', prescriptions: 260, stockouts: 4, availability: 92 },
  { medicine: 'Aspirin', prescriptions: 240, stockouts: 1, availability: 98 },
  { medicine: 'Insulin', prescriptions: 180, stockouts: 5, availability: 89 },
  { medicine: 'Salbutamol', prescriptions: 160, stockouts: 2, availability: 96 },
  { medicine: 'Simvastatin', prescriptions: 140, stockouts: 1, availability: 98 },
  { medicine: 'Furosemide', prescriptions: 120, stockouts: 0, availability: 100 }
];

const stockStatusData = [
  { status: 'In Stock', count: 167, color: '#22c55e' },
  { status: 'Low Stock', count: 23, color: '#f59e0b' },
  { status: 'Out of Stock', count: 8, color: '#ef4444' }
];

export function MedicineMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Medicine KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly GAMOT Spending"
          value="₱1.24M"
          change={10.7}
          changeType="increase"
          description="Total medicine benefits used"
          target="₱1.3M"
          status="good"
        />
        <KPICard
          title="Members with Prescriptions"
          value="3,450"
          change={8.5}
          changeType="increase"
          description="Received at least 1 prescription"
          target="3,600"
          status="good"
        />
        <KPICard
          title="Average Value per Member"
          value="₱359"
          change={-1.1}
          changeType="decrease"
          description="Per member per month"
          target="₱400"
          status="good"
        />
        <KPICard
          title="Stock Availability"
          value="94"
          unit="%"
          change={2.3}
          changeType="increase"
          description="Top 10 medicines in stock"
          target="95"
          status="good"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Medicine Spending */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Medicine Spending</CardTitle>
            <CardDescription>
              GAMOT benefits utilization and average per member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={medicineSpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'spending' ? `₱${value.toLocaleString()}` : `₱${value}`,
                    name === 'spending' ? 'Total Spending' : 'Avg per Member'
                  ]}
                />
                <Bar yAxisId="left" dataKey="spending" fill="#8884d8" name="spending" />
                <Line yAxisId="right" type="monotone" dataKey="avgPerMember" stroke="#82ca9d" strokeWidth={2} name="avgPerMember" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drug Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Categories</CardTitle>
            <CardDescription>
              Distribution by therapeutic category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={drugTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {drugTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Medicines */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Medicines by Prescription Volume</CardTitle>
            <CardDescription>
              Most frequently prescribed medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMedicinesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="medicine" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="prescriptions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Stock Status</CardTitle>
            <CardDescription>
              Current availability status of medicines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Availability Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Medicine Availability</CardTitle>
          <CardDescription>
            Stock status and availability percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Medicine</th>
                  <th className="text-right p-2">Monthly Prescriptions</th>
                  <th className="text-right p-2">Stock-out Days</th>
                  <th className="text-right p-2">Availability %</th>
                  <th className="text-right p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topMedicinesData.map((med, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{med.medicine}</td>
                    <td className="text-right p-2">{med.prescriptions}</td>
                    <td className="text-right p-2">{med.stockouts}</td>
                    <td className="text-right p-2">{med.availability}%</td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        med.availability >= 95 ? 'bg-green-100 text-green-800' :
                        med.availability >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {med.availability >= 95 ? 'Good' : med.availability >= 90 ? 'Warning' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Medicine Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generic Prescription Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">87</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Prescriptions using generic names
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Days Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">28</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per prescription dispensed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formulary Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">92</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Prescriptions from approved list
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}