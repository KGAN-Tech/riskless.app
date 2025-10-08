import LaboratoryPage from "~/app/pages/private/other/laboratory/laboratory.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Laboratory" }];
};

export default function AdminLaboratory() {
  return <LaboratoryPage />;
}
