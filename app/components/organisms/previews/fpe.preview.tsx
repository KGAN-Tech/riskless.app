import { PreviewFormMapper } from "@/components/helper/preview.form.mapper";
import { OPTIONS } from "@/configuration/options.config";
import { isPediatricClient } from "@/utils/use.health";
import { getUser } from "@/utils/use.token";
import { useEffect, useState } from "react";

interface PreviewStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const FPEPreview = ({ formData, setFormData }: PreviewStepProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const res = getUser();
    if (res) {
      console.log("res2", res);
      setUser(res); // set with the fetched result
    }
  }, []);
  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow">
      <h3 className="text-2xl font-semibold mt-4  py-2 text-primary">
        Review Your Information
      </h3>
      <p className=" mb-4 text-gray-500 text-sm italic">
        Please carefully review all the details you have entered before
        proceeding. Make sure everything is correct to avoid any errors.
      </p>
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Review of the Systems
      </h3>
      <PreviewFormMapper
        label="Chief complaint (please describe)"
        value={
          formData.reviewOfSystems?.chiefComplaint
            ? formData.reviewOfSystems?.chiefComplaint
            : "---"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      <PreviewFormMapper
        label="Do you experience any of the following: loss of appetite, lack of sleep, unexplained weight loss,
feeling down/depressed, fever, headache, memory loss, blurring of vision, or hearing loss?
"
        value={
          formData.reviewOfSystems?.mental?.explain
            ? formData.reviewOfSystems?.mental?.hasIssues
              ? "YES, " + " " + formData.reviewOfSystems?.mental?.explain
              : "NO"
            : "---"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      <PreviewFormMapper
        label="Do you experience any of the following: cough/colds, chest pain, palpitations, or difficulty in breathing?
"
        value={
          formData.reviewOfSystems?.respiratory?.explain
            ? formData.reviewOfSystems?.respiratory?.hasIssues
              ? "YES, " + " " + formData.reviewOfSystems?.respiratory?.explain
              : "NO"
            : "---"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />

      <PreviewFormMapper
        label="Do you experience any of the following: abdominal pain, vomiting, change in bowel movement, rectal bleeding, or bloody/tarry stools??
"
        value={
          formData.reviewOfSystems?.gi?.explain
            ? formData.reviewOfSystems?.gi?.hasIssues
              ? "YES, " + " " + formData.reviewOfSystems?.gi?.explain
              : "NO"
            : "---"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />

      <PreviewFormMapper
        label="Do you experience any of the following: abdominal pain, vomiting, change in bowel movement, rectal bleeding, or bloody/tarry stools?"
        value={
          formData.reviewOfSystems?.urinary?.explain
            ? formData.reviewOfSystems?.urinary?.hasIssues
              ? "YES, " + " " + formData.reviewOfSystems?.urinary?.explain
              : "NO"
            : "---"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />

      <PreviewFormMapper
        label="For male and female, do you experience ay of the following: pain or discomfort on urination, frequency of urination, dribbling of urine, pain during/after sex, blood in the urine, or foulsmelling genital discharge?
"
        value={
          formData.reviewOfSystems?.genital?.explain
            ? formData.reviewOfSystems?.genital?.hasIssues
              ? "YES, " + " " + formData.reviewOfSystems?.genital?.explain
              : "NO"
            : "---"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      {user?.person?.gender?.toLowerCase() === "female" && (
        <div>
          <h3 className="text-lg text-blue-600 font-semibold mt-4  py-2 text-primary">
            For Females Only
          </h3>
          <PreviewFormMapper
            label="Last menstrual period
"
            value={formData.reviewOfSystems.lastMenstrualPeriod}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="First menstrual period
"
            value={formData.reviewOfSystems.firstMenstrualPeriod}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Number of pregnancy"
            value={formData.reviewOfSystems.pregnancyCount}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
        </div>
      )}
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Personal/Social History
      </h3>
      <PreviewFormMapper
        label="Do you smoke cigar, cigarette, e-cigarette, vape, or other similar products?"
        value={
          formData.history?.social?.smoker
            ? "YES " +
              " " +
              (formData.history?.social?.smokingYears > 0
                ? `, ${formData.history?.social?.smokingYears} year/s`
                : "")
            : "NO"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />
      <PreviewFormMapper
        label="Do you drink alcohol or alcohol-containing beverages?"
        value={
          formData.history?.social?.alcohol
            ? "YES " +
              " " +
              (formData.history?.social?.alcoholYears > 0
                ? `, ${formData.history?.social?.alcoholYears} year/s`
                : "")
            : "NO"
        }
        type="question"
        className={{ container: "border-b border-gray-100 py-2" }}
      />

      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Past Medical History
      </h3>
      <PreviewFormMapper
        label="Cancer"
        value={
          formData.history?.medical?.conditions?.cancer?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.cancer?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Allergies"
        value={
          formData.history?.medical?.conditions?.allergies?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.allergies?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Diabetes Mellitus"
        value={
          formData.history?.medical?.conditions?.diabetesMellitus?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.diabetesMellitus?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Diabetes Mellitus"
        value={
          formData.history?.medical?.conditions?.hypertension?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.hypertension?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Diabetes Mellitus"
        value={
          formData.history?.medical?.conditions?.heartDisease?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.heartDisease?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Stroke"
        value={
          formData.history?.medical?.conditions?.stroke?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.stroke?.type
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Bronchial Asthma"
        value={
          formData.history?.medical?.conditions?.bronchialAsthma?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.bronchialAsthma?.details
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="COPD or emphysema or bronchitis"
        value={
          formData.history?.medical?.conditions?.copd?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.copd?.details
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Tuberculosis"
        value={
          formData.history?.medical?.conditions?.tuberculosis?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.tuberculosis?.details
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Others"
        value={
          formData.history?.medical?.conditions?.others?.isDiagnosed
            ? "YES, " +
              " " +
              formData.history?.medical?.conditions?.others?.details
            : "NO"
        }
        type="question"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Pertinent Physical Examination Findings
      </h3>
      <PreviewFormMapper
        label="Blood Pressure"
        value={`${formData.physicalExam.bloodPressure.systolic} / ${formData.physicalExam.bloodPressure.diastolic} mmHg`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Heart Rate"
        value={`${formData?.physicalExam?.heartRate?.value} /min`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Respiratory Rate"
        value={`${formData?.physicalExam?.respiratoryRate?.value} /min`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Visual Acuity"
        value={`${formData.physicalExam.visualAcuity} `}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Height"
        value={`${formData.physicalExam?.height.centimeter}  cm`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Weight"
        value={`${formData.physicalExam?.weight.kilograms}  kg`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="BMI"
        value={`${formData.physicalExam?.bmi}  `}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <PreviewFormMapper
        label="Temperature"
        value={`${formData?.physicalExam?.temperature.value}  Celsius`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />

      {isPediatricClient(user?.person?.birthDate) && (
        <>
          <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
            Pediatric Client aged 0-24 months
          </h3>
          <PreviewFormMapper
            label="Length"
            value={`${formData?.pediatricData?.length}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Head Circumference"
            value={`${formData?.pediatricData?.headCircumference}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Skinfold Thickness"
            value={`${formData?.pediatricData?.skinfoldThickness}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Waist"
            value={`${formData?.pediatricData?.waist}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Hip"
            value={`${formData?.pediatricData?.hip}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Limbs"
            value={`${formData?.pediatricData?.limbs}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
          <PreviewFormMapper
            label="Middle Upper Arm
Circumference (MUAC)"
            value={`${formData?.pediatricData?.muac}  cm`}
            type="text"
            className={{
              container: "border-b border-gray-100 py-2",
              value: "uppercase text-gray-500",
            }}
          />
        </>
      )}
      <h3 className="text-xl font-semibold my-4 border-b py-2  text-blue-800">
        Others
      </h3>
      <PreviewFormMapper
        label="Blood Type "
        value={`${formData.physicalExam.bloodType}`}
        type="text"
        className={{
          container: "border-b border-gray-100 py-2",
          value: "uppercase text-gray-500",
        }}
      />
      <div className="space-y-6 mt-4 bg-white p-6 rounded-xl shadow-md border">
        <div className="space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            I hereby certify that I did not avail of FPE in other KPP. Moreover,
            I grant my free and voluntary consent to the collection,
            transmission and processing of my personal data and health records
            to PhilHelth for the purpose of paying and monitoring the provider
            for the Konsulta benefit in accordance with Republic Act No. 10173,
            otherwise known as the “Data Privacy Act of 2012”.
          </p>

          {/* 
          <div>
            {" "}
            <p className="text-gray-700 text-sm leading-relaxed italic">
              Reminder: Please bring this documents to school for validation and
              verifications.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              1. Printed Enrollment Form with complete signature.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              2. Original SF9 or Report Card.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              3. Photocopy of PSA Birth Certificate.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              4. Photocopy of Medical Certificate.
            </p>
          </div> */}
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="certify-checkbox"
            checked={formData.validation?.isCertifyTheData}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                validation: {
                  ...prev.validation,
                  isCertifyTheData: e.target.checked,
                },
              }))
            }
            className="mt-1 accent-blue-600 w-4 h-4"
          />
          <label htmlFor="certify-checkbox" className="text-sm text-gray-800">
            I confirm that the information provided is accurate and complete to
            the best of my knowledge. By checking this box and submitting, I
            agree to the Terms of Service and Privacy Policy, and acknowledge
            that this submission constitutes my electronic signature.
          </label>
        </div>
      </div>
    </div>
  );
};
