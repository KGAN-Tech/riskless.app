import { Button } from "../atoms/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export const Headerbackbutton = ({ 
  title, 
  showBackButton = true, 
  onBackClick,
  className = ""
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 pt-0 pb-4 ${className}`}
      >
        <div className="flex items-center w-full p-4 border-b bg-white/95 backdrop-blur-sm shadow-sm rounded-b-lg">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-blue-600" />
            </Button>
          )}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold ml-4 text-blue-900">
            {title}
          </h1>
        </div>
      </header>
      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
};
