import MapsPage from "~/app/pages/private/reports/maps.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Maps" }];
};

export default function AdminReportsMapsRoute() {
  return <MapsPage />;
}
