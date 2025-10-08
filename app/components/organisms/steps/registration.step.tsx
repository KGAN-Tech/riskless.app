import { FormMapper } from "@/components/helper/form.mapper";
import { OPTIONS } from "@/configuration/options.config";
import { useEffect, useRef, useState } from "react";

interface RegistrationStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  step?: number;
}

export const RegistrationStep = ({
  formData,
  setFormData,
  step,
}: RegistrationStepProps) => {
  const { STUDENT } = OPTIONS();
  const [capturingIndex, setCapturingIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start/stop camera when a dependent capture is initiated
  useEffect(() => {
    if (capturingIndex !== null) {
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
          // Optionally, show a toast or alert
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: any) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturingIndex]);

  const handleDependentCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || capturingIndex === null) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob: any) => {
      if (blob) {
        const file = new File([blob], `dependent-${capturingIndex}.png`, {
          type: "image/png",
        });

        setFormData((prev: any) => {
          const newDependents = [...prev.dependents];
          newDependents[capturingIndex] = {
            ...newDependents[capturingIndex],
            image: file,
            // Create a preview URL to display the image immediately
            imagePreview: URL.createObjectURL(file),
          };
          return { ...prev, dependents: newDependents };
        });

        // Turn off camera and close capture UI
        stream?.getTracks().forEach((track: any) => track.stop());
        setCapturingIndex(null);
      }
    }, "image/png");
  };

  // Handler to add a new dependent
  const handleAddDependent = () => {
    setFormData((prev: any) => ({
      ...prev,
      dependents: [...(prev.dependents || []), { id: Date.now() }],
    }));
  };

  const handleRemoveDependent = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      dependents: prev.dependents.filter((_: any, i: number) => i !== idx),
    }));
  };

  return (
    <>
      {step === 1 && (
        <div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
              Personal Information
            </h1>
          </div>
          {/* <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-gray-400 text-white py-2 px-4 w-fit rounded-t-lg ">
              
            </h1>
          </div> */}
          <FormMapper
            title="Client Type"
            description=""
            placeholder="Select Client Type"
            value={formData.type || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                type: value,
              })
            }
            options={[
              { value: "patient_member", label: "Member" },
              { value: "patient_dependent", label: "Dependent" },
            ]}
            required={true}
            fieldType="dropdown"
            inputTextCase="uppercase"
          />
          <FormMapper
            title="PhilHealth Number (Optional)"
            description=""
            placeholder="Enter PhilHealth Number"
            value={
              formData.identifications.find(
                (i: any) => i.type === "philhealth_identification_number"
              )?.value || ""
            }
            onChange={(value) =>
              setFormData({
                ...formData,
                identifications: formData.identifications.map((i: any) =>
                  i.type === "philhealth_identification_number"
                    ? { ...i, value }
                    : i
                ),
              })
            }
            required={false}
            fieldType="philhealth-number"
            inputTextCase="uppercase"
          />
          <FormMapper
            title="Last Name"
            description=""
            placeholder="Enter Last Name"
            value={formData.lastName || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                lastName: value,
              })
            }
            required={true}
            fieldType="name"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="First Name"
            description=""
            placeholder="Enter First Name"
            value={formData.firstName || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                firstName: value,
              })
            }
            required={true}
            fieldType="name"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="Middle Name (Optional)"
            description=""
            placeholder="Enter Middle Name"
            value={formData.middleName || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                middleName: value,
              })
            }
            required={false}
            fieldType="name"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="Extension Name (Optional)"
            description=""
            placeholder="Enter Extension Name"
            value={formData.extensionName || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                extensionName: value,
              })
            }
            otherValue={
              formData.extensionName === "other" ? formData.extensionName : ""
            }
            onOtherChange={(value) =>
              setFormData({
                ...formData,
                extensionName: value,
              })
            }
            options={[
              { value: "N/A", label: "None" },
              { value: "Jr.", label: "Jr." },
              { value: "Sr.", label: "Sr." },
              { value: "II", label: "II" },
              { value: "III", label: "III" },
              { value: "IV", label: "IV" },
              { value: "V", label: "V" },
              { value: "VI", label: "VI" },
              { value: "VII", label: "VII" },
              { value: "VIII", label: "VIII" },
              { value: "IX", label: "IX" },
              { value: "X", label: "X" },
              { value: "other", label: "Other" },
            ]}
            required={false}
            fieldType="dropdown"
          />

          <FormMapper
            title="Current Address"
            description=""
            placeholder=""
            value={formData.addresses[0] || ""}
            onChange={(value) =>
              setFormData((prev: any) => {
                const existingIndex = prev.addresses.findIndex(
                  (addr: any) => addr.type === value.type
                );

                if (existingIndex !== -1) {
                  // Overwrite the existing address with the same type
                  const updatedAddresses = [...prev.addresses];
                  updatedAddresses[existingIndex] = value;

                  return {
                    ...prev,
                    addresses: updatedAddresses,
                  };
                } else {
                  // Add new address if type not found
                  return {
                    ...prev,
                    addresses: [...prev.addresses, value],
                  };
                }
              })
            }
            required={true}
            fieldType="address-current"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="Sex (Biological)"
            description=""
            placeholder="Select Sex (Biological)"
            value={formData.sex || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                sex: value,
              })
            }
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            required={true}
            fieldType="dropdown"
          />

          <FormMapper
            title="Birthday"
            description=""
            placeholder="Enter Birthday"
            value={formData.birthDate || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                birthDate: value,
              })
            }
            required={true}
            fieldType="birthDate"
            inputTextCase="uppercase"
          />
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
              Dependents
            </h1>
          </div>
          {/* Dependents Section */}
          <div className="mt-6">
            {formData.dependents.length > 0 &&
              formData.dependents.map((dep: any, idx: number) => (
                <div
                  key={idx}
                  className="mb-4 p-4 border border-gray-300 rounded bg-gray-50 relative"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
                    onClick={() => handleRemoveDependent(idx)}
                    aria-label="Remove dependent"
                  >
                    ×
                  </button>
                  <h2 className="font-semibold mb-2">
                    Dependent Form {idx + 1}
                  </h2>

                  {/* --- INLINE Dependent Image Capture UI --- */}
                  <div className="p-6 border-gray-300 rounded bg-white my-4">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      Dependent's Profile Image
                    </h2>
                    {capturingIndex === idx ? (
                      // SHOW CAMERA
                      <div className="flex flex-col items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          className="rounded-full border object-cover"
                          style={{
                            width: 240,
                            height: 240,
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleDependentCapture}
                          >
                            Capture
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            onClick={() => {
                              stream
                                ?.getTracks()
                                .forEach((track) => track.stop());
                              setCapturingIndex(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // SHOW PREVIEW OR INITIAL BUTTON
                      <div className="flex flex-col items-center justify-center">
                        {dep.imagePreview ? (
                          <>
                            <img
                              src={dep.imagePreview}
                              alt={`Dependent ${idx + 1}`}
                              className="rounded-full border object-cover"
                              style={{
                                width: 240,
                                height: 240,
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="ml-0 mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={() => setCapturingIndex(idx)}
                            >
                              Retake
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <div
                              className="rounded-full border-2 border-dashed bg-gray-100 flex items-center justify-center text-gray-400"
                              style={{
                                width: 240,
                                height: 240,
                              }}
                            >
                              No Image
                            </div>
                            <button
                              type="button"
                              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => setCapturingIndex(idx)}
                            >
                              Capture Image
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* --- End Image Capture UI --- */}

                  {/* Placeholder: Replace with actual dependent form fields */}

                  <FormMapper
                    key={idx}
                    title="Relationship"
                    description=""
                    placeholder="Select Relationship"
                    value={formData.dependents[idx]?.relationship || ""}
                    onChange={(value) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, relationship: value } : d
                        ),
                      }));
                    }}
                    options={[
                      { value: "spouse", label: "Spouse" },
                      { value: "child", label: "Child" },
                      { value: "parent", label: "Parent" },
                      { value: "sibling", label: "Sibling" },
                      { value: "other", label: "Other" },
                    ]}
                    required={true}
                    fieldType="dropdown"
                  />

                  <FormMapper
                    title="PhilHealth Number (Optional)"
                    description=""
                    placeholder="Enter PhilHealth Number"
                    value={formData.dependents[idx].philHealthIdNumber || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, philHealthIdNumber: value } : d
                        ),
                      }))
                    }
                    required={false}
                    fieldType="philhealth-number"
                    inputTextCase="uppercase"
                  />
                  <FormMapper
                    title="Last Name"
                    description=""
                    placeholder="Enter Last Name"
                    value={dep.lastName || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, lastName: value } : d
                        ),
                      }))
                    }
                    required={true}
                    fieldType="name"
                    inputTextCase="uppercase"
                  />
                  <FormMapper
                    title="First Name"
                    description=""
                    placeholder="Enter First Name"
                    value={formData.dependents[idx].firstName || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, firstName: value } : d
                        ),
                      }))
                    }
                    required={true}
                    fieldType="name"
                    inputTextCase="uppercase"
                  />
                  <FormMapper
                    title="Middle Name  (Optional)"
                    description=""
                    placeholder="Enter Middle Name"
                    value={formData.dependents[idx].middleName || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, middleName: value } : d
                        ),
                      }))
                    }
                    required={false}
                    fieldType="name"
                    inputTextCase="uppercase"
                  />
                  <FormMapper
                    title="Extension Name  (Optional)"
                    description=""
                    placeholder="Enter Extension Name"
                    value={formData.dependents[idx].extensionName || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, extensionName: value } : d
                        ),
                      }))
                    }
                    otherValue={formData.extensionName || ""}
                    onOtherChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, extensionName: value } : d
                        ),
                      }))
                    }
                    options={[
                      { value: "N/A", label: "None" },
                      { value: "Jr.", label: "Jr." },
                      { value: "Sr.", label: "Sr." },
                      { value: "II", label: "II" },
                      { value: "III", label: "III" },
                      { value: "IV", label: "IV" },
                      { value: "V", label: "V" },
                      { value: "VI", label: "VI" },
                      { value: "VII", label: "VII" },
                      { value: "VIII", label: "VIII" },
                      { value: "IX", label: "IX" },
                      { value: "X", label: "X" },
                      { value: "other", label: "Other" },
                    ]}
                    required={false}
                    fieldType="dropdown"
                  />

                  <FormMapper
                    title="Sex (Biological)"
                    description=""
                    placeholder="Select Sex (Biological)"
                    value={formData.dependents[idx].gender || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, gender: value } : d
                        ),
                      }))
                    }
                    options={[
                      { value: "male", label: "Male" },
                      {
                        value: "female",
                        label: "Female",
                      },
                    ]}
                    required={true}
                    fieldType="dropdown"
                  />
                  <FormMapper
                    title="Birthday"
                    description=""
                    placeholder="Enter Birthday"
                    value={formData.dependents[idx].birthDate || ""}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        dependents: prev.dependents.map((d: any, i: number) =>
                          i === idx ? { ...d, birthDate: value } : d
                        ),
                      }))
                    }
                    required={true}
                    fieldType="birthDate"
                    inputTextCase="uppercase"
                  />
                </div>
              ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleAddDependent}
            >
              + Add dependent
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
              Account Information
            </h1>
          </div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-gray-400 text-white py-2 px-4 w-fit rounded-t-lg ">
              Contact & Security
            </h1>
          </div>
          <FormMapper
            title="Mobile Number"
            description=""
            placeholder="Enter Mobile Number"
            value={
              formData.contacts.find((c: any) => c.type === "mobile_number")
                ?.value || ""
            }
            onChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                contacts: prev.contacts.map((c: any) =>
                  c.type === "mobile_number"
                    ? {
                        ...c,
                        value,
                        provider: value.startsWith("639")
                          ? "globe/smart"
                          : "unknown",
                      }
                    : c
                ),
              }))
            }
            required={true}
            fieldType="phoneNumber"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="Email"
            description=""
            placeholder="Enter Email"
            value={
              formData.contacts.find((c: any) => c.type === "email")?.value ||
              ""
            }
            onChange={(value) => {
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

              setFormData((prev: any) => ({
                ...prev,
                contacts: prev.contacts.map((c: any) =>
                  c.type === "email" ? { ...c, value } : c
                ),
                // optional: if you want to keep validation flags, you can store them separately
                emailValid: isValidEmail,
              }));
            }}
            required={true}
            fieldType="email"
            inputTextCase="uppercase"
          />

          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-gray-400 text-white py-2 px-4 w-fit rounded-t-lg ">
              Login Credentials
            </h1>
          </div>
          <FormMapper
            title="Username"
            description=""
            placeholder="Enter Username"
            value={formData.userName || ""}
            onChange={(value) =>
              setFormData({
                ...formData,
                userName: value,
              })
            }
            required={true}
            fieldType="short-text"
          />
          {/* 
          <FormMapper
            title="Enter 6-Digit MPIN (Mobile Personal Identification Number)"
            description=""
            placeholder="Enter 6-Digit MPIN"
            value={
              formData.passwords.find((p: any) => p.type === "mpin6char")
                ?.value || ""
            }
            onChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                passwords: prev.passwords.map((p: any) =>
                  p.type === "mpin6char" ? { ...p, value } : p
                ),
              }))
            }
            required={true}
            fieldType="mpin-6"
            inputTextCase="uppercase"
          /> */}

          <FormMapper
            title="Password"
            description=""
            placeholder="Enter Password"
            value={
              formData.passwords.find((p: any) => p.type === "text")?.value ||
              ""
            }
            onChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                passwords: prev.passwords.map((p: any) =>
                  p.type === "text" ? { ...p, value } : p
                ),
              }))
            }
            required={true}
            fieldType="password"
          />
        </div>
      )}
    </>
  );
};
