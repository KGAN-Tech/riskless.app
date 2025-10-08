import { cn } from "@/lib/utils";
import { LogOut, ChevronDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "~/app/configuration/const.config";

import { useAuth } from "~/app/hooks/use.auth";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SidebarV2({ isOpen, setIsOpen }: AdminSidebarProps) {
  const location = useLocation();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { logout } = useAuth();
  const getAuth = getUserFromLocalStorage();

  // Initialize expanded items based on current route
  useEffect(() => {
    const activeItem = NAVIGATION.MAIN.find((item) => {
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

  // Update expanded items when route changes
  useEffect(() => {
    const activeItem = NAVIGATION.MAIN.find((item) => {
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

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-64 bg-gray-100  transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between  px-4">
          <h1 className="text-xl font-semibold">
            <img
              src="/ftcc-health-tech.png"
              alt="FTCC Health Tech"
              className="h-10 w-10"
            />
          </h1>
          <button
            className="sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {NAVIGATION.MAIN.filter((item) =>
            item.userTypes.includes(getAuth?.user?.type)
          ).map((item) => {
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
                        ? "bg-blue-100 text-gray-900"
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
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary-800 text-blue-500 hover:text-blue-700 "
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => {
                      if (item.href) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive
                          ? "text-[var(--sidebar-text-active)]"
                          : "text-[var(--sidebar-text)]"
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
                          className={cn(
                            "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                            isSubActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                          onClick={() => setIsOpen(false)}
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
              // Handle logout
              logout();
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
