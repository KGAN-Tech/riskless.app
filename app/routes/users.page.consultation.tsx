import type { MetaFunction } from "react-router";
import { ConsultationPage } from "~/app/pages/private/member/users.consultation.page";

export const meta: MetaFunction = () => {
  return [{ title: "COnsultation page " }];
};

export default function Consultationpage() {
  return <ConsultationPage />;
}
