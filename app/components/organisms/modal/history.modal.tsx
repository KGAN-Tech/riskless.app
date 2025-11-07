import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
  } from "@/components/atoms/dialog";
  import { Button } from "@/components/atoms/button";
  import { X } from "lucide-react";
  
  interface HistoryRecord {
    id: string;
    date: string;
    summary: string;
  }
  
  interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRecord: (type: "ekas" | "epress" | "medcert", record: HistoryRecord) => void;
  }
  
  export function HistoryModal({ isOpen, onClose, onSelectRecord }: HistoryModalProps) {
    const ekasRecords: HistoryRecord[] = [
      { id: "1", date: "2025-08-01", summary: "Lab Request - Blood Test" },
      { id: "2", date: "2025-08-10", summary: "Lab Request - Urinalysis" },
    ];
  
    const epressRecords: HistoryRecord[] = [
      { id: "a", date: "2025-08-05", summary: "Prescription - Amoxicillin" },
      { id: "b", date: "2025-08-12", summary: "Prescription - Paracetamol" },
    ];
  
    const medcertRecords: HistoryRecord[] = [
      { id: "m1", date: "2025-08-15", summary: "Medical Certificate - Fit to Work" },
      { id: "m2", date: "2025-08-20", summary: "Medical Certificate - Travel Clearance" },
    ];
  
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md rounded-lg" />
          
          {/* Modal Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Patient History
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Add other action buttons if necessary */}
              </div>
            </div>
  
            {/* Content */}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
              <div className="transition-transform duration-300 ease-in-out">
                <div className="relative w-full bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5">
                    {/* E-KAS */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-600">
                        E-KAS (Laboratory Requests)
                      </h3>
                      <div className="space-y-3">
                        {ekasRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white/80 hover:bg-blue-50 transition"
                          >
                            <div>
                              <p className="text-sm font-medium">{rec.summary}</p>
                              <p className="text-xs text-gray-500">{rec.date}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onSelectRecord("ekas", rec)}
                              className="bg-blue-500 text-white"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* E-PRESS */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-600">
                        E-PRESS (Prescriptions)
                      </h3>
                      <div className="space-y-3">
                        {epressRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white/80 hover:bg-blue-50 transition"
                          >
                            <div>
                              <p className="text-sm font-medium">{rec.summary}</p>
                              <p className="text-xs text-gray-500">{rec.date}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onSelectRecord("epress", rec)}
                              className="bg-blue-500 text-white"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* MedCert */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-600">
                        Medical Certificates
                      </h3>
                      <div className="space-y-3">
                        {medcertRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white/80 hover:bg-blue-50 transition"
                          >
                            <div>
                              <p className="text-sm font-medium">{rec.summary}</p>
                              <p className="text-xs text-gray-500">{rec.date}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onSelectRecord("medcert", rec)}
                              className="bg-blue-500 text-white"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  