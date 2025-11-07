import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";

const bottomNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t bg-white px-4 py-2 sm:hidden">
      {bottomNavItems.map((item) => {
        const isActive = location.pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
