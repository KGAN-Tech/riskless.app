import LaboratoryDetailPage from "~/app/pages/private/facilities/laboratories/laboratory.detail.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Laboratory Details" }];
};

export default function AdminLaboratoryDetail() {
  return <LaboratoryDetailPage />;
}
