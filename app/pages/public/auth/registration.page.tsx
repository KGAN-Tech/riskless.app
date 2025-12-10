import { useState } from "react";
import { Eye, EyeOff, Shield, UserPlus, X } from "lucide-react";
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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

  // Modal Component
  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden bg-background rounded-[1.5rem] calm-shadow border-border">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">{children}</div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-border">
            <Button
              onClick={onClose}
              className="w-full h-12 bg-primary text-white rounded-full"
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
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

      {/* Terms of Service Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">
            Last Updated: {new Date().toLocaleDateString()}
          </h4>

          <section>
            <h5 className="font-semibold mb-2">1. Acceptance of Terms</h5>
            <p className="text-muted-foreground">
              By accessing and using Riskless, you accept and agree to be bound
              by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">2. Description of Service</h5>
            <p className="text-muted-foreground">
              Riskless provides a platform for riders to connect with services.
              We reserve the right to modify or discontinue, temporarily or
              permanently, the service with or without notice.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">3. User Responsibilities</h5>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your
              account and password. You agree to accept responsibility for all
              activities that occur under your account.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">4. Prohibited Uses</h5>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing upon intellectual property rights</li>
              <li>Harassing, abusing, or harming others</li>
              <li>Distributing viruses or malicious code</li>
              <li>Attempting to gain unauthorized access</li>
            </ul>
          </section>

          <section>
            <h5 className="font-semibold mb-2">5. Termination</h5>
            <p className="text-muted-foreground">
              We may terminate or suspend your account immediately, without
              prior notice, for conduct that we believe violates these Terms or
              is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">6. Limitation of Liability</h5>
            <p className="text-muted-foreground">
              Riskless shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use of or inability to use the service.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">7. Changes to Terms</h5>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will
              provide notice of significant changes. Your continued use of the
              service after changes constitutes acceptance.
            </p>
          </section>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">
            Effective Date: {new Date().toLocaleDateString()}
          </h4>

          <section>
            <h5 className="font-semibold mb-2">1. Information We Collect</h5>
            <p className="text-muted-foreground mb-2">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Name and contact information (email, phone)</li>
              <li>Account credentials</li>
              <li>Profile information and preferences</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section>
            <h5 className="font-semibold mb-2">
              2. How We Use Your Information
            </h5>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Personalize your experience</li>
            </ul>
          </section>

          <section>
            <h5 className="font-semibold mb-2">3. Information Sharing</h5>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share
              information:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect the rights and safety of our users</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section>
            <h5 className="font-semibold mb-2">4. Data Security</h5>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">5. Your Rights</h5>
            <p className="text-muted-foreground">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h5 className="font-semibold mb-2">6. Cookies and Tracking</h5>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to collect information
              about your browsing activities. You can control cookies through
              your browser settings.
            </p>
          </section>

          <section>
            <h5 className="font-semibold mb-2">7. Contact Us</h5>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please
              contact us at privacy@riskless.com.
            </p>
          </section>
        </div>
      </Modal>
    </>
  );
}
