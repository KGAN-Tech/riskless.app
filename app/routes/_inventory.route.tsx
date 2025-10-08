import type { MetaFunction } from "react-router";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import InvetoryPage from "../pages/private/inventory/inventory.page";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";

export const meta: MetaFunction = () => {
  return [
    { title: "Inventory" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function InventoryRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin", "admin"],
        <PortalProtectedLayout>
          <InvetoryPage />
        </PortalProtectedLayout>,
        <></>
      )()}
    </div>
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
