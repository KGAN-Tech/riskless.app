import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../atoms/card";
import { Button } from "../../atoms/button";
import { Progress } from "../../atoms/progress";

interface FileUploadCardProps {
  onUpload: (file: File, onProgress: (percent: number) => void) => Promise<void>;
}

type Step = 1 | 2 | 3 | 4;

export default function FileUploadCard({ onUpload }: FileUploadCardProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (
        allowedTypes.includes(file.type) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        setSelectedFile(file);
      } else {
        alert("Only Excel files (.xlsx/.xls) are allowed.");
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  const startUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    setCurrentStep(3);

    try {
      await onUpload(selectedFile, (percent) => setProgress(percent));
      setUploadSuccess(true);
      setProgress(100);
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
      setUploadSuccess(false);
      setProgress(100);
      setCurrentStep(4);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setProgress(0);
    setCurrentStep(1);
    setUploadSuccess(null);
    setIsUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Library File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Step Progress UI - copied exactly */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-4">
            {[
              { step: 1, label: "Upload" },
              { step: 2, label: "Configure" },
              { step: 3, label: "Import" },
              { step: 4, label: "Done" },
            ].map(({ step, label }, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm transition-all duration-300 ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground border-primary scale-105 shadow"
                        : currentStep > step
                        ? "bg-green-500 text-white border-green-500"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs ${
                      currentStep >= step
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload File */}
        {currentStep === 1 && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("excel-input")?.click()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p>Drag & drop your Excel file here, or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                Accepts only .xlsx or .xls files
              </p>
              <input
                id="excel-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} •{" "}
                      {new Date(selectedFile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={reset}>
                  Remove
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedFile}
              >
                Next: Configure
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Configure */}
        {currentStep === 2 && (
          <>
            <div className="bg-muted p-6 rounded-lg">
              <p className="mb-2">You're ready to upload:</p>
              <p className="font-semibold">{selectedFile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile?.size || 0)}
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={startUpload} disabled={isUploading}>
                Start Import
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Importing */}
        {currentStep === 3 && (
          <>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin w-16 h-16 border-4 border-muted border-t-primary rounded-full"></div>
              </div>
              <p>Processing your file...</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </>
        )}

        {/* Step 4: Done */}
        {currentStep === 4 && (
          <>
            <div className="text-center space-y-4">
              {uploadSuccess ? (
                <>
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                                    <p className="text-green-600 font-semibold">
                    Upload Complete!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Your file <strong>{selectedFile?.name}</strong> was uploaded successfully.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                  <p className="text-red-600 font-semibold">
                    Upload Failed
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Something went wrong. Please try again.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={reset}>
                Upload Another File
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

