import { useState, useRef, useEffect } from "react";
import { Upload, FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { facilityService } from "@/services/facility.service";

interface Facility {
  id: string;
  name: string;
  pcb?: {
    chiperKey?: string;
  };
}

export default function MigrationPage() {
  const [facilitySearch, setFacilitySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [cipherKey, setCipherKey] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalCipherKey, setOriginalCipherKey] = useState("");

  // Fetch facilities with optional search query
  useEffect(() => {
    const fetchFacilities = async () => {
      // Don't search if query is too short
      if (facilitySearch.length < 2) {
        setFacilities([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const params = facilitySearch ? { query: facilitySearch } : {};

        const response = await facilityService.getAll(params);
        setFacilities(response.data || response);
      } catch (err) {
        setError("Failed to load facilities");
        console.error("Error fetching facilities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: wait 500ms after user stops typing
    const debounceTimer = setTimeout(() => {
      fetchFacilities();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [facilitySearch]);

  const handleFacilitySelect = (facility: Facility) => {
    setFacilitySearch(facility.name);
    setSelectedFacility(facility.id);

    // Set the cipher key from the selected facility and store the original
    const selectedCipherKey = facility.pcb?.chiperKey || "";
    setCipherKey(selectedCipherKey);
    setOriginalCipherKey(selectedCipherKey); // Store the original value

    setShowSuggestions(false);
    console.log(
      "Selected facility:",
      facility.name,
      "Cipher key:",
      selectedCipherKey
    );
  };

  const handleCipherKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCipherKey = e.target.value;
    setCipherKey(newCipherKey);

    // Clear facility selection if cipher key is manually changed from the original
    if (selectedFacility && newCipherKey !== originalCipherKey) {
      setSelectedFacility("");
      setFacilitySearch("");
      setOriginalCipherKey(""); // Reset original cipher key
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleStartMigration = async () => {
    if (!cipherKey || !uploadedFile) return;

    console.log("Starting migration with:", {
      facilityId: selectedFacility,
      cipherKey,
      file: uploadedFile,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-8xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Data Migration</h1>
          <p className="text-muted-foreground mt-2">
            Search for your facility and upload your data files
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facility Selection</CardTitle>
            <CardDescription>
              Search for your facility to auto-populate the cipher key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2 relative">
              <Label htmlFor="facility-search">Facility</Label>
              <div className="relative">
                <Input
                  id="facility-search"
                  type="text"
                  placeholder="Type to search facility..."
                  value={facilitySearch}
                  onChange={(e) => {
                    setFacilitySearch(e.target.value);
                    setShowSuggestions(true);
                    // Clear selected facility and cipher key when user starts typing again
                    if (selectedFacility) {
                      setSelectedFacility("");
                      setCipherKey("");
                      setOriginalCipherKey("");
                    }
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {showSuggestions && facilitySearch && facilities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="px-4 py-2 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleFacilitySelect(facility)}
                    >
                      <div className="font-medium">{facility.name}</div>
                      {facility.pcb?.chiperKey && (
                        <div className="text-xs text-muted-foreground">
                          Cipher Key: {facility.pcb.chiperKey}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showSuggestions &&
                facilitySearch &&
                facilities.length === 0 &&
                !isLoading && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
                    <div className="px-4 py-2 text-muted-foreground">
                      No facility found
                    </div>
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cipher-key">Cipher Key</Label>
              <Input
                id="cipher-key"
                type="text"
                placeholder="Enter cipher key manually or select a facility"
                value={cipherKey}
                onChange={handleCipherKeyChange}
                className={
                  selectedFacility ? "bg-accent/20 border-primary/50" : ""
                }
              />
              {selectedFacility && (
                <p className="text-xs text-muted-foreground">
                  Cipher key auto-populated from selected facility. Editing will
                  clear the facility selection.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Data File</Label>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${
                    isDragging
                      ? "border-primary bg-accent"
                      : "border-border hover:border-muted-foreground"
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  {uploadedFile ? (
                    <>
                      <FileUp className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change File
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p>Drag and drop your file here</p>
                        <p className="text-sm text-muted-foreground">or</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!cipherKey || !uploadedFile}
              onClick={handleStartMigration}
            >
              Start Migration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
