import type { MetaFunction } from "react-router";
import { Homepage } from "~/app/pages/private/member/users.home.page";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC - users.home.page.tsx " }];
};

export default function homepage() {
  return <Homepage />;
}
