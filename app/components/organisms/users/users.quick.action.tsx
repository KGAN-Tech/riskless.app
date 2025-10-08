import { Calendar, FileText, Package, Stethoscope, User, Clock, Download  } from "lucide-react";
import { Button } from "@/components/atoms/button";

const actions = [
  {
    id: "records",
    label: "My Records",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "appointment",
    label: "Appointment",
    icon: Calendar,
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    id: "prescriptions",
    label: "Prescriptions",
    icon: Package,
    color: "bg-orange-600 hover:bg-orange-700",
  },
  {
    id: "pharmacy",
    label: "pharmacy",
    icon: Stethoscope,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    color: "bg-gray-600 hover:bg-gray-700",
  },
  {
    id: "download",
    label: "download",
    icon: Download,
    color: "bg-teal-600 hover:bg-teal-700",
  },
  {
    id: "history",
    label: "history",
    icon: Clock,
    color: "bg-teal-600 hover:bg-teal-700",
  },
];

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="px-4 md:px-6">
      <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="h-20 flex-col gap-2 border-0 bg-white shadow-sm hover:shadow-md transition-shadow"
              onClick={() => onActionClick(action.id)}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}