import type { MetaFunction } from "react-router";
import UserFormPage from "~/app/pages/private/member/users.form.download";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC - EMR page" }];
};

export default function downloadformPage() {
  return <UserFormPage />;
}
