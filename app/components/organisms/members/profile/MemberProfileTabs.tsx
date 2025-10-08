import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode; // JSX element
}

interface MemberProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MemberProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: MemberProfileTabsProps) {
  return (
    <div className="border-b overflow-x-auto">
      <nav
        className="flex space-x-4 sm:space-x-8"
        role="tablist"
        aria-label="Member Profile Tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center border-b-2 py-3 px-2 text-sm font-medium focus:outline-none",
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {tab.icon && <div className="text-xl">{tab.icon}</div>}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
