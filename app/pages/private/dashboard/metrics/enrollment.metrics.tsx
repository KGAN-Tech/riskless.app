import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const enrollmentData = [
  { month: 'Jan', new: 1240, existing: 8950, fpe: 1180, target: 1300 },
  { month: 'Feb', new: 1380, existing: 10330, fpe: 1320, target: 1400 },
  { month: 'Mar', new: 1520, existing: 11850, fpe: 1450, target: 1500 },
  { month: 'Apr', new: 1450, existing: 13300, fpe: 1380, target: 1500 },
  { month: 'May', new: 1680, existing: 14980, fpe: 1620, target: 1600 },
  { month: 'Jun', new: 1820, existing: 16800, fpe: 1750, target: 1800 }
];

const memberTypeData = [
  { type: 'Indigent', count: 5847, percentage: 45.5 },
  { type: 'Sponsored', count: 3920, percentage: 30.5 },
  { type: 'Contributory', count: 2180, percentage: 17.0 },
  { type: 'Others', count: 900, percentage: 7.0 }
];

const retentionData = [
  { period: '1 Month', retained: 92 },
  { period: '3 Months', retained: 85 },
  { period: '6 Months', retained: 78 },
  { period: '12 Months', retained: 71 }
];

const ageGroupData = [
  { age: '0-17', male: 1200, female: 1150 },
  { age: '18-35', male: 2100, female: 2350 },
  { age: '36-59', male: 1890, female: 2180 },
  { age: '60+', male: 980, female: 1196 }
];

export function EnrollmentMetrics({ filters, metrics }: { filters: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Enrollment KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="YAKAP Registration Rate"
          value="68"
          unit="%"
          change={4.2}
          changeType="increase"
          description="Of PhilHealth members registered"
          target="75"
          status="good"
        />
        <KPICard
          title="First Patient Encounters"
          value="1,750"
          change={7.5}
          changeType="increase"
          description="FPE completed in June"
          target="1,800"
          status="good"
        />
        <KPICard
          title="Active Enrollees"
          value="12,847"
          change={15.2}
          changeType="increase"
          description="Currently active members"
          target="15,000"
          status="good"
        />
        <KPICard
          title="12-Month Retention"
          value="71"
          unit="%"
          change={-2.1}
          changeType="decrease"
          description="Members retained after 1 year"
          target="75"
          status="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Enrollment Trends</CardTitle>
            <CardDescription>
              New registrations vs. First Patient Encounters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="new" fill="#8884d8" name="New Registrations" />
                <Bar dataKey="fpe" fill="#82ca9d" name="First Patient Encounters" />
                <Bar dataKey="target" fill="#ffc658" name="Target" fillOpacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Member Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Member Types Distribution</CardTitle>
            <CardDescription>
              Breakdown by PhilHealth member category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memberTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                >
                  {memberTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Members']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Member Retention Analysis</CardTitle>
            <CardDescription>
              Percentage of members who continue using services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                <Line type="monotone" dataKey="retained" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age and Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age & Gender Distribution</CardTitle>
            <CardDescription>
              Member demographics by age group and gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageGroupData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="age" type="category" />
                <Tooltip />
                <Bar dataKey="male" fill="#8884d8" name="Male" />
                <Bar dataKey="female" fill="#82ca9d" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Registration Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">3.2</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              From registration to first visit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">37.8</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Members using services per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catchment Area Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">68</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Of total PhilHealth members in area
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}