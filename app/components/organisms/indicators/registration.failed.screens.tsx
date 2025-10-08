import { Button } from "@/components/atoms/button";
import { decodeEncryptedToken } from "@/utils/token.encyption";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function RegistrationFailedPage() {
  const [errorData, setErrorData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("err");

    if (err) {
      decodeEncryptedToken(err, "pkrf")
        .then((decoded) => {
          console.log("Decoded:", decoded);
          setErrorData(decoded);
        })
        .catch((error) => {
          console.error("Token decode error:", error);
          setErrorData({ message: "Unknown error occurred." });
        });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Pure Animated X Mark */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {/* Circle Background */}
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
                  stroke="#ef4444"
                  strokeWidth="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#ef4444"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                />
              </svg>
            </motion.div>

            {/* X Mark */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <svg width="60%" height="60%" viewBox="0 0 60 60">
                {/* First stroke of X */}
                <motion.line
                  x1="15"
                  y1="15"
                  x2="45"
                  y2="45"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                />

                {/* Second stroke of X */}
                <motion.line
                  x1="45"
                  y1="15"
                  x2="15"
                  y2="45"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Registration Failed
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your registration to FTCC and PKRF was unsuccessful.
          </p>
          <p className="mt-2 text-gray-500">
            {errorData?.message ||
              "Please check your information and try again."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.5 }}
          className="pt-6 "
        >
          <div className="flex flex-col gap-4 flex-1">
            <Button
              onClick={() => {
                navigate(-1);
              }}
              className="px-8 py-6 text-lg bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>

            <Button
              onClick={() => {
                navigate("/");
              }}
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
