import { useState, type JSX } from "react";
import { ChevronDown, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Button } from "~/app/components/atoms/button";
import { useNavigate } from "react-router";

type HeaderProps = {
  title: string;
  selectedUser: any;
  users: any[];
  pages: any[];
  selectedPage: string;
  onSelectUser: (user: any) => void;
  onSelectPage?: (page: string) => void;
  views: { id: string; icon: JSX.Element; page?: string; views?: string[] }[];
  selectedView?: string;
  onSelectView?: (view: string) => void;
};

export default function MainPatientHeader({
  title,
  selectedUser,
  users,
  pages,
  selectedPage,
  onSelectUser,
  onSelectPage,
  views,
  onSelectView,
  selectedView,
}: HeaderProps) {
  const navigate = useNavigate();
  // const [activePage, setActivePage] = useState(selectedPage || pages[0].id);

  const handlePageSelect = (page: string) => {
    onSelectPage?.(page);
  };

  const handleViewSelect = (viewId: string) => {
    onSelectView?.(viewId);
  };

  const encounterViews = views.filter(
    (v: any) => v.page?.toLowerCase() === "encounter"
  );

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 border-b border-border bg-card/50 backdrop-blur">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Home Shortcut */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Home</span>
        </Button>

        {/* Page Title + Dropdown */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl capitalize font-semibold text-foreground">
            {pages.find((p) => p.id === selectedPage)?.title || "Unknown"}
          </h1>

          {pages?.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center focus:outline-none">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel>Pages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pages.map((page) => (
                  <DropdownMenuItem
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={page.title === selectedPage ? "bg-muted" : ""}
                  >
                    {page.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Encounter Views Dropdown */}
          {selectedPage.toLowerCase() === "encounter" &&
            encounterViews.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none">
                  <span>
                    {encounterViews.find((v) => v.id === selectedView)?.id ||
                      "Select View"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuLabel>Views</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {encounterViews.map((view) => (
                    <DropdownMenuItem
                      key={view.id}
                      onClick={() => handleViewSelect(view.id)}
                      className={view.id === selectedView ? "bg-muted" : ""}
                    >
                      <div className="flex items-center gap-2">
                        {view.icon}
                        <span>{view.id}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/registration")}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline font-medium">Records</span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <img
              src={
                selectedUser?.person?.images?.[0] ||
                selectedUser?.avatar ||
                "/avatar.png"
              }
              alt={selectedUser?.name}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="hidden sm:inline text-sm font-medium text-foreground">
              {selectedUser?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`flex items-center gap-2 ${
                  user.id === selectedUser?.id ? "bg-muted" : ""
                }`}
              >
                <img
                  src={user.avatar || "/avatar.png"}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
