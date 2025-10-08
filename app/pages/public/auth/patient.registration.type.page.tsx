import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function UserTypePage() {
  // const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const getview = params.get("view");

  //   if (getview === "info") {
  //     setOpen(true);
  //   }
  // }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Logo Section */}
          <div className="text-center mb-8">
            {/* <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <img
                src="/ftcc-logo.png?height=40&width=40"
                alt="Company Logo"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
            </div> */}
            <div className="h-34 w-64 mx-auto mb-2  rounded-2xl flex items-center justify-center">
              <img
                src="/ftcc-logo.png"
                alt="Company Logo"
                // width={100}
                // height={100}
                className=""
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Good Day!
            </h1>
            <p className="text-slate-600">Select your Registartion Type</p>
          </div>

          {/* Buttons Section */}
          <div className="space-y-4">
            <Button
              onClick={() => {
                navigate("/register");
              }}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Manual
            </Button>
            <Button
              onClick={() => {
                navigate("/register/ocr");
              }}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              ID Card
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500">Version</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Additional Options */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">beta.1.0.0</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>By continuing, you agree to our</p>
          <div className="flex justify-center gap-4 mt-1">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
