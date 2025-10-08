import { Button } from "@/components/atoms/button";
import { authService } from "@/services/auth.service";
import { uselocalStorage } from "@/utils/localstorage.utils";
import { decodeEncryptedToken } from "@/utils/token.encyption";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function RegistrationSuccessPage() {
  const [accountData, setAccountData] = useState<any>(null);
  const navigate = useNavigate();

  // Get URL query params once
  const rawToken = new URLSearchParams(window.location.search).get("tkn");
  const rawType = new URLSearchParams(window.location.search).get("type");
  const type = rawType as "pkrf" | "fpe" | null;

  useEffect(() => {
    const token = rawToken ? decodeURIComponent(rawToken) : null;

    if (token && type) {
      decodeEncryptedToken(token, type)
        .then((data) => setAccountData(data))
        .catch((err) => {
          console.error("Failed to decode token", err);
          setAccountData({ error: "Invalid or expired token" });
        });
    } else {
      setAccountData({ error: "Missing or invalid parameters." });
    }
  }, [rawToken, type]);

  // const handleProceed = async () => {
  //   console.log("Account data:", accountData); // Debug log
  //   console.log("Type:", type); // Debug log

  //   try {
  //     navigate("/");
  //     // if (type === "pkrf" && accountData?.mobileNumber && accountData?.mpin) {
  //     //   console.log("Attempting auto-login with MPIN"); // Debug log
  //     //   const res = await authService.login({
  //     //     identifier: accountData.mobileNumber,
  //     //     password: accountData.mpin,
  //     //     passwordType: "mpin6char", // Add missing passwordType
  //     //   });

  //     //   uselocalStorage.set("auth", {
  //     //     user: res.user,
  //     //     token: res.token,
  //     //   });

  //     //   navigate("/"); // Navigate to existing dashboard route
  //     //   toast.success("Login successful.");
  //     // } else if (type === "pkrf" && accountData?.mobileNumber) {
  //     //   // Fallback: Skip auto-login and just navigate to dashboard
  //     //   console.log("Skipping auto-login, navigating to dashboard"); // Debug log
  //     //   navigate("/dashboard");
  //     //   toast.success("Registration complete! Please login when ready.");
  //     // } else if (type === "fpe") {
  //     //   uselocalStorage.remove("fpeFormData");
  //     //   uselocalStorage.remove("pkrfFormData");
  //     //   navigate("/dashboard"); // Navigate to dashboard instead of non-existent route
  //     // } else {
  //     //   console.log("Fallback: navigating to login"); // Debug log
  //     //   navigate("/login");
  //     //   toast.success("Registration complete! Please login with your credentials.");
  //     // }
  //   } catch (e) {
  //     console.error("Auto-login failed:", e);
  //     toast.error("Registration complete! Please login manually.");
  //     navigate("/"); // Navigate to login page on failure
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="absolute inset-0"
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#22c55e"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <svg width="50%" height="50%" viewBox="0 0 52 52">
                <motion.path
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14,27 L22,35 L38,15"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Congratulations!
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {type === "pkrf"
              ? "You have successfully registered to FTCC and PKRF."
              : "You have successfully registered to FPE (First Patient Encounter) Form."}
          </p>
          <p className="mt-2 text-gray-500">
            Your registration has been confirmed and processed successfully.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="pt-6"
        >
          <div className="flex flex-col gap-4 flex-1">
            {/* <Button
              onClick={handleProceed}
              className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700"
            >
              Proceed
            </Button> */}

            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
