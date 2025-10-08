import { PreviewFormMapper } from "@/components/helper/preview.form.mapper";
import { OPTIONS } from "@/configuration/options.config";

interface PreviewStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  capturedImage?: string | null;
}

export const PKRFPreview = ({
  formData,
  setFormData,
  capturedImage,
}: PreviewStepProps) => {
  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow">
      {capturedImage && (
        <div className="flex justify-center mb-6">
          <img
            src={capturedImage}
            alt="Your Profile"
            className="rounded-full border-4 border-blue-500 shadow-lg"
            style={{ width: 160, height: 160, objectFit: "cover" }}
          />
        </div>
      )}
      <h3 className="text-2xl font-semibold mt-4  py-2 text-primary">
        Review Your Information
      </h3>
      <p className=" mb-4 text-gray-500 text-sm italic">
        Please carefully review all the details you have entered before
        proceeding. Make sure everything is correct to avoid any errors.
      </p>
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Personal Information
      </h3>
      <PreviewFormMapper
        label="PhilHealth ID Number"
        value={
          formData.identifications.find(
            (id: any) => id.type === "philhealth_identification_number"
          )?.value || "---"
        }
        type="text"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      <PreviewFormMapper
        label="Full Name"
        value={
          [
            formData.firstName,
            formData.middleName,
            formData.lastName,
            formData.extensionName !== "N/A" ? formData.extensionName : "",
          ]
            .filter(Boolean)
            .join(" ")
            .trim() || "---"
        }
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase",
        }}
      />
      <PreviewFormMapper
        label="Sex (Biological)"
        value={formData.sex || "---"}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase",
        }}
      />
      <PreviewFormMapper
        label="Birthday"
        value={formData.birthDate || "---"}
        type="date"
        dateFormat="mm/dd/yyyy"
        dateFormatType="readable-1"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase",
        }}
      />
      <PreviewFormMapper
        label="Current Address"
        value={
          formData.addresses?.length > 0
            ? [
                formData.addresses[0]?.houseNo,
                formData.addresses[0]?.street,
                formData.addresses[0]?.barangay?.value,
                formData.addresses[0]?.city?.value,
                formData.addresses[0]?.province?.value,
                formData.addresses[0]?.country || "PHILIPPINES",
                formData.addresses[0]?.zipCode,
              ]
                .filter(Boolean)
                .join(" ")
            : "---"
        }
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase",
        }}
      />
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Account Information
      </h3>
      <PreviewFormMapper
        label="Mobile Number"
        value={
          formData.contacts.find((c: any) => c.type === "mobile_number")
            ?.value || "---"
        }
        type="text"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      <PreviewFormMapper
        label="Email"
        value={
          formData.contacts.find((c: any) => c.type === "email")?.value || "---"
        }
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase",
        }}
      />
      {/* MPIN */}
      <PreviewFormMapper
        label="Password"
        value={formData.passwords[0]?.value || "---"}
        type="security"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      {formData.type === "patient_member" &&
        formData.dependents?.length > 0 &&
        formData.dependents.some((dep: any) => dep.firstName) && (
          <>
            <h3 className="text-xl font-semibold my-4 border-b py-2 text-blue-800">
              Dependents Information
            </h3>
            {formData.dependents.map((dep: any, index: number) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50"
              >
                <h4 className="text-lg font-semibold mb-3 text-gray-700">
                  Dependent {index + 1}
                </h4>
                {dep.imagePreview && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={dep.imagePreview}
                      alt={`Dependent ${index + 1}`}
                      className="rounded-full border-2 border-blue-400 shadow-md object-cover"
                      style={{ width: 120, height: 120 }}
                    />
                  </div>
                )}
                <PreviewFormMapper
                  label="Relationship"
                  value={dep.relationship || "---"}
                  type="text"
                  className={{
                    container: "border-b border-gray-100 py-2",
                    value: "uppercase",
                  }}
                />
                <PreviewFormMapper
                  label="Full Name"
                  value={
                    `${dep.firstName ?? ""} ${dep.middleName ?? ""} ${
                      dep.lastName ?? ""
                    }${
                      dep.suffix && dep.suffix !== "N/A"
                        ? ", " + dep.suffix
                        : ""
                    }`
                      .replace(/\s+/g, " ")
                      .trim() || "---"
                  }
                  type="text"
                  className={{
                    container: "border-b border-gray-100 py-2",
                    value: "uppercase",
                  }}
                />
                <PreviewFormMapper
                  label="Sex (Biological)"
                  value={dep.gender || "---"}
                  type="text"
                  className={{
                    container: "border-b border-gray-100 py-2",
                    value: "uppercase",
                  }}
                />
                <PreviewFormMapper
                  label="Birthday"
                  value={dep.birthDate || "---"}
                  type="date"
                  dateFormat="mm/dd/yyyy"
                  dateFormatType="readable-1"
                  className={{
                    container: "border-b border-gray-100 py-2",
                    value: "uppercase",
                  }}
                />
              </div>
            ))}
          </>
        )}
    </div>
  );
};
