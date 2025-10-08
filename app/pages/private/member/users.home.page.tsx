import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Header } from "@/components/organisms/users/users.header";
import { ViewTabs } from "@/components/organisms/users/users.view.tabs";
import { QuickActions } from "@/components/organisms/users/users.quick.action";
import { BottomNavigation } from "@/components/organisms/users/users.bottom.navigation";

import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function Homepage() {
  const navigate = useNavigate();
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [member, setMember] = useState<any>({});

  const getUserdata = getUserFromLocalStorage();
  const userId = getUserdata?.user?.id;

  function handleLogout() {
    localStorage.removeItem("auth");
    sessionStorage.clear();
    navigate("/login"); // use navigate instead of window.location.href
  }

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await userService.get(userId as string, {
          fields: "id,userName,person,type",
        });
        setMember(res.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    if (userId) fetchMember();
  }, [userId]);

  // 🔹 Action buttons → Navigate to real routes
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "records":
        navigate("/users/encounter");
        break;
      case "appointment":
        navigate("/api/appointment");
        break;
      case "prescriptions":
        navigate("/prescriptions");
        break;
      case "pharmacy":
        navigate("/pharmacy/map");
        break;
      case "profile":
        navigate("/users/profile");
        break;
      case "download":
        navigate("/forms");
        break;
      case "history":
        navigate("/encounter");
        break;
      default:
        navigate("/users/home");
    }
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "qr") {
      console.log("QR tab selected");
    } else if (tab === "profile") {
      navigate("/users/profile");
    } else if (tab === "home") {
      navigate("/users/home");
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 overflow-x-hidden">
      <div className="w-full h-full bg-white max-w-full">
        {/* Desktop + Mobile Header */}
        <Header userName={member?.userName} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="space-y-8 pb-20 md:pb-8">
          <ViewTabs
            userId={member?.id ?? ""}
            userName={`${member?.person?.lastName ?? ""} ${
              member?.person?.firstName ?? ""
            }`.trim()}
            memberType={member?.type ?? "Member"}
          />

          <QuickActions onActionClick={handleActionClick} />
        </div>

        {/* Bottom Nav (mobile only) */}
        <div className="md:hidden">
          <BottomNavigation
            activeTab={activeNavTab}
            onTabChange={handleNavTabChange}
          />
        </div>
      </div>
    </div>
  );
}
