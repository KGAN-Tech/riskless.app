import type { MetaFunction } from "react-router";
import { PharmacyMapPage } from "~/app/pages/private/member/users.pharmacy.map";

export const meta: MetaFunction = () => {
  return [{ title: "COnsultation page " }];
};

export default function PharmacyPage() {
  return <PharmacyMapPage />;
}
