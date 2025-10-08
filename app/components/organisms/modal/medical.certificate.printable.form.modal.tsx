import { useState, useEffect } from "react";
import { Printer, Download, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface HistoryRecord {
  id: string;
  date: string;
  summary: string;
}

interface PrintableMedicalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: HistoryRecord | null;
}

export default function PrintableMedicalCertificateModal({
  isOpen,
  onClose,
  record,
}: PrintableMedicalCertificateModalProps) {
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
  const handleDownload = () => console.log("Download not yet implemented");

  if (!isOpen || !record) return null;

  const config = {
    title: "Medical Certificate",
    background:
      "/template/medical-certificate/FTCC-Medical-Certificate.jpg?height=1000&width=800",
    width: 800,
    height: 1150,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md rounded-lg" />

        {/* Modal Content */}
        <div className="relative z-10 flex flex-col">
          {/* Header */}
          <div className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {config.title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white/90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toolbar */}
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

          {/* Content Area */}
          <div className="overflow-x-auto overflow-y-auto p-5 flex-1">
            <div
              className="print-area transition-transform duration-300 ease-in-out mx-auto"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                width: `${config.width}px`,
                height: `${config.height}px`,
              }}
            >
              <div
                className="relative rounded-lg overflow-hidden shadow-2xl mx-auto text-[10px]"
                style={{
                  width: `${config.width}px`,
                  height: `${config.height}px`,
                  backgroundImage: `url('${config.background}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Overlay record data */}
                <div className="absolute inset-0 p-6">
                  <h2 className="text-base font-bold mb-2">{config.title}</h2>

                  {/* Precise overlay */}
                  <p className="absolute" style={{ top: "200px", left: "100px" }}>
                    <span className="font-semibold">Date:</span> {record.date}
                  </p>
                  <p className="absolute" style={{ top: "250px", left: "100px" }}>
                    <span className="font-semibold">Details:</span> {record.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
