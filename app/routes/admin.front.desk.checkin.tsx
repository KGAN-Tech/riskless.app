import CheckInPage from "~/app/pages/private/other/front.desk/check.in.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Patient Check-In" }];
};

export default function AdminFrontDeskCheckInRoute() {
  return <CheckInPage />;
}
