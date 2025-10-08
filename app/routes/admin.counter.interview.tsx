import { CountersInterviewPage } from "~/app/pages/private/other/counters/counter.interview.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Counters Interview" }];
};

export default function AdminCountersInterviewPage() {
  return <CountersInterviewPage />;
}
