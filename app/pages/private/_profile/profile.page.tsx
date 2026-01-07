import { useEffect, useState } from "react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  Heart,
  Camera,
  Eye,
  EyeOff,
  Edit,
  X,
} from "lucide-react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// Modal Component
function EditModal({ isOpen, onClose, children, title }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalType, setModalType] = useState<
    "personal" | "account" | "security" | null
  >(null);
  const [modalFormData, setModalFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    userName: "",
    email: "",
    phone: "",
  });

  // Password modal state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Image states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const getLatestImage = (images: any[]) => {
    if (!images || images.length === 0) return null;
    const sorted = [...images].sort(
      (a, b) =>
        new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime()
    );
    return sorted[0];
  };

  const fetchUser = async () => {
    try {
      const authUser = getUserFromLocalStorage();
      if (!authUser?.user?.id) return;

      const res = await userService.getById(authUser.user.id);
      setUser(res.data);

      const email =
        res.data.person?.contacts?.find((c: any) => c.type === "email")
          ?.value || "";
      const phone =
        res.data.person?.contacts?.find((c: any) => c.type === "mobile_number")
          ?.value || "";

      // Set display data (not modal data)
      setModalFormData({
        firstName: res.data.person?.firstName || "",
        middleName: res.data.person?.middleName || "",
        lastName: res.data.person?.lastName || "",
        extensionName: res.data.person?.extensionName || "",
        userName: res.data.userName || "",
        email,
        phone,
      });

      if (res.data.person?.images?.length > 0) {
        const latest = getLatestImage(res.data.person.images);
        if (latest?.url) setImagePreview(latest.url);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setSelectedImage(file);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("files", file);

      await userService.update(user.id, formData);
      await fetchUser(); // Refresh user data
      setSelectedImage(null);
      alert("Profile image updated successfully!");
    } catch (err) {
      console.error("Failed to update image", err);
      alert("Failed to update profile image");
    } finally {
      setUploadingImage(false);
    }
  };

  const openModal = (type: "personal" | "account" | "security") => {
    setModalType(type);
    // Reset modal form data to current user data
    if (user) {
      const email =
        user.person?.contacts?.find((c: any) => c.type === "email")?.value ||
        "";
      const phone =
        user.person?.contacts?.find((c: any) => c.type === "mobile_number")
          ?.value || "";

      setModalFormData({
        firstName: user.person?.firstName || "",
        middleName: user.person?.middleName || "",
        lastName: user.person?.lastName || "",
        extensionName: user.person?.extensionName || "",
        userName: user.userName || "",
        email,
        phone,
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    // Reset password fields when closing security modal
    if (modalType === "security") {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleModalInputChange = (field: string, value: string) => {
    setModalFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = async () => {
    if (!user?.id) return;

    try {
      const formData = new FormData();
      formData.append("firstName", modalFormData.firstName || "");
      formData.append("lastName", modalFormData.lastName || "");
      formData.append("middleName", modalFormData.middleName || "");
      formData.append("extensionName", modalFormData.extensionName || "");

      await userService.update(user.id, formData);
      await fetchUser(); // Refresh user data
      closeModal();
      alert("Personal information updated successfully!");
    } catch (err) {
      console.error("Failed to update personal info", err);
      alert("Failed to update personal information");
    }
  };

  const handleSaveAccountInfo = async () => {
    if (!user?.id) return;

    try {
      const formData = new FormData();
      formData.append("userName", modalFormData.userName || "");

      const contacts = [];
      if (modalFormData.email) {
        contacts.push({
          type: "email",
          provider: "email",
          value: modalFormData.email,
        });
      }
      if (modalFormData.phone) {
        contacts.push({
          type: "mobile_number",
          provider: "mobile",
          value: modalFormData.phone,
        });
      }

      formData.append("contacts", JSON.stringify(contacts));

      await userService.update(user.id, formData);
      await fetchUser(); // Refresh user data
      closeModal();
      alert("Account information updated successfully!");
    } catch (err) {
      console.error("Failed to update account info", err);
      alert("Failed to update account information");
    }
  };

  const handleChangePassword = async () => {
    if (!user?.id) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    setChangingPassword(true);
    try {
      const fd = new FormData();
      fd.append("password", passwordData.newPassword);
      fd.append("passwordType", "text");

      await userService.update(user.id, fd);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      closeModal();
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const ProfileSection = ({ title, children, onEdit }: any) => (
    <Card className="p-6 rounded-2xl calm-shadow border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="rounded-xl"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
      {children}
    </Card>
  );

  const PasswordField = ({ label, value, onChange, visible, toggle }: any) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-border rounded-2xl pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
            <Heart className="w-6 h-6 text-pink-400" />
            My Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Avatar Section */}
        <Card className="p-6 rounded-3xl calm-shadow border-border">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-green-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-full"
                    alt="Profile"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-3xl">
                    {user.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-colors ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {user.person?.firstName} {user.person?.lastName}
              </h3>
              <p className="text-muted-foreground">@{user.userName}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                {user.status ?? "Active"}
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information Section */}
        <ProfileSection
          title="Personal Information"
          onEdit={() => openModal("personal")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">
                First Name
              </Label>
              <p className="text-foreground font-medium">
                {user.person?.firstName || "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Middle Name
              </Label>
              <p className="text-foreground font-medium">
                {user.person?.middleName || "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <p className="text-foreground font-medium">
                {user.person?.lastName || "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Extension Name
              </Label>
              <p className="text-foreground font-medium">
                {user.person?.extensionName || "Not set"}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Account Information Section */}
        <ProfileSection
          title="Account Information"
          onEdit={() => openModal("account")}
        >
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Username</Label>
              <p className="text-foreground font-medium">
                {user.userName || "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Email Address
              </Label>
              <p className="text-foreground font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {modalFormData.email || "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Phone Number
              </Label>
              <p className="text-foreground font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {modalFormData.phone || "Not set"}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Security Section */}
        <ProfileSection title="Security" onEdit={() => openModal("security")}>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Password</Label>
              <p className="text-foreground font-medium">••••••••</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Last changed: {new Date().toLocaleDateString()}
            </p>
          </div>
        </ProfileSection>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-2xl py-6 text-lg"
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/";
          }}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Personal Info Modal */}
      <EditModal
        isOpen={modalType === "personal"}
        onClose={closeModal}
        title="Edit Personal Information"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">First Name</Label>
            <Input
              value={modalFormData.firstName}
              onChange={(e) =>
                handleModalInputChange("firstName", e.target.value)
              }
              className="border-border rounded-2xl"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Middle Name</Label>
            <Input
              value={modalFormData.middleName}
              onChange={(e) =>
                handleModalInputChange("middleName", e.target.value)
              }
              className="border-border rounded-2xl"
              placeholder="Enter middle name"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Last Name</Label>
            <Input
              value={modalFormData.lastName}
              onChange={(e) =>
                handleModalInputChange("lastName", e.target.value)
              }
              className="border-border rounded-2xl"
              placeholder="Enter last name"
            />
          </div>
          {/* <div>
            <Label className="text-xs text-muted-foreground">
              Extension Name
            </Label>
            <Input
              value={modalFormData.extensionName}
              onChange={(e) =>
                handleModalInputChange("extensionName", e.target.value)
              }
              className="border-border rounded-2xl"
              placeholder="e.g., Jr., Sr., III"
            />
          </div> */}
          <Button
            onClick={handleSavePersonalInfo}
            className="w-full bg-primary hover:bg-primary/90 rounded-2xl"
          >
            Save Changes
          </Button>
        </div>
      </EditModal>

      {/* Account Info Modal */}
      <EditModal
        isOpen={modalType === "account"}
        onClose={closeModal}
        title="Edit Account Information"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Username</Label>
            <Input
              value={modalFormData.userName}
              onChange={(e) =>
                handleModalInputChange("userName", e.target.value)
              }
              className="border-border rounded-2xl"
              placeholder="Enter username"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Email Address
            </Label>
            <Input
              type="email"
              value={modalFormData.email}
              onChange={(e) => handleModalInputChange("email", e.target.value)}
              className="border-border rounded-2xl"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Phone Number
            </Label>
            <Input
              value={modalFormData.phone}
              onChange={(e) => handleModalInputChange("phone", e.target.value)}
              className="border-border rounded-2xl"
              placeholder="Enter phone number"
            />
          </div>
          <Button
            onClick={handleSaveAccountInfo}
            className="w-full bg-primary hover:bg-primary/90 rounded-2xl"
          >
            Save Changes
          </Button>
        </div>
      </EditModal>

      {/* Security Modal */}
      <EditModal
        isOpen={modalType === "security"}
        onClose={closeModal}
        title="Change Password"
      >
        <div className="space-y-4">
          <PasswordField
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(v: string) =>
              setPasswordData((prev) => ({ ...prev, currentPassword: v }))
            }
            visible={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />
          <PasswordField
            label="New Password"
            value={passwordData.newPassword}
            onChange={(v: string) =>
              setPasswordData((prev) => ({ ...prev, newPassword: v }))
            }
            visible={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />
          <PasswordField
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(v: string) =>
              setPasswordData((prev) => ({ ...prev, confirmPassword: v }))
            }
            visible={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="w-full bg-amber-500 hover:bg-amber-600 rounded-2xl"
          >
            {changingPassword ? "Changing Password..." : "Update Password"}
          </Button>
        </div>
      </EditModal>
    </div>
  );
}
