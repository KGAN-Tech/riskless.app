import React, { useEffect } from "react";
import { useNavigate } from "react-router";

interface SecurityAlertProps {
  isOn: boolean;
  children: React.ReactNode;
}

const SecurityAlert = ({ isOn, children }: SecurityAlertProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOn) return;

    // --- Block right-click silently ---
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // --- Detect DevTools open ---
    let devToolsOpen = false;
    const threshold = 160; // px difference means devtools is open

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          navigate("/warning");
        }
      } else {
        devToolsOpen = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      clearInterval(interval);
    };
  }, [isOn, navigate]);

  return <>{children}</>;
};

export default SecurityAlert;
