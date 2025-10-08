import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "~/app/components/atoms/button";

interface TrancheModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrancheModal = ({ isOpen, onClose }: TrancheModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto rounded-xl shadow-lg">
        <DialogHeader className="">
          <DialogTitle className="text-xl font-bold flex justify-between">
            <p>Tranche Information</p>
            <Button onClick={onClose} variant="ghost">
              ✕
            </Button>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="mt-4 text-base text-gray-700">
          <p className="mb-3">Here’s how to interpret tranche statuses:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-gray-600">Not yet validated</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-600">
                Validated and ready to submit
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-sm rounded-md bg-blue-100 text-blue-600 font-medium">
                1
              </span>
              <span className="text-gray-700">Tranche 1</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-sm rounded-md bg-blue-100 text-blue-600 font-medium">
                2
              </span>
              <span className="text-gray-700">Tranche 2</span>
            </li>
          </ul>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
