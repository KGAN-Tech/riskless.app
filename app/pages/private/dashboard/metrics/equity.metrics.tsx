import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const utilizationByDemographics = [
  { group: '0-17 years', male: 35, female: 38, total: 2350 },
  { group: '18-35 years', male: 42, female: 45, total: 4450 },
  { group: '36-59 years', male: 38, female: 41, total: 4070 },
  { group: '60+ years', male: 28, female: 32, total: 2176 }
];

const incomeGroupData = [
  { group: 'Indigent', members: 5847, utilization: 45, avgVisits: 4.2 },
  { group: 'Low Income', members: 3920, utilization: 38, avgVisits: 3.8 },
  { group: 'Middle Income', members: 2180, utilization: 32, avgVisits: 3.2 },
  { group: 'High Income', members: 900, utilization: 28, avgVisits: 2.8 }
];

const geographicData = [
  { area: 'Urban Core', members: 4280, distance: 2.3, utilization: 48 },
  { area: 'Urban Periphery', members: 3890, distance: 5.7, utilization: 42 },
  { area: 'Rural Towns', members: 2940, distance: 12.4, utilization: 35 },
  { area: 'Remote Areas', members: 1737, distance: 28.6, utilization: 22 }
];

const disabilityData = [
  { type: 'No Disability', count: 11420, utilization: 39 },
  { type: 'Physical Disability', count: 890, utilization: 42 },
  { type: 'Visual Impairment', count: 320, utilization: 38 },
  { type: 'Hearing Impairment', count: 217, utilization: 35 }
];

const languageBarrierData = [
  { language: 'Filipino/Tagalog', members: 8940, satisfaction: 89 },
  { language: 'Local Dialect', members: 2890, satisfaction: 84 },
  { language: 'Other Languages', members: 1017, satisfaction: 78 }
];

export function EquityMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Equity KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Indigent Member Utilization"
          value="45"
          unit="%"
          change={3.2}
          changeType="increase"
          description="Utilization rate among indigent members"
          target="50"
          status="warning"
        />
        <KPICard
          title="Rural Area Coverage"
          value="35"
          unit="%"
          change={2.1}
          changeType="increase"
          description="Utilization in rural/remote areas"
          target="40"
          status="warning"
        />
        <KPICard
          title="Average Travel Time"
          value="12.8"
          unit="min"
          change={-5.2}
          changeType="decrease"
          description="To nearest YAKAP clinic"
          target="15"
          status="good"
        />
        <KPICard
          title="Disability Access Rate"
          value="38"
          unit="%"
          change={4.8}
          changeType="increase"
          description="Members with disabilities using services"
          target="45"
          status="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Age and Gender */}
        <Card>
          <CardHeader>
            <CardTitle>Utilization by Age and Gender</CardTitle>
            <CardDescription>
              Service utilization rates across demographic groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationByDemographics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization Rate']} />
                <Bar dataKey="male" fill="#8884d8" name="Male" />
                <Bar dataKey="female" fill="#82ca9d" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income Group Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Utilization by Income Group</CardTitle>
            <CardDescription>
              Access patterns across socioeconomic groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="members" fill="#8884d8" name="Members" />
                <Bar yAxisId="right" dataKey="utilization" fill="#82ca9d" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Access Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Access Analysis</CardTitle>
            <CardDescription>
              Distance vs utilization by geographic area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="distance" fill="#ffc658" name="Avg Distance (km)" />
                <Bar yAxisId="right" dataKey="utilization" fill="#82ca9d" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disability Access */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility for People with Disabilities</CardTitle>
            <CardDescription>
              Service utilization by disability type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={disabilityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Language and Cultural Barriers */}
      <Card>
        <CardHeader>
          <CardTitle>Language Accessibility & Satisfaction</CardTitle>
          <CardDescription>
            Service satisfaction by primary language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageBarrierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[70, 95]} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="members" fill="#8884d8" name="Members" />
              <Bar yAxisId="right" dataKey="satisfaction" fill="#82ca9d" name="Satisfaction %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Equity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Access Barriers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Access Barriers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Transportation Cost</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">34%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Work Schedule Conflict</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Long Wait Times</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">22%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Language Barriers</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">16%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gender Equity */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Equity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Female Participation</span>
                <span className="font-medium">52.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maternal Health Services</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Women's Cancer Screening</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gender-based Violence Support</span>
                <span className="font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Competency */}
        <Card>
          <CardHeader>
            <CardTitle>Cultural Competency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Multilingual Staff</span>
                <span className="font-medium">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cultural Training Completed</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Indigenous Health Programs</span>
                <span className="font-medium">3 Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Religious Accommodation</span>
                <span className="font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Equity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Senior Citizen Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">30</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Utilization rate among 60+ years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Youth Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">36</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Utilization rate among 0-17 years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Clinic Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">1,247</span>
              <span className="text-sm text-muted-foreground">members</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Served by mobile clinics monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Divide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">23</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Members using digital services
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}