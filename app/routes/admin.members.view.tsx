import type { MetaFunction } from "react-router";
import EncounterViewPage from "./users.encounter.view.page";

export const meta: MetaFunction = () => {
  return [
    { title: "FTCC | About" },
    {
      name: "description",
      content: "About Filipino Trusted Care Company (FTCC).",
    },
  ];
};

export default function AdminMemberViewer() {
  return <EncounterViewPage />;
}
