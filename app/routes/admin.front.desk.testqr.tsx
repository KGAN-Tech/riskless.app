import TestQRPage from "~/app/pages/private/other/front.desk/test.qr.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Test QR Codes" }];
};

export default function AdminFrontDeskTestQRRoute() {
  return <TestQRPage />;
}
