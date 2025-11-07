import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  UserPlus,
  ClipboardList,
  Pill,
  Stethoscope,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

interface SubItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/~/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    href: "/~/members",
    icon: Users,
  },
  {
    name: "E-Kas",
    href: "/~/e-kas",
    icon: ClipboardList,
  },
  {
    name: "E-Press",
    href: "/~/e-press",
    icon: Pill,
  },
  {
    name: "Doctors",
    icon: Stethoscope,
    subItems: [
      {
        name: "Doctor List",
        href: "/~/doctors",
      },
      {
        name: "Doctor Schedule",
        href: "/~/doctors/schedule",
      },
      {
        name: "Schedule Appointment",
        href: "/~/doctors/appointments",
      },
    ],
  },
  // {
  //   name: "Patients",
  //   href: "/~/patients",
  //   icon: UserPlus,
  // },
  {
    name: "Appointments",
    href: "/~/appointments",
    icon: Calendar,
  },
  // {
  //   name: "Records",
  //   href: "/~/records",
  //   icon: FileText,
  // },
  {
    name: "Settings",
    href: "/~/settings",
    icon: Settings,
  },
  // {
  //   name: "PKRF",
  //   href: "/~/annex-a-pkrf-2024",
  //   icon: FileText,
  // },
  // {
  //   name: "FPE",
  //   href: "/~/fpe",
  //   icon: FileText,
  // },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const activeItem = navigation.find((item) => {
      if (item.subItems) {
        return item.subItems.some((subItem) =>
          location.pathname.startsWith(subItem.href)
        );
      }
      return item.href === location.pathname;
    });

    if (activeItem?.subItems) {
      setExpandedItems([activeItem.name]);
    }
  }, []);

  useEffect(() => {
    const activeItem = navigation.find((item) => {
      if (item.subItems) {
        return item.subItems.some((subItem) =>
          location.pathname.startsWith(subItem.href)
        );
      }
      return item.href === location.pathname;
    });

    if (activeItem?.subItems) {
      setExpandedItems((prev) => {
        if (!prev.includes(activeItem.name)) {
          return [...prev, activeItem.name];
        }
        return prev;
      });
    }
  }, [location.pathname]);

  const toggleItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const baseClass =
    "fixed z-30 inset-y-0 left-0 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out";
  const responsiveClass = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sm:hidden fixed inset-0 bg-black bg-opacity-25 transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`${baseClass} sm:relative sm:translate-x-0 ${responsiveClass}`}
      >
        <div className="flex h-16 items-center border-b px-4">
          <h1 className="text-xl font-semibold">FTCC EMR</h1>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const hasSubItems = item.subItems !== undefined;
            const isExpanded = expandedItems.includes(item.name);
            const isSubActive = item.subItems?.some((subItem) =>
              location.pathname.startsWith(subItem.href)
            );

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleItem(item.name)}
                    className={cn(
                      "flex w-full items-center px-2 py-2 text-sm font-medium rounded-md",
                      isSubActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isSubActive ? "text-gray-500" : "text-gray-400"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform",
                        isExpanded ? "transform rotate-180" : ""
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-gray-500" : "text-gray-400"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )}
                {hasSubItems && isExpanded && item.subItems && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                            isSubActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <button
            className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            onClick={() => {
              // Handle logout logic
              setIsOpen(false);
            }}
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
