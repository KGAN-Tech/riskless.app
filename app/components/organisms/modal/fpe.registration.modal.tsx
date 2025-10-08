import React from "react";

import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms/button";

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  // onDownload: () => void;
};

const FPERegistrationConfirmationModal: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  onConfirm,
  // onDownload,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
        {/* Close Icon */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 rounded-full p-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-lg font-semibold mb-1">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-2">
          This action can’t be undone. Please confirm if you want to proceed.
          {/* <p
          onClick={onDownload}
          className="text-sm ml-2 underline text-blue-500 hover:underline cursor-pointer mb-6 inline-block"
        >
          Download your copy
        </p> */}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FPERegistrationConfirmationModal;
