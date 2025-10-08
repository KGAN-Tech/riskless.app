import { useState, useEffect } from "react";
import { Printer, Download, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface HistoryRecord {
  id: string;
  date: string;
  summary: string;
}

interface EkasEpressPrintableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ekas" | "epress" | "medcert" | null;
  record: HistoryRecord | null;
}

export default function EkasEpressPrintableFormModal({
  isOpen,
  onClose,
  type,
  record,
}: EkasEpressPrintableFormModalProps) {
  const [scale, setScale] = useState(1);

  // Responsive scale
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) setScale(0.4);
      else if (screenWidth < 768) setScale(0.6);
      else if (screenWidth < 1024) setScale(0.7);
      else if (screenWidth < 1280) setScale(0.8);
      else setScale(1);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const adjustScale = (delta: number) =>
    setScale((prev) => Math.max(0.3, Math.min(1.5, prev + delta)));

  const handlePrint = () => setTimeout(() => window.print(), 100);
  const handleDownload = () => {
    // Placeholder: you can export data as needed
    console.log("Download not yet implemented");
  };

  if (!isOpen || !type || !record) return null;

  const getConfig = () => {
    switch (type) {
      case "ekas":
        return {
          title: "Laboratory Request (E-KAS)",
          background:
            "/template/ekas-epress/Annex_H_eKAS_ePresS.jpg?height=1000&width=800",
        };
      case "epress":
        return {
          title: "Prescription (E-PRESS)",
          background:
            "/template/ekas-epress/Annex_H_eKAS_ePresS.jpg?height=1000&width=800",
        };
      default:
        return { title: "", background: "" };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="max-w-[95vw] max-h-[95vh] h-full w-full overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md rounded-lg" />
        
        {/* Modal Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with toolbar */}
          <div className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {config.title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scale adjustment and action buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={() => adjustScale(-0.1)}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
              >
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={() => adjustScale(0.1)}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
              >
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-600 mt-2">
              Scale: {Math.round(scale * 100)}%
            </div>
          </div>

          {/* Content area */}
          <div className="overflow-x-auto overflow-y-auto p-5 h-full w-full">
            <div
              className="print-area transition-transform duration-300 ease-in-out"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                width: "1300px",
                height: "1000px",
                margin: "0 auto",
              }}
            >
              <div
                className="relative w-[1300px] h-[1000px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5 text-[10px]"
                style={{
                  backgroundImage: `url('${config.background}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
