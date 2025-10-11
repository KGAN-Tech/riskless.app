import { LoginForm } from "../../../components/organisms/forms/login.form";
import { Shield, Heart, Users } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            Riskless
          </div>
          <nav className="hidden sm:flex gap-6 text-sm font-medium">
            <a href="/" className="hover:text-primary transition">
              Home
            </a>
            <a href="/about" className="hover:text-primary transition">
              About Us
            </a>
            <a href="/contact" className="hover:text-primary transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-1 container mx-auto px-6 py-12 items-center gap-12">
        {/* Left Side - Marketing (hidden on small screens) */}
        <div className="hidden lg:flex flex-1 flex-col space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome back to your{" "}
            <span className="text-primary">risk-free journey</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Access your secure dashboard, manage your information safely, and
            stay protected with Riskless — your trusted safety companion.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span>Advanced protection and secure login</span>
            </li>
            <li className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <span>Connect with verified professionals</span>
            </li>
            <li className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary" />
              <span>Monitor your well-being with confidence</span>
            </li>
          </ul>
        </div>

        {/* Right Side - Login Card (always visible) */}
        <div className="flex-1 flex justify-center">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © 2024 Riskless. All rights reserved. &nbsp;|&nbsp;
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>{" "}
        &nbsp;|&nbsp;
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
