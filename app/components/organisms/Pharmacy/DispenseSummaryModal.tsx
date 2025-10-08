import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { Separator } from '@/components/atoms/separator';
import { CheckCircle, Pill, User, Calendar, Package, TrendingDown, AlertTriangle } from 'lucide-react';


interface DispensedMedicine {
    medicine: string;
    quantity: number;
    remainingStock: number;
  }
  
  interface DispensingSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
    dispensedMedicines: DispensedMedicine[];
    timestamp: string;
  }
  
  export function DispensingSummaryModal({ 
    isOpen, 
    onClose, 
    patientName, 
    dispensedMedicines, 
    timestamp 
  }: DispensingSummaryModalProps) {
    const totalMedicinesDispensed = dispensedMedicines.reduce((sum, med) => sum + med.quantity, 0);
    const uniqueMedicinesCount = dispensedMedicines.length;
    const lowStockItems = dispensedMedicines.filter(med => med.remainingStock < 20);
    const outOfStockItems = dispensedMedicines.filter(med => med.remainingStock === 0);
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-2xl sm:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] lg:max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-green-800 flex items-center gap-2 text-xl">
              <CheckCircle className="h-6 w-6" />
              Dispensing Complete
            </DialogTitle>
            <DialogDescription className="text-base">
              Summary of medicines successfully dispensed to the patient with updated inventory levels.
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-green-900 font-medium text-lg mb-2">
                  Medicines Successfully Dispensed!
                </h3>
                <p className="text-green-700">
                  All prescribed medicines have been processed and dispensed to the patient.
                </p>
              </CardContent>
            </Card>
  
            {/* Summary Statistics - Desktop Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-blue-100">
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-700 text-sm font-medium">Patient</p>
                  <p className="text-blue-900 font-semibold">{patientName}</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-100">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 text-sm font-medium">Total Units</p>
                  <p className="text-green-900 font-semibold text-xl">{totalMedicinesDispensed}</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardContent className="p-4 text-center">
                  <Pill className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-purple-700 text-sm font-medium">Medicine Types</p>
                  <p className="text-purple-900 font-semibold text-xl">{uniqueMedicinesCount}</p>
                </CardContent>
              </Card>
              
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-orange-700 text-sm font-medium">Time</p>
                  <p className="text-orange-900 font-semibold text-sm">{timestamp}</p>
                </CardContent>
              </Card>
            </div>
  
            {/* Dispensed Medicines - Desktop Grid Layout */}
            <div className="space-y-4">
              <h3 className="text-blue-900 font-medium text-lg">Dispensed Medicines Summary</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dispensedMedicines.map((medicine, index) => (
                  <Card key={index} className="border-green-100 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-green-900 font-medium flex items-center gap-2">
                              <Pill className="h-4 w-4 shrink-0" />
                              <span className="truncate">{medicine.medicine}</span>
                            </h4>
                            <p className="text-green-700 text-sm">
                              Dispensed: {medicine.quantity} units
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge 
                            variant="outline" 
                            className={
                              medicine.remainingStock === 0 
                                ? 'border-red-300 text-red-800 bg-red-50'
                                : medicine.remainingStock < 20
                                ? 'border-yellow-300 text-yellow-800 bg-yellow-50'
                                : 'border-green-300 text-green-800 bg-green-100'
                            }
                          >
                            {medicine.remainingStock} left
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
  
            {/* Stock Alerts - Responsive Layout */}
            {lowStockItems.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {outOfStockItems.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="text-red-800 font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Out of Stock ({outOfStockItems.length})
                      </h4>
                      <div className="space-y-2">
                        {outOfStockItems.map((medicine, index) => (
                          <div key={index} className="flex items-center gap-2 text-red-700 text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
                            <span className="truncate">{medicine.medicine}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {lowStockItems.filter(med => med.remainingStock > 0).length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <h4 className="text-yellow-800 font-medium mb-3 flex items-center gap-2">
                        <TrendingDown className="h-5 w-5" />
                        Low Stock ({lowStockItems.filter(med => med.remainingStock > 0).length})
                      </h4>
                      <div className="space-y-2">
                        {lowStockItems.filter(med => med.remainingStock > 0).map((medicine, index) => (
                          <div key={index} className="flex items-center justify-between text-yellow-700 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0"></div>
                              <span className="truncate">{medicine.medicine}</span>
                            </div>
                            <span className="font-medium shrink-0">{medicine.remainingStock} left</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
  
            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={onClose} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }