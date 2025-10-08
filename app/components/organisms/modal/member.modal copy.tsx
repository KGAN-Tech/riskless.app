import { Badge } from "@/components/atoms/badge";
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
import { Textarea } from "@/components/atoms/textarea";
import {
  UserPlus,
  Link,
  QrCode,
  Upload,
  Copy,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  X,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shareableLink = "https://yourapp.com/join/abc123xyz";

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
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
    return <FileText className="h-4 w-4" />;
  };

  const downloadTemplate = (type: string) => {
    // In a real app, this would download actual template files
    console.log(`Downloading ${type} template`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would call your API here
      // await pkrfService.createMember(formData);

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call for file import
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would process the uploaded files here
      // const formData = new FormData();
      // uploadedFiles.forEach(file => formData.append('files', file));
      // await pkrfService.importMembers(formData);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shareable Invitation Link</CardTitle>
                <CardDescription>
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

                {/* <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Link Statistics</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Clicks</p>
                      <p className="font-medium">0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Signups</p>
                      <p className="font-medium">0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Invitation</CardTitle>
                <CardDescription>
                  Generate a QR code for easy mobile access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          QR Code will appear here
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with a mobile device to join
                    </p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {shareableLink}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download SVG
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>QR Code Settings</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qrExpiry">Expires In</Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Member Data</CardTitle>
                <CardDescription>
                  Import members from JSON, CSV, or Excel files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTemplate("json")}
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      JSON Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTemplate("csv")}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      CSV Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTemplate("excel")}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel Template
                    </Button>
                  </div> */}

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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
