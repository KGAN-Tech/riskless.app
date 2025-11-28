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
} from "lucide-react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    userName: "",
    email: "",
    phone: "",
  });

  // Track initial form data to compare against
  const [initialFormData, setInitialFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    userName: "",
    email: "",
    phone: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "personal" | "account" | "security"
  >("personal");

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

      const newFormData = {
        firstName: res.data.person?.firstName || "",
        middleName: res.data.person?.middleName || "",
        lastName: res.data.person?.lastName || "",
        extensionName: res.data.person?.extensionName || "",
        userName: res.data.userName || "",
        email,
        phone,
      };

      setFormData(newFormData);
      setInitialFormData(newFormData); // Set initial data for comparison

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

  // Check for changes whenever formData or selectedImage changes
  useEffect(() => {
    const formHasChanges =
      formData.firstName !== initialFormData.firstName ||
      formData.middleName !== initialFormData.middleName ||
      formData.lastName !== initialFormData.lastName ||
      formData.extensionName !== initialFormData.extensionName ||
      formData.userName !== initialFormData.userName ||
      formData.email !== initialFormData.email ||
      formData.phone !== initialFormData.phone ||
      selectedImage !== null;

    setHasChanges(formHasChanges);
  }, [formData, initialFormData, selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id || !hasChanges) return;

    setSaving(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("userName", formData.userName || "");
      formDataToSend.append("firstName", formData.firstName || "");
      formDataToSend.append("lastName", formData.lastName || "");
      formDataToSend.append("middleName", formData.middleName || "");
      formDataToSend.append("extensionName", formData.extensionName || "");

      const contacts = [];
      if (formData.email) {
        contacts.push({
          type: "email",
          provider: "email",
          value: formData.email,
        });
      }
      if (formData.phone) {
        contacts.push({
          type: "mobile_number",
          provider: "mobile",
          value: formData.phone,
        });
      }

      formDataToSend.append("contacts", JSON.stringify(contacts));

      if (selectedImage) {
        formDataToSend.append("files", selectedImage);
      }

      const response = await userService.update(user.id, formDataToSend);

      const updatedUser = response.user || response.data?.user || response.data;

      setUser(updatedUser);

      // Update initial form data to reflect the saved state
      const email =
        updatedUser.person?.contacts?.find((c: any) => c.type === "email")
          ?.value || "";
      const phone =
        updatedUser.person?.contacts?.find(
          (c: any) => c.type === "mobile_number"
        )?.value || "";

      const newInitialFormData = {
        firstName: updatedUser.person?.firstName || "",
        middleName: updatedUser.person?.middleName || "",
        lastName: updatedUser.person?.lastName || "",
        extensionName: updatedUser.person?.extensionName || "",
        userName: updatedUser.userName || "",
        email,
        phone,
      };

      setInitialFormData(newInitialFormData);

      // Refresh preview image
      const latest = getLatestImage(updatedUser.person?.images || []);
      setImagePreview(latest?.url || null);

      setSelectedImage(null);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
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

      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const TabNavigation = () => (
    <div className="flex space-x-1 bg-muted/50 p-1 rounded-2xl">
      <button
        onClick={() => setActiveTab("personal")}
        className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-colors ${
          activeTab === "personal"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="w-4 h-4 inline mr-2" />
        Personal Info
      </button>

      <button
        onClick={() => setActiveTab("account")}
        className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-colors ${
          activeTab === "account"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Mail className="w-4 h-4 inline mr-2" />
        Account
      </button>

      <button
        onClick={() => setActiveTab("security")}
        className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-colors ${
          activeTab === "security"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Shield className="w-4 h-4 inline mr-2" />
        Security
      </button>
    </div>
  );

  const FormInput = ({
    field,
    label,
    type = "text",
    placeholder = "",
  }: any) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="border-border rounded-2xl"
      />
    </div>
  );

  const PersonalInfoTab = () => (
    <Card className="p-4 rounded-2xl calm-shadow border-border space-y-4">
      <FormInput field="firstName" label="First Name" />
      <FormInput field="middleName" label="Middle Name" />
      <FormInput field="lastName" label="Last Name" />
      <FormInput field="extensionName" label="Extension Name" />
    </Card>
  );

  const AccountTab = () => (
    <Card className="p-4 rounded-2xl calm-shadow border-border space-y-4">
      <FormInput field="userName" label="Username" />
      <FormInput field="email" label="Email" type="email" />
      <FormInput field="phone" label="Phone" />
    </Card>
  );

  const SecurityTab = () => (
    <Card className="p-4 rounded-2xl calm-shadow border-border space-y-4">
      {/* Current password */}
      <PasswordField
        label="Current Password"
        value={passwordData.currentPassword}
        onChange={(v: string) =>
          setPasswordData((prev) => ({ ...prev, currentPassword: v }))
        }
        visible={showPassword}
        toggle={() => setShowPassword(!showPassword)}
      />

      {/* New password */}
      <PasswordField
        label="New Password"
        value={passwordData.newPassword}
        onChange={(v: string) =>
          setPasswordData((prev) => ({ ...prev, newPassword: v }))
        }
        visible={showPassword}
        toggle={() => setShowPassword(!showPassword)}
      />

      {/* Confirm password */}
      <PasswordField
        label="Confirm Password"
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
        {changingPassword ? "Changing Password..." : "Change Password"}
      </Button>
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
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        {/* Avatar */}
        <Card className="p-6 rounded-3xl calm-shadow border-border">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-green-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {user.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h3 className="text-foreground">{user.userName}</h3>
              <p className="text-xs text-muted-foreground">
                {user.status ?? "Active User"}
              </p>
            </div>
          </div>
        </Card>

        <TabNavigation />

        {activeTab === "personal" && <PersonalInfoTab />}
        {activeTab === "account" && <AccountTab />}
        {activeTab === "security" && <SecurityTab />}

        {/* Save button */}
        {hasChanges && activeTab !== "security" && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90 rounded-2xl"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-2xl"
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/";
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
