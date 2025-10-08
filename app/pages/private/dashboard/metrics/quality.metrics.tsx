import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const clinicalOutcomesData = [
  { month: 'Jan', bpControlled: 72, diabetesControlled: 65, satisfaction: 84 },
  { month: 'Feb', bpControlled: 74, diabetesControlled: 67, satisfaction: 85 },
  { month: 'Mar', bpControlled: 76, diabetesControlled: 69, satisfaction: 86 },
  { month: 'Apr', bpControlled: 78, diabetesControlled: 71, satisfaction: 87 },
  { month: 'May', bpControlled: 79, diabetesControlled: 73, satisfaction: 88 },
  { month: 'Jun', bpControlled: 81, diabetesControlled: 75, satisfaction: 87 }
];

const satisfactionData = [
  { category: 'Overall Experience', score: 87, target: 90 },
  { category: 'Wait Time', score: 82, target: 85 },
  { category: 'Staff Courtesy', score: 91, target: 90 },
  { category: 'Facility Cleanliness', score: 89, target: 88 },
  { category: 'Treatment Quality', score: 88, target: 90 },
  { category: 'Cost Transparency', score: 85, target: 85 }
];

const qualityIndicatorsData = [
  { indicator: 'BP Control (<140/90)', current: 81, target: 85, status: 'warning' },
  { indicator: 'HbA1c Control (<7%)', current: 75, target: 80, status: 'warning' },
  { indicator: 'Mammography Screening', current: 70, target: 75, status: 'warning' },
  { indicator: 'Cervical Cancer Screening', current: 68, target: 70, status: 'warning' },
  { indicator: 'Medication Adherence', current: 78, target: 80, status: 'warning' },
  { indicator: 'Follow-up Compliance', current: 82, target: 85, status: 'warning' }
];

const npsData = [
  { category: 'Promoters', count: 5420, percentage: 62 },
  { category: 'Passives', count: 2180, percentage: 25 },
  { category: 'Detractors', count: 1134, percentage: 13 }
];

const referralCompletionData = [
  { specialty: 'Cardiology', referred: 245, completed: 189, rate: 77 },
  { specialty: 'Endocrinology', referred: 180, completed: 151, rate: 84 },
  { specialty: 'Ophthalmology', referred: 156, completed: 124, rate: 79 },
  { specialty: 'Orthopedics', referred: 98, completed: 68, rate: 69 },
  { specialty: 'Dermatology', referred: 87, completed: 74, rate: 85 },
  { specialty: 'Neurology', referred: 65, completed: 48, rate: 74 }
];

export function QualityMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Quality KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patient Satisfaction"
          value="87"
          unit="%"
          change={-1.1}
          changeType="decrease"
          description="Overall satisfaction score"
          target="90"
          status="warning"
        />
        <KPICard
          title="BP Control Rate"
          value="81"
          unit="%"
          change={2.5}
          changeType="increase"
          description="Hypertensive patients <140/90"
          target="85"
          status="warning"
        />
        <KPICard
          title="Diabetes Control"
          value="75"
          unit="%"
          change={2.7}
          changeType="increase"
          description="Diabetics with HbA1c <7%"
          target="80"
          status="warning"
        />
        <KPICard
          title="Referral Completion"
          value="78"
          unit="%"
          change={1.9}
          changeType="increase"
          description="Patients completing referrals"
          target="85"
          status="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinical Outcomes Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Outcomes Trends</CardTitle>
            <CardDescription>
              Blood pressure control, diabetes management, and satisfaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clinicalOutcomesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 95]} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="bpControlled" stroke="#8884d8" strokeWidth={2} name="BP Control" />
                <Line type="monotone" dataKey="diabetesControlled" stroke="#82ca9d" strokeWidth={2} name="Diabetes Control" />
                <Line type="monotone" dataKey="satisfaction" stroke="#ffc658" strokeWidth={2} name="Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Satisfaction Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction Breakdown</CardTitle>
            <CardDescription>
              Satisfaction scores by category vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={satisfactionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[70, 100]} />
                <YAxis dataKey="category" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" name="Current Score" />
                <Bar dataKey="target" fill="#82ca9d" fillOpacity={0.5} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Indicators Performance</CardTitle>
            <CardDescription>
              Key clinical quality metrics vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityIndicatorsData.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{indicator.indicator}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            indicator.current >= indicator.target ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${(indicator.current / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12">
                        {indicator.current}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-sm font-medium">{indicator.current}%</span>
                    <p className="text-xs text-muted-foreground">Target: {indicator.target}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Net Promoter Score */}
        <Card>
          <CardHeader>
            <CardTitle>Net Promoter Score (NPS)</CardTitle>
            <CardDescription>
              Patient loyalty and recommendation likelihood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={npsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">NPS Score</p>
              <p className="text-2xl font-bold text-green-600">+49</p>
              <p className="text-xs text-muted-foreground">62% Promoters - 13% Detractors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Completion Rates by Specialty</CardTitle>
          <CardDescription>
            Percentage of patients who complete referred specialist visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referralCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="specialty" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'rate' ? `${value}%` : value,
                  name === 'referred' ? 'Referred' : name === 'completed' ? 'Completed' : 'Completion Rate'
                ]}
              />
              <Bar dataKey="referred" fill="#8884d8" name="referred" />
              <Bar dataKey="completed" fill="#82ca9d" name="completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">78</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Patients taking medications as prescribed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readmission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">8.2</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              30-day readmission rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adverse Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">0.3</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rate of adverse events per 1,000 visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">83</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Healthcare staff satisfaction score
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}