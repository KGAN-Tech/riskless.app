import { useState, useEffect } from "react";
import {
  Printer,
  Download,
  FileText,
  Edit3,
  ZoomIn,
  ZoomOut,
  X,
  Calendar,
  Clock,
  User,
  FlaskConical,
  Pill,
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
import { Circle, Square } from "lucide-react";
import { formatPKRFData, formatFPEData } from "@/utils/document.helpers";

interface EKASSnEPRESSModalProps {
  ekasRecord?: any;
  epressRecord?: any;
}

interface PrintableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ekas' | 'epress';
  record?: any;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ekas' | 'epress';
  onSelectRecord: (record: any) => void;
}

// Mock data for history
const mockEkasHistory = [
  {
    id: 1,
    date: "2024-01-15",
    time: "09:30 AM",
    doctor: "Dr. Maria Santos",
    tests: ["Complete Blood Count", "Blood Chemistry", "Urinalysis"],
    status: "completed",
    patientName: "Juan Dela Cruz"
  },
  {
    id: 2,
    date: "2024-01-10",
    time: "02:15 PM",
    doctor: "Dr. Jose Reyes",
    tests: ["X-Ray Chest", "ECG"],
    status: "completed",
    patientName: "Juan Dela Cruz"
  },
  {
    id: 3,
    date: "2024-01-05",
    time: "11:45 AM",
    doctor: "Dr. Ana Garcia",
    tests: ["Blood Sugar", "Cholesterol"],
    status: "completed",
    patientName: "Juan Dela Cruz"
  }
];

const mockEpressHistory = [
  {
    id: 1,
    date: "2024-01-15",
    time: "09:30 AM",
    doctor: "Dr. Maria Santos",
    medicines: ["Paracetamol 500mg", "Amoxicillin 500mg", "Vitamin C"],
    status: "active",
    patientName: "Juan Dela Cruz"
  },
  {
    id: 2,
    date: "2024-01-10",
    time: "02:15 PM",
    doctor: "Dr. Jose Reyes",
    medicines: ["Ibuprofen 400mg", "Omeprazole 20mg"],
    status: "completed",
    patientName: "Juan Dela Cruz"
  },
  {
    id: 3,
    date: "2024-01-05",
    time: "11:45 AM",
    doctor: "Dr. Ana Garcia",
    medicines: ["Metformin 500mg", "Losartan 50mg"],
    status: "active",
    patientName: "Juan Dela Cruz"
  }
];

