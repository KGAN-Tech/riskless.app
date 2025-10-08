import { useNavigate } from "react-router";
import { Card } from "~/app/components/atoms/card";
import { FaPills } from "react-icons/fa";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/atoms/tabs";
import {
  MessageCircle,
  Stethoscope,
  UserPlus,
  Monitor,
  Settings,
  Laptop,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const openStandaloneDisplay = () => {
  window.open(
    "/queue/standalone",
    "_blank",
    "width=1920,height=1080,scrollbars=no,resizable=yes"
  );
};

const counters = [
  {
    name: "Front Desk (Check-in)",
    path: "/counter/front-desk",
    icon: <Laptop className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Appointment",
    path: "/counter/appointment",
    icon: <Calendar className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Interview",
    path: "/counter/interview",
    icon: <UserPlus className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Vitals",
    path: "/counter/vitals",
    icon: <Stethoscope className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Consultation",
    path: "/counter/consultation",
    icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Pharmacy",
    path: "/counter/pharmacy",
    icon: <FaPills className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Counter Display",
    path: null,
    icon: <Monitor className="w-12 h-12 text-blue-500" />,
    action: openStandaloneDisplay,
  },

  {
    name: "Settings",
    path: "/counter/settings",
    icon: <Settings className="w-12 h-12 text-blue-500" />,
  },
];

export default function CounterPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("default");

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800  border-gray-200 ">
          Counters
        </h1>
        <p className="text-sm text-gray-500">
          Choose the module of counters you want to use.
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-5"
      >
        <TabsList className="w-fit border bg-transparent rounded-sm shadow-none p-0">
          <TabsTrigger
            value="default"
            className="border-r w-full m-0 p-0 text-nowrap px-2"
          >
            Default
          </TabsTrigger>
          <TabsTrigger value="custom" className="m-0 p-0 w-full px-2">
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="default"
          className="space-y-2 -mt-5 overflow-y-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {counters.map((item) => (
              <Card
                key={item.name}
                className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full ">
                    {item.icon}
                  </div>
                  <p className="text-lg font-medium text-gray-700 text-center">
                    {item.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-2 -mt-5 overflow-y-auto">
          <p>Not ready yet</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
