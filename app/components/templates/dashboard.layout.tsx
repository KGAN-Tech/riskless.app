import type { ReactNode } from "react";
import { useState } from "react";
import AvatarDropdown from "../organisms/avatar/avatar.dropdown";
import BottomNav from "../organisms/navigation/admin.dasboard.bottom.nav";
import { Menu } from "lucide-react";

type DashboardLayoutProps = {
  children: ReactNode;
  SidebarComponent: React.ElementType;
};

export const DashboardLayout = ({
  children,
  SidebarComponent,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Sidebar + Overlay */}
      <div className="sm:hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-white/60 backdrop-blur px-4 sm:px-6">
            <button className="sm:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <AvatarDropdown />
          </header>

          {/* Content */}
          <main className="flex-1 p-4 pb-24 sm:pb-6 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <BottomNav />
    </div>
  );
};
