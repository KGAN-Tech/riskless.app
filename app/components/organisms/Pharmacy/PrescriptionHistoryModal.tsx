import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { History, Pill, ChevronDown, ChevronUp } from 'lucide-react';

interface PrescriptionHistory {
  date: string;
  prescribedBy: string;
  medicines: {
    name: string;
    quantity: number;
    dosage: string;
  }[];
}

interface Patient {
  id: string;
  name: string;
  prescriptionHistory?: PrescriptionHistory[];
}

interface PrescriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function PrescriptionHistoryModal({ isOpen, onClose, patient }: PrescriptionHistoryModalProps) {
  const [expandedHistoryIndex, setExpandedHistoryIndex] = React.useState<number | null>(null);

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistoryIndex(expandedHistoryIndex === index ? null : index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-xl">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              Prescription History for {patient?.name}
              {patient?.prescriptionHistory && (
                <p className="text-sm font-normal text-gray-500 mt-1">
                  {patient.prescriptionHistory.length} prescription(s) on record
                </p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {patient?.prescriptionHistory && patient.prescriptionHistory.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-3">Date</div>
                <div className="col-span-4">Prescribed By</div>
                <div className="col-span-3">Medicines</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {patient.prescriptionHistory.map((history, index) => (
                  <div key={index} className="transition-colors duration-150 hover:bg-gray-50/50">
                    {/* History Row */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                      <div className="col-span-3">
                        <span className="font-medium text-gray-900">{history.date}</span>
                      </div>
                      <div className="col-span-4">
                        <span className="text-gray-700">{history.prescribedBy}</span>
                      </div>
                      <div className="col-span-3">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                          {history.medicines.length} medicine(s)
                        </Badge>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHistoryExpansion(index)}
                          className="text-gray-600 border-gray-200 hover:bg-gray-100 h-8 w-8 p-0"
                        >
                          {expandedHistoryIndex === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Medicine Details */}
                    {expandedHistoryIndex === index && (
                      <div className="bg-blue-25 px-4 py-3 border-t border-gray-100">
                        <div className="mb-2 font-medium text-blue-900 text-sm">Dispensed Medicines:</div>
                        <div className="grid gap-3">
                          {history.medicines.map((medicine, medIndex) => (
                            <div key={medIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Pill className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 block">{medicine.name}</span>
                                  <span className="text-sm text-gray-500 mt-1 block">{medicine.dosage}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-gray-600 text-sm block">Quantity</span>
                                  <span className="font-semibold text-gray-900">{medicine.quantity}</span>
                                </div>
                                <div className="w-px h-8 bg-gray-200"></div>
                                <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 font-medium py-1 px-2">
                                  {medicine.dosage}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="font-medium text-lg mb-1">No prescription history</h3>
              <p className="max-w-md mx-auto">No prescriptions have been recorded for this patient yet.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
          <Button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 font-medium"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}