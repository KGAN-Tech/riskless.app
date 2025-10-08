import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const consultationData = [
  { month: 'Jan', consultations: 3420, perMember: 2.8, labTests: 1840 },
  { month: 'Feb', consultations: 3680, perMember: 3.1, labTests: 1920 },
  { month: 'Mar', consultations: 4100, perMember: 3.4, labTests: 2180 },
  { month: 'Apr', consultations: 3890, perMember: 3.2, labTests: 2040 },
  { month: 'May', consultations: 4520, perMember: 3.6, labTests: 2380 },
  { month: 'Jun', consultations: 4860, perMember: 3.8, labTests: 2540 }
];

const chiefComplaintsData = [
  { complaint: 'Hypertension', count: 1240, percentage: 25.5 },
  { complaint: 'Diabetes', count: 890, percentage: 18.3 },
  { complaint: 'Respiratory', count: 720, percentage: 14.8 },
  { complaint: 'Cardiovascular', count: 650, percentage: 13.4 },
  { complaint: 'Musculoskeletal', count: 580, percentage: 11.9 },
  { complaint: 'Others', count: 780, percentage: 16.1 }
];

const labTestsData = [
  { test: 'CBC', count: 840, rate: 65.4 },
  { test: 'Lipid Profile', count: 720, rate: 56.1 },
  { test: 'Blood Sugar', count: 680, rate: 52.9 },
  { test: 'Creatinine', count: 520, rate: 40.5 },
  { test: 'HbA1c', count: 380, rate: 29.6 },
  { test: 'ECG', count: 290, rate: 22.6 }
];

const screeningData = [
  { screening: 'Blood Pressure', eligible: 8500, completed: 7650, coverage: 90 },
  { screening: 'Mammography', eligible: 3200, completed: 2240, coverage: 70 },
  { screening: 'Pap Smear', eligible: 4100, completed: 2870, coverage: 70 },
  { screening: 'Colonoscopy', eligible: 2800, completed: 1400, coverage: 50 },
  { screening: 'Eye Exam', eligible: 12847, completed: 8988, coverage: 70 }
];

export function ClinicalMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Clinical KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Consultations"
          value="4,860"
          change={7.5}
          changeType="increase"
          description="Total consultations in June"
          target="5,000"
          status="good"
        />
        <KPICard
          title="Consultations per Member"
          value="3.8"
          change={5.6}
          changeType="increase"
          description="Average monthly consultations"
          target="4.0"
          status="good"
        />
        <KPICard
          title="Lab Tests per 1,000 Enrollees"
          value="198"
          change={6.5}
          changeType="increase"
          description="Monthly lab test rate"
          target="220"
          status="good"
        />
        <KPICard
          title="Screening Coverage"
          value="72"
          unit="%"
          change={3.2}
          changeType="increase"
          description="Cancer screening completion"
          target="80"
          status="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Clinical Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Clinical Activity</CardTitle>
            <CardDescription>
              Consultations and lab tests over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consultationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="consultations" fill="#8884d8" name="Consultations" />
                <Line yAxisId="right" type="monotone" dataKey="perMember" stroke="#82ca9d" strokeWidth={2} name="Per Member" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Chief Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Top Chief Complaints</CardTitle>
            <CardDescription>
              Most common reasons for consultation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chiefComplaintsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="complaint" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laboratory Tests Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Tests Utilization</CardTitle>
            <CardDescription>
              Most frequently ordered laboratory tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={labTestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Tests Performed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Screening Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Preventive Screening Coverage</CardTitle>
            <CardDescription>
              Percentage of eligible members screened
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={screeningData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="screening" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Coverage']} />
                <Bar dataKey="coverage" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Clinical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Lab Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">2.4</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              For routine lab results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">78</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Patients completing referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-up Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">82</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Scheduled follow-ups attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">124</span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Emergency consultations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}