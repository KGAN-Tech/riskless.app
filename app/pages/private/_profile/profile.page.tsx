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
} from "lucide-react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const authUser = getUserFromLocalStorage();
      if (!authUser?.user?.id) return;

      const res = await userService.getById(authUser.user.id);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user?.id) return;

    // Prepare payload for backend
    const email = user.person?.contacts?.find(
      (c: any) => c.type === "email"
    )?.value;
    const phone = user.contactNumber;

    const payload = {
      userName: user.userName,
      person: {
        firstName: user.person?.firstName,
        middleName: user.person?.middleName,
        lastName: user.person?.lastName,
        extensionName: user.person?.extensionName,
        contacts: [
          { type: "email", provider: "email", value: email },
          ...(phone
            ? [{ type: "mobile_number", provider: "unknown", value: phone }]
            : []),
        ],
      },
    };

    try {
      const updated = await userService.update(user.id, payload);
      setUser(updated);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const email =
    user.person?.contacts?.find((c: any) => c.type === "email")?.value ?? "";
  const phone = user.contactNumber ?? "";

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
            <Avatar className="w-24 h-24 border-4 border-green-100">
              <AvatarFallback className="bg-primary text-white text-2xl">
                {user.userName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground">{user.userName}</h3>
              <p className="text-xs text-muted-foreground">
                {user.status ?? "Active User"}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-border text-primary text-sm rounded-full hover:bg-green-50"
            >
              Change Photo
            </Button>
          </div>
        </Card>

        {/* Personal Information */}
        <div className="space-y-3">
          <h3 className="text-foreground">Personal Information</h3>

          <Card className="p-4 rounded-2xl calm-shadow border-border">
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  First Name
                </Label>
                <Input
                  value={user.person?.firstName ?? ""}
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
                  value={user.person?.middleName ?? ""}
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
                  value={user.person?.lastName ?? ""}
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
                  value={user.person?.extensionName ?? ""}
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
                      person: {
                        ...prev.person,
                        contacts: [
                          {
                            type: "email",
                            provider: "email",
                            value: e.target.value,
                          },
                        ],
                      },
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
                      contactNumber: e.target.value,
                    }))
                  }
                  className="border-border rounded-2xl"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 rounded-2xl"
              >
                Save Changes
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
