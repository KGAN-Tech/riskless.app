import { Button } from "@/components/atoms/button";
import { ClipboardList, Camera, FileText } from "lucide-react";

export const ShortcutActions = () => {
  const shortcuts = [
    // { label: "Queue", icon: <ClipboardList className="w-5 h-5 mb-1" /> },
    // { label: "Photo Consent", icon: <Camera className="w-5 h-5 mb-1" /> },
    { label: "Documents", icon: <FileText className="w-5 h-5 mb-1" /> },
  ];

  return (
    <>
      <h1>Shortcut Actions</h1>
      <div className="grid grid-cols-3 gap-3 w-full mt-4">
        {shortcuts.map((item, index) => (
          <Button
            key={index}
            variant="secondary"
            className="flex flex-col items-center py-3"
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </>
  );
};
