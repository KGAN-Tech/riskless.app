import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function UserLegalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 text-white overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">FTCC Health Tech</h1>
                  <p className="text-emerald-100 text-lg leading-relaxed">
                    Welcome to our health community
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-5 h-5 text-blue-200 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        As mandated by the{" "}
                        <span className="font-semibold text-white">
                          Universal Health Care (UHC) Act
                        </span>
                        , we are happy to be your{" "}
                        <span className="font-semibold text-white">
                          PhilHealth-accredited Konsulta Package Provider (KPP)
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-200" />
                    <h3 className="font-semibold text-white">
                      Konsulta Onboarding Process
                    </h3>
                  </div>

                  <div className="space-y-3 ml-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <span className="text-emerald-100">
                        Konsulta Registration
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <span className="text-emerald-100">
                        First Patient Encounter (FPE)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4">
                  <p className="text-emerald-100 italic text-lg">
                    {"Let's start your Konsulta journey today."}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border border-emerald-600"
                  size="lg"
                >
                  Fill Up The Form
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-emerald-700 text-sm">
              Secure • Confidential • PhilHealth Accredited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
