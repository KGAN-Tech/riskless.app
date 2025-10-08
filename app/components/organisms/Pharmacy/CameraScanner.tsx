import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import { QrCode, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { DispenseModal } from './DispenseModal';

// Mock inventory
const mockInventory = {
  Paracetamol: { medicine: 'Paracetamol', available: 50, expiry: '2025-12-31' },
  Amoxicillin: { medicine: 'Amoxicillin', available: 20, expiry: '2024-08-10' },
};

// Mock patient
const mockPatient = {
  id: 'P-12345',
  name: 'John Doe',
  age: 32,
  diagnosis: 'Flu',
  consultationDate: '2025-08-25',
  prescriptions: [
    { id: 'RX1', medicine: 'Paracetamol', quantity: 10, frequency: '3x daily' },
    { id: 'RX2', medicine: 'Amoxicillin', quantity: 5, frequency: '2x daily' },
  ],
};

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  onPatientFound?: (patientName: string) => void;
}

export function CameraScanner({ isOpen, onClose, onScan, onPatientFound }: CameraScannerProps) {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dispenseOpen, setDispenseOpen] = useState(false);

  const handleQRScan = (codes: any[]) => {
    if (codes && codes.length > 0 && codes[0].rawValue) {
      try {
        const qrData = codes[0].rawValue;
        setScannedData(qrData);
        setIsProcessing(true);
        setError(null);

        setTimeout(() => {
          onScan(qrData);

          try {
            const parsed = JSON.parse(qrData);
            if (parsed.name && onPatientFound) {
              onPatientFound(parsed.name);
            }
          } catch {
            // raw value is fine
          }

          setIsProcessing(false);

          // Close scanner dialog and open DispenseModal
          onClose();
          setDispenseOpen(true);
        }, 1500);
      } catch (err) {
        setError('Invalid QR code format');
      }
    }
  };

  return (
    <>
      {/* Scanner Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-900 flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </DialogTitle>
          </DialogHeader>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              {!scannedData ? (
                <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden relative">
                  <Scanner
                    onScan={handleQRScan}
                    onError={() => setError('Camera access denied')}
                    styles={{ container: { width: '100%', height: '100%' } }}
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  {isProcessing ? (
                    <div className="flex flex-col items-center text-green-700">
                      <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full mb-2" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-green-700">
                      <CheckCircle className="h-10 w-10 mb-2" />
                      QR Code Scanned!
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 text-red-600 mt-4">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {scannedData && !isProcessing && (
            <Button onClick={() => setScannedData(null)} className="mt-4 w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Scan Again
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispense Modal */}
      <DispenseModal
        isOpen={dispenseOpen}
        onClose={() => setDispenseOpen(false)}
        patient={mockPatient}
        inventory={mockInventory}
        onDispenseComplete={(dispensed) => {
          console.log('Dispensed:', dispensed);
          setDispenseOpen(false);
        }}
      />
    </>
  );
}
