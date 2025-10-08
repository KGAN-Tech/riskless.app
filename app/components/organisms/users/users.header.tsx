import { Bell, Menu, User, LogOut } from "lucide-react";
import { Button } from "../../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useNavigate } from "react-router";

interface HeaderProps {
  userName: string;
  onLogout?: () => void;
}

function handleLogout() {
  // Clear stored tokens/session
  localStorage.removeItem("authToken");
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "/login";
}

export function Header({ userName, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const currentTime = new Date().getHours();
  const greeting =
    currentTime < 12
      ? "Good Morning"
      : currentTime < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex items-center justify-between p-4 md:p-6">
      <div>
        <p className="text-muted-foreground">{greeting}</p>
        <h1 className="text-2xl font-medium">{userName}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
        </Button>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Menu className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("users/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout ?? handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
