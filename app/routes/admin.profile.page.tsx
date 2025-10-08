import { ProfilePage } from "~/app/pages/private/profile/profile.doctor.admin";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Profile" }];
};

export default function AdminProfileRoute() {
  return <ProfilePage />;
}
