import { useEffect, useState, type ReactNode } from "react";
import BottomNav from "@/components/organisms/navigation/admin.dasboard.bottom.nav";
import { ChevronDown, User, Shrink, Expand } from "lucide-react";
import SidebarV2 from "../navigation/side.nav";

import { useLocation, useNavigate } from "react-router";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { NAVIGATION } from "@/configuration/const.config";

interface PortalProtectedLayoutProps {
  children?: ReactNode;
}

export default function PortalProtectedLayout({
  children,
}: PortalProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [selectedPortal, setSelectedPortal] = useState(NAVIGATION.PORTAL[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Example user (replace with your auth context/store)
  const getAuth = getUserFromLocalStorage();

  // Auto-detect current path
  useEffect(() => {
    const current = NAVIGATION.PORTAL.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );

    setSelectedPortal(current ?? NAVIGATION.PORTAL[0]); // fallback to first if no match
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
                : "flex-1 bg-white overflow-y-auto p-4 m-2 rounded-lg shadow-md"
            }`}
          >
            <div className="flex items-center justify-between ">
              <div>
                <p className="font-medium text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-full mb-4 inline-block">
                  {getAuth.user?.role === "super_admin" ? (
                    <span>Admin | {getAuth.user?.facility?.name}</span>
                  ) : (
                    <span>
                      {getAuth.user?.facility?.name} |{" "}
                      {getAuth.user?.facility?.pcb?.accreditationNo}
                    </span>
                  )}
                </p>
              </div>

              {/* Right: User + Fullscreen */}
              <div className="flex items-center gap-4">
                {/* User dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md  hover:bg-gray-200">
                    <div className="hidden md:block text-sm text-gray-700 ">
                      <p className="flex flex-col leading-tight">
                        {getAuth.user?.type === "admin" ? (
                          <span>(Admin) {getAuth.user?.userName}</span>
                        ) : getAuth.user?.type === "physician" ? (
                          <span>
                            {" "}
                            <span className="font-semibold">Dr.</span>{" "}
                            {getAuth.user?.person?.firstName}
                            {getAuth.user?.person?.middleName}{" "}
                            {getAuth.user?.person?.lastName}{" "}
                            {getAuth.user?.person?.extensionName}
                          </span>
                        ) : (
                          <span>{getAuth.user?.userName}</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 "
                    >
                      {getAuth.user?.person?.images[0] ? (
                        <img
                          src={getAuth.user?.person?.images[0]?.url}
                          alt={getAuth.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {getAuth.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {getAuth.user?.person?.firstName}{" "}
                          {getAuth.user?.person?.middleName}{" "}
                          {getAuth.user?.person?.lastName}{" "}
                          {getAuth.user?.person?.extensionName}
                        </p>
                        <p className="text-xs text-gray-500">{getAuth.email}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profile
                      </button>
                      <button 
                        onClick={() => navigate('/settings')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Settings
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('auth');
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Fullscreen Toggle Button */}
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 shadow transition"
                  title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullScreen ? (
                    <Shrink className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Expand className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-between border-b pb-2">
              {/* Left: Portal dropdown */}
              <div>
                <div className="">
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
                        {NAVIGATION.PORTAL.filter(
                          (item) =>
                            item.isDisplayed &&
                            item?.userTypes.includes(getAuth?.user?.type)
                        ).map((item, idx) => (
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
              </div>
            </div>

            {/* Render passed children */}
            {children}
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile (hidden if fullscreen) */}
      {!isFullScreen && <BottomNav />}
    </div>
  );
}
