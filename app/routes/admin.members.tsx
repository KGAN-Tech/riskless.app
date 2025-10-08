import MembersPage from "~/app/pages/private/masterlist/masterlist.page";

import { DashboardLayout } from "@/components/templates/dashboard.layout";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "FTCC | About" },
    {
      name: "description",
      content: "About Filipino Trusted Care Company (FTCC).",
    },
  ];
};

export default function AdminMembers() {
  return <MembersPage />;
}
