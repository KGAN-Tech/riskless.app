import type { MetaFunction } from "react-router";
import EMRPage from "~/app/pages/private/member/users.emr.page";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC - users.home.page.tsx " }];
};

export default function emrPage() {
  return <EMRPage />;
}
