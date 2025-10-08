import HealthScreeningPage from "~/app/pages/private/other/health.screening/health.screening.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Health Screening" }];
};

export default function AdminHealthScreeningRoute() {
  return <HealthScreeningPage />;
}
