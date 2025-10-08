import React, { useEffect, useState } from "react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/atoms/select";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit2,
  Save,
  X,
  UserCog,
  Camera,
} from "lucide-react";
import { Skeleton } from "@/components/atoms/skeleton";
import { AvatarImage } from "@/components/atoms/avatar";
import { userService } from "@/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// Import Toast components directly
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/atoms/toast";

interface AdminData {
  id: string;
  userName: string;
  type: string;
  membershipStatus?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName?: string;
  sex?: string;
  religion?: string;
  civilStatus?: string;
  citizenship?: string;
  birthDate?: string;
  birthPlace?: string;
  position?: string;
  specialization?: string;
  email?: string;
  phoneNumber?: string;
  prcId?: string;
  images?: string;
}

// Get current user ID from localStorage
const getCurrentId = () => {
  const currentUser = getUserFromLocalStorage();
  return currentUser?.user?.id;
};

// Updated constants
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit
const COMPRESSION_THRESHOLD = 500 * 1024; // Compress files over 500KB

// Enhanced compression function
const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        const scaleFactor = maxWidth / width;
        width = maxWidth;
        height = Math.floor(height * scaleFactor);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with quality settings
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "medium";
      ctx!.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Check if compression is needed
const needsCompression = (file: File) => file.size > COMPRESSION_THRESHOLD;

// Toast state interface
interface ToastState {
  open: boolean;
  title: string;
  description: string;
  variant: "default" | "success" | "destructive";
}

