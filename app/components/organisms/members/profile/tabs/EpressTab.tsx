import { useState } from "react";

import {
  Calendar,
  Edit2,
  Lock,
  FileText,
  Plus,
  Pill,
  Printer,
} from "lucide-react";
import type { EpressRecord } from "@/model/test.member.model";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

interface EpressTabProps {
  records: EpressRecord[];
}

export function EpressTab({ records }: EpressTabProps) {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(
    records.find((r) => r.isLatest)?.id || null
  );

  const currentRecord = records.find((r) => r.id === selectedRecord);

  const handlePrint = () => {
    if (currentRecord) {
      window.print();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Records List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">E-PRESS Records</h3>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Record
          </Button>
        </div>
        <div className="space-y-2">
          {records.map((record) => (
            <button
              key={record.id}
              onClick={() => setSelectedRecord(record.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-gray-50",
                selectedRecord === record.id ? "bg-blue-50" : ""
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{record.date}</span>
                </div>
                {record.isLatest ? (
                  <Edit2 className="h-4 w-4 text-blue-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-600">{record.doctor}</p>
                <p className="text-xs text-gray-500">{record.hospital}</p>
                <p className="text-xs text-gray-500">
                  Case No: {record.caseNo}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Record Preview */}
      <Card className="p-6 md:col-span-2">
        {currentRecord ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">E-PRESS Record</h3>
                <p className="text-sm text-gray-500">{currentRecord.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentRecord.isLatest ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Record
                  </Button>
                ) : (
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    View Only
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{currentRecord.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hospital</p>
                <p className="font-medium">{currentRecord.hospital}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Case No</p>
                <p className="font-medium">{currentRecord.caseNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{currentRecord.status}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Diagnosis</h4>
              <p className="text-sm text-gray-600">{currentRecord.diagnosis}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Medications</h4>
              <div className="space-y-2">
                {currentRecord.medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded"
                  >
                    <Pill className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{medication.name}</p>
                        <p className="text-xs text-gray-500">
                          {medication.type}
                        </p>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-600">
                          Dosage: {medication.dosage} | Frequency:{" "}
                          {medication.frequency}
                        </p>
                        <p className="text-xs text-gray-600">
                          Duration: {medication.duration} | Quantity:{" "}
                          {medication.quantity}
                        </p>
                        <p className="text-xs text-gray-600">
                          {medication.instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentRecord.notes && (
              <div>
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{currentRecord.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No E-PRESS records found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
