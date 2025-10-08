import { useState, type ReactNode } from "react";
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  X,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";

interface DocumentModalProps {
  title: string;
  children: ReactNode; // 👈 external content will be injected here
}

export function AllDocumentsSection({ title, children }: DocumentModalProps) {
  const [scale, setScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const adjustScale = (delta: number) => {
    setScale((prev) => Math.max(0.3, Math.min(1.5, prev + delta)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-blue-500 text-white">
          <FileText className="w-4 h-4" /> {title}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
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
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