export const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<AdminData | null>(null);
  const [formData, setFormData] = useState<AdminData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: "",
    description: "",
    variant: "default",
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Show toast function
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "success" | "destructive" = "default"
  ) => {
    setToast({
      open: true,
      title,
      description,
      variant,
    });
  };

  // Close toast function
  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const userId = getCurrentId();
      if (!userId) {
        showToast(
          "Error",
          "User ID not found. Please log in again.",
          "destructive"
        );
        return;
      }

      const res: any = await userService.get(userId, {
        fields:
          "id,userName,role,type,status,createdAt,lastLogin,joinAt,facility.name,person.firstName,person.middleName,person.lastName,person.extensionName,person.identifications,person.contacts,person.images,person.sex,person.gender,person.birthDate,person.birthPlace,person.age,person.religion,person.civilStatus,person.addresses,person.professional,person.citizenship",
      });

      const u = res;
      const person = u?.data?.person || {};
      const images = person?.images || [];
      const professional = person?.professional || [];
      const contacts = person?.contacts || [];
      const identifications = person?.identifications || [];

      const userData: AdminData = {
        id: u?.data?.id || person?.data?.id || "",
        userName: u?.data?.userName || "",
        firstName: person?.firstName || "",
        middleName: person?.middleName || "",
        lastName: person?.lastName || "",
        extensionName: person?.extensionName || "",
        position: (professional?.[0]?.position || u?.type || "").toString(),
        specialization: professional?.[0]?.specialization || "",
        prcId:
          identifications.find((i: any) => i?.issuer === "PRC")?.value || "",
        email: contacts.find((c: any) => c?.type === "email")?.value || "",
        phoneNumber:
          contacts.find((c: any) => c?.type === "mobile_number")?.value || "",
        type: (u?.data?.type || "").toString(),
        membershipStatus: u?.data?.status || "active",
        images: images[0]?.url || null,
        sex: person?.sex || "",
        religion: person?.religion || "",
        civilStatus: person?.civilStatus || "",
        citizenship: person?.citizenship || "",
        birthDate: person?.birthDate || "",
        birthPlace: person?.birthPlace || "",
      };

      setUserData(userData);
      setFormData(userData);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      showToast(
        "Error",
        "Failed to load profile data. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof AdminData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(userData);
    setProfilePicturePreview(null);
    setIsEditing(false);
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast(
        "Invalid file type",
        "Please select a valid image file (JPEG, PNG, etc.)",
        "destructive"
      );
      return;
    }

    // Validate file size - 1MB limit
    if (file.size > MAX_FILE_SIZE) {
      showToast(
        "File too large",
        `Please select an image smaller than 1MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`,
        "destructive"
      );
      return;
    }

    try {
      setIsUploadingImage(true);

      let imageDataUrl: string;

      if (needsCompression(file)) {
        // Show compression toast only for files over 500KB
        showToast(
          "Optimizing image...",
          "Compressing image for optimal size",
          "default"
        );
        imageDataUrl = await compressImage(file);
      } else {
        // For files under 500KB, use FileReader directly (no compression needed)
        imageDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setProfilePicturePreview(imageDataUrl);
      handleChange("images", imageDataUrl);

      // Show success message
      if (needsCompression(file)) {
        showToast(
          "Success",
          "Profile picture optimized and updated",
          "success"
        );
      }
    } catch (error) {
      console.error("Error processing image:", error);
      showToast(
        "Upload failed",
        "Failed to process image. Please try again.",
        "destructive"
      );
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProfilePictureClick = () => {
    if (isUploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setIsSaving(true);

      const payload = {
        userName: formData.userName,
        type: formData.type,
        images: formData.images
          ? [
              {
                url: formData.images,
              },
            ]
          : [],
        status: formData.membershipStatus ?? "active",
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        extensionName: formData.extensionName ?? null,
        sex: formData.sex ?? "male",
        religion: formData.religion ?? "",
        civilStatus: formData.civilStatus ?? "",
        citizenship: formData.citizenship ?? "filipino",
        birthDate: formData.birthDate
          ? new Date(formData.birthDate).toISOString()
          : null,
        birthPlace: formData.birthPlace ?? "",
        identifications: [
          {
            type: "prc_id_medical",
            value: formData.prcId ?? "",
            issuer: "PRC",
          },
        ],
        professional: [
          {
            profession: "unknown",
            position: formData.position ?? "",
            specialization: formData.specialization ?? "",
          },
        ],
        contacts: [
          {
            type: "email",
            provider: "Gmail",
            value: formData.email ?? "",
          },
          {
            type: "mobile_number",
            provider: "",
            value: formData.phoneNumber ?? "",
          },
        ],
      };

      await userService.update(formData.id, payload);

      setUserData(formData);
      setProfilePicturePreview(null);
      setIsEditing(false);

      showToast(
        "Profile Updated",
        "Your profile has been updated successfully!",
        "success"
      );
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage = error?.message || "Failed to update profile";
      showToast("Update Failed", errorMessage, "destructive");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">No profile data available</p>
              <Button onClick={fetchUserData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = () => {
    return `${formData.firstName?.[0] || ""}${
      formData.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const getFullName = () => {
    return `${formData.firstName} ${
      formData.middleName ? formData.middleName + " " : ""
    }${formData.lastName}`;
  };

  const getRoleDisplay = (type: string) => {
    const roleMap: Record<string, string> = {
      physician: "Physician (Doctor)",
      presenter: "Presenter (Nurse)",
      hci: "HCI Staff",
      laboratory: "Laboratory Staff",
      pharmacy: "Pharmacy Staff",
      admin: "Admin Staff",
    };
    return roleMap[type] || type;
  };

  return (
    <ToastProvider>
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        {/* Header Card */}
        <Card className="mb-6 border-none shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-4 border-blue-100">
                    {(profilePicturePreview || formData.images) && (
                      <AvatarImage
                        src={profilePicturePreview || formData.images}
                        alt={getFullName()}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button
                      onClick={handleProfilePictureClick}
                      disabled={isUploadingImage}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                    >
                      {isUploadingImage ? (
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </div>
                <div>
                  <h1 className="text-3xl mb-2">{getFullName()}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <UserCog className="w-3 h-3 mr-1" />
                      {getRoleDisplay(formData.type)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        formData.membershipStatus === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {formData.membershipStatus || "Active"}
                    </Badge>
                    {formData.prcId && (
                      <span className="text-sm text-muted-foreground">
                        PRC ID: {formData.prcId}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum file size: 1MB. Supported formats: JPEG, PNG, WebP
                    </p>
                  )}
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="border-gray-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details Card */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Account Information */}
            <div>
              <h3 className="mb-4 text-blue-900 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-sm text-gray-700">
                    User Name
                  </Label>
                  <Input
                    id="userName"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h3 className="mb-4 text-blue-900 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm text-gray-700">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.middleName}
                    onChange={(e) => handleChange("middleName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex" className="text-sm text-gray-700">
                    Sex
                  </Label>
                  <Input
                    id="sex"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.sex}
                    onChange={(e) => handleChange("sex", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-1 text-blue-600" />
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={
                      formData.birthDate ? formData.birthDate.split("T")[0] : ""
                    }
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-sm text-gray-700">
                    <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                    Birth Place
                  </Label>
                  <Input
                    id="birthPlace"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.birthPlace}
                    onChange={(e) => handleChange("birthPlace", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion" className="text-sm text-gray-700">
                    Religion
                  </Label>
                  <Input
                    id="religion"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.religion}
                    onChange={(e) => handleChange("religion", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="civilStatus"
                    className="text-sm text-gray-700"
                  >
                    Civil Status
                  </Label>
                  <Input
                    id="civilStatus"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.civilStatus}
                    onChange={(e) =>
                      handleChange("civilStatus", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="citizenship"
                    className="text-sm text-gray-700"
                  >
                    Citizenship
                  </Label>
                  <Input
                    id="citizenship"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.citizenship}
                    onChange={(e) =>
                      handleChange("citizenship", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prcId" className="text-sm text-gray-700">
                    PRC ID
                  </Label>
                  <Input
                    id="prcId"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.prcId}
                    onChange={(e) => handleChange("prcId", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="mb-4 text-blue-900 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    <Mail className="w-4 h-4 inline mr-1 text-blue-600" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm text-gray-700"
                  >
                    <Phone className="w-4 h-4 inline mr-1 text-blue-600" />
                    Phone
                  </Label>
                  <Input
                    id="phoneNumber"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            <div>
              <h3 className="mb-4 text-blue-900 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm text-gray-700">
                    <Briefcase className="w-4 h-4 inline mr-1 text-blue-600" />
                    Position
                  </Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleChange("position", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      className={`${
                        !isEditing
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-blue-200"
                      }`}
                    >
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
                  <Label
                    htmlFor="specialization"
                    className="text-sm text-gray-700"
                  >
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    className={`${
                      !isEditing
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 focus:ring-blue-500"
                    }`}
                    value={formData.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast Component */}
      <Toast
        open={toast.open}
        onOpenChange={closeToast}
        variant={toast.variant}
      >
        <ToastTitle>{toast.title}</ToastTitle>
        <ToastDescription>{toast.description}</ToastDescription>
        <ToastClose />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  );
};
