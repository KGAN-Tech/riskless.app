import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms/button";

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
};

const RegistrationConfirmationModal: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  onConfirm,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/50 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
        {/* Close Icon */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-6">
          This action can’t be undone. Please confirm if you want to proceed.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className=" border-gray-300 hover:bg-gray-100"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            className=" bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmationModal;
