import React from "react";
import { type FilterState, type ReportType } from "../../../types/reports";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/atoms/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportsChartProps {
  reportType: ReportType;
  filters: FilterState;
}

// Mock data
const mockChartData = [
  { month: "Jan", registration: 650, fpe: 320, consultation: 35 },
  { month: "Feb", registration: 720, fpe: 380, consultation: 40 },
  { month: "Mar", registration: 800, fpe: 420, consultation: 42 },
  { month: "Apr", registration: 880, fpe: 450, consultation: 45 },
  { month: "May", registration: 950, fpe: 480, consultation: 48 },
  { month: "Jun", registration: 1000, fpe: 500, consultation: 50 },
];

export const ReportsChart: React.FC<ReportsChartProps> = ({
  reportType,
  filters,
}) => {
  const currentData = mockChartData.map((item) => ({
    month: item.month,
    value: item[reportType],
  }));

  const getColor = () => {
    switch (reportType) {
      case "registration":
        return "#2563eb"; // blue
      case "fpe":
        return "#facc15"; // yellow
      case "consultation":
        return "#16a34a"; // green
      default:
        return "#2563eb";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold capitalize">{reportType} Trends</h2>
        <p className="text-muted-foreground">Monthly trends and comparisons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={getColor()} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right side small stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historical Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">892</p>
                  <p className="text-success flex items-center">
                    <span className="mr-1">↑</span> 12.5%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">FPE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">500</p>
                  <p className="text-destructive flex items-center">
                    <span className="mr-1">↓</span> 5% vs last period
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">50</p>
                  <p className="text-success flex items-center">
                    <span className="mr-1">↑</span> 8% vs last period
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Period Comparison Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Period Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData.slice(-3)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={getColor()} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Previous Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData.slice(0, 3)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
