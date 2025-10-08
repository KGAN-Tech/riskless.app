import type { MetaFunction } from "react-router";
import PatientRegistrationPage from "../pages/public/auth/patient.registration.page";

export const meta: MetaFunction = () => {
  return [{ title: "HealthLink | Patient Registration" }];
};

export default function PatientRegistrationRoute() {
  return <PatientRegistrationPage />;
}
