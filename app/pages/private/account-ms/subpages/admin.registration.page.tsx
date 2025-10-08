import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Camera, Upload, Shuffle, Eye, EyeOff, Loader2 } from "lucide-react";
import { facilityService } from "@/services/facility.service";
import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/use.toast";
import { useNavigate } from "react-router";
import AddressSelect, {
  type Address,
} from "@/components/organisms/selectors/address.select";

 interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string;
  position: string;
  specialization: string;
  prcId: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  email: string;
  phoneNumber: string;
  landline: string;
  age: string;
  gender: string;
  civilStatus: string;
  religion: string;
  citizenship: string;
  birthday: string;
  birthplace: string;
  facilityId: string;
  customFacilityName: string;
  philhealthPin: string;
  userName: string;
  password: string;
  type: string;
  profilePic: File | null;
  role: string;
  prcIdType: string;
}

interface Facility {
  id: string;
  name: string;
  category?: string;
}

export const AdminRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomFacility, setShowCustomFacility] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EmployeeData>({
    role: "admin",
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    position: "",
    specialization: "",
    prcId: "",
    prcIdType: "prc_id_medical",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    region: "",
    email: "",
    phoneNumber: "",
    landline: "",
    age: "",
    gender: "",
    civilStatus: "",
    religion: "",
    citizenship: "",
    birthday: "",
    birthplace: "",
    facilityId: "",
    customFacilityName: "",
    philhealthPin: "",
    userName: "",
    password: "",
    type: "",
    profilePic: null,
  });

  // Compute age from birthday
  const computeAge = (birthDateStr: string): string => {
    if (!birthDateStr) return "";
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return String(Math.max(age, 0));
  };

  useEffect(() => {
    const computed = computeAge(formData.birthday);
    setFormData((prev) => ({ ...prev, age: computed }));
  }, [formData.birthday]);

  // AddressSelect state (maps to form fields street/barangay/municipality/province)
  const [address, setAddress] = useState<Address>({
    houseNo: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
    type: "current",
  });

  // File input refs for upload and camera capture
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isPhotoPreview, setIsPhotoPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const response = await facilityService.getAll();
        setFacilities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
        setSubmitError("Failed to load facilities. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleInputChange = (field: keyof EmployeeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  // Handle facility selection
  const handleFacilityChange = (facilityId: string) => {
    if (facilityId === "other") {
      setShowCustomFacility(true);
      setFormData((prev) => ({ ...prev, facilityId: "" }));
    } else {
      setShowCustomFacility(false);
      setFormData((prev) => ({ ...prev, facilityId }));
    }
  };

  // Clear PRC fields when position is not doctor or nurse
  useEffect(() => {
    const isMedical =
      formData.position === "doctor" || formData.position === "nurse";
    if (!isMedical && (formData.prcId || formData.prcIdType)) {
      setFormData((prev) => ({ ...prev, prcId: "", prcIdType: "" }));
    }
  }, [formData.position]);

  const generateCredentials = () => {
    const userName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}${Math.floor(
      Math.random() * 999
    )}`;
    const password = Math.random().toString(36).slice(-12);

    setFormData((prev) => ({ ...prev, userName, password }));
  };

  const handleProfilePicUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      toast({
        title: "Camera error",
        description: err?.message || "Unable to access camera",
        variant: "destructive",
      });
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const openCamera = async () => {
    setCapturedDataUrl(null);
    setIsPhotoPreview(false);
    setShowCamera(true);
    await startCamera();
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedDataUrl(dataUrl);
    setIsPhotoPreview(true);
    stopCamera();
  };

  const handleUseCaptured = async () => {
    if (!capturedDataUrl) return;
    const res = await fetch(capturedDataUrl);
    const blob = await res.blob();
    const file = new File([blob], "camera.jpg", {
      type: blob.type || "image/jpeg",
    });
    setFormData((prev) => ({ ...prev, profilePic: file }));
    setShowCamera(false);
    setIsPhotoPreview(false);
    setCapturedDataUrl(null);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setIsPhotoPreview(false);
    setCapturedDataUrl(null);
    stopCamera();
  };

  // AddressSelect change handler: sync to local address and formData
  const handleAddressChange = (addr: Address) => {
    setAddress(addr);
    setFormData((prev) => ({
      ...prev,
      street: addr.street || "",
      barangay: addr.barangay || "",
      municipality: addr.city || "",
      province: addr.province || "",
    }));
  };

  const validateForm = (): boolean => {
    // Check required fields
    const requiredFields: (keyof EmployeeData)[] = [
      "firstName",
      "lastName",
      "position",
      "email",
      "phoneNumber",
      "type",
      "userName",
      "password",
      "gender",
      "civilStatus",
      "citizenship",
      "birthday",
      "birthplace",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`Please fill in the ${field} field`);
        return false;
      }
    }

    // Validate facility selection
    if (!showCustomFacility && !formData.facilityId) {
      setSubmitError("Please select a facility");
      return false;
    }

    // If custom facility is selected, validate custom facility name
    if (showCustomFacility && !formData.customFacilityName) {
      setSubmitError("Please specify the custom facility name");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError("Please enter a valid email address");
      return false;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setSubmitError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  // Helper function to format addresses properly
  const formatAddresses = () => {
    const street = address.street || "";
    const barangay = address.barangay || "";
    const municipality = address.city || "";
    const province = address.province || "";

    return [
      {
        type: "current",
        description: `${street ? street + ", " : ""}${
          barangay ? barangay + ", " : ""
        }${municipality ? municipality + ", " : ""}${province}`,
        street: street,
        houseNo: address.houseNo || "",
        city: { value: municipality, code: "unknown" },
        province: { value: province, code: "unknown" },
        barangay: { value: barangay, code: "unknown" },
        zipCode: address.zipCode || "",
        country: "Philippines",
      },
    ];
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      role: "admin",
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      position: "",
      specialization: "",
      prcId: "",
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      region: "",
      email: "",
      phoneNumber: "",
      landline: "",
      age: "",
      gender: "",
      civilStatus: "",
      religion: "",
      citizenship: "",
      birthday: "",
      birthplace: "",
      facilityId: "",
      customFacilityName: "",
      philhealthPin: "",
      userName: "",
      password: "",
      type: "",
      profilePic: null,
      prcIdType: "prc_id_medical",
    });
    setAddress({
      houseNo: "",
      street: "",
      barangay: "",
      city: "",
      province: "",
      zipCode: "",
      type: "current",
    });
    setShowCustomFacility(false);
  };

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);

      const formPayload = new FormData();

      // Add profile image if available
      if (formData.profilePic instanceof File) {
        formPayload.append("files", formData.profilePic);
        console.log("Added profile image:", formData.profilePic.name);
      }

      // Format addresses from AddressSelect state
      const addresses = formatAddresses();

      // Prepare contacts array
      const contacts = [
        { type: "email", provider: "Gmail", value: formData.email },
        { type: "mobile_number", provider: "", value: formData.phoneNumber },
      ];

      // Add landline if provided
      if (formData.landline) {
        contacts.push({
          type: "landline",
          provider: "",
          value: formData.landline,
        });
      }

      // Prepare passwords array
      const passwords = [
        { type: "text", value: formData.password },
        { type: "mpin6char", value: "123456" },
      ];

      // Prepare legal agreements
      const legal = [
        { type: "privacy_policy", value: true },
        { type: "terms_and_condition", value: true },
      ];

      // FIX: Prepare professional information - ensure it's always an array
      const professional = [];
      if (formData.position || formData.specialization) {
        professional.push({
          profession: "unknown",
          position: formData.position || null,
          specialization: formData.specialization || null,
        });
      }

      // Prepare identifications
      const identifications = [];
      const isMedical =
        formData.position === "doctor" || formData.position === "nurse";

      if (isMedical && formData.prcId) {
        let prcType = "prc_id_medical";
        if (formData.position === "nurse") {
          prcType = "prc_id_nurse";
        }
        identifications.push({
          type: prcType,
          issuer: "PRC",
          value: formData.prcId,
        });
      }

      if (formData.philhealthPin) {
        identifications.push({
          type: "philhealth_identification_number",
          issuer: "PhilHealth",
          value: formData.philhealthPin,
        });
      }

      // Construct registration data
      const normalizedType = ((): string => {
        if (
          formData.type === "admin" ||
          formData.type === "laboratory" ||
          formData.type === "pharmacy"
        )
          return "hci";
        return formData.type;
      })();

      const registrationData = {
        passwords,
        userName: formData.userName,
        role: formData.role,
        type: normalizedType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        extensionName: formData.extensionName || undefined,
        sex: formData.gender,
        birthDate: formData.birthday,
        birthPlace: formData.birthplace,
        age: parseInt(formData.age) || 0,
        religion: formData.religion,
        civilStatus: formData.civilStatus,
        citizenship: formData.citizenship || "filipino",
        addresses,
        identifications,
        professional, // This should be an array, not a string
        contacts,
        legal,
        ...(formData.facilityId &&
          !showCustomFacility && { facilityId: formData.facilityId }),
      };

      console.log("Professional field:", professional);
      console.log("Professional field type:", typeof professional);

      // FIX: Properly append all data to FormData
      Object.keys(registrationData).forEach((key) => {
        const value = (registrationData as any)[key];

        if (value === undefined || value === null) return;

        // For array/object fields, stringify them
        if (typeof value === "object") {
          formPayload.append(key, JSON.stringify(value));
        } else {
          formPayload.append(key, String(value));
        }
      });

      // Submit to auth/register endpoint
      const res = await authService.register(formPayload);

      if (res) {
        toast({
          title: "Success!",
          description: "Employee registered successfully",
        });
        setSubmitSuccess(true);
        resetForm();
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      setSubmitError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await handleRegister();
  };

  return (
    <div className="min-h-screen bg-background p-0">
      <div className="w-full max-lg mx-auto">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Employee Registration
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Register new healthcare staff members to the system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Success Message */}
            {submitSuccess && (
              <div className="p-4 bg-green-100 text-green-800 rounded-md">
                Employee registered successfully!
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-100 text-red-800 rounded-md">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={
                      formData.profilePic
                        ? URL.createObjectURL(formData.profilePic)
                        : ""
                    }
                  />
                  <AvatarFallback className="bg-secondary text-lg">
                    {formData.firstName?.[0] || "?"}
                    {formData.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  <Input
                    ref={uploadInputRef}
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={openCamera}
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {showCamera && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="bg-white rounded-md w-full max-w-md p-4 space-y-3">
                    <div className="text-sm font-medium">Camera</div>
                    <div className="relative w-full aspect-[3/4] bg-black rounded">
                      {!isPhotoPreview ? (
                        <video
                          ref={videoRef}
                          className="w-full h-full object-contain"
                          playsInline
                          muted
                        />
                      ) : (
                        <img
                          src={capturedDataUrl || ""}
                          alt="Captured"
                          className="w-full h-full object-contain"
                        />
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex justify-end gap-2">
                      {!isPhotoPreview ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseCamera}
                          >
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleCapturePhoto}>
                            Capture
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsPhotoPreview(false);
                              setCapturedDataUrl(null);
                              startCamera();
                            }}
                          >
                            Retake
                          </Button>
                          <Button type="button" onClick={handleUseCaptured}>
                            Use Photo
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) =>
                        handleInputChange("middleName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extensionName">Extension Name</Label>
                    <Input
                      id="extensionName"
                      list="extension-options"
                      value={formData.extensionName}
                      onChange={(e) =>
                        handleInputChange("extensionName", e.target.value)
                      }
                      placeholder="e.g. Jr., Sr., III"
                    />
                    <datalist id="extension-options">
                      <option value="Jr." />
                      <option value="Sr." />
                      <option value="II" />
                      <option value="III" />
                      <option value="IV" />
                      <option value="V" />
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday *</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        handleInputChange("birthday", e.target.value)
                      }
                      required
                    />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender/Sex *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status *</Label>
                    <Select
                      value={formData.civilStatus}
                      onValueChange={(value) =>
                        handleInputChange("civilStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widow">Widow</SelectItem>
                        <SelectItem value="legally_separated">
                          Legally Separated
                        </SelectItem>
                        <SelectItem value="annulled">Annulled</SelectItem>
                        <SelectItem value="cohabiting">Cohabiting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) =>
                        handleInputChange("religion", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizenship">Citizenship *</Label>
                    <Select
                      value={formData.citizenship}
                      onValueChange={(value) =>
                        handleInputChange("citizenship", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select citizenship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filipino">Filipino</SelectItem>
                        <SelectItem value="foreign_national">
                          Foreign National
                        </SelectItem>
                        <SelectItem value="dual_citizen">
                          Dual Citizen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthplace">Birthplace *</Label>
                    <Input
                      id="birthplace"
                      value={formData.birthplace}
                      onChange={(e) =>
                        handleInputChange("birthplace", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        handleInputChange("position", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="it-staff">IT Staff</SelectItem>
                        <SelectItem value="encoder">Encoder</SelectItem>
                        <SelectItem value="administrative">
                          Administrative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) =>
                        handleInputChange("specialization", e.target.value)
                      }
                      placeholder="For doctors/nurses only"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prcId">PRC ID Number</Label>
                    {(formData.position === "doctor" ||
                      formData.position === "nurse") && (
                      <Input
                        id="prcId"
                        value={formData.prcId}
                        onChange={(e) =>
                          handleInputChange("prcId", e.target.value)
                        }
                        placeholder="Professional Regulation Commission ID"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="philhealthPin">PhilHealth PIN</Label>
                    <Input
                      id="philhealthPin"
                      value={formData.philhealthPin}
                      onChange={(e) =>
                        handleInputChange("philhealthPin", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessRole">Access/Role *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physician">
                        Physician (Doctor)
                      </SelectItem>
                      <SelectItem value="presenter">
                        Presenter (Nurse)
                      </SelectItem>
                      <SelectItem value="hci">HCI Staff</SelectItem>
                      <SelectItem value="laboratory">
                        Laboratory Staff
                      </SelectItem>
                      <SelectItem value="pharmacy">Pharmacy Staff</SelectItem>
                      <SelectItem value="admin">Admin Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility Name *</Label>
                  {isLoading ? (
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Loading facilities..." />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <>
                      <Select
                        value={formData.facilityId}
                        onValueChange={handleFacilityChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id}>
                              {facility.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (specify)</SelectItem>
                        </SelectContent>
                      </Select>

                      {showCustomFacility && (
                        <div className="mt-2 space-y-2">
                          <Label htmlFor="customFacility">
                            Specify Facility Name *
                          </Label>
                          <Input
                            id="customFacility"
                            value={formData.customFacilityName}
                            onChange={(e) =>
                              handleInputChange(
                                "customFacilityName",
                                e.target.value
                              )
                            }
                            placeholder="Enter facility name"
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Address Information
                </h3>
                <AddressSelect
                  value={address}
                  onChange={handleAddressChange}
                  isPermanent={false}
                  inputTextCase={""}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landline">Landline</Label>
                    <Input
                      id="landline"
                      value={formData.landline}
                      onChange={(e) =>
                        handleInputChange("landline", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex-1">
                    Temporary Login Credentials
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateCredentials}
                    className="gap-2 ml-4"
                  >
                    <Shuffle className="h-4 w-4" />
                    Generate
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.userName}
                      onChange={(e) =>
                        handleInputChange("userName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Employee"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
