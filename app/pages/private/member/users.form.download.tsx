import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/use.token";
import { fpeService } from "~/app/configuration/others/fpe.mockdata";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import AOS from "aos";
import "aos/dist/aos.css";

export default function UserFormPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const getUserData = getUser();
    setUser(getUserData);
  }, []);

  const fullName = `${user?.person?.firstName} ${
    user?.person?.middleName || ""
  } ${user?.person?.lastName} ${user?.person?.suffix || ""}`.trim();

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlePKRF = async () => {
    if (!user?.forms?.pkrfId) {
      setError("PKRF form not found. Please complete your registration first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Your PKRF export logic here
      // const response = await pkrfService.exportPKRF(user.forms.pkrfId);
      // if (response && response.data) {
      //   const fileName = `PKRF_${fullName.replace(/\s+/g, "_")}_${formatDate()}.docx`;
      //   downloadBase64Docx(response.data, fileName);
      // } else {
      //   setError("Failed to generate PKRF form. Please try again.");
      // }
      setError("PKRF export functionality not implemented yet");
    } catch (error) {
      setError("Error generating PKRF form. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFPE = async () => {
    if (!user?.forms?.fpeId) {
      setError("FPE form not found. Please complete your registration first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use fpeService.exportFPE instead of FPEService.exportFPE
      const response = await fpeService.exportFPE(user.forms.fpeId);

      // Since we're working with mock data, response will be a Blob directly
      const fileName = `FPE_${fullName.replace(
        /\s+/g,
        "_"
      )}_${formatDate()}.pdf`;

      // Create download link for the blob
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error generating FPE form. Please try again later.");
      console.error("FPE export error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the downloadBase64Docx function since we're working with Blobs directly

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Headerbackbutton title="Download Forms" />

      {/* Error Message */}
      {error && (
        <div
          className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div
        className="text-center px-4 py-8"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <Badge variant="secondary" className="mb-4">
          <Users className="w-4 h-4 mr-2" />
          Membership Portal
        </Badge>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Membership Forms & Documents
        </h1>
        <p className="text-sm text-gray-600">
          Access and download the required membership forms. Please complete all
          necessary documentation to proceed with your membership application.
        </p>
      </div>

      {/* Forms Section */}
      <div className="px-4 space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PKRF Form Card */}
          <Card
            className="bg-white rounded-2xl shadow-md border-0"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-blue-600" />
                <Badge variant="outline">Required</Badge>
              </div>
              <CardTitle className="text-lg">PKRF Form</CardTitle>
              <CardDescription>Konsulta Registration Form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Purpose:</strong> This form registers members and
                  dependents under the PhilHealth Konsulta Program and gathers
                  baseline information.
                </p>
                <p>
                  <strong>Contents:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>PhilHealth Identification Number (PIN)</li>
                  <li>Demographic and contact details</li>
                  <li>Member type classification</li>
                  <li>Consent and declaration sections</li>
                </ul>
                <p>
                  <strong>Instructions:</strong> Fill out completely and submit
                  to your Konsulta provider. A valid PIN is required.
                </p>
              </div>
              <Button
                onClick={handlePKRF}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download PKRF Form
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FPE Form Card */}
          <Card
            className="bg-white rounded-2xl shadow-md border-0"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-green-600" />
                <Badge variant="outline">Required</Badge>
              </div>
              <CardTitle className="text-lg">FPE Form</CardTitle>
              <CardDescription>
                Health Screening / First Patient Encounter Form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Purpose:</strong> Used during the first patient
                  encounter to assess current health status, identify risk
                  factors, and establish a medical baseline.
                </p>
                <p>
                  <strong>Contents:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Vital signs (BP, HR, weight, height, BMI)</li>
                  <li>Medical and family history</li>
                  <li>Lifestyle habits (smoking, alcohol, diet, activity)</li>
                  <li>Initial findings and health education notes</li>
                </ul>
                <p>
                  <strong>Instructions:</strong> Completed by the attending
                  provider during the member's first visit. Be honest and
                  accurate for effective care.
                </p>
              </div>
              <Button
                onClick={handleFPE}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download FPE Form
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card
          className="bg-amber-50 border-amber-200 rounded-2xl shadow-md border-0"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800 text-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 space-y-3">
            <div className="pt-2 border-t border-amber-200">
              <p className="text-sm">
                <strong>Need Help?</strong> Contact our membership support team
                at{" "}
                <a href="mailto:membership@company.com" className="underline">
                  membership@company.com
                </a>{" "}
                or call (555) 123-4567 for assistance with form completion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
