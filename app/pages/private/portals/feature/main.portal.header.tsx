import { useState, type JSX } from "react";
import { ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

type HeaderProps = {
  title: string;
  selectedUser: any;
  users: any[];
  pages: string[];
  selectedPage?: string;
  onSelectUser: (user: any) => void;
  onSelectPage?: (page: string) => void;
  views: { id: string; icon: JSX.Element; page?: string }[];
  selectedView?: string;
  onSelectView?: (view: string) => void;
};

export default function MainPortalHeader({
  title,
  selectedUser,
  users,
  pages,
  onSelectUser,
  onSelectPage,
  views,
  onSelectView,
  selectedView,
}: HeaderProps) {
  const [activePage, setActivePage] = useState(pages[0] || title);

  const handlePageSelect = (page: string) => {
    setActivePage(page);
    onSelectPage?.(page);
  };

  const handleViewSelect = (viewId: string) => {
    onSelectView?.(viewId);
  };

  const encounterViews = views.filter(
    (v) => v.page?.toLowerCase() === "encounter"
  );

  return (
    <header className="w-full flex justify-between items-center px-6 py-3">
      {/* Page Title with Dropdown */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-800">{activePage}</h1>
        {pages?.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuLabel>Pages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pages.map((page) => (
                <DropdownMenuItem
                  key={page}
                  onClick={() => handlePageSelect(page)}
                  className={page === activePage ? "bg-gray-100" : ""}
                >
                  {page}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* View Dropdown (only if activePage = Encounter) */}
        {activePage.toLowerCase() === "encounter" &&
          encounterViews.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none border rounded-md p-2">
                <span className="text-sm font-medium text-gray-700">
                  {encounterViews.find((v) => v.id === selectedView)?.id ||
                    "Select View"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>Views</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {encounterViews.map((view) => (
                  <DropdownMenuItem
                    key={view.id}
                    onClick={() => handleViewSelect(view.id)}
                    className={view.id === selectedView ? "bg-gray-100" : ""}
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

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
          <img
            src={
              selectedUser?.person?.images?.length > 0
                ? selectedUser?.person?.images[0]
                : "/avatar.png"
            }
            alt={selectedUser?.name}
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedUser?.name}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-2 ${
                user.id === selectedUser.id ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
