import ReportsPage from "~/app/pages/private/reports/reports.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Reports" }];
};

export default function AdminReportsRoute() {
  return <ReportsPage />;
}
