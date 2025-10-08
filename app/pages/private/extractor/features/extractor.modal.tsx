import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/atoms/dialog";
import { X, CheckCircle, XCircle, Copy, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { authService } from "~/app/services/auth.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: any[];
  onSubmit?: (data: any) => void;
  onSuccess?: () => void;
}

export default function ExtractorModal({
  open,
  onOpenChange,
  data,
  onSuccess,
}: MemberModalProps) {
  const getAuth = getUserFromLocalStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<any>(null);
  const [extractionComplete, setExtractionComplete] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setExtractionComplete(false);
    try {
      const body = {
        facilityId: getAuth?.user?.facilityId,
        provider: "philhealth",
        data,
      };
      const res: any = await authService.extract(body);
      setReports(res);
      setExtractionComplete(true);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReports(null);
    setExtractionComplete(false);
    onOpenChange(false);
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Extracting Members
        </h3>
        <p className="text-gray-600 mt-1">
          Please wait while we process {data?.length} members...
        </p>
      </div>
    </div>
  );

  const renderReportSummary = () => {
    if (!reports) return null;

    const { reports: reportStats, facility, data: extractedData } = reports;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Extraction Complete
          </h3>
          <p className="text-gray-600">
            Extracted from <span className="font-medium">{facility?.name}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Success</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {reportStats.success}
            </p>
            <p className="text-sm text-green-700">Successfully extracted</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Copy className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Duplicates</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {reportStats.duplicate}
            </p>
            <p className="text-sm text-yellow-700">Already exist</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {reportStats.failed}
            </p>
            <p className="text-sm text-red-700">Processing failed</p>
          </div>
        </div>

        {/* Detailed Results */}
        {/* {extractedData && extractedData.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Processed Members</h4>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {extractedData.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.person?.firstName} {item.person?.middleName}{" "}
                      {item.person?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">PIN: {item.pin}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status === "success" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Success
                      </span>
                    )}
                    {item.status === "duplicate" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicate
                      </span>
                    )}
                    {item.status === "failed" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    );
  };

  const renderInitialState = () => (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Extract New Members</DialogTitle>
        <DialogDescription>
          Are you sure you want to extract{" "}
          <span className="font-medium">{data?.length}</span> members?
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={() => handleSubmit(data)} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting...
            </>
          ) : (
            "Extract"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[calc(100vw-2rem)] max-w-[95vw] sm:max-h-[90vh] bg-white p-6 overflow-y-auto">
        <div className="absolute right-4 top-4">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-8 sm:mt-0">
          {isSubmitting
            ? renderLoadingState()
            : extractionComplete && reports
            ? renderReportSummary()
            : renderInitialState()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
