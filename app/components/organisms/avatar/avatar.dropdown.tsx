import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function AvatarDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>
        <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-gray-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-300 shadow-lg rounded-lg p-2 border-0">
          <nav className="flex flex-col space-y-2">
            <Button variant="secondary" className="text-left w-full">
              Profile
            </Button>
            <Button variant="secondary" className="text-left w-full">
              Settings
            </Button>
            <Button variant="secondary" className="text-left w-full">
              Logout
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
