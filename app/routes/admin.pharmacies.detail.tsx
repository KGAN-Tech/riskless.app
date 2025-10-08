import PharmaciesDetailPage from "~/app/pages/private/facilities/pharmacies/pharmacies.detail.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Pharmacies Detail" }];
};

export default function AdminPharmaciesDetailRoute() {
  return <PharmaciesDetailPage />;
}
