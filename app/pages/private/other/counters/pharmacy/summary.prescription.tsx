import { Check, Edit2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { type PrescriptionData } from "~/app/pages/private/other/counters/counter.pharmacy.page";

interface SummaryPrescriptionProps {
  prescriptionData: PrescriptionData | null;
  onProceedToReceipt: () => void;
  onBack: () => void;
}

export function SummaryPrescription({
  prescriptionData,
  onProceedToReceipt,
  onBack,
}: SummaryPrescriptionProps) {
  if (!prescriptionData) {
    return <div>No prescription data available</div>;
  }

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Prescription Summary</h2>
          <p className="text-gray-600">
            Review the scanned prescription details
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-green-600 border-green-200 bg-green-50"
        >
          <Check className="h-3 w-3 mr-1" />
          Scanned Successfully
        </Badge>
      </div>

      {/* Prescription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prescription Details</span>
            <Button variant="ghost" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Prescription ID</p>
              <p className="text-gray-900">{prescriptionData.prescriptionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="text-gray-900">{prescriptionData.doctorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900">{prescriptionData.date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Medicines ({prescriptionData.medicines.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Instructions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptionData.medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{medicine.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{medicine.dosage}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {medicine.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(medicine.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(medicine.totalPrice)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {medicine.instructions}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-900">Total Amount</p>
              <p className="text-sm text-gray-600">
                {prescriptionData.medicines.length} items • Tax included
              </p>
            </div>
            <p className="text-2xl text-gray-900">
              {formatCurrency(prescriptionData.totalAmount)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to (?)
        </Button>
        <Button onClick={onProceedToReceipt}>
          Proceed to Receipt
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
