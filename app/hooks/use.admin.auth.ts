// use.admin.auth.ts
import { authService } from "@/services/auth.service";
import { uselocalStorage } from "@/utils/localstorage.utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function useAdminAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    username: string
  ) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await authService.login({
        identifier: username,
        password: password,
      });

      uselocalStorage.set("auth", {
        token: res.token,
        user: res.user,
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
}
