import { useState, type ReactNode, useRef, useEffect } from "react";
import { Printer, Download, ZoomIn, ZoomOut, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";

// Define a type for print styles
interface PrintStyles {
  width?: string;
  height?: string;
  position?: {
    left?: string;
    top?: string;
  };
  transform?: string;
  scale?: string;
  isMultiPage?: boolean; // Flag to indicate if document has multiple pages
}

interface DocumentModalProps {
  title: string;
  children: ReactNode;
  printStyles?: PrintStyles;
  scale: any;
  setScale: any;
}

export function DocumentModal({
  title,
  children,
  printStyles,
  scale,
  setScale,
}: DocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Default print styles
  const defaultPrintStyles: PrintStyles = {
    position: {
      left: "50%",
      top: "18%",
    },
    transform: "translate(-50%, -50%)",
    scale: "0.70",
    isMultiPage: false,
  };

  // Merge default styles with provided styles
  const mergedPrintStyles = {
    ...defaultPrintStyles,
    ...printStyles,
    position: {
      ...defaultPrintStyles.position,
      ...printStyles?.position,
    },
  };

  const handlePrint = () => {
    // Add a style element to control what gets printed
    const style = document.createElement("style");

    // Different styling for single vs multi-page documents
    if (mergedPrintStyles.isMultiPage) {
      style.innerHTML = `
        @media print {
          /* Hide everything except the print content */
          body > *:not(#printContainer) {
            display: none !important;
          }
          
          /* Show the print content */
          #printContent {
            display: block !important;
            position: relative !important;
            margin: 0 auto !important;
            background-color: white;
          }
          
          /* Ensure background images are visible */
          #printContent * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-shadow: none !important;
          }
          
          /* Reset any page breaks that might be automatically added */
          #printContent > div {
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          
          /* Handle multi-page content - target direct children of print-area */
          #printContent > div > div {
            page-break-after: always !important;
            transform: scale(${mergedPrintStyles.scale || "0.70"}) !important;
            transform-origin: top center !important;
          }
          
          /* Remove page break for the last page */
          #printContent > div > div:last-child {
            page-break-after: avoid !important;
          }
          
          /* Force exactly 2 pages for FPE form */
          @page {
            margin: 0;
            size: auto;
          }
        }
      `;
    } else {
      style.innerHTML = `
        @media print {
          /* Hide everything except the print content */
          body > *:not(#printContainer) {
            display: none !important;
          }
          
          /* Show the print content */
          #printContent {
            display: block !important;
            position: fixed;
            left: ${mergedPrintStyles.position?.left || "50%"} !important;
            top: ${mergedPrintStyles.position?.top || "18%"} !important;
            transform: ${
              mergedPrintStyles.transform || "translate(-50%, -50%)"
            } !important;
            max-width: 100% !important;
            max-height: 100% !important;
            margin: 0 auto !important;
            z-index: 9999;
            background-color: white;
          }
          
          /* Ensure background images are visible */
          #printContent * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-shadow: none !important;
          }
          
          /* Remove any scaling from the content */
          #printContent > div {
            transform: scale(${mergedPrintStyles.scale || "0.70"}) !important;
            transform-origin: center center !important;
          }
        }
      `;
    }

    document.head.appendChild(style);

    // Create a clone of the content to print
    if (contentRef.current) {
      // Create a container for printing
      let printContainer = document.getElementById("printContainer");
      if (!printContainer) {
        printContainer = document.createElement("div");
        printContainer.id = "printContainer";
        document.body.appendChild(printContainer);
      }

      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
      contentClone.id = "printContent";
      contentClone.style.transform = "scale(1)";

      printContainer.innerHTML = "";
      printContainer.appendChild(contentClone);

      setTimeout(() => {
        window.print();

        setTimeout(() => {
          document.head.removeChild(style);
          printContainer.innerHTML = "";
        }, 500);
      }, 300);
    }
  };

  const adjustScale = (delta: number) => {
    setScale((prev: any) => Math.max(0.3, Math.min(1.5, prev + delta)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-blue-500 text-white">
          <FileText className="w-4 h-4" /> {title}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                {title}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </DialogClose>
            </div>
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
                onClick={() => console.log("Download not implemented")}
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
          </DialogHeader>

          {/* Scalable Content */}
          <div
            className="overflow-auto"
            style={{
              transformOrigin: "top center",
            }}
          >
            <div ref={contentRef}>{children}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
