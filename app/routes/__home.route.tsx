import type { MetaFunction } from "react-router";
import { UserHomeScreen } from "../pages/private/_home/home.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Registration" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function HomeRoute() {
  //   const Authenticated = isAuthenticated(
  //     // render if authenticated
  //     <div>
  //       {isRole(
  //         ["super_admin", "admin"],
  //         <PortalProtectedLayout>
  //           <PortalPage />
  //         </PortalProtectedLayout>,
  //         <AuthorizationMiddlewarePage />
  //       )()}
  //     </div>,
  //     <AutoExitMiddlewarePage />
  //   );

  return (
    <>
      {/* <Authenticated /> */}
      <UserHomeScreen />
    </>
  );
}
