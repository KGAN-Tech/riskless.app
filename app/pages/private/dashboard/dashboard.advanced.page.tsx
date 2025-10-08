import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Users,
  Activity,
  Pill,
  DollarSign,
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";
import { EnrollmentMetrics } from "~/app/pages/private/dashboard/metrics/enrollment.metrics";
import { ClinicalMetrics } from "~/app/pages/private/dashboard/metrics/clinical.metrics";
import { MedicineMetrics } from "~/app/pages/private/dashboard/metrics/medicine.metrics";
import { FinancialMetrics } from "~/app/pages/private/dashboard/metrics/financial.metrics";
import { QualityMetrics } from "~/app/pages/private/dashboard/metrics/quality.metrics";
import { EquityMetrics } from "~/app/pages/private/dashboard/metrics/equity.metrics";
import { OperationalMetrics } from "~/app/pages/private/dashboard/metrics/operational.metrics";
import { DashboardOverview } from "~/app/pages/private/dashboard/dashboard.overview";
import {
  FilterPanel,
  type FilterState,
} from "@/components/organisms/filter.panel";
import { ActiveFiltersDisplay } from "~/app/pages/private/dashboard/active.filters.display";
import { metricsService } from "@/services/metrics.service";

const sidebarItems = [
  { id: "overview", label: "Dashboard Overview", icon: Activity },
  { id: "enrollment", label: "Enrollment & Utilization", icon: Users },
  { id: "clinical", label: "Clinical Services", icon: Heart },
  { id: "medicine", label: "Medicine & GAMOT", icon: Pill },
  { id: "financial", label: "Financial & Cost", icon: DollarSign },
  { id: "quality", label: "Quality & Outcomes", icon: TrendingUp },
  { id: "equity", label: "Equity & Access", icon: MapPin },
  { id: "operational", label: "Operational Metrics", icon: Clock },
];

export default function DashboardAdvancedPage() {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    facilityName: [],
    region: [],
    province: [],
    city: [],
    municipality: [],
    barangay: [],
    urbanRural: [],
    accreditationType: [],
    facilityType: [],
    dateRange: { from: null, to: null },
    timePeriod: "",
    fiscalYear: "",
    ageGroup: [],
    gender: [],
    membershipType: [],
    philhealthCategory: [],
    program: [],
    serviceType: [],
    diseaseGroup: [],
    labTestType: [],
    medicineCategory: [],
    prescriptionStatus: [],
    claimStatus: [],
    fundingSource: [],
    costBracket: [],
    provider: [],
    department: [],
    staffShift: [],
    screeningStatus: [],
    controlStatus: [],
    followupAdherence: [],
    satisfactionCategory: [],
    visitType: [],
    referralStatus: [],
    stockStatus: [],
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // On first load, read query param metrics
  useEffect(() => {
    const metrics = searchParams.get("metrics");
    if (metrics) {
      setActiveSection(metrics);
    }
  }, [searchParams]);

  // Handle dropdown change
  const handleMetricsChange = (id: string) => {
    setActiveSection(id);
    const params = new URLSearchParams(searchParams);
    params.set("metrics", id);
    setSearchParams(params);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "dateRange") {
        if ((value as any).from || (value as any).to) count++;
      } else if (typeof value === "string" && value) {
        count++;
      } else if (Array.isArray(value) && value.length > 0) {
        count++;
      }
    });
    return count;
  }, [filters]);

  const sanitizeFilters = (filters: FilterState) => {
    const cleaned: Record<string, any> = {};

    for (const key in filters) {
      const value = filters[key as keyof FilterState];

      if (key === "dateRange") {
        // Narrow type here before accessing .from and .to
        if (
          typeof value === "object" &&
          value !== null &&
          "from" in value &&
          "to" in value
        ) {
          if (value.from || value.to) {
            cleaned[key] = {
              ...(value.from ? { from: value.from } : {}),
              ...(value.to ? { to: value.to } : {}),
            };
          }
        }
      } else if (typeof value === "string" && value.trim()) {
        cleaned[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const removeFilter = (key: keyof FilterState, value?: string) => {
    setFilters((prev) => {
      if (key === "dateRange") {
        return { ...prev, [key]: { from: null, to: null } };
      } else if (key === "timePeriod" || key === "fiscalYear") {
        return { ...prev, [key]: "" };
      } else if (Array.isArray(prev[key]) && value) {
        return {
          ...prev,
          [key]: (prev[key] as string[]).filter((item) => item !== value),
        };
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      facilityName: [],
      region: [],
      province: [],
      city: [],
      municipality: [],
      barangay: [],
      urbanRural: [],
      accreditationType: [],
      facilityType: [],
      dateRange: { from: null, to: null },
      timePeriod: "",
      fiscalYear: "",
      ageGroup: [],
      gender: [],
      membershipType: [],
      philhealthCategory: [],
      program: [],
      serviceType: [],
      diseaseGroup: [],
      labTestType: [],
      medicineCategory: [],
      prescriptionStatus: [],
      claimStatus: [],
      fundingSource: [],
      costBracket: [],
      provider: [],
      department: [],
      staffShift: [],
      screeningStatus: [],
      controlStatus: [],
      followupAdherence: [],
      satisfactionCategory: [],
      visitType: [],
      referralStatus: [],
      stockStatus: [],
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview filters={filters} metrics={metrics} />;
      case "enrollment":
        return <EnrollmentMetrics filters={filters} metrics={metrics} />;
      case "clinical":
        return <ClinicalMetrics filters={filters} metrics={metrics} />;
      case "medicine":
        return <MedicineMetrics filters={filters} metrics={metrics} />;
      case "financial":
        return <FinancialMetrics filters={filters} metrics={metrics} />;
      case "quality":
        return <QualityMetrics filters={filters} metrics={metrics} />;
      case "equity":
        return <EquityMetrics filters={filters} metrics={metrics} />;
      case "operational":
        return <OperationalMetrics filters={filters} metrics={metrics} />;
      default:
        return <DashboardOverview filters={filters} metrics={metrics} />;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await metricsService.search({
          metrics: [
            {
              model: "user",
              data: ["newUsersYearly", "newUsersMonthly", "totalUsers"],
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
          filter: sanitizeFilters(filters),
        });

        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  if (loading) return <p>Loading metrics…</p>;

  return (
    <div className="flex-1">
      <header className="sticky top-0 z-40 border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={activeSection}
              onChange={(e) => handleMetricsChange(e.target.value)}
            >
              {sidebarItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center ">
            {/* Filter button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <ActiveFiltersDisplay
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        metrics={metrics}
      />

      <main className="p-6">{renderContent()}</main>
    </div>
  );
}
