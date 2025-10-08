import {
  MapPin,
  FlaskConical,
  MessageCircle,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { FaPills } from "react-icons/fa";
import { Card } from "@/components/atoms/card";
import { useNavigate } from "react-router";

const konsulta = [
  {
    name: "Registration",
    path: "/konsulta/reports/registration",
    icon: <UserPlus className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Health Screening",
    path: "/konsulta/reports/health-screening",
    icon: <Stethoscope className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Consultation",
    path: "/konsulta/reports/consultation",
    icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Laboratory",
    path: "/konsulta/reports/laboratory",
    icon: <FlaskConical className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Medicines",
    path: "/konsulta/reports/medicines",
    icon: <FaPills className="w-12 h-12 text-blue-500" />,
  },
  {
    name: "Maps",
    path: "/konsulta/reports/maps",
    icon: <MapPin className="w-12 h-12 text-blue-500" />,
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800  border-gray-200 ">
          Reports
        </h1>
        <p className="text-sm text-gray-500">
          Choose the module of reports you want to use.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {konsulta.map((item) => (
          <Card
            key={item.name}
            className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
            onClick={() => navigate(item.path)}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full ">{item.icon}</div>
              <p className="text-lg font-medium text-gray-700 text-center">
                {item.name}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}