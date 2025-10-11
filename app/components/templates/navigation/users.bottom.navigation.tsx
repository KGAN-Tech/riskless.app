import { Button } from "@/components/atoms/button";
import { useNavigate } from "react-router";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    id: string;
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function BottomNavigation({
  activeTab,
  onTabChange,
  tabs,
}: BottomNavigationProps) {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, path: string) => {
    onTabChange(tabId);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200
              ${isActive ? "text-green-600" : "text-gray-500"}
              hover:bg-green-400 hover:text-white`}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-200
                ${isActive ? "stroke-green-600" : "stroke-gray-500"}
                group-hover:stroke-white`}
            />
            <span className="text-xs">{tab.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
