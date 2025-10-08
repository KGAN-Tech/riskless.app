import LaboratoriesPage from "~/app/pages/private/facilities/laboratories/laboratories.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Laboratories" }];
};

export default function AdminLaboratories() {
  return <LaboratoriesPage />;
}
