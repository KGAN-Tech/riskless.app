import { useState, useEffect } from "react";
import { Users, Activity, ListFilter } from "lucide-react";
import { metricsService } from "@/services/metrics.service";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [dashboardData, setDashboardData] = useState();

  console.log(metrics);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  const getActiveFilters = () => {
    const filters = [];
    if (selectedDepartment !== 'all') filters.push(`Department: ${selectedDepartment}`);
    if (selectedTimeRange !== 'month') filters.push(`Period: ${selectedTimeRange}`);
    if (startDate && endDate) filters.push(`Date: ${startDate} to ${endDate}`);
    else if (startDate) filters.push(`Date from: ${startDate}`);
    else if (endDate) filters.push(`Date until: ${endDate}`);
    return filters;
  };

  const clearFilters = () => {
    setSelectedDepartment('all');
    setSelectedTimeRange('month');
  };

  const handleRefreshAll = () => {
    // Simulate data refresh with slight variations
    setDashboardData(metrics);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await metricsService.search({
          metrics: [
            {
              model: "user",
              data: [
                "newUsersYearly",
                "newUsersMonthly",
                "totalUsers",
              ],
            },
            {
              model: "encounter",
              data: [
                "totalEncounters",
                "encountersByType",
                "encountersByStatus",
                "encountersByYear",
                "encountersByMonth",
                "encountersByDay",
                "encountersByTransactionType",
                "encountersByServiceType",
                "encountersByConsent",
                "encountersByFacility",
                "encountersByFacilityName",
                "encountersByPatientSex",
                "encountersByPatientUserType",
                "encountersByAgeGroup",
                "encountersByPatientBarangay",
                "encountersByPatientCity",
                "encountersByMedicinePrescribed",
                "encountersByPatientProvince",
                "encountersByPatientRegion",
                "topMedicinesPrescribed",
                "topPatientBarangays",
                "topPatientCities",
              ],
            },
          ],
          filter: {
          dateRange: {
            from: startDate || null,
            to: endDate || null,
          },
        }

        });
        // response shape = { user: {...}, encounter: {...} }
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  if (loading) return <p>Loading metrics…</p>;

  // --- pick out numbers safely ---
  const totalUsers = metrics.user?.totalUsers ?? 0;

  // monthlyCount: pick a month or sum all
  const monthlyArray = Array.isArray(metrics.user?.newUsersMonthly)
    ? metrics.user.newUsersMonthly
    : [];
  // e.g. sum all months:
  const monthlyCount = monthlyArray.reduce((sum: number, m: any) => sum + (m._count ?? 0), 0);

  // yearlyCount: sum all periods
  const yearlyArray = Array.isArray(metrics.user?.newUsersYearly)
    ? metrics.user.newUsersYearly
    : [];
  const yearlyCount = yearlyArray.reduce((sum: number, y: any) => sum + (y._count ?? 0), 0);

  const dynamicStats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      change: null,
    },
    {
      title: "Registrations (Monthly total)",
      value: monthlyCount,
      icon: Users,
      change: null,
    },
    {
      title: "Registrations (Yearly total)",
      value: yearlyCount,
      icon: Activity,
      change: null,
    },
    {
      title: "Registrations (Yearly total)",
      value: yearlyCount,
      icon: Activity,
      change: null,
    },
  ];

  return (
    <div className="p-6">
      {/* Dropdown button for all filters here */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Active Filters Display */}
        <div className="mt-2 text-sm text-gray-600">
          {getActiveFilters().length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getActiveFilters().map((f, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {f}
                </span>
              ))}
            </div>
          ) : (
            <span>No filters applied</span>
          )}
        </div>


        {/* Filter button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm"
        >
          <ListFilter className="w-4 h-4" />
            Filters
        </button>

        {/* Filters container */}
        {filterOpen && (
          <div className="absolute right-4 top-26 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
            <h2 className="text-lg font-semibold mb-2">Available Filters</h2>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {dynamicStats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white shadow p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-6 w-6 text-gray-500" />
              <h2 className="font-medium">{stat.title}</h2>
            </div>
            <h3 className="mt-2 text-2xl font-semibold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">New Users Monthly (list)</h2>
        {monthlyArray.length === 0 && <p>No data</p>}
        <ul>
          {monthlyArray.map((m: any) => (
            <li key={m.month}>
              {m.month} {m.year}: {m._count}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">New Users Yearly (list)</h2>
        {yearlyArray.length === 0 && <p>No data</p>}
        <ul>
          {yearlyArray.map((y: any) => (
            <li key={y.period}>
              {y.period}: {y._count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}