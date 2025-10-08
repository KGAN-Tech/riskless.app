import CounterVitalsPage from "~/app/pages/private/other/counters/counter.vitals.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Counters Vitals" }];
};

export default function AdminCountersVitalsRoute() {
  return <CounterVitalsPage />;
}
