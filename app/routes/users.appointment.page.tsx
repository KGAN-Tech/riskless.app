import type { MetaFunction } from "react-router";
import { useNavigate } from "react-router";
import { AppointmentPage } from "~/app/pages/private/member/users.appointment";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC - users.home.page.tsx " }];
};

export default function appointmentPage() {
  const navigate = useNavigate();
  return <AppointmentPage />;
}
