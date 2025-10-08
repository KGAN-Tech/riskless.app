import CounterSettingsPage from "~/app/pages/private/other/counters/counter.settings.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Counter Settings" }];
};

export default function CounterSettingsPageRoute() {
  return <CounterSettingsPage />;
}
