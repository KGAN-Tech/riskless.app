import { CountersPharmacyPage } from "~/app/pages/private/other/counters/counter.pharmacy.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Pharmacy" }];
};

export default function AdminCounterPharmacyPage() {
  return <CountersPharmacyPage />;
}
