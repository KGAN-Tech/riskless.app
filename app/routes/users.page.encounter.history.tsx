import type { MetaFunction } from "react-router";
import { EncounterHistoryPage } from "../pages/private/member/users.encounter.history.page";

export const meta: MetaFunction = () => {
  return [{ title: "Encounter History" }];
};

export default function EncounterHistoryRoute() {
  return <EncounterHistoryPage />;
}
