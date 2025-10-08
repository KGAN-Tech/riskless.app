import { useState, useEffect, useRef } from "react";
import { Search, QrCode } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";

// Mock data for Health Screening records
const mockScreeningRecords = [
  {
    id: 1,
    screeningNo: "HS-2024-001",
    date: "2024-03-15",
    memberName: "John Doe",
    screeningType: "Annual Physical Exam",
    result: "Normal",
    doctor: "Dr. Sarah Wilson",
    hospital: "City General Hospital",
    status: "Completed",
    dateScreened: "2024-03-15",
  },
  {
    id: 2,
    screeningNo: "HS-2024-002",
    date: "2024-03-14",
    memberName: "Jane Smith",
    screeningType: "Blood Pressure Check",
    result: "High BP",
    doctor: "Dr. Michael Brown",
    hospital: "Metro Medical Center",
    status: "Pending",
    dateScreened: "-",
  },
];

export default function HealthScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records] = useState(mockScreeningRecords);
  const [searchActive, setSearchActive] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  }, [searchQuery]);

  // Filter records based on search query
  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="space-y-4 px-4 py-6">
        <nav className="text-sm text-gray-500 mb-1 w-full" aria-label="Breadcrumb">
          <ol className="list-reset flex gap-2">
            <li><a href="/konsulta" className="hover:underline">Konsulta</a></li>
            <li>/</li>
            <li className="text-gray-700 font-medium">Health Screening</li>
          </ol>
        </nav>
        <div className="border-b pb-2 w-full">
          <h1 className="text-2xl font-semibold text-gray-800 border-gray-200">Health Screening Records</h1>
        </div>
        <div className="min-h-[70vh] flex flex-col items-center">
          <div
            ref={searchBarRef}
            className={`w-full max-w-2xl mx-auto z-10 transition-all duration-500 ${
              searchActive
                ? "pt-8 pb-4"
                : "flex flex-col items-center justify-center gap-6 min-h-[60vh]"
            }`}
            style={{ position: "static" }}
          >
            <div className="flex flex-col items-center gap-2">
              <h1 className={`text-3xl font-bold text-gray-800 text-center transition-all duration-500 ${searchActive ? "text-2xl" : "text-3xl"}`}>Health Screening Records</h1>
              <p className="text-base text-gray-500 text-center">Search and view health screening records</p>
            </div>
            <div className="relative w-full flex items-center mt-6">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 rounded-full text-lg shadow focus:ring-2 focus:ring-blue-200"
              />
              <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Scan QR Code"
                onClick={() => setScannerOpen(true)}
              >
                <QrCode className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          {/* Search Results - vertical list of cards */}
          <div
            className={`w-full max-w-2xl mx-auto pt-8 transition-all duration-500 ${
              searchActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            {searchActive && (
              <div className="flex flex-col gap-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No records found.</div>
                ) : (
                  filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2 animate-fade-in"
                      style={{ animation: "fadeInUp 0.5s" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Screening #</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            record.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h2 className="text-lg font-bold text-gray-800">{record.screeningNo}</h2>
                        <p className="text-sm text-gray-600">{record.memberName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{record.screeningType}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{record.result}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{record.doctor}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{record.hospital}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Date Screened:</span>
                          <span className="font-medium text-gray-700">{record.dateScreened}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* QR Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            drag
            dragElastic={0.2}
            className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full flex flex-col items-center relative pointer-events-auto"
            style={{ zIndex: 100 }}
          >
            <div className="qr-drag-handle w-full flex items-center justify-between cursor-move mb-2 select-none" style={{ touchAction: 'none' }}>
              <span className="text-sm text-gray-500 pl-2">QR Scanner</span>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setScannerOpen(false)}
                aria-label="Close QR Scanner"
              >
                ×
              </button>
            </div>
            <Scanner
              onScan={(codes) => {
                if (codes && codes.length > 0 && codes[0].rawValue) {
                  setSearchQuery(codes[0].rawValue);
                  setScannerOpen(false);
                }
              }}
              onError={() => {}}
              styles={{ container: { width: '100%', height: 300 } }}
            />
            <div className="mt-2 text-sm text-gray-600">Align QR code within the frame</div>
          </motion.div>
        </div>
      )}
    </>
  );
}
