
import type { MetaFunction } from "react-router";
import AppointmentPage from "../pages/private/appointments/appointment.page copy";

export const meta: MetaFunction = () => {
  return [
    { title: "FTCC | Appointment" },
  ];
};

    export default function AdminAppointmentRoute() {
  return <AppointmentPage />;
}
