import { Dialog, DialogContent, DialogOverlay } from "@/components/atoms/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="sm:max-w-md">
        {children}
      </DialogContent>
    </Dialog>
  );
};