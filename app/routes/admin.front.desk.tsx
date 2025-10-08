import FrontDeskPage from "~/app/pages/private/other/front.desk/front.desk.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Front Desk" }];
};

export default function AdminFrontDeskRoute() {
  return <FrontDeskPage />;
}
