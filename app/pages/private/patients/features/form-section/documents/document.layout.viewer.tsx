import React, { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, Printer, Download } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface OverlayText {
  text: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color?: string;
  fontSize?: string;
}

interface DocumentConfig {
  title: string;
  background: string; // image URL
  imgHeight: string;
  imgWidth: string;
  texts?: OverlayText[]; // texts specific to this image
}

interface DocumentLayoutViewerProps {
  configs: DocumentConfig[];
}

export const DocumentLayoutViewer: React.FC<DocumentLayoutViewerProps> = ({
  configs,
}) => {
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

  const handlePrint = () => {
    const printAreas = document.querySelectorAll(".print-area");
    if (!printAreas.length) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    let html = `<html>
      <head>
        <title>Documents</title>
        <style>
          @page { size: auto; margin: 10mm; }
          body { margin: 0; padding: 0; text-align: center; }
          .print-image { max-width: 100%; max-height: 100vh; object-fit: contain; }
          .overlay-text { position: absolute; font-size: 12px; font-weight: bold; }
          .page { page-break-after: always; position: relative; display: inline-block; }
        </style>
      </head>
      <body>`;

    printAreas.forEach((el) => {
      html += `<div class="page">${el.innerHTML}</div>`;
    });

    html += `</body></html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleDownload = () => {
    alert("Download logic goes here");
  };

  return (
    <div className="relative z-10 flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Document Viewer
          </h2>
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

      {/* Content */}
      <div className="overflow-x-auto overflow-y-auto p-5 mb-5 h-[600px]">
        {configs.map((config, idx) => (
          <div
            key={idx}
            className="print-area transition-transform duration-300 ease-in-out mb-5"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <div
              className={`relative ${config.imgWidth} ${config.imgHeight} bg-white shadow-2xl rounded-lg overflow-hidden mx-auto`}
            >
              <img
                src={config.background}
                alt={config.title}
                className="print-image w-full h-full object-contain"
              />

              {config.texts?.map((t, i) => (
                <div
                  key={i}
                  className="absolute overlay-text"
                  style={{
                    top: t.top,
                    left: t.left,
                    right: t.right,
                    bottom: t.bottom,
                    color: t.color || "black",
                    fontSize: t.fontSize || "12px",
                  }}
                >
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
