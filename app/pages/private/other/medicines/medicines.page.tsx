import { useState, useEffect, useRef } from "react";
import { Search, QrCode } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import MedicineManagement from "./MedicineManagement.component";

// Mock data for E-Press records
const mockEpressRecords = [
  {
    id: 1,
    orderNo: "EP-2024-001",
    date: "2024-03-15",
    memberName: "John Doe",
    qty: 30,
    medicineName: "Amoxicillin 500mg",
    frequency: "1 tablet 3x daily",
    physician: "Dr. Sarah Wilson",
    hospital: "City General Hospital",
    caseNo: "CASE-2024-001",
    status: "Released",
    dateReleased: "2024-03-15",
  },
  {
    id: 2,
    orderNo: "EP-2024-002",
    date: "2024-03-14",
    memberName: "Jane Smith",
    qty: 60,
    medicineName: "Metformin 500mg",
    frequency: "1 tablet 2x daily",
    physician: "Dr. Michael Brown",
    hospital: "Metro Medical Center",
    caseNo: "CASE-2024-002",
    status: "Pending",
    dateReleased: "-",
  },
  {
    id: 3,
    orderNo: "EP-2024-003",
    date: "2024-03-13",
    memberName: "Mike Johnson",
    qty: 20,
    medicineName: "Omeprazole 20mg",
    frequency: "1 capsule daily",
    physician: "Dr. Emily Chen",
    hospital: "St. Mary's Hospital",
    caseNo: "CASE-2024-003",
    status: "Released",
    dateReleased: "2024-03-13",
  },
  {
    id: 4,
    orderNo: "EP-2024-004",
    date: "2024-03-12",
    memberName: "Sarah Wilson",
    qty: 15,
    medicineName: "Cetirizine 10mg",
    frequency: "1 tablet daily",
    physician: "Dr. James Lee",
    hospital: "City General Hospital",
    caseNo: "CASE-2024-004",
    status: "Processing",
    dateReleased: "-",
  },
  {
    id: 5,
    orderNo: "EP-2024-005",
    date: "2024-03-11",
    memberName: "David Brown",
    qty: 45,
    medicineName: "Atorvastatin 40mg",
    frequency: "1 tablet daily",
    physician: "Dr. Lisa Anderson",
    hospital: "Metro Medical Center",
    caseNo: "CASE-2024-005",
    status: "Released",
    dateReleased: "2024-03-11",
  },
];

export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records] = useState(mockEpressRecords);
  const [searchActive, setSearchActive] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showMedicineManagement, setShowMedicineManagement] = useState(false);
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

  const handleRecordClick = (record: any) => {
    setSelectedRecord(record);
    setShowMedicineManagement(true);
  };

  const handleBackFromMedicineManagement = () => {
    setShowMedicineManagement(false);
    setSelectedRecord(null);
  };

  const handleCompleteMedicineManagement = () => {
    // Handle completion logic here
    setShowMedicineManagement(false);
    setSelectedRecord(null);
    // You can add success message or redirect logic here
  };

  // Prepare the content based on whether Medicine Management is shown or not
  const pageContent =
    showMedicineManagement && selectedRecord ? (
      <div className="overflow-y-auto h-full">
        <MedicineManagement
          record={selectedRecord}
          onBack={handleBackFromMedicineManagement}
          onNext={handleCompleteMedicineManagement}
        />
      </div>
    ) : (
      <div className="flex flex-col items-center overflow-y-auto h-full">
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
            <h1
              className={`text-3xl font-bold text-gray-800 text-center transition-all duration-500 ${
                searchActive ? "text-2xl" : "text-3xl"
              }`}
            >
              Electronic Prescription Slip (E-PRESS)
            </h1>
            <p className="text-base text-gray-500 text-center">
              Search and view medicines records
            </p>
          </div>
          <div className="relative w-full flex items-center mt-6">
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
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
            searchActive
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {searchActive && (
            <div className="flex flex-col gap-4">
              {filteredRecords.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No records found.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2 animate-fade-in cursor-pointer hover:shadow-md transition-shadow"
                    style={{ animation: "fadeInUp 0.5s" }}
                    onClick={() => handleRecordClick(record)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Order #
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "Released"
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
                      <h2 className="text-lg font-bold text-gray-800">
                        {record.orderNo}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {record.memberName}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        Qty: {record.qty}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {record.medicineName}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {record.frequency}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {record.physician}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {record.hospital}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Case No.:</span>
                        <span className="font-medium text-gray-700">
                          {record.caseNo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Date Released:</span>
                        <span className="font-medium text-gray-700">
                          {record.dateReleased}
                        </span>
                      </div>
                    </div>

                    {/* Click indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-center text-xs text-blue-600 font-medium">
                        Click to manage medicine →
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 px-4 py-6 flex-shrink-0">
        <nav
          className="text-sm text-gray-500 mb-1 w-full"
          aria-label="Breadcrumb"
        >
          <ol className="list-reset flex gap-2">
            <li>
              <a href="/konsulta" className="hover:underline">
                Konsulta
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">Medicines</li>
          </ol>
        </nav>
        <div className="border-b pb-2 w-full">
          <h1 className="text-2xl font-semibold text-gray-800 border-gray-200">
            Medicines Records
          </h1>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">{pageContent}</div>
      {/* QR Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            drag
            dragElastic={0.2}
            className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full flex flex-col items-center relative pointer-events-auto"
            style={{ zIndex: 100 }}
          >
            <div
              className="qr-drag-handle w-full flex items-center justify-between cursor-move mb-2 select-none"
              style={{ touchAction: "none" }}
            >
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
              styles={{ container: { width: "100%", height: 300 } }}
            />
            <div className="mt-2 text-sm text-gray-600">
              Align QR code within the frame
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
