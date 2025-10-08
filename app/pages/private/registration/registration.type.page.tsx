import { useState, useEffect } from "react";
import {
  CheckCircle,
  Code,
  IdCard,
  Link,
  QrCode,
  UserCircle,
  X,
  Maximize2,
  Minimize2,
  Plus,
  Copy,
  ExternalLink,
  Users,
  QrCodeIcon,
} from "lucide-react";
import { FaFileUpload, FaPills } from "react-icons/fa";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { useLink } from "~/app/hooks/use.link";
import QRCodeLinkGeneratorModal from "~/app/components/templates/modal/qr.link.generator.modal";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/atoms/tabs";
import { RegistrationConverterCard } from "~/app/components/templates/cards/registration.converter.card";
import { RegistrationReaderCard } from "~/app/components/templates/cards/registration.reader.card";
import type { METHOD } from "~/app/configuration/const.config";
import { METHOD as Method } from "~/app/configuration/const.config";

export default function YakapRegistrationTypePage() {
  const [selectedItem, setSelectedItem] = useState<
    (typeof METHOD.REGISTRATION)[0] | null
  >(null);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>({});

  const {
    form,
    setForm,
    links,
    loading,
    handleInputChange,
    generateSlug,
    getAll,
    onSubmit,
  } = useLink();

  useEffect(() => {
    getAll();
  }, []);

  const handleCardClick = (item: (typeof METHOD.REGISTRATION)[0]) => {
    setSelectedItem(item);

    if (item.name === "Sharable Link") {
      setForm({
        ...form,
        generatedIn: "link",
      });
    }

    if (item.name === "QR Code") {
      setForm({
        ...form,
        generatedIn: "qr",
      });
    }

    if (item.name === "Assisted/Manual") {
      setForm({
        ...form,
        generatedIn: "Assisted/Manual",
      });
    }

    setIsFullWidth(false);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const toggleFullWidth = () => {
    setIsFullWidth(!isFullWidth);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const handleFormSubmit = async () => {
    try {
      // Auto-generate slug if it's a sharable link or QR code
      if (
        selectedItem?.name === "Sharable Link" ||
        selectedItem?.name === "QR Code"
      ) {
        generateSlug();
      }

      await onSubmit();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const renderGeneratorContent = () => {
    const isAssistedManual = selectedItem?.name === "Assisted/Manual";
    const isSharableLink = selectedItem?.name === "Sharable Link";
    const isQRCode = selectedItem?.name === "QR Code";

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isAssistedManual
              ? "Staff-Created Registration Links"
              : `Generated ${isSharableLink ? "Links" : "QR Codes"}`}
          </h3>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isAssistedManual
              ? "Create New Assisted Link"
              : `Create New ${isSharableLink ? "Link" : "QR Code"}`}
          </Button>
        </div>

        {links.length > 0 ? (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {(isSharableLink || isQRCode) && (
                      <TableHead>Type</TableHead>
                    )}
                    {(isSharableLink || isQRCode) && (
                      <TableHead>Organization</TableHead>
                    )}
                    {isAssistedManual && <TableHead>Assisted By</TableHead>}
                    {isAssistedManual && <TableHead>Status</TableHead>}
                    {isAssistedManual && <TableHead>Usage</TableHead>}
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link: any) => (
                    <TableRow key={link.id}>
                      {(isSharableLink || isQRCode) && (
                        <TableCell className="capitalize">
                          {link.type}
                        </TableCell>
                      )}
                      {(isSharableLink || isQRCode) && (
                        <TableCell className="max-w-[150px] truncate">
                          {link.name}
                        </TableCell>
                      )}
                      {isAssistedManual && (
                        <TableCell className="max-w-[120px] truncate">
                          {link.createdBy || "N/A"}
                        </TableCell>
                      )}
                      {isAssistedManual && (
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !link.expiredAt ||
                              new Date(link.expiredAt) > new Date()
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {!link.expiredAt ||
                            new Date(link.expiredAt) > new Date()
                              ? "active"
                              : "expired"}
                          </span>
                        </TableCell>
                      )}
                      {isAssistedManual && (
                        <TableCell className="text-center">
                          {link.usageCount || 0}
                        </TableCell>
                      )}
                      <TableCell>
                        {new Date(link.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {isQRCode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowQRModal(true);
                                setSelectedLink(link);
                              }}
                              className="h-8 w-8 p-0"
                              title="Open QR Code"
                            >
                              <QrCodeIcon className="w-4 h-4" />
                            </Button>
                          )}
                          {(isSharableLink || isAssistedManual) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(link.url)}
                              className="h-8 w-8 p-0"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              let url = link.url;
                              window.open(url, "_blank");
                            }}
                            className="h-8 w-8 p-0"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {isSharableLink ? (
                <Link className="w-12 h-12 text-gray-400" />
              ) : isQRCode ? (
                <QrCode className="w-12 h-12 text-gray-400" />
              ) : (
                <Users className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isAssistedManual
                ? "No assisted registration links created yet"
                : `No ${isSharableLink ? "links" : "QR codes"} generated yet`}
            </h3>
            <p className="text-gray-500 mb-4">
              {isAssistedManual
                ? "Get started by creating your first assisted registration link for staff to use."
                : `Get started by creating your first ${
                    isSharableLink ? "shareable link" : "QR code"
                  }.`}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isAssistedManual
                ? "Create Your First Assisted Link"
                : `Create Your First ${isSharableLink ? "Link" : "QR Code"}`}
            </Button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {isAssistedManual
                    ? "Generate Assisted Registration Link"
                    : `Generate ${selectedItem?.name}`}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(isSharableLink || isQRCode) && (
                  <>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={form.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger className="rounded-md border-gray-300">
                          <SelectValue placeholder="Select KPP type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="organization">
                            Organization
                          </SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name">Name of Organization *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter organization name"
                        onBlur={generateSlug}
                        className="rounded-md border-gray-300"
                      />
                    </div>
                  </>
                )}

                {isAssistedManual && (
                  <div>
                    <Label htmlFor="createdBy">Assisted By: *</Label>
                    <Input
                      id="createdBy"
                      value={form.createdBy}
                      onChange={(e) =>
                        handleInputChange("createdBy", e.target.value)
                      }
                      placeholder="Enter staff name (e.g., Dr. Maria Santos)"
                      className="rounded-md border-gray-300"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    disabled={isSharableLink || isQRCode}
                    placeholder={
                      isSharableLink || isQRCode
                        ? "Auto-generated from organization name"
                        : "Enter URL slug (e.g., clinic-name)"
                    }
                    className="rounded-md border-gray-300"
                  />
                </div>

                {/* Other Inputs */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter description"
                    className="rounded-md border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="expiredAt">Expired At</Label>
                  <Input
                    id="expiredAt"
                    type="date"
                    value={form.expiredAt || ""}
                    onChange={(e) =>
                      handleInputChange("expiredAt", e.target.value)
                    }
                    className="rounded-md border-gray-300"
                  />
                </div>

                {/* Address Inputs */}
                {[
                  { label: "Unit", field: "unit" },
                  { label: "Building Name", field: "buildingName" },
                  { label: "House No", field: "houseNo" },
                  { label: "Street", field: "street" },
                  { label: "Province", field: "province.value" },
                  { label: "City", field: "city.value" },
                  { label: "Barangay", field: "barangay.value" },
                  { label: "Zip Code", field: "zipCode" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <Label htmlFor={field}>{label}</Label>
                    <Input
                      id={field}
                      value={
                        field.includes(".")
                          ? field
                              .split(".")
                              .reduce((obj, key) => obj[key], form.address)
                          : form.address[field]
                      }
                      onChange={(e) =>
                        handleInputChange(
                          field.includes(".")
                            ? `address.${field}`
                            : `address.${field}`,
                          e.target.value
                        )
                      }
                      placeholder={label}
                      className="rounded-md border-gray-300"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 justify-end">
                <Button
                  onClick={handleFormSubmit}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {isAssistedManual
                        ? "Generate Assisted Link"
                        : `Generate ${isSharableLink ? "Link" : "QR Code"}`}
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {showQRModal && (
          <QRCodeLinkGeneratorModal
            showQRModal={showQRModal}
            selectedLink={selectedLink}
            onClose={() => setShowQRModal(false)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 ">
      <div
        className={`flex gap-6 transition-all duration-300 ${
          selectedItem ? "h-[calc(100vh-200px)]" : ""
        }`}
      >
        <div
          className={`transition-all duration-300 ${
            selectedItem && !isFullWidth
              ? "w-1/2"
              : selectedItem && isFullWidth
              ? "w-0 overflow-hidden"
              : "w-full"
          }`}
        >
          <div className="scroll-thin max-h-[calc(100vh-200px)] px-1 py-1 overflow-y-auto">
            <div
              className={`grid gap-4 ${
                selectedItem
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {Method.REGISTRATION.map((item) => (
                <Card
                  key={item.name}
                  className={`px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${
                    selectedItem?.name === item.name
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full ">
                      {item.icon}
                    </div>
                    <p className="text-lg font-medium text-gray-700 text-center">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {selectedItem && (
          <div
            className={`transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm ${
              isFullWidth ? "w-full" : "w-1/2"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedItem.content?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedItem.content?.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullWidth}
                    className="h-8 w-8"
                  >
                    {isFullWidth ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedItem.name === "Sharable Link" ||
                selectedItem.name === "QR Code" ||
                selectedItem.name === "Assisted/Manual" ? (
                  renderGeneratorContent()
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-6">
                      {selectedItem.name === "Sharable Link" ||
                      selectedItem.name === "QR Code" ||
                      selectedItem.name === "Assisted/Manual" ? (
                        renderGeneratorContent()
                      ) : (
                        <>
                          <Tabs defaultValue="features" className="w-full ">
                            {/* Tab Headers */}
                            <TabsList className="grid w-fit grid-cols-2 p-0 rounded-none shadow-none">
                              <TabsTrigger value="features">
                                Features
                              </TabsTrigger>
                              <TabsTrigger value="actual">
                                Start Register Here
                              </TabsTrigger>
                            </TabsList>

                            {/* Features Tab */}
                            <TabsContent value="features">
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                  Key Features
                                </h3>
                                <ul className="space-y-2">
                                  {selectedItem.content?.features.map(
                                    (feature, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">
                                          {feature}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                                <div className="space-y-4 mt-6">
                                  <h3 className="text-lg font-medium text-gray-900">
                                    Registration Steps
                                  </h3>
                                  <ol className="space-y-2">
                                    {selectedItem.content?.steps.map(
                                      (step, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-3"
                                        >
                                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                            {index + 1}
                                          </div>
                                          <span className="text-sm text-gray-700">
                                            {step}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ol>
                                </div>
                              </div>
                            </TabsContent>

                            {/* Actual Feature Tab */}
                            <TabsContent value="actual">
                              <div className="">
                                {selectedItem.name === "File Upload" ? (
                                  <RegistrationConverterCard />
                                ) : (
                                  <RegistrationReaderCard />
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
