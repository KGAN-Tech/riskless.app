export type ReportType = "registration" | "fpe" | "consultation";
export type ViewType = "table" | "chart";

export interface FilterState {
  reportType: "all" | ReportType;
  location: string;
  organization: string;
  dateRange: { from: Date | null; to: Date | null };
}

export interface MetricData {
  count: number;
  trend: number;
  icon: React.ComponentType<any>;
  color: 'primary' | 'warning' | 'success';
}