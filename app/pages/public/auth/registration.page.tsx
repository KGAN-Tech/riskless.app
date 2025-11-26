import { useState } from "react";
import { Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card } from "@/components/atoms/card";
import { authService } from "@/services/auth.service";

export function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();

    // ✅ File
    if (profileImage) {
      formData.append("files", profileImage);
    }

    // ✅ Text & JSON fields (backend expects JSON)
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append(
      "passwords",
      JSON.stringify([{ type: "text", value: password }])
    );
    formData.append(
      "contacts",
      JSON.stringify([{ type: "email", value: email, provider: "email" }])
    );
    formData.append(
      "legal",
      JSON.stringify([
        { type: "privacy_policy", value: true },
        { type: "terms_and_condition", value: true },
      ])
    );
    formData.append("role", "user");
    formData.append("type", "rider");

    try {
      setIsLoading(true);
      const res = await authService.register(formData);
      alert("Registration successful!");
      console.log("✅ Registered user:", res.data);
      navigate("/login");
    } catch (err: any) {
      console.error("❌ Registration failed:", err);
      alert(err?.response?.data?.message || "Error during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start px-6 py-8 nature-pattern overflow-auto">
      <div className="w-full max-w-md fade-in-up">
        {/* Logo + Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-green-400 rounded-[1.75rem] mb-3 calm-shadow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-primary mb-1">Join Riskless</h2>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        {/* Registration Card */}
        <Card className="p-6 rounded-[1.5rem] calm-shadow border-border">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Picture (optional)</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setProfileImage(e.target.files[0]);
                  }
                }}
                className="cursor-pointer"
              />
              {profileImage && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {profileImage.name}
                </p>
              )}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms" className="text-muted-foreground">
                I agree to the{" "}
                <span className="text-primary">Terms of Service</span> and{" "}
                <span className="text-primary">Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white rounded-full mt-6"
            >
              {isLoading ? (
                "Creating..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 mb-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
