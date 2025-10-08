import { useEffect } from "react";

export const useRestrictBrowserActions = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J", "K"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U") ||
        ((e.ctrlKey || e.metaKey) && ["+", "-", "0"].includes(e.key))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Disable zoom via Ctrl + Mouse Wheel
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Disable pinch zoom (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const handleGestureStart = (e: Event) => e.preventDefault();

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("gesturestart", handleGestureStart);

    // Inject viewport meta tag to disable scaling
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(meta);

    // DevTools Detection
    let checkInterval: number | undefined;

    const detectDevTools = () => {
      const devtools = new Function(
        'return /./.constructor.constructor("debugger")()'
      );
      try {
        devtools();
      } catch (_) {
        // Detected! Redirect or attempt to close tab
        window.location.href = "about:blank"; // or: window.close(); (may not work)
      }
    };

    checkInterval = window.setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("gesturestart", handleGestureStart);
      document.head.removeChild(meta);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [enabled]);
};
