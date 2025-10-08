import { useEffect, useState } from "react";
import AvatarDropdown from "@/components/organisms/avatar/avatar.dropdown";
import BottomNav from "@/components/organisms/navigation/admin.dasboard.bottom.nav";
import { Maximize2, Minimize2, ChevronDown } from "lucide-react";
import SidebarV2 from "../navigation/side.nav";
import { PORTAL_NAV } from "~/app/configuration/const.config";
import { useLocation, useNavigate, Outlet, useParams } from "react-router";
import { CounterSidebar } from "../sidebar/counter.sidebar";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { queuingService } from "~/app/services/queuing.service";

export default function CounterProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { counterId } = useParams<{ counterId: string }>();

  const [selectedPortal, setSelectedPortal] = useState(PORTAL_NAV[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [queu, setQueu] = useState<any>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect current path
  useEffect(() => {
    const current = PORTAL_NAV.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (current) {
      setSelectedPortal(current);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchQueus = async () => {
      try {
        const res: any = await queuingService.getAll({
          counterId: counterId || "",
        });
        setQueu(res.data);
      } catch (err) {
        console.error("Failed to fetch counters", err);
      }
    };

    fetchQueus();
  }, []);

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
          <>
            <CounterSidebar
              patients={queu}
              onPatientsReorder={() => {}}
              onServeNext={() => {}}
              onSkipPatient={() => {}}
              onRecallPatient={() => {}}
              currentPatientId={undefined}
            />
          </>
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
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom nav for mobile (hidden if fullscreen) */}
      {!isFullScreen && <BottomNav />}
    </div>
  );
}