// History Modal Component
export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  type,
  onSelectRecord
}) => {
  const history = type === 'ekas' ? mockEkasHistory : mockEpressHistory;
  const title = type === 'ekas' ? 'Laboratory History (E-KAS)' : 'Prescription History (E-PRESS)';
  const IconComponent = type === 'ekas' ? FlaskConical : Pill;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">Select a record to view details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {type === 'ekas' ? 'laboratory' : 'prescription'} records found</h3>
              <p className="text-gray-600">This patient has no previous {type === 'ekas' ? 'laboratory tests' : 'prescriptions'}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onSelectRecord(record)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{record.doctor}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      {type === 'ekas' ? 'Laboratory Tests:' : 'Medicines:'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(type === 'ekas' 
                        ? (record as any).tests 
                        : (record as any).medicines
                      ).map((item: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(record);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// New component for showing individual forms
export const PrintableFormModal: React.FC<PrintableFormModalProps> = ({
  isOpen,
  onClose,
  type,
  record
}) => {
  const [scale, setScale] = useState(1);

  // Calculate responsive scale based on screen size
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        // Mobile
        setScale(0.4);
      } else if (screenWidth < 768) {
        // Small tablet
        setScale(0.6);
      } else if (screenWidth < 1024) {
        // Tablet
        setScale(0.7);
      } else if (screenWidth < 1280) {
        // Small desktop
        setScale(0.8);
      } else {
        // Large desktop
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownload = () => {
    // const content = {}
    // const blob = new Blob([content], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "form-data.txt";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  const adjustScale = (delta: number) => {
    setScale((prev) => Math.max(0.3, Math.min(1.5, prev + delta)));
  };

  const getFormConfig = () => {
    if (type === 'ekas') {
      return {
        title: 'E-KAS Printable Form',
        backgroundImage: '/template/e-kas/ANNEX_G_EKAS_EPRESS_Form_1.jpg?height=1000&width=800',
        record: record
      };
    } else {
      return {
        title: 'E-PRESS Printable Form',
        backgroundImage: '/template/e-press/ANNEX_G_EKAS_EPRESS_Form_2.jpg?height=1000&width=800',
        record: record
      };
    }
  };

  const config = getFormConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md rounded-lg" />
        <div className="relative z-10 h-full flex flex-col">
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
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => adjustScale(-0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button onClick={() => adjustScale(0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-600 mt-2">Scale: {Math.round(scale * 100)}%</div>
          </div>
          <div className="overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
            <div className="print-area transition-transform duration-300 ease-in-out"
              style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1150px", margin: "0 auto" }}>
              <div className="relative w-[800px] h-[1100px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5 text-[10px]"
                style={{ backgroundImage: `url('${config.backgroundImage}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                {/* Render record data here */}
                {config.record ? JSON.stringify(config.record) : `No ${type.toUpperCase()} record.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EKASSnEPRESSModal({ ekasRecord, epressRecord }: EKASSnEPRESSModalProps) {
  const [isOpenEkas, setIsOpenEkas] = useState(false);
  const [isOpenEpress, setIsOpenEpress] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate responsive scale based on screen size
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        // Mobile
        setScale(0.4);
      } else if (screenWidth < 768) {
        // Small tablet
        setScale(0.6);
      } else if (screenWidth < 1024) {
        // Tablet
        setScale(0.7);
      } else if (screenWidth < 1280) {
        // Small desktop
        setScale(0.8);
      } else {
        // Large desktop
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownload = () => {
    // const content = {}
    // const blob = new Blob([content], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "form-data.txt";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  const adjustScale = (delta: number) => {
    setScale((prev) => Math.max(0.3, Math.min(1.5, prev + delta)));
  };

  return (
    <div className="flex gap-3">
      {/* E-KAS Button and Modal */}
      <Dialog open={isOpenEkas} onOpenChange={setIsOpenEkas}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            E-KAS
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  E-KAS Printable Form
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => adjustScale(-0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={() => adjustScale(0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-2">Scale: {Math.round(scale * 100)}%</div>
            </DialogHeader>
            <div className="overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
              <div className="print-area transition-transform duration-300 ease-in-out"
                style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1150px", margin: "0 auto" }}>
                <div className="relative w-[800px] h-[1100px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5 text-[10px]"
                  style={{ backgroundImage: `url('/template/e-kas/ANNEX_G_EKAS_EPRESS_Form_1.jpg?height=1000&width=800')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                  {/* Render ekasRecord data here */}
                  {ekasRecord ? JSON.stringify(ekasRecord) : "No E-KAS record."}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* E-PRESS Button and Modal */}
      <Dialog open={isOpenEpress} onOpenChange={setIsOpenEpress}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            E-PRESS
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  E-PRESS Printable Form
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => adjustScale(-0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={() => adjustScale(0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-2">Scale: {Math.round(scale * 100)}%</div>
            </DialogHeader>
            <div className="overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
              <div className="print-area transition-transform duration-300 ease-in-out"
                style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1150px", margin: "0 auto" }}>
                <div className="relative w-[800px] h-[1100px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5 text-[10px]"
                  style={{ backgroundImage: `url('/template/e-press/ANNEX_G_EKAS_EPRESS_Form_2.jpg?height=1000&width=800')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                  {/* Render epressRecord data here */}
                  {epressRecord ? JSON.stringify(epressRecord) : "No E-PRESS record."}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}