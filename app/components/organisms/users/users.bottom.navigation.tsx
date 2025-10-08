import { Home, QrCode, User } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "qr", label: "QR", icon: QrCode },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 flex-col gap-1 h-16 rounded-none ${
                isActive ? "text-blue-600" : "text-muted-foreground"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.id === "qr" ? (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              ) : (
                <IconComponent className="h-5 w-5" />
              )}
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}