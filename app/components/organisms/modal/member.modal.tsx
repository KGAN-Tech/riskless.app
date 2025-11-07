import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Separator } from "@/components/atoms/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";

import {
  Link,
  QrCode,
  Upload,
  Copy,
  FileText,
  FileSpreadsheet,
  FileJson,
  X,
  CheckCircle,
  Image,
} from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { metricsService } from "@/services/metrics.service";
import { userService } from "~/app/services/user.service";

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function MemberModal({
  open,
  onOpenChange,
  onSuccess,
}: MemberModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shareableLink = "https://ftcc-health-member-app-test.web.app/type";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDragOCR = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "qr-code.png";
    link.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/json" ||
        file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
    );
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDropOCR = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/json" ||
        file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
    );
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/json")
      return <FileJson className="h-4 w-4" />;
    if (file.type === "text/csv")
      return <FileSpreadsheet className="h-4 w-4" />;
    if (file.type.includes("spreadsheet") || file.type.includes("excel"))
      return <FileSpreadsheet className="h-4 w-4" />;
    if (file.type === "image/jpeg" || file.type === "image/png")
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-4 w-4"
        />
      );
    return <FileText className="h-4 w-4" />;
  };

  const handleImportSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("file", file));

      await userService.import(formData);

      setUploadedFiles([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error importing members:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportSubmitOCR = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("file", file));

      await userService.imports(formData);

      setUploadedFiles([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error importing members:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[calc(100vw-2rem)] max-w-[95vw] sm:max-h-[90vh] bg-white p-6 overflow-y-auto">
        <div className="absolute right-4 top-4">
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        <DialogHeader className="mt-8 sm:mt-0">
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Choose how you'd like to add new members to your organization.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="manual"
          className="w-full mt-5"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 ">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <p className="hidden lg:block">Link</p>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <p className="hidden lg:block">QR Code</p>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <p className="hidden lg:block">Upload</p>
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <p className="hidden lg:block">OCR</p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-2 -mt-5 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Shareable Invitation Link</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Generate a link that others can use to join your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Link Settings</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkExpiry">Expires In</Label>
                      <Select defaultValue="7days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="1day">1 Day</SelectItem>
                          <SelectItem value="7days">7 Days</SelectItem>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Generated Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareableLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      className={linkCopied ? "text-green-600" : ""}
                    >
                      {linkCopied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {linkCopied && (
                    <p className="text-sm text-green-600">
                      Link copied to clipboard!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-2 -mt-5 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Invitation</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Generate a QR code for easy mobile access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-1 relative">
                  <div
                    ref={qrRef}
                    className="bg-white p-4 rounded-lg border-2 border-dashed border-muted-foreground/25 relative"
                  >
                    <div className="relative w-28 h-28 lg:w-48 lg:h-48">
                      <QRCode
                        value={shareableLink}
                        size={100}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        className="w-full h-full"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5">
                        <img
                          src="/ftcc-health-tech.png"
                          alt="Logo"
                          className="w-6 h-6 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan this QR code with a mobile device to join
                  </p>
                  <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {shareableLink}
                  </p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400 text-sm"
                  >
                    Download QR Code
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-2 -mt-5 ">
            <div className="h-[350px] overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Member Data</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Import members from Images, JSON, CSV, or Excel files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          Drop your files here, or{" "}
                          <label className="text-primary cursor-pointer hover:underline">
                            browse
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept=".json,.csv,.xlsx,.xls"
                              onChange={handleFileInput}
                            />
                          </label>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports JSON, CSV, and Excel files
                        </p>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files</Label>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getFileIcon(file)}
                                <div>
                                  <p className="font-medium text-sm">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Import Settings</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="skipDuplicates">
                            Duplicate Handling
                          </Label>
                          <Select defaultValue="skip">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="skip">
                                Skip Duplicates
                              </SelectItem>
                              <SelectItem value="update">
                                Update Existing
                              </SelectItem>
                              <SelectItem value="error">Show Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      disabled={uploadedFiles.length === 0 || isSubmitting}
                      onClick={handleImportSubmit}
                    >
                      {isSubmitting
                        ? "Importing..."
                        : `Import ${uploadedFiles.length} File${
                            uploadedFiles.length !== 1 ? "s" : ""
                          }`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
