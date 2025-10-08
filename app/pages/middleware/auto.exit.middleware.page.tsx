import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AutoExitMiddlewarePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
}
