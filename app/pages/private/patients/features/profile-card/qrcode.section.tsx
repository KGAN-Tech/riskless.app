// Assuming this is your reusable QR component
import { Button } from "@/components/atoms/button";
import QRCodeBox from "~/app/components/atoms/qr-code";

export const QRCodeSection = ({ value }: { value: string }) => (
  <div className="mt-6 flex flex-col items-center gap-4">
    <QRCodeBox
      value={value}
      size={160}
      className="border-gray-600 border rounded-lg p-2 shadow-sm"
    />
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        QR About
      </Button>
      <Button variant="default" size="sm">
        Personal Information
      </Button>
    </div>
  </div>
);
