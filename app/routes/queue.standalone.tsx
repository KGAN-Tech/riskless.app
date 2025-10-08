import type { MetaFunction } from "react-router";
import QueueStandalonePage from "../pages/private/queue/queue.standalone.page";

export const meta: MetaFunction = () => {
  return [{ title: "Queue Display - FTCC" }];
};

export default function QueueStandaloneRoute() {
  return <QueueStandalonePage />;
}
