import DoctorsPage from "~/app/pages/private/other/doctors/DoctorsPage";
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
  return <DoctorsPage />;
}
