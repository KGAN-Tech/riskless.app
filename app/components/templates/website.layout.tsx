// import { ReactNode } from "react";
// import { Outlet } from "react-router";

import type { ReactNode } from "react";

interface WebsiteLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode; // ✅ Add this
}

export const WebsiteLayout = ({
  header,
  footer,
  children,
}: WebsiteLayoutProps) => {
  return (
    <div className="w-screen h-screen flex flex-col ">
      {header && <header className="">{header}</header>}

      <main className="">
        {children} {/* ✅ Render passed children */}
      </main>

      {footer && <footer className="">{footer}</footer>}
    </div>
  );
};
