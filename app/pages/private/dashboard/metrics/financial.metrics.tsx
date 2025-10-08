import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';

const reimbursementData = [
  { month: 'Jan', submitted: 2850, approved: 2680, rejected: 170, amount: 2100000, avgAmount: 784 },
  { month: 'Feb', submitted: 3120, approved: 2940, rejected: 180, amount: 2340000, avgAmount: 796 },
  { month: 'Mar', submitted: 3450, approved: 3210, rejected: 240, amount: 2580000, avgAmount: 804 },
  { month: 'Apr', submitted: 3280, approved: 3050, rejected: 230, amount: 2420000, avgAmount: 794 },
  { month: 'May', submitted: 3890, approved: 3620, rejected: 270, amount: 2890000, avgAmount: 799 },
  { month: 'Jun', submitted: 4120, approved: 3820, rejected: 300, amount: 3100000, avgAmount: 812 }
];

const serviceTypeData = [
  { service: 'Consultations', claims: 1240, amount: 890000, avgAmount: 718 },
  { service: 'Laboratory', claims: 890, amount: 620000, avgAmount: 697 },
  { service: 'Medicines', claims: 1580, amount: 1240000, avgAmount: 785 },
  { service: 'Procedures', claims: 110, amount: 350000, avgAmount: 3182 }
];

const processingTimeData = [
  { period: '0-7 days', count: 1520, percentage: 40 },
  { period: '8-14 days', count: 1140, percentage: 30 },
  { period: '15-21 days', count: 760, percentage: 20 },
  { period: '22-30 days', count: 285, percentage: 7.5 },
  { period: '>30 days', count: 115, percentage: 2.5 }
];

const oopeData = [
  { category: 'Diagnostics', amount: 45000, patients: 890 },
  { category: 'Medicines', amount: 38000, patients: 650 },
  { category: 'Consultation Fees', amount: 28000, patients: 420 },
  { category: 'Procedures', amount: 67000, patients: 180 }
];

export function FinancialMetrics({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  return (
    <div className="space-y-6">
      {/* Key Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Reimbursements"
          value="₱3.1M"
          change={7.3}
          changeType="increase"
          description="PhilHealth reimbursements"
          target="₱3.2M"
          status="good"
        />
        <KPICard
          title="Approval Rate"
          value="92.7"
          unit="%"
          change={1.2}
          changeType="increase"
          description="Claims approved vs submitted"
          target="95"
          status="good"
        />
        <KPICard
          title="Average Claim Value"
          value="₱812"
          change={1.6}
          changeType="increase"
          description="Per approved claim"
          target="₱850"
          status="good"
        />
        <KPICard
          title="Processing Time"
          value="11.2"
          unit="days"
          change={-8.2}
          changeType="decrease"
          description="Average claim processing"
          target="10"
          status="good"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reimbursement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reimbursement Trends</CardTitle>
            <CardDescription>
              Claims submitted vs approved and total amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reimbursementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'amount' ? `₱${(Number(value) / 1000000).toFixed(1)}M` : value,
                    name === 'submitted' ? 'Submitted' : name === 'approved' ? 'Approved' : 'Amount'
                  ]}
                />
                <Area yAxisId="left" type="monotone" dataKey="submitted" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area yAxisId="left" type="monotone" dataKey="approved" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#ffc658" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Claims by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle>Reimbursements by Service Type</CardTitle>
            <CardDescription>
              Breakdown of claims and amounts by service category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'amount' ? `₱${value.toLocaleString()}` : value,
                    name === 'claims' ? 'Claims' : 'Amount'
                  ]}
                />
                <Bar yAxisId="left" dataKey="claims" fill="#8884d8" name="claims" />
                <Bar yAxisId="right" dataKey="amount" fill="#82ca9d" name="amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Processing Time Distribution</CardTitle>
            <CardDescription>
              Time taken to process claims from submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Out-of-Pocket Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Out-of-Pocket Expenses</CardTitle>
            <CardDescription>
              Patient expenses not covered by PhilHealth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={oopeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#ff7c7c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quarterly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Q2 2024 Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Total Claims</span>
                <span className="font-medium">11,290</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Amount</span>
                <span className="font-medium">₱8.41M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Approval Rate</span>
                <span className="font-medium">92.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Processing</span>
                <span className="font-medium">11.2 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Rejection Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Top Rejection Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Incomplete Documentation</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Non-covered Service</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Duplicate Claims</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Other Reasons</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Cost per Member</span>
                <span className="font-medium">₱241</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Revenue per Member</span>
                <span className="font-medium">₱289</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Margin</span>
                <span className="font-medium text-green-600">16.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">ROI</span>
                <span className="font-medium text-green-600">1.2x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}