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
import { Switch } from "@/components/atoms/switch";

export function ProfilePage() {
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
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground">John Doe</h3>
              <p className="text-xs text-muted-foreground">Active User</p>
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
              <div>
                <Label className="text-xs text-muted-foreground">
                  Full Name
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-primary" />
                  <Input
                    defaultValue="John Doe"
                    className="border-border rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-primary" />
                  <Input
                    defaultValue="john.doe@example.com"
                    type="email"
                    className="border-border rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-primary" />
                  <Input
                    defaultValue="+1 (555) 123-4567"
                    className="border-border rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Location
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <Input
                    defaultValue="San Francisco, CA"
                    className="border-border rounded-2xl"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 rounded-2xl">
                Save Changes
              </Button>
            </div>
          </Card>
        </div>

        {/* Security Settings */}
        <div className="space-y-3">
          <h3 className="text-foreground">Security Settings</h3>

          <Card className="p-3 rounded-2xl calm-shadow border-border">
            <button className="w-full flex items-center justify-between p-2 hover:bg-green-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-foreground">Change Password</p>
                  <p className="text-xs text-muted-foreground">
                    Update your password
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>

          <Card className="p-3 rounded-2xl calm-shadow border-border">
            <button className="w-full flex items-center justify-between p-2 hover:bg-green-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add extra security
                  </p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </button>
          </Card>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3">
          <h3 className="text-foreground">Notifications</h3>

          <Card className="p-4 rounded-2xl calm-shadow border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">
                      Push Notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts and updates
                    </p>
                  </div>
                </div>
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">
                      Email Notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get updates via email
                    </p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-primary" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">Location Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Nearby incident warnings
                    </p>
                  </div>
                </div>
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-2xl"
          onClick={() => {
            //clear local storage "auth"
            localStorage.removeItem("auth");
            //redirect to login page
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
