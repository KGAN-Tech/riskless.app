import PharmaciesPage from "~/app/pages/private/facilities/pharmacies/pharmacies.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Pharmacies" }];
};

export default function AdminPharmaciesRoute() {
  return <PharmaciesPage />;
}
