import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { KPICard } from '@/components/molecules/kpi.card';
import { FilterSummaryCard } from '@/components/molecules/filter.summary.card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { type FilterState } from '@/components/organisms/filter.panel';
import { useEffect, useState } from 'react';

const monthlyData = [
  { month: 'Jan', enrollments: 1240, consultations: 3420, claims: 2850 },
  { month: 'Feb', enrollments: 1380, consultations: 3680, claims: 3120 },
  { month: 'Mar', enrollments: 1520, consultations: 4100, claims: 3450 },
  { month: 'Apr', enrollments: 1450, consultations: 3890, claims: 3280 },
  { month: 'May', enrollments: 1680, consultations: 4520, claims: 3890 },
  { month: 'Jun', enrollments: 1820, consultations: 4860, claims: 4120 }
];

const serviceDistribution = [
  { name: 'Consultations', value: 35, color: '#8884d8' },
  { name: 'Lab Tests', value: 28, color: '#82ca9d' },
  { name: 'Medicines', value: 22, color: '#ffc658' },
  { name: 'Screenings', value: 15, color: '#ff7c7c' }
];

export function DashboardOverview({ filters, metrics }: { filters?: FilterState; metrics?: any }) {
  const getFilteredLabel = () => {
    if (!filters) return '';
    
    const activeFilters = [];
    if (filters.facilityName.length > 0) activeFilters.push(`${filters.facilityName.length} facilities`);
    if (filters.region.length > 0) activeFilters.push(filters.region.join(', '));
    if (filters.timePeriod) activeFilters.push(filters.timePeriod.replace('-', ' '));
    if (filters.program.length > 0) activeFilters.push(filters.program.join(', '));
    
    return activeFilters.length > 0 ? ` (Filtered: ${activeFilters.join(', ')})` : '';
  };

  return (
    <div className="space-y-6">
      {/* Filter Summary */}
      {filters && <FilterSummaryCard filters={filters} />}
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Enrolled Members"
          value={metrics?.user?.totalUsers || 'N/A'}
          change={15.2}
          changeType="increase"
          description="Active YAKAP enrollees"
          target="15,000"
          status="good"
        />
        <KPICard
          title="Monthly Consultations"
          value="4,860"
          change={7.5}
          changeType="increase"
          description="June 2024 consultations"
          target="5,000"
          status="good"
        />
        <KPICard
          title="PhilHealth Claims"
          value="₱2.4M"
          change={-2.1}
          changeType="decrease"
          description="Monthly reimbursements"
          target="₱2.8M"
          status="warning"
        />
        <KPICard
          title="Patient Satisfaction"
          value="87"
          unit="%"
          change={3.2}
          changeType="increase"
          description="Based on latest survey"
          target="90"
          status="good"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends{getFilteredLabel()}</CardTitle>
            <CardDescription>
              Enrollment and utilization trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} name="New Enrollments" />
                <Line type="monotone" dataKey="consultations" stroke="#82ca9d" strokeWidth={2} name="Consultations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Service Utilization</CardTitle>
            <CardDescription>
              Distribution of services provided in June 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Coverage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">68%</span>
              <span className="text-sm text-muted-foreground">of eligible population</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              12,847 enrolled out of 18,892 eligible PhilHealth members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Claim Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">₱584</span>
              <span className="text-sm text-muted-foreground">per claim</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on 4,120 processed claims this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">94%</span>
              <span className="text-sm text-muted-foreground">medicine availability</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Top 20 essential medicines in stock
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}