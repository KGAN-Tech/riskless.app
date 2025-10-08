import type { MetaFunction } from "react-router";
import FPEPage from "~/app/pages/private/member/users.fpe.records";

export const meta: MetaFunction = () => {
  return [{ title: "FPE data page " }];
};

export default function pageFPE() {
  return <FPEPage />;
}
