import { useEffect, useState } from "react";
import { metricsService } from "~/app/services/metrics.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// Type definitions
interface CountData {
  _count: {
    id: number;
  };
}

interface PeriodData {
  period: string;
  _count: number;
}

interface MonthlyData {
  month: string;
  year: number;
  _count: number;
  byType?: Record<string, number>;
  byStatus?: Record<string, number>;
  byCategory?: Record<string, number>;
}

interface LocationData {
  withLocation: number;
  withoutLocation: number;
  total: number;
  percentageWithLocation: number;
}

interface MetricsData {
  user: {
    newUsersYearly: PeriodData[];
    newUsersMonthly: MonthlyData[];
    totalUsers: number;
  };
  road: {
    totalRoads: number;
    activeRoads: number;
    roadsByType: (CountData & { type: string })[];
    highRiskRoads: number;
    roadsByStatus: (CountData & { status: string })[];
    newRoadsYearly: PeriodData[];
    newRoadsMonthly: MonthlyData[];
  };
  report: {
    totalReports: number;
    activeReports: number;
    reportsByType: (CountData & { type: string })[];
    reportsByStatus: (CountData & { status: string | null })[];
    newReportsYearly: PeriodData[];
    newReportsMonthly: MonthlyData[];
    reportsWithLocation: LocationData[];
  };
  facility: {
    totalFacilities: number;
    activeFacilities: number;
    facilitiesByType: (CountData & { type: string })[];
    facilitiesByStatus: (CountData & { status: string })[];
    facilitiesByCategory: (CountData & { category: string })[];
    facilitiesWithLocation: LocationData[];
    newFacilitiesYearly: PeriodData[];
    newFacilitiesMonthly: MonthlyData[];
  };
}

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div
            className={`flex items-center mt-2 text-xs font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        )}
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-600">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

// Data Grid Component
const DataGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const user = getUserFromLocalStorage().user?.role;
  const facilityId = getUserFromLocalStorage().user?.facilityId;

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      if (user === "super_admin") {
        const res = await metricsService.search({
          metrics: [
            {
              model: "user",
              data: ["newUsersYearly", "newUsersMonthly", "totalUsers"],
            },
            {
              model: "road",
              data: [
                "totalRoads",
                "activeRoads",
                "roadsByType",
                "highRiskRoads",
                "roadsByStatus",
                "newRoadsYearly",
                "newRoadsMonthly",
              ],
            },
            {
              model: "report",
              data: [
                "totalReports",
                "activeReports",
                "reportsByType",
                "reportsByStatus",
                "newReportsYearly",
                "newReportsMonthly",
                "reportsWithLocation",
              ],
            },
            {
              model: "facility",
              data: [
                "totalFacilities",
                "activeFacilities",
                "facilitiesByType",
                "facilitiesByStatus",
                "facilitiesByCategory",
                "facilitiesWithLocation",
                "newFacilitiesYearly",
                "newFacilitiesMonthly",
              ],
            },
          ],
        });

        if (res?.data) {
          setMetrics(res.data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
      if (user === "admin" && facilityId) {
        const res = await metricsService.search({
          metrics: [
            // {
            //   model: "road",
            //   data: [
            //     "totalRoads",
            //     "activeRoads",
            //     "roadsByType",
            //     "highRiskRoads",
            //     "roadsByStatus",
            //     "newRoadsYearly",
            //     "newRoadsMonthly",
            //   ],
            // },
            {
              model: "report",
              data: [
                "totalReports",
                "activeReports",
                "reportsByType",
                "reportsByStatus",
                "newReportsYearly",
                "newReportsMonthly",
                "reportsWithLocation",
              ],
            },
          ],
          filter: {
            facilityId,
          },
        });

        if (res?.data) {
          setMetrics(res.data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load metrics
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again.
          </p>
          <button
            onClick={fetchMetrics}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive overview of system metrics and performance
              indicators
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </span>
            <button
              onClick={fetchMetrics}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>↻</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Section */}
      {user === "super_admin" && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
              👥
            </span>
            User Analytics
          </h2>
          <DataGrid>
            <StatCard
              title="Total Users"
              value={metrics.user.totalUsers.toLocaleString()}
              subtitle="All time"
              icon="👤"
            />
            <StatCard
              title="New This Month"
              value={
                metrics.user.newUsersMonthly[0]?._count.toLocaleString() || "0"
              }
              subtitle={`${metrics.user.newUsersMonthly[0]?.month} ${metrics.user.newUsersMonthly[0]?.year}`}
              trend={{ value: 12, isPositive: true }}
              icon="📈"
            />
            <StatCard
              title="New This Year"
              value={
                metrics.user.newUsersYearly[0]?._count.toLocaleString() || "0"
              }
              subtitle="Year to date"
              icon="📅"
            />
            <StatCard
              title="Growth Rate"
              value="+12%"
              subtitle="vs. last month"
              trend={{ value: 12, isPositive: true }}
              icon="🚀"
            />
          </DataGrid>
        </section>
      )}
      {/* Roads Section */}
      {user === "super_admin" && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-orange-100 text-orange-800 p-2 rounded-lg mr-3">
              🛣️
            </span>
            Road Infrastructure
          </h2>
          <DataGrid>
            <StatCard
              title="Total Roads"
              value={metrics.road.totalRoads.toLocaleString()}
              subtitle="Monitored"
              icon="🛣️"
            />
            <StatCard
              title="Active Roads"
              value={metrics.road.activeRoads.toLocaleString()}
              subtitle="Currently tracked"
              icon="🟢"
            />
            <StatCard
              title="High Risk Roads"
              value={metrics.road.highRiskRoads.toLocaleString()}
              subtitle="Requiring attention"
              icon="⚠️"
            />
            <StatCard
              title="New Roads"
              value={
                metrics.road.newRoadsMonthly[0]?._count.toLocaleString() || "0"
              }
              subtitle="This month"
              icon="🆕"
            />
          </DataGrid>

          {/* Roads Breakdown */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Roads by Type
              </h3>
              <div className="space-y-3">
                {metrics.road.roadsByType.map((roadType, index) => (
                  <ProgressBar
                    key={index}
                    percentage={
                      (roadType._count.id / metrics.road.totalRoads) * 100
                    }
                    label={`${
                      roadType.type.charAt(0).toUpperCase() +
                      roadType.type.slice(1)
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Road Status Distribution
              </h3>
              <div className="space-y-3">
                {metrics.road.roadsByStatus.map((roadStatus, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700 capitalize">
                      {roadStatus.status || "Unspecified"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {roadStatus._count.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reports Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-purple-100 text-purple-800 p-2 rounded-lg mr-3">
            📊
          </span>
          Incident Reports
        </h2>
        <DataGrid>
          <StatCard
            title="Total Reports"
            value={metrics.report.totalReports.toLocaleString()}
            subtitle="All time"
            icon="📋"
          />
          <StatCard
            title="Active Reports"
            value={metrics.report.activeReports.toLocaleString()}
            subtitle="Currently open"
            icon="🟡"
          />
          <StatCard
            title="New Reports"
            value={
              metrics.report.newReportsMonthly[0]?._count.toLocaleString() ||
              "0"
            }
            subtitle="This month"
            icon="🆕"
          />
          {/* <StatCard
            title="Location Coverage"
            value={`${metrics.report.reportsWithLocation[0]?.percentageWithLocation}%`}
            subtitle="Reports with location data"
            icon="📍"
          /> */}
        </DataGrid>

        {/* Reports Breakdown */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Reports by Type
            </h3>
            <div className="space-y-3">
              {metrics.report.reportsByType.map((reportType, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700 capitalize">
                    {reportType.type || "Unknown"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {reportType._count.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      (
                      {(
                        (reportType._count.id / metrics.report.totalReports) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Reports by Status
            </h3>
            <div className="space-y-3">
              {metrics.report.reportsByStatus.map((reportStatus, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700 capitalize">
                    {reportStatus.status || "Unknown"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {reportStatus._count.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      (
                      {(
                        (reportStatus._count.id / metrics.report.totalReports) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      {user === "super_admin" && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-green-100 text-green-800 p-2 rounded-lg mr-3">
              🏥
            </span>
            Facility Management
          </h2>
          <DataGrid>
            <StatCard
              title="Total Facilities"
              value={metrics.facility.totalFacilities.toLocaleString()}
              subtitle="Registered"
              icon="🏢"
            />
            <StatCard
              title="Active Facilities"
              value={metrics.facility.activeFacilities.toLocaleString()}
              subtitle="Currently operational"
              icon="🟢"
            />
            <StatCard
              title="New Facilities"
              value={
                metrics.facility.newFacilitiesMonthly[0]?._count.toLocaleString() ||
                "0"
              }
              subtitle="This month"
              icon="🆕"
            />
            <StatCard
              title="Location Data"
              value={`${metrics.facility.facilitiesWithLocation[0]?.percentageWithLocation}%`}
              subtitle="Facilities with coordinates"
              icon="📍"
            />
          </DataGrid>

          {/* Facilities Breakdown */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">By Type</h3>
              <div className="space-y-3">
                {metrics.facility.facilitiesByType.map(
                  (facilityType, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 capitalize">
                        {facilityType.type}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {facilityType._count.id}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">By Status</h3>
              <div className="space-y-3">
                {metrics.facility.facilitiesByStatus.map(
                  (facilityStatus, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 capitalize">
                        {facilityStatus.status}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {facilityStatus._count.id}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">By Category</h3>
              <div className="space-y-3">
                {metrics.facility.facilitiesByCategory.map(
                  (facilityCategory, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 capitalize">
                        {facilityCategory.category.replace(/_/g, " ")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {facilityCategory._count.id}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
