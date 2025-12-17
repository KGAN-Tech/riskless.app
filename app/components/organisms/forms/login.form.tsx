import { useAuth } from "~/app/hooks/use.auth";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    passwordType,
    setPasswordType,
    showPassword,
    setShowPassword,
    isLoading,
    handleLogin,
  } = useAuth();

  // active tab UI state
  const [activeMethod, setActiveMethod] = useState(passwordType);
  const [error, setError] = useState<string | null>(null); // <-- error state

  const handleAuthMethodChange = (method: "text" | "mpin6char") => {
    setPasswordType(method);
    setActiveMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // reset error before login

    try {
      const success = await handleLogin();
      if (!success) {
        setError("Invalid identifier/email or password."); // show error
      }
    } catch (err) {
      setError("Something went wrong. Please try again."); // fallback error
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-card rounded-2xl shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-center">Sign in to Riskless</h2>
      <p className="text-center text-muted-foreground text-sm">
        Access your personalized dashboard
      </p>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm text-center mb-2">{error}</div>
      )}

      {/* Identifier */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Identifier/Username
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Phone"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
        />
      </div>

      {/* Password / MPIN input */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {passwordType === "text" ? "Password" : "MPIN"}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              passwordType === "text" ? "Enter password" : "Enter 6-digit MPIN"
            }
            maxLength={passwordType === "mpin6char" ? 6 : undefined}
            className="w-full px-3 py-2 border rounded-lg pr-10 focus:outline-none focus:ring focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-2">
        New to Riskless?{" "}
        <a href="/register" className="text-primary hover:underline">
          Create an account
        </a>
      </div>
    </form>
  );
}
