import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { XIcon } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

export default function PrivacyPolicyModal({
  isOpen,
  onAgree,
  onDisagree,
}: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDisagree()}>
      <DialogContent className="sm:max-w-md border-t-4 border-blue-600 bg-white flex flex-col h-auto max-h-[80vh]">
        <DialogHeader>
          <img
            src="/FTCC LOGO.png"
            alt="FTCC Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
          <DialogTitle className="text-2xl font-semibold text-center">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 pt-2 text-center">
            Please read and agree to the terms before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-gray-700 overflow-y-auto pr-6 flex-grow">
          <p>
            Welcome to our registration process. Before you begin, please be
            aware of the following:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4">
            <li>
              <strong>Photo Requirement:</strong> As part of this registration,
              you will be required to capture a photo of yourself and/or your
              dependents for identification and profile purposes.
            </li>
            <li>
              <strong>Data Usage and Third-Party Sharing:</strong> Your personal
              data, including the photos you provide, will be collected and may
              be shared with third-party service providers for purposes such as
              identity verification, service fulfillment, and as required by our
              partners (e.g., PhilHealth).
            </li>
            <li>
              <strong>Data Privacy Act of 2012:</strong> In compliance with
              Republic Act No. 10173 (the “Data Privacy Act of 2012”), your
              agreement provides consent for us to collect, transmit, and
              process your personal data and health records. This information
              will be shared with PhilHealth for the purpose of paying and
              monitoring the provider for your Konsulta benefit. We are
              committed to ensuring the safety of your data throughout this
              process.
            </li>
            <li>
              <strong>Consent:</strong> By clicking "Agree and Continue", you
              provide your consent to the collection, use, and sharing of your
              data as described.
            </li>
          </ul>
          <p>
            If you do not agree to these terms, you will not be able to proceed
            with the registration.
          </p>
          <DialogFooter className="sm:justify-end gap-2 pt-6">
            <Button type="button" variant="outline" onClick={onDisagree}>
              Close
            </Button>
            <Button type="button" onClick={onAgree}>
              Agree and Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
