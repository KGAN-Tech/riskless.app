import Reports from "@/components/pages/Registration reports/Reports";
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

export default function AdminDoctors() {
  return <Reports />;
}
