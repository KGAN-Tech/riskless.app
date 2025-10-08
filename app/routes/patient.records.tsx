import type { MetaFunction } from "react-router";
import PatientRecord from "../pages/private/patients/patient.records";
import { EcounterViewPage } from "../pages/private/encounter/encounter.view.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Patient Records" },
    {
      name: "description",
      content: "View and manage patient records.",
    },
  ];
};

export default function PatientRecordsPage() {
  return <EcounterViewPage />;
}
