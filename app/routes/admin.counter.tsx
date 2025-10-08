import CounterPage from "~/app/pages/private/other/counters/counter.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Counters" }];
};

export default function AdminCountersRoute() {
  return <CounterPage />;
}
