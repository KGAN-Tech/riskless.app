import { useState } from "react";
import { Upload, QrCode, Camera, FileText } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import {
  type PrescriptionData,
  type Medicine,
} from "~/app/pages/private/other/counters/counter.pharmacy.page";

interface ScanPrescriptionProps {
  onPrescriptionScanned: (data: PrescriptionData) => void;
}

export function ScanPrescription({
  onPrescriptionScanned,
}: ScanPrescriptionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock prescription data for demonstration
  const mockPrescriptionData: PrescriptionData = {
    prescriptionId: "RX-2024-001",
    doctorName: "Dr. Maria Santos",
    date: "August 28, 2024",
    medicines: [
      {
        id: "1",
        name: "Amoxicillin",
        dosage: "500mg",
        quantity: 21,
        unitPrice: 15.0,
        totalPrice: 315.0,
        instructions: "Take 1 capsule every 8 hours for 7 days",
      },
      {
        id: "2",
        name: "Paracetamol",
        dosage: "500mg",
        quantity: 20,
        unitPrice: 2.5,
        totalPrice: 50.0,
        instructions:
          "Take 1-2 tablets every 4-6 hours as needed for pain/fever",
      },
      {
        id: "3",
        name: "Omeprazole",
        dosage: "20mg",
        quantity: 14,
        unitPrice: 8.0,
        totalPrice: 112.0,
        instructions: "Take 1 capsule daily before breakfast",
      },
    ],
    totalAmount: 477.0,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate processing time
      setTimeout(() => {
        onPrescriptionScanned(mockPrescriptionData);
      }, 1500);
    }
  };

  const handleQRScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false);
      onPrescriptionScanned(mockPrescriptionData);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl text-gray-900 mb-2">Scan Prescription</h2>
        <p className="text-gray-600">
          Choose a method to capture the prescription information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <QrCode className="h-12 w-12 text-blue-600 mx-auto" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Scan QR Code</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Use your device camera to scan the QR code on the prescription
            </p>
            <Button
              onClick={handleQRScan}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Camera className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Start QR Scan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Upload className="h-12 w-12 text-green-600 mx-auto" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Upload Image</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Upload a photo or scanned image of the prescription
            </p>
            <div className="space-y-4">
              <Label htmlFor="prescription-upload" className="cursor-pointer">
                <div className="w-full py-2 px-4 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                  <FileText className="h-4 w-4 mr-2 inline" />
                  Choose File
                </div>
                <input
                  id="prescription-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="text-sm text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Ensure the prescription QR code or text is clearly visible
            </li>
            <li>• Make sure the image is well-lit and not blurry</li>
            <li>• Supported formats: JPG, PNG, PDF</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
