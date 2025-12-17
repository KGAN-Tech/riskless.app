import { authService } from "@/services/auth.service";
import { uselocalStorage } from "@/utils/localstorage.utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export function useAuth() {
  type AuthMethod = "text" | "mpin6char";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState<AuthMethod>("text");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const body = { identifier, password, passwordType };
      const res = await authService.login(body);

      uselocalStorage.set("auth", { token: res.token, user: res.user });
      toast.success("Login successful!");

      // Navigate based on role
      if (res.user?.role === "admin" || res.user?.role === "staff") {
        navigate("/");
      } else {
        navigate("/"); // default user dashboard
      }

      return true; // login success
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Login failed!");
      return false; // login failed
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    uselocalStorage.remove("auth");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return {
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
    logout,
  };
}
