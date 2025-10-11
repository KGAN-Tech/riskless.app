import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation } from "../navigation/users.bottom.navigation";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { NAVIGATION } from "@/configuration/const.config";

interface UserProtectedLayoutProps {
  children?: ReactNode;
}

export default function UserProtectedLayout({
  children,
}: UserProtectedLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const getAuth = getUserFromLocalStorage();
  const [activeTab, setActiveTab] = useState<string>(NAVIGATION.USER[0].id);

  useEffect(() => {
    const currentTab = NAVIGATION.USER.find(
      (tab) =>
        location.pathname === tab.path ||
        location.pathname.startsWith(tab.path + "/")
    );
    if (currentTab && currentTab.id !== activeTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]); // ✅ fixed

  const handleTabChange = (tabId: string) => {
    const selectedTab = NAVIGATION.USER.find((t) => t.id === tabId);
    if (!selectedTab) return;
    if (selectedTab.path === location.pathname) return; // ✅ Prevent loop
    navigate(selectedTab.path);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col relative z-10">
          <main className="w-full h-[calc(100vh-64px)] overflow-auto">
            {children}
          </main>
        </div>
      </div>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={NAVIGATION.USER}
      />
    </div>
  );
}
