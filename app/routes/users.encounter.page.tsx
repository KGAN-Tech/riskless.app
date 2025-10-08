import type { MetaFunction } from "react-router";
import { MedicalRecord } from "~/app/pages/private/member/users.encounter.page";

export const meta: MetaFunction = () => {
  return [{ title: "FPE data page " }];
};

export default function encounterPage() {
  return <MedicalRecord />;
}
