import type { MetaFunction } from "react-router";
import { ProfilePage } from "~/app/pages/private/member/users.profile.page";

export const meta: MetaFunction = () => {
  return [{ title: "COnsultation page " }];
};

export default function profilePage() {
  return <ProfilePage />;
}
