import type { MetaFunction } from "react-router";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import LibraryPage from "../pages/private/library/library.page";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";

export const meta: MetaFunction = () => {
  return [
    { title: "Library" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function LibraryRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin"],
        <PortalProtectedLayout>
          <LibraryPage />
        </PortalProtectedLayout>,
        <> </>
      )()}
    </div>
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
