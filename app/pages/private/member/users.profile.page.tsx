import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Save,
  Edit3,
  Camera,
  Shield,
  Calendar,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";

// 🟢 Import the same helpers/services used in Homepage
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  citizenship: string;
  contacts: any;
  addresses: any;
  birthDate: string;
  civilstatus: string;
  sex: string;
  identifications: any;
  images?: any;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Get user data from localStorage
  const getUserdata = getUserFromLocalStorage();
  const userId = getUserdata?.user?.id;

  // ✅ Manage local state
  const [member, setMember] = useState<any>({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // ✅ Fetch member profile by userId
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await userService.get(userId as string, {
          fields: "id,userName,person,type",
        });
        setMember(res.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    if (userId) fetchMember();
  }, [userId]);

  // ✅ Sync profile state once member is loaded
  useEffect(() => {
    if (member && member.person) {
      setProfile({
        firstName: member.person.firstName || "",
        lastName: member.person.lastName || "",
        middleName: member.person.middleName || "",
        contacts: member.person.contacts || "",
        addresses: member.person.addresses || "",
        birthDate: member.person.birthDate || "",
        citizenship: member.person.citizenship || "",
        sex: member.person.sex || "",
        civilstatus: member.person.civilstatus || "",
        identifications: member.person.identifications || "",
        images: member.person.images || "",
      });
    }
  }, [member]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Headerbackbutton title="Profile Settings" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 mt-2">
        <div className="p-4 space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium shadow-lg ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Header Card */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-lg">
                  {profile.images?.[0]?.url ? (
                    <img
                      src={profile.images?.[0]?.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfile({ ...profile, images: e.target.value })
                }
                className="hidden"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.firstName.toUpperCase()}{" "}
                  {profile.middleName.toUpperCase()}{" "}
                  {profile.lastName.toUpperCase()}
                </h2>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {
                    profile.contacts?.find(
                      (c: any) => c.type === "mobile_number"
                    )?.value
                  }
                </span>
                <p className="text-gray-500 mb-2">Health Member</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />

                    {
                      profile.contacts?.find((c: any) => c.type === "email")
                        ?.value
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal Info</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "security"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
              {/* Personal Information Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Personal Information
                      </h3>
                      <p className="text-sm text-gray-500">
                        Update your personal details
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {isEditing ? (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={profile.firstName.toUpperCase()}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={profile.lastName.toUpperCase()}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={profile.middleName.toUpperCase()}
                      onChange={(e) =>
                        setProfile({ ...profile, middleName: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={
                        profile.birthDate ? profile.birthDate.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        setProfile({ ...profile, birthDate: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      sex *
                    </label>
                    <select
                      value={profile.sex}
                      onChange={(e) =>
                        setProfile({ ...profile, sex: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                      <option value="other">other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      PhilHealth ID *
                    </label>
                    <input
                      type="text"
                      value={
                        profile.identifications?.find(
                          (c: any) =>
                            c.type === "philhealth_identification_number"
                        )?.value
                      }
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          identifications: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter PhilHealth ID"
                    />
                  </div>
                       {/* 🆕 Citizenship */}
                       <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Citizenship *
                    </label>
                    <input
                      type="text"
                      value={profile.citizenship}
                      onChange={(e) =>
                        setProfile({ ...profile, citizenship: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      placeholder="Enter citizenship"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Civil status
                    </label>
                    <select
                      value={profile.civilstatus}
                      onChange={(e) =>
                        setProfile({ ...profile, civilstatus: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">single</option>
                      <option value="male">married</option>
                      <option value="female">divorced</option>
                      <option value="female">Widowed</option>
                      <option value="female">Separated</option>
                      <option value="other">other</option>
                    </select>
                  </div>

                </div>
                      
                {/* Contact Information */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={
                        profile.contacts?.find((c: any) => c.type === "email")
                          ?.value
                      }
                      onChange={(e) =>
                        setProfile({ ...profile, contacts: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={
                        profile.contacts?.find(
                          (c: any) => c.type === "mobile_number"
                        )?.value
                      }
                      onChange={(e) =>
                        setProfile({ ...profile, contacts: e.target.value })
                      }
                      disabled={!isEditing}
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address *
                    </label>
                    <textarea
  value={
    [
      profile.addresses[0]?.unit,
      profile.addresses[0]?.buildingName,
      profile.addresses[0]?.houseNo,
      profile.addresses[0]?.street,
      profile.addresses[0]?.barangay?.value,
      profile.addresses[0]?.city?.value,
      profile.addresses[0]?.province?.value,
    ]
      .filter((part) => part && part.trim() !== "") // remove null/empty strings
      .join(" ") // join with spaces
  }
  onChange={(e) =>
    setProfile({
      ...profile,
      addresses: [{ ...profile.addresses[0], fullAddress: e.target.value }],
    })
  }
  disabled={!isEditing}
  required
  rows={3}
  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
  placeholder="Enter complete address"
/>

                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          await userService.update(
                            member.userId as string,
                            profile
                          );
                          setIsEditing(false);
                          setIsSaving(false);
                        } catch (error) {
                          console.error("Error updating profile:", error);
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
              {/* Security Settings Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Security Settings
                    </h3>
                    <p className="text-sm text-gray-500">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => "current"}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            passwordData.newPassword.length >= 8
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {passwordData.newPassword.length >= 8
                            ? "Strong"
                            : "Weak"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordData.newPassword.length >= 8
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (passwordData.newPassword.length / 8) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Change Password Button */}
                  <Button
                    disabled={
                      isChangingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
