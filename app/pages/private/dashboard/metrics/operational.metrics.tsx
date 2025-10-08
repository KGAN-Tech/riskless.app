import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const waitTimeData = [
  { month: 'Jan', consultation: 18, laboratory: 25, pharmacy: 12 },
  { month: 'Feb', consultation: 16, laboratory: 23, pharmacy: 11 },
  { month: 'Mar', consultation: 15, laboratory: 21, pharmacy: 10 },
  { month: 'Apr', consultation: 17, laboratory: 24, pharmacy: 13 },
  { month: 'May', consultation: 14, laboratory: 19, pharmacy: 9 },
  { month: 'Jun', consultation: 13, laboratory: 18, pharmacy: 8 }
];

const noShowData = [
  { month: 'Jan', scheduled: 2840, attended: 2380, noShows: 460, rate: 16.2 },
  { month: 'Feb', scheduled: 3120, attended: 2650, noShows: 470, rate: 15.1 },
  { month: 'Mar', scheduled: 3450, attended: 2940, noShows: 510, rate: 14.8 },
  { month: 'Apr', scheduled: 3280, attended: 2820, noShows: 460, rate: 14.0 },
  { month: 'May', scheduled: 3890, attended: 3350, noShows: 540, rate: 13.9 },
  { month: 'Jun', scheduled: 4120, attended: 3580, noShows: 540, rate: 13.1 }
];

const staffingData = [
  { clinic: 'Main Clinic', doctors: 8, nurses: 12, support: 6, patientRatio: 160 },
  { clinic: 'Branch A', doctors: 4, nurses: 6, support: 3, patientRatio: 185 },
  { clinic: 'Branch B', doctors: 3, nurses: 5, support: 2, patientRatio: 198 },
  { clinic: 'Mobile Unit 1', doctors: 2, nurses: 3, support: 1, patientRatio: 220 },
  { clinic: 'Mobile Unit 2', doctors: 2, nurses: 3, support: 1, patientRatio: 215 }
];

const resourceUtilizationData = [
  { resource: 'Consultation Rooms', capacity: 12, utilization: 85 },
  { resource: 'Laboratory', capacity: 4, utilization: 78 },
  { resource: 'Pharmacy', capacity: 3, utilization: 92 },
  { resource: 'X-Ray', capacity: 2, utilization: 65 },
  { resource: 'ECG', capacity: 2, utilization: 58 }
];

const operationalCostsData = [
  { month: 'Jan', personnel: 850000, supplies: 320000, utilities: 45000, maintenance: 28000 },
  { month: 'Feb', personnel: 850000, supplies: 340000, utilities: 48000, maintenance: 32000 },
  { month: 'Mar', personnel: 870000, supplies: 380000, utilities: 42000, maintenance: 25000 },
  { month: 'Apr', personnel: 870000, supplies: 360000, utilities: 46000, maintenance: 38000 },
  { month: 'May', personnel: 890000, supplies: 420000, utilities: 51000, maintenance: 29000 },
  { month: 'Jun', personnel: 890000, supplies: 450000, utilities: 49000, maintenance: 35000 }
];

export function OperationalMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Average Wait Time"
          value="13"
          unit="min"
          change={-7.1}
          changeType="decrease"
          description="For consultation"
          target="15"
          status="good"
        />
        <KPICard
          title="No-Show Rate"
          value="13.1"
          unit="%"
          change={-2.1}
          changeType="decrease"
          description="For scheduled follow-ups"
          target="12"
          status="warning"
        />
        <KPICard
          title="Staff-to-Patient Ratio"
          value="178"
          change={-3.4}
          changeType="decrease"
          description="Patients per staff member"
          target="150"
          status="warning"
        />
        <KPICard
          title="Resource Utilization"
          value="76"
          unit="%"
          change={4.2}
          changeType="increase"
          description="Average facility utilization"
          target="80"
          status="good"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wait Times Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Average Wait Times</CardTitle>
            <CardDescription>
              Wait times for different services over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, '']} />
                <Line type="monotone" dataKey="consultation" stroke="#8884d8" strokeWidth={2} name="Consultation" />
                <Line type="monotone" dataKey="laboratory" stroke="#82ca9d" strokeWidth={2} name="Laboratory" />
                <Line type="monotone" dataKey="pharmacy" stroke="#ffc658" strokeWidth={2} name="Pharmacy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* No-Show Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment No-Show Analysis</CardTitle>
            <CardDescription>
              Scheduled vs attended appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={noShowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Scheduled" />
                <Area type="monotone" dataKey="attended" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Attended" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staffing Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Staffing Distribution by Clinic</CardTitle>
            <CardDescription>
              Staff count and patient-to-staff ratio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="clinic" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="doctors" fill="#8884d8" name="Doctors" />
                <Bar yAxisId="left" dataKey="nurses" fill="#82ca9d" name="Nurses" />
                <Bar yAxisId="left" dataKey="support" fill="#ffc658" name="Support Staff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization Rates</CardTitle>
            <CardDescription>
              Utilization percentage by resource type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceUtilizationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="resource" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Bar dataKey="utilization" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operational Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Operational Costs</CardTitle>
          <CardDescription>
            Breakdown of operational expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={operationalCostsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="personnel" stackId="1" stroke="#8884d8" fill="#8884d8" name="Personnel" />
              <Area type="monotone" dataKey="supplies" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Supplies" />
              <Area type="monotone" dataKey="utilities" stackId="1" stroke="#ffc658" fill="#ffc658" name="Utilities" />
              <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#ff7c7c" fill="#ff7c7c" name="Maintenance" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Operational Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Clinic</th>
                    <th className="text-right p-2">Total Staff</th>
                    <th className="text-right p-2">Patient Ratio</th>
                    <th className="text-right p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffingData.map((clinic, index) => {
                    const totalStaff = clinic.doctors + clinic.nurses + clinic.support;
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{clinic.clinic}</td>
                        <td className="text-right p-2">{totalStaff}</td>
                        <td className="text-right p-2">{clinic.patientRatio}:1</td>
                        <td className="text-right p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            clinic.patientRatio <= 160 ? 'bg-green-100 text-green-800' :
                            clinic.patientRatio <= 200 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {clinic.patientRatio <= 160 ? 'Optimal' : clinic.patientRatio <= 200 ? 'Adequate' : 'Understaffed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Operational Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Key Operational Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Consultation Time</span>
                <span className="font-medium">18 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Patient Satisfaction (Wait Time)</span>
                <span className="font-medium">82%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Equipment Downtime</span>
                <span className="font-medium">2.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Staff Overtime Rate</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Supply Stock-out Incidents</span>
                <span className="font-medium">3 this month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Cost per Patient</span>
                <span className="font-medium">₱12.50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">8-11 AM</span>
              <span className="text-sm text-muted-foreground">busiest</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              40% of daily consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Check-in Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">34</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Patients using online check-in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">4.2</span>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average response to emergencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facility Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">96</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Equipment operational status
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}