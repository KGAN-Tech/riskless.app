import { Button } from "@/components/atoms/button";
import Stepper from "@/components/molecules/navigation/stepper";
import RegistrationConfirmationModal from "@/components/organisms/modal/registration.modal";
import { PKRFPreview } from "@/components/organisms/previews/pkrf.preview";
import { RegistrationStep } from "@/components/organisms/steps/registration.step";
import { CONTENT, LANG } from "@/configuration/app.config";
import { usePKRFForm } from "@/hooks/user.pkrf.form";
import { useRegister } from "@/hooks/use.register";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { linkService } from "@/services/link.service";
import PrivacyPolicyModal from "~/app/components/organisms/modal/privacy.modal";

export default function UserRegistrationPage() {
  const { formData, setFormData } = usePKRFForm();
  const { isLoading: isSubmitting, handleRegister } = useRegister();
  const { name: linkSlug } = useParams(); // Get the link slug from URL params
  const [lang, setLang] = useState<"en" | "tl">("en");
  const content = CONTENT(lang);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Link state
  const [linkData, setLinkData] = useState<any>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  // Fetch link data when component mounts if linkSlug exists
  useEffect(() => {
    console.log("Registration page loaded with linkSlug:", linkSlug);

    const fetchLinkData = async () => {
      if (!linkSlug) {
        console.log("No linkSlug found, skipping link data fetch");
        return;
      }

      console.log("Fetching link data for slug:", linkSlug);
      try {
        setLinkLoading(true);
        const response = await linkService.getBySlug(linkSlug);
        if (response?.data) {
          setLinkData(response.data);
          setFormData((prev: any) => ({
            ...prev,
            facilityId: response.data.facilityId || "",
          }));
          console.log("Link data fetched:", response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch link data:", error);
        if (error?.status === 404) {
          toast.error("Registration link not found");
          navigate("/register"); // Redirect to normal registration
        } else if (error?.status === 410) {
          toast.error("This registration link has expired");
          navigate("/register"); // Redirect to normal registration
        } else {
          toast.error("Failed to load registration link");
        }
      } finally {
        setLinkLoading(false);
      }
    };

    fetchLinkData();
  }, [linkSlug, navigate]);

  const handleSubmit = async () => {
    // Pass linkData.id as linkId if available
    await handleRegister(formData, linkData?.id);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 0);
  }, [step]);

  // Start/stop camera when entering/leaving step 2 (previously step 4)
  useEffect(() => {
    if (step === 2 && !capturedImage) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          toast.error(`Camera error: ${err.message}`);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [step, capturedImage]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and then to File
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "profile.png", { type: "image/png" });

        console.log("file", file);

        // Preview the image
        setCapturedImage(URL.createObjectURL(file));

        // Save the file in formData
        setFormData((prev: any) => ({
          ...prev,
          image: file,
        }));
        // Stop all video tracks (turn off webcam)
        stream?.getTracks().forEach((track) => track.stop());
      }
    }, "image/png");
  };

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const isValidStep = (step: number) => {
    if (step === 1) {
      return !!(formData.type && formData.sex);
    }
    if (step === 2) {
      return !!capturedImage;
    }
    if (step === 3) {
      if (formData.dependents.length === 0) {
        return true; // Step 2 is optional if no dependents
      } else {
        return formData.dependents.every(
          (dependent: any) =>
            dependent.lastName &&
            dependent.firstName &&
            dependent.gender &&
            dependent.birthDate &&
            dependent.relationship &&
            dependent.image instanceof File // Check if image is actually a File
        );
      }
    }

    if (step === 4) {
      const emailContact = formData.contacts.find((c) => c.type === "email");
      const mobileContact = formData.contacts.find(
        (c) => c.type === "mobile_number"
      );

      const email = emailContact?.value || "";
      const mobile = mobileContact?.value || "";

      // Example: return true only if mobile exists and is valid
      return !!mobile && (!email || (email && /\S+@\S+\.\S+/.test(email)));
    }

    if (step === 5) {
      return true;
    }

    return false;
  };

  const errorDisplay = () => {
    const errors: string[] = [];

    if (step === 1) {
      if (!formData.sex) {
        errors.push("Member Sex (Biological) is required.");
      }
      if (!formData.type) {
        errors.push("Member Type is required.");
      }

      const currentAddress = formData.addresses?.[0] || {};

      if (!currentAddress?.barangay?.value) {
        errors.push("Member Current Barangay is required.");
      }
      if (!currentAddress?.city?.value) {
        errors.push("Member Current City is required.");
      }
      if (!currentAddress?.province?.value) {
        errors.push("Member Current Province is required.");
      }
    }

    if (step === 2) {
      if (!capturedImage) errors.push("Please capture an image to continue.");
    }
    if (step === 3) {
      formData.dependents.forEach((dep: any, idx: number) => {
        if (!dep.relationship) {
          errors.push(`Relationship is required for dependent #${idx + 1}.`);
        }
        if (!dep.lastName) {
          errors.push(`Last Name is required for dependent #${idx + 1}.`);
        }
        if (!dep.firstName) {
          errors.push(`First Name is required for dependent #${idx + 1}.`);
        }
        if (!dep.gender) {
          errors.push(
            `Sex (Biological) is required for dependent #${idx + 1}.`
          );
        }
        if (!dep.birthDate) {
          errors.push(`Birthday is required for dependent #${idx + 1}.`);
        }
        if (!(dep.image instanceof File)) {
          errors.push(`Please capture an image for dependent #${idx + 1}.`);
        }
      });
    }

    if (step === 4) {
      const emailContact = formData.contacts.find((c) => c.type === "email");
      const mobileContact = formData.contacts.find(
        (c) => c.type === "mobile_number"
      );

      if (emailContact?.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailContact.value)) {
          errors.push("The email you entered is not valid.");
        }
      }

      if (!mobileContact?.value || mobileContact.value.length < 10) {
        errors.push("The mobile number is not valid.");
      }
    }

    if (errors.length === 0) return null;

    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4"
        role="alert"
      >
        <div className="font-bold mb-2">
          Oops! Some required information is missing. Please complete the
          following:
        </div>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      </div>
    );
  };

  const isDependentFlow = formData.type === "patient_dependent";

  const stepsConfig = [
    { label: "Personal Info", step: 1 },
    { label: "Profile Image", step: 2 },
    ...(!isDependentFlow ? [{ label: "Dependents", step: 3 }] : []),
    { label: "Account", step: 4 },
    { label: "Review", step: 5 },
  ];

  const stepLabels = stepsConfig.map((s) => s.label);
  const currentStepInfo = stepsConfig.find((s) => s.step === step);
  const displayStepIndex = stepLabels.indexOf(currentStepInfo?.label || "");

  return (
    <>
      <div
        className={`relative max-w-4xl mx-auto w-full h-screen flex flex-col px-4 sm:px-6 lg:px-8 ${
          isPrivacyModalOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="sticky top-0 z-40 pt-4 pb-2 bg-white">
          <div className="shadow-md border border-gray-100 mb-2 bg-white rounded-t-lg">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img src="/FTCC LOGO.png" alt="FTCC Logo" className="h-15" />
              </div>
              <div className="flex items-center space-x-6">
                <select
                  className="border border-gray-300 rounded-md p-1 text-sm"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "en" | "tl")}
                  aria-label="Select Language"
                >
                  {LANG.map(({ code, label }) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title + Toggleable Description */}
            <div className="p-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                {content.PKRF.TITLE}
              </h3>

              {/* Show link info if available */}
              {linkData && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Registration via:</strong>{" "}
                    {linkData.facility?.name || linkData.slug}
                    {linkData.createdBy && (
                      <span className="ml-2">
                        (Invited by: {linkData.createdBy.firstName}{" "}
                        {linkData.createdBy.lastName})
                      </span>
                    )}
                  </p>
                </div>
              )}

              <button
                className="text-sm text-blue-600 hover:underline mt-1 flex items-center space-x-1"
                onClick={() => setShowDescription(!showDescription)}
              >
                <span>
                  {showDescription ? "Hide Instructions" : "Show Instructions"}
                </span>
                {showDescription ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showDescription && (
                <div className="mt-2 space-y-1">
                  {content.PKRF.INSTRUCTION_VALUE.map((text, index) => (
                    <p key={index} className="text-sm text-gray-500 italic">
                      {text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <Stepper.Default step={displayStepIndex + 1} steps={stepLabels} />
          </div>
        </div>

        {isSubmitting || linkLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow space-y-4 py-10">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-gray-700 font-medium text-center">
              {linkLoading
                ? "Loading registration details..."
                : "Submitting your registration. Please wait..."}
            </p>
          </div>
        ) : (
          <div ref={containerRef} style={{ height: "auto", overflowY: "auto" }}>
            <div className="my-4 py-4 mb-20">
              <div className="space-y-3">
                {step === 1 && (
                  <RegistrationStep
                    formData={formData}
                    setFormData={setFormData}
                    step={1}
                  />
                )}
                {step === 2 && (
                  <div className="p-6 border border-gray-300 rounded bg-white">
                    <h2 className="text-lg font-semibold mb-4">
                      Capture Your Profile Image
                    </h2>
                    {!capturedImage ? (
                      <div className="flex flex-col items-center justify-center">
                        <video
                          ref={videoRef}
                          width={320}
                          height={240}
                          autoPlay
                          className="rounded-full border object-cover"
                          style={{
                            width: 240,
                            height: 240,
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button
                            type="button"
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleCapture}
                          >
                            Capture
                          </button>
                        </div>
                        <canvas
                          ref={canvasRef}
                          width={320}
                          height={240}
                          style={{ display: "none" }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center mt-4">
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="rounded-full border object-cover"
                          style={{
                            width: 240,
                            height: 240,
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          className="ml-0 mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => setCapturedImage(null)}
                        >
                          Retake
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {step === 3 && (
                  <>
                    {(formData.dependents?.length ?? 0) === 0 && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Adding dependents is{" "}
                        <span className="font-semibold">optional</span>.
                      </div>
                    )}
                    <RegistrationStep
                      formData={formData}
                      setFormData={setFormData}
                      step={2}
                    />
                  </>
                )}
                {step === 4 && (
                  <RegistrationStep
                    formData={formData}
                    setFormData={setFormData}
                    step={3}
                  />
                )}
                {step === 5 && (
                  <PKRFPreview
                    formData={formData}
                    setFormData={setFormData}
                    capturedImage={capturedImage}
                  />
                )}

                <div>{!isValidStep(step) && errorDisplay()}</div>

                <div className="flex sm:flex-row justify-center sm:justify-end mt-6 gap-3">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      className="w-30 h-10"
                      onClick={() => {
                        if (isDependentFlow && step === 4) {
                          setStep(2); // Go from Account (4) back to Image (2)
                        } else {
                          setStep(step - 1);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  )}

                  {step < 5 && isValidStep(step) && (
                    <Button
                      className="w-30 h-10 bg-blue-500 border text-white  hover:bg-blue-400"
                      onClick={() => {
                        if (!isValidStep(step)) return;
                        if (isDependentFlow && step === 2) {
                          setStep(4); // Skip to Account info
                        } else {
                          setStep(step + 1);
                        }
                      }}
                      disabled={!isValidStep(step) || isSubmitting}
                    >
                      Next
                    </Button>
                  )}

                  {step === 5 && (
                    <Button
                      onClick={() => setShowModal(true)}
                      className="w-30 h-10 bg-blue-500 border text-white  hover:bg-blue-400"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <RegistrationConfirmationModal
        showModal={showModal}
        setShowModal={setShowModal}
        onConfirm={handleConfirm}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onAgree={() => setIsPrivacyModalOpen(false)}
        onDisagree={() => navigate("/")}
      />
    </>
  );
}
