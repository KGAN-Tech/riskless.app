import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import { Card, CardContent } from '@/components/atoms/card';
import { DispensingSummaryModal } from '@/components/organisms/Pharmacy/DispenseSummaryModal';
import { Pill, Check, Package, User, Calendar, AlertTriangle } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  consultationDate: string;
  prescriptions: Prescription[];
}

interface Prescription {
  id: string;
  medicine: string;
  quantity: number;
  frequency: string;
}

interface InventoryItem {
  medicine: string;
  available: number;
  expiry: string;
  brand?: string;
  category?: string;
  unit?: string;
  barcode?: string;
}

interface DispensedMedicine {
  medicine: string;
  quantity: number;
  remainingStock: number;
}

interface DispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  inventory: Record<string, InventoryItem>;
  onDispenseComplete: (dispensedMedicines: { medicine: string; quantity: number; patientName: string }[]) => void;
}

export function DispenseModal({ isOpen, onClose, patient, inventory, onDispenseComplete }: DispenseModalProps) {
  const [dispensedQuantities, setDispensedQuantities] = useState<Record<string, number>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [dispensedMedicines, setDispensedMedicines] = useState<DispensedMedicine[]>([]);

  if (!patient) return null;

  const updateQuantity = (prescriptionId: string, quantity: number) => {
    const prescription = patient.prescriptions.find(p => p.id === prescriptionId);
    if (!prescription) return;
    
    const availableStock = inventory[prescription.medicine]?.available || 0;
    // Limit the quantity to between 0 and available stock
    const clampedQuantity = Math.max(0, Math.min(quantity, availableStock));
    
    setDispensedQuantities(prev => ({
      ...prev,
      [prescriptionId]: clampedQuantity
    }));
  };

  const getAvailabilityStatus = (medicine: string) => {
    const stock = inventory[medicine];
    if (!stock) return { status: 'unavailable', available: 0 };

    if (stock.available > 0) {
      return { status: 'available', available: stock.available };
    } else {
      return { status: 'unavailable', available: 0 };
    }
  };

  const handleDispense = () => {
    // Only include medicines that have available stock and quantity > 0
    const dispensedMedicinesData = patient.prescriptions
      .map(prescription => {
        const dispensedQty = dispensedQuantities[prescription.id] || prescription.quantity;
        const availableStock = inventory[prescription.medicine]?.available || 0;
        
        return {
          medicine: prescription.medicine,
          quantity: Math.min(dispensedQty, availableStock), // Ensure we don't dispense more than available
          patientName: patient.name
        };
      })
      .filter(item => item.quantity > 0); // Only include items with quantity > 0

    const summaryData = dispensedMedicinesData.map(item => ({
      medicine: item.medicine,
      quantity: item.quantity,
      remainingStock: Math.max(0, inventory[item.medicine]?.available - item.quantity || 0)
    }));

    onDispenseComplete(dispensedMedicinesData);

    setDispensedMedicines(summaryData);
    setShowSummary(true);
    setDispensedQuantities({});
  };

  const handleClose = () => {
    setDispensedQuantities({});
    setShowSummary(false);
    setDispensedMedicines([]);
    onClose();
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    setDispensedMedicines([]);
    onClose();
  };

  // Check if there are any medicines that can be dispensed (have available stock)
  const canDispense = patient.prescriptions.some(prescription => {
    const availableStock = inventory[prescription.medicine]?.available || 0;
    return availableStock > 0;
  });

  return (
    <>
      <Dialog open={isOpen && !showSummary} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-4xl lg:max-w-5xl h-[90vh] bg-white flex flex-col">
          {/* Header */}
          <DialogHeader className="pb-2 flex-shrink-0">
            <DialogTitle className="text-blue-900 flex items-center gap-2 text-lg lg:text-xl">
              <Pill className="h-5 w-5" />
              Dispense Medicine - {patient.name}
            </DialogTitle>
            <DialogDescription className="text-sm lg:text-base">
              Review and adjust quantities for each prescribed medicine before dispensing.
            </DialogDescription>
          </DialogHeader>

          {/* Patient Info */}
          <Card className="bg-blue-50 border-blue-200 flex-shrink-0">
            <CardContent className="p-2 lg:p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">{patient.name}</p>
                    <p className="text-blue-600 text-xs">Age: {patient.age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">{patient.diagnosis}</p>
                    <p className="text-blue-600 text-xs">Primary Condition</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">{patient.consultationDate}</p>
                    <p className="text-blue-600 text-xs">Consultation Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">{patient.prescriptions.length} Items</p>
                    <p className="text-blue-600 text-xs">Prescriptions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table of prescriptions */}
          <div className="flex-1 overflow-y-auto mt-3">
            <h3 className="text-blue-900 font-medium text-sm lg:text-base px-1 mb-2">
              Prescribed Medicines
            </h3>

            <div className="overflow-x-auto border border-blue-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-blue-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-blue-700 font-medium">Medicine</th>
                    <th className="px-3 py-2 text-center text-blue-700 font-medium">Frequency</th>
                    <th className="px-3 py-2 text-center text-blue-700 font-medium">Prescribed</th>
                    <th className="px-3 py-2 text-center text-blue-700 font-medium">Dispense</th>
                    <th className="px-3 py-2 text-center text-blue-700 font-medium">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {patient.prescriptions.map((prescription) => {
                    const dispensedQty = dispensedQuantities[prescription.id] || prescription.quantity;
                    const availability = getAvailabilityStatus(prescription.medicine);
                    const availableStock = availability.available;

                    return (
                      <tr key={prescription.id} className="hover:bg-blue-50">
                        <td className="px-3 py-2 text-blue-900 font-semibold">{prescription.medicine}</td>
                        <td className="px-3 py-2 text-center text-blue-600">{prescription.frequency}</td>
                        <td className="px-3 py-2 text-center text-blue-900">{prescription.quantity}</td>

                        {/* Dispense Column with + / - */}
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(prescription.id, dispensedQty - 1)}
                              disabled={dispensedQty <= 0 || availability.status === 'unavailable'}
                              className="h-6 w-6 p-0 rounded-full border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              −
                            </Button>

                            <Input
                              type="number"
                              value={dispensedQty}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                updateQuantity(prescription.id, newValue);
                              }}
                              className="h-8 w-16 text-center text-sm rounded-md border border-blue-200 focus:border-blue-400"
                              max={availableStock}
                              min={0}
                              disabled={availability.status === 'unavailable'}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(prescription.id, dispensedQty + 1)}
                              disabled={dispensedQty >= availableStock || availability.status === 'unavailable'}
                              className="h-6 w-6 p-0 rounded-full border-blue-300 text-blue-600 hover:bg-blue-500"
                            >
                              +
                            </Button>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-center">
                          <Badge
                            variant={availability.status === "available" ? "default" : "destructive"}
                            className={`px-2 py-0.5 text-[11px] rounded-full ${
                              availability.status === "available"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {availability.status === "available"
                              ? `Available (${availableStock})`
                              : "Out of Stock"}
                          </Badge>

                          {availability.status === "available" && dispensedQty > availableStock && (
                            <p className="text-yellow-700 text-xs mt-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Max: {availableStock}
                            </p>
                          )}
                          {availability.status === "unavailable" && (
                            <p className="text-red-700 text-xs mt-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Cannot be dispensed
                            </p>
                          )}
                          {dispensedQty > 0 && availableStock >= dispensedQty && (
                            <p className="text-green-700 text-xs mt-1">✓ Ready</p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-blue-100 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 sm:w-auto w-full order-2 sm:order-1 text-sm px-3 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDispense}
              disabled={!canDispense}
              className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full order-1 sm:order-2 text-sm px-3 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4 mr-1" />
              Complete Dispensing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Modal */}
      <DispensingSummaryModal
        isOpen={showSummary}
        onClose={handleSummaryClose}
        patientName={patient.name}
        dispensedMedicines={dispensedMedicines}
        timestamp={new Date().toLocaleString()}
      />
    </>
  );
}