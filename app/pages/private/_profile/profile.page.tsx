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
  MapPin,
  Lock,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Heart,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Function to get the latest image based on captureDate
  const getLatestImage = (images: any[]) => {
    if (!images || images.length === 0) return null;

    // Sort images by captureDate in descending order (newest first)
    const sortedImages = [...images].sort(
      (a, b) =>
        new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime()
    );

    return sortedImages[0]; // Return the latest image
  };

  const fetchUser = async () => {
    try {
      const authUser = getUserFromLocalStorage();
      if (!authUser?.user?.id) return;

      const res = await userService.getById(authUser.user.id);
      setUser(res.data);
      setOriginalUser(JSON.parse(JSON.stringify(res.data)));

      // Set image preview using the latest image
      if (res.data.person?.images?.length > 0) {
        const latestImage = getLatestImage(res.data.person.images);
        if (latestImage?.url) {
          setImagePreview(latestImage.url);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Check if there are any changes in the profile data
  const hasChanges = () => {
    if (!user || !originalUser) return false;

    // Check for image changes
    if (selectedImage) return true;

    // Check basic user fields
    if (user.userName !== originalUser.userName) return true;
    if (user.phone !== originalUser.phone) return true;
    if (user.email !== originalUser.email) return true;

    // Check person fields
    if (user.person?.firstName !== originalUser.person?.firstName) return true;
    if (user.person?.middleName !== originalUser.person?.middleName)
      return true;
    if (user.person?.lastName !== originalUser.person?.lastName) return true;
    if (user.person?.extensionName !== originalUser.person?.extensionName)
      return true;

    return false;
  };

  const handleSave = async () => {
    if (!user?.id || !hasChanges()) return;

    setSaving(true);
    try {
      const formData = new FormData();

      // Append basic user fields
      formData.append("userName", user.userName || "");

      // Append contact number (for mobile_number contact)
      if (user.phone) {
        formData.append("contactNumber", user.phone);
      }

      // Append person data as JSON string for nested objects
      const personData = {
        firstName: user.person?.firstName || "",
        middleName: user.person?.middleName || "",
        lastName: user.person?.lastName || "",
        extensionName: user.person?.extensionName || "",
        contacts: [
          // Email contact
          ...(user.email
            ? [
                {
                  type: "email",
                  provider: "email",
                  value: user.email,
                },
              ]
            : []),
        ].filter((contact) => contact.type !== "mobile_number"),
      };

      formData.append("person", JSON.stringify(personData));

      // Append image file if selected
      if (selectedImage) {
        formData.append("files", selectedImage);
      }

      // Update user with FormData
      const updated = await userService.update(user.id, formData);
      setUser(updated.data || updated);
      setOriginalUser(JSON.parse(JSON.stringify(updated.data || updated)));

      // Reset selected image after successful upload
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

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setChangingPassword(true);
    try {
      const formData = new FormData();

      // Add password fields according to your BE structure
      formData.append("password", passwordData.newPassword);
      formData.append("passwordType", "text");

      const updated = await userService.update(user.id, formData);

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password changed successfully!");
    } catch (err) {
      console.error("Failed to change password", err);
      alert("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Extract email and phone from contacts
  const email =
    user?.person?.contacts?.find((c: any) => c.type === "email")?.value || "";
  const phone =
    user?.person?.contacts?.find((c: any) => c.type === "mobile_number")
      ?.value || "";

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 rounded-3xl calm-shadow border-border">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-green-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {user.userName?.[0]?.toUpperCase() ?? "U"}
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
              {/* Display image info for debugging */}
              {/* {user.person?.images?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {user.person.images.length} image(s) • Latest:{" "}
                  {new Date(
                    getLatestImage(user.person.images)?.captureDate
                  ).toLocaleDateString()}
                </p>
              )} */}
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <div className="space-y-3">
          <h3 className="text-foreground">Personal Information</h3>

          <Card className="p-4 rounded-2xl calm-shadow border-border">
            <div className="space-y-4">
              {/* Username */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Username
                </Label>
                <Input
                  value={user.userName || ""}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* First Name */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  First Name
                </Label>
                <Input
                  value={user.person?.firstName || ""}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      person: { ...prev.person, firstName: e.target.value },
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Middle Name */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Middle Name
                </Label>
                <Input
                  value={user.person?.middleName || ""}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      person: { ...prev.person, middleName: e.target.value },
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Last Name */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  value={user.person?.lastName || ""}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      person: { ...prev.person, lastName: e.target.value },
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Extension Name */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Extension Name
                </Label>
                <Input
                  value={user.person?.extensionName || ""}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      person: { ...prev.person, extensionName: e.target.value },
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  value={email}
                  type="email"
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              {/* Only show Save Changes button if there are actual changes */}
              {hasChanges() && (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary/90 rounded-2xl disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Change Password Section */}
        <div className="space-y-3">
          <h3 className="text-foreground">Change Password</h3>

          <Card className="p-4 rounded-2xl calm-shadow border-border">
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="border-border rounded-2xl pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="border-border rounded-2xl pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="border-border rounded-2xl pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={
                  changingPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                className="w-full bg-amber-500 hover:bg-amber-600 rounded-2xl disabled:opacity-50"
              >
                {changingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
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
