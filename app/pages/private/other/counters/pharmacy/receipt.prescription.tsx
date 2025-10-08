import { useState } from "react";
import {
  Printer,
  Download,
  ArrowLeft,
  RotateCcw,
  Check,
  Save,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { type PrescriptionData } from "~/app/pages/private/other/counters/counter.pharmacy.page";

interface ReceiptProps {
  prescriptionData: PrescriptionData | null;
  onBack: () => void;
  finishEncounter: () => void;
}

export function ReceiptPrescription({
  prescriptionData,
  onBack,
  finishEncounter,
}: ReceiptProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!prescriptionData) {
    return <div>No prescription data available</div>;
  }

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const handlePrint = () => {
    setIsPrinting(true);
    // Simulate printing process
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 1000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, you would generate and download a PDF
    }, 1500);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Receipt</h2>
          <p className="text-gray-600">Review and print the receipt</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            {isPrinting ? "Printing..." : "Print Receipt"}
          </Button>
        </div>
      </div>

      {/* Receipt */}
      <Card className="max-w-2xl mx-auto" id="receipt">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-gray-900 mb-2">MediCare Pharmacy</h1>
            <p className="text-gray-600">
              123 Main Street, Quezon City, Philippines
            </p>
            <p className="text-gray-600">Phone: +63 2 8123 4567</p>
            <p className="text-gray-600">Email: info@medicare-pharmacy.com</p>
          </div>

          <Separator className="my-6" />

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Receipt No.</p>
              <p className="text-gray-900">
                REC-{Date.now().toString().slice(-6)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="text-gray-900">{currentDate}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-2">Patient Information</h3>
            <p className="text-gray-900">Juan Delacruz</p>
            <p className="text-gray-600 text-sm">DOB: March 15, 1989</p>
          </div>

          {/* Prescription Info */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-2">Prescription Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  Prescription ID: {prescriptionData.prescriptionId}
                </p>
                <p className="text-gray-600">
                  Doctor: {prescriptionData.doctorName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Prescription Date: {prescriptionData.date}
                </p>
                <p className="text-gray-600">Dispensed by: Pharmacy Staff</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-4">Items</h3>
            <div className="space-y-3">
              {prescriptionData.medicines.map((medicine, index) => (
                <div key={medicine.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.dosage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {medicine.instructions}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-900">
                        {medicine.quantity} ×{" "}
                        {formatCurrency(medicine.unitPrice)}
                      </p>
                      <p className="text-gray-900">
                        {formatCurrency(medicine.totalPrice)}
                      </p>
                    </div>
                  </div>
                  {index < prescriptionData.medicines.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total */}
          <div className="text-right space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">
                {formatCurrency(prescriptionData.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (12%):</span>
              <span className="text-gray-900">
                {formatCurrency(prescriptionData.totalAmount * 0.12)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">
                {formatCurrency(prescriptionData.totalAmount * 1.12)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for choosing MediCare Pharmacy!</p>
            <p>Please take medications as prescribed by your doctor.</p>
            <p className="mt-2">For questions, call us at +63 2 8123 4567</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Summary
        </Button>
        <Button onClick={finishEncounter} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Encounter
        </Button>
      </div>

      {/* Success Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-green-900">
                Transaction Completed Successfully
              </p>
              <p className="text-sm text-green-700">
                Receipt generated and ready for printing. Patient has been
                notified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
