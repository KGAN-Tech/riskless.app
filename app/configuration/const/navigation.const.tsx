import {
  Book,
  Box,
  CheckCircle,
  Coins,
  Database,
  FileText,
  Hospital,
  LayoutDashboard,
  Puzzle,
  User,
  UserPlus,
  GitBranch,
  Home,
  Activity,
  MapPin,
  Bell,
} from "lucide-react";
import { FaRoad } from "react-icons/fa";

interface SubItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubItem[];
  userTypes: string[];
}

export const PORTAL_NAV = [
  {
    code: "portals_1",
    title: "Portals",
    description: "Choose the module of yakap you want to use.",
    path: "/portals",
    isCardDisplayed: false,
    isDisplayed: true,
    userTypes: ["admin", "hci", "physician", "presenter"],
    icon: <UserPlus className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "appointments_1",
    title: "Appointments",
    description:
      "The list of all appointments in the facility/KPP (PhilHealth Konsulta Package Provider).",
    path: "/appointments",
    isCardDisplayed: true,
    isDisplayed: true,
    userTypes: ["admin", "hci", "physician", "presenter"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "masterlist_1",
    title: "Masterlist",
    description:
      "The list of all members registered in the facility/KPP (PhilHealth Konsulta Package Provider).",
    path: "/masterlist",
    isCardDisplayed: true,
    isDisplayed: true,
    userTypes: ["admin", "hci", "physician", "presenter"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "encounters_1",
    title: "Encounters",
    description:
      "The list of all patient encounters in the facility/KPP (PhilHealth Konsulta Package Provider).",
    path: "/encounters",
    isCardDisplayed: true,
    isDisplayed: true,
    userTypes: ["admin", "hci", "physician", "presenter"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "registration_1",
    title: "Registration",
    description: "The registration process for new members.",
    path: "/registration",
    isCardDisplayed: true,
    isDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "counter_1",
    title: "Counter",
    description: "Choose the type of registration you want to use",
    path: "/counters",
    isDisplayed: true,
    isCardDisplayed: true,
    userTypes: ["admin", "hci", "physician", "presenter"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "extractor_1",
    title: "Extractor",
    description: "Extract data from the PhilHealth API system.",
    path: "/extractor",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["hci", "physician"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "inventory_1",
    title: "Inventory",
    path: "/inventory",
    description: "Inventory Management",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <Box className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "migration_1",
    title: "Migration",
    path: "/migration",
    description: " Management",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <Box className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "reports_1",
    title: "Reports",
    path: "/reports",
    description: "Generate and view various reports.",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "quality_control_1",
    title: "Quality Control",
    path: "/quality-control",
    description: "Generate and view various reports.",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <CheckCircle className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "generator_1",
    title: "Generator",
    path: "/generator",
    description: "Generate and view various reports.",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin", "hci"],
    icon: <FileText className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "library_1",
    title: "Library",
    path: "/library",
    description: "Generate and view various reports.",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin"],
    icon: <Book className="w-12 h-12 text-blue-500" />,
  },
  {
    code: "version_control_1",
    title: "Version Control",
    path: "/version-control",
    description: "Manage version control for the application.",
    isDisplayed: false,
    isCardDisplayed: true,
    userTypes: ["admin"],
    icon: <GitBranch className="w-12 h-12 text-blue-500" />,
  },
];

export const USER_NAV = [
  {
    id: "home",
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    id: "activity",
    name: "Activity",
    path: "/activity",
    icon: Activity,
  },
  {
    id: "map",
    name: "Map",
    path: "/map",
    icon: MapPin,
  },
  {
    id: "notification",
    name: "Notification",
    path: "/notification",
    icon: Bell,
  },
  {
    id: "account",
    name: "Account",
    path: "/account",
    icon: User,
  },
];

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/metrics",
    icon: LayoutDashboard,
    userTypes: ["admin", "organization"],
  },
  {
    name: "Roads",
    href: "/roads",
    icon: FaRoad,
    userTypes: ["admin", "organization"],
  },
  {
    name: "Facility",
    href: "/facility",
    icon: Hospital,
    userTypes: ["admin"],
  },
  {
    name: "Report",
    href: "/report",
    icon: FileText,
    userTypes: ["admin", "organization"],
  },
  {
    name: "Notification",
    href: "/notification-ms",
    icon: Bell,
    userTypes: ["admin", "organization"],
  },

  {
    name: "Accounts",
    href: "/account-ms",
    icon: User,
    userTypes: ["admin", "organization"],
  },
];
