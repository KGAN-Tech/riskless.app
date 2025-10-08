import { useEffect, useState } from "react";
import AvatarDropdown from "@/components/organisms/avatar/avatar.dropdown";
import BottomNav from "@/components/organisms/navigation/admin.dasboard.bottom.nav";
import { Maximize2, Minimize2, ChevronDown } from "lucide-react";
import SidebarV2 from "../navigation/side.nav";
import { NAVIGATION } from "~/app/configuration/const.config";
import { useLocation, useNavigate, Outlet } from "react-router";

export default function PortalProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [selectedPortal, setSelectedPortal] = useState(NAVIGATION.PORTAL[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect current path
  useEffect(() => {
    const current = NAVIGATION.PORTAL.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (current) {
      setSelectedPortal(current);
    }
  }, [location.pathname]);

  const handleSelect = (item: (typeof NAVIGATION.PORTAL)[0]) => {
    setSelectedPortal(item);
    setDropdownOpen(false);
    navigate(item.path);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
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
        {/* Sidebar (hidden if fullscreen) */}
        {!isFullScreen && (
          <SidebarV2 isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col relative z-10">
          <main
            className={`${
              isFullScreen
                ? "fixed inset-0 w-full h-full z-50 bg-white p-5"
                : "flex-1 bg-white overflow-y-auto p-5 m-2 rounded-lg shadow-md"
            }`}
          >
            <div className="relative">
              <div className="border-b pb-2">
                {/* Dropdown for title */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center text-2xl font-semibold text-gray-800 border-gray-200"
                  >
                    {selectedPortal?.title ?? "Select Portal"}
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                      {NAVIGATION.PORTAL.map((item, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleSelect(item)}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  {selectedPortal?.description}
                </p>
              </div>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="absolute top-4 right-4 p-2 rounded-md bg-gray-200 hover:bg-gray-300 shadow"
              >
                {isFullScreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Render nested routes */}
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile (hidden if fullscreen) */}
      {!isFullScreen && <BottomNav />}
    </div>
  );
}
