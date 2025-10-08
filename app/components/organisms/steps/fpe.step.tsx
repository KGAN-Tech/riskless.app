import { FormMapper } from "@/components/helper/form.mapper";
import { OPTIONS } from "@/configuration/options.config";
import { getAge } from "@/utils/format.utils";
import { isPediatricClient } from "@/utils/use.health";
import { getUser } from "@/utils/use.token";
import { useEffect, useState } from "react";

interface FPERegistrationStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  step?: number;
}

export const FPERegistrationStep = ({
  formData,
  setFormData,
  step,
}: FPERegistrationStepProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const res = getUser();
    if (res) {
      console.log("res2", res);
      setUser(res); // set with the fetched result
    }
  }, []);

  return (
    <>
      {step === 1 && (
        <div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
              Review of the Systems
            </h1>
          </div>

          <FormMapper
            title="1. Chief Complaint (Please Describe)"
            description="Please describe any medical conditions, allergies, or injuries."
            placeholder="Enter Chief Complaint"
            value={
              formData?.reviewOfSystems?.chiefComplaint
                ? formData?.reviewOfSystems?.chiefComplaint
                : ""
            }
            onChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                reviewOfSystems: {
                  ...prev.reviewOfSystems,
                  chiefComplaint: value,
                },
              }))
            }
            required={true}
            fieldType="long-text"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="2. Do you experience any of the following: loss of appetite, lack of sleep, unexplained weight loss, feeling down/depressed, fever, headache, memory loss, blurring of vision, or hearing loss?"
            description=""
            placeholder="Explain here..."
            value={{
              isTrue: formData.reviewOfSystems?.mental?.hasIssues ?? null,
              value: formData.reviewOfSystems?.mental?.explain ?? "",
            }}
            isTrueFieldName="hasIssues"
            onChange={(data) =>
              setFormData((prev: any) => ({
                ...prev,
                reviewOfSystems: {
                  ...formData.reviewOfSystems,
                  mental: {
                    ...formData.reviewOfSystems.mental,
                    hasIssues: data.isTrue,
                    explain: data.value,
                  },
                },
              }))
            }
            required={true}
            fieldType="yes-no-with-input-text"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="3. Do you experience any of the following: cough/colds, chest pain, palpitations, or difficulty in
breathing?"
            description=""
            placeholder="Explain here..."
            value={{
              isTrue: formData.reviewOfSystems?.respiratory?.hasIssues ?? null,
              value: formData.reviewOfSystems?.respiratory?.explain ?? "",
            }}
            isTrueFieldName="hasIssues"
            onChange={(data) =>
              setFormData({
                ...formData,
                reviewOfSystems: {
                  ...formData.reviewOfSystems,
                  respiratory: {
                    ...formData.reviewOfSystems.respiratory,
                    hasIssues: data.isTrue,
                    explain: data.value,
                  },
                },
              })
            }
            required={true}
            fieldType="yes-no-with-input-text"
            inputTextCase="uppercase"
          />
          <FormMapper
            title="4. Do you experience any of the following: abdominal pain, vomiting, change in bowel movement,
rectal bleeding, or bloody/tarry stools?"
            description=""
            placeholder="Explain here..."
            value={{
              isTrue: formData.reviewOfSystems?.gi?.hasIssues ?? null,
              value: formData.reviewOfSystems?.gi?.explain ?? "",
            }}
            isTrueFieldName="hasIssues"
            onChange={(data) =>
              setFormData({
                ...formData,
                reviewOfSystems: {
                  ...formData.reviewOfSystems,
                  gi: {
                    ...formData.reviewOfSystems.gi,
                    hasIssues: data.isTrue,
                    explain: data.value,
                  },
                },
              })
            }
            required={true}
            fieldType="yes-no-with-input-text"
            inputTextCase="uppercase"
          />
          <FormMapper
            title="5. Do you experience any of the following: frequent urination, frequent eating, frequent intake of
fluids?"
            description=""
            isTrueFieldName="hasIssues"
            placeholder="Explain here..."
            value={{
              isTrue: formData.reviewOfSystems?.urinary?.hasIssues ?? null,
              value: formData.reviewOfSystems?.urinary?.explain ?? "",
            }}
            onChange={(data) =>
              setFormData({
                ...formData,
                reviewOfSystems: {
                  ...formData.reviewOfSystems,
                  urinary: {
                    ...formData.reviewOfSystems.urinary,
                    hasIssues: data.isTrue,
                    explain: data.value,
                  },
                },
              })
            }
            required={true}
            fieldType="yes-no-with-input-text"
            inputTextCase="uppercase"
          />
          <FormMapper
            title="6. For male and female, do you experience ay of the following: pain or discomfort on urination,
frequency of urination, dribbling of urine, pain during/after sex, blood in the urine, or foulsmelling genital discharge?
"
            description=""
            isTrueFieldName="hasIssues"
            placeholder="Explain here..."
            value={{
              isTrue: formData.reviewOfSystems?.genital?.hasIssues ?? null,
              value: formData.reviewOfSystems?.genital?.explain ?? "",
            }}
            onChange={(data) =>
              setFormData({
                ...formData,
                reviewOfSystems: {
                  ...formData.reviewOfSystems,
                  genital: {
                    ...formData.reviewOfSystems.genital,
                    hasIssues: data.isTrue,
                    explain: data.value,
                  },
                },
              })
            }
            required={true}
            fieldType="yes-no-with-input-text"
            inputTextCase="uppercase"
          />

          {user?.person?.gender?.toLowerCase() === "female" && (
            <div>
              <div className="w-full border-b border-gray-300 mb-2">
                <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
                  For Females Only
                </h1>
              </div>
              <FormMapper
                title="Last menstrual period"
                description=""
                placeholder="Enter Chief Complaint"
                value={formData.reviewOfSystems.lastMenstrualPeriod || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    reviewOfSystems: {
                      ...formData.reviewOfSystems,
                      lastMenstrualPeriod: value,
                    },
                  })
                }
                required={true}
                max={new Date().toISOString().split("T")[0]}
                fieldType="date"
                inputTextCase="uppercase"
              />
              <FormMapper
                title="First menstrual period"
                description=""
                placeholder="Enter Chief Complaint"
                value={formData.reviewOfSystems.firstMenstrualPeriod || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    reviewOfSystems: {
                      ...formData.reviewOfSystems,
                      firstMenstrualPeriod: value,
                    },
                  })
                }
                required={true}
                max={new Date().toISOString().split("T")[0]}
                fieldType="date"
                inputTextCase="uppercase"
              />
              <FormMapper
                title="Number of pregnancy:"
                description=""
                placeholder="Enter Number of Pregnancy"
                value={formData.reviewOfSystems.pregnancyCount || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    reviewOfSystems: {
                      ...formData.reviewOfSystems,
                      pregnancyCount: parseInt(value),
                    },
                  })
                }
                max={20}
                required={true}
                fieldType="number"
                inputTextCase="uppercase"
              />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
              History Information
            </h1>
          </div>

          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-gray-400 text-white py-2 px-4 w-fit rounded-t-lg ">
              PERSONAL/SOCIAL HISTORY
            </h1>
          </div>

          <FormMapper
            title="Do you smoke cigar, cigarette, e-cigarette, vape, or other similar products?"
            subTitle="Number of years"
            description=""
            isTrueFieldName="hasIssues"
            placeholder="Number of years"
            value={{
              isTrue: formData.history?.social?.smoker ?? null,
              value: formData.history?.social?.smokingYears ?? 0,
            }}
            onChange={(data) =>
              setFormData({
                ...formData,
                history: {
                  ...formData.history,
                  social: {
                    ...formData.history.social,
                    smoker: data.isTrue,
                    smokingYears: data.value,
                  },
                },
              })
            }
            max={getAge(user?.person?.birthDate)} // dynamically limit to user's age
            required={true}
            fieldType="yes-no-with-input-number"
            inputTextCase="uppercase"
          />

          <FormMapper
            title="Do you drink alcohol or alcohol-containing beverages?"
            subTitle="Number of years"
            description=""
            isTrueFieldName="hasIssues"
            placeholder="Number of years"
            value={{
              isTrue: formData.history?.social?.alcohol ?? null,
              value: formData.history?.social?.alcoholYears ?? 0,
            }}
            onChange={(data) =>
              setFormData({
                ...formData,
                history: {
                  ...formData.history,
                  social: {
                    ...formData.history.social,
                    alcohol: data.isTrue,
                    alcoholYears: data.value,
                  },
                },
              })
            }
            max={getAge(user?.person?.birthDate)}
            required={true}
            fieldType="yes-no-with-input-number"
            inputTextCase="uppercase"
          />

          <div className="w-full border-b border-gray-300 mb-2">
            <h1 className="text-lg font-semibold bg-gray-400 text-white py-2 px-4 w-fit rounded-t-lg ">
              PAST MEDICAL HISTORY
            </h1>
          </div>
          <p className="italic text-xs px-2">
            Note: Only include 'Past Medical History' if applicable; otherwise,
            omit it.
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            <FormMapper
              title="Cancer"
              subTitle="Type of cancer (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.cancer?.isDiagnosed ??
                  null,
                value:
                  formData.history?.medical?.conditions?.cancer?.type ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        cancer: {
                          ...formData.history?.medical?.conditions?.cancer,
                          isDiagnosed: data.isTrue,
                          type: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Allergies"
              subTitle="Type of allergies (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.allergies
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions?.allergies?.type ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        allergies: {
                          ...formData.history?.medical?.conditions?.allergies,
                          isDiagnosed: data.isTrue,
                          type: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Diabetes Mellitus"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.diabetesMellitus
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions.diabetesMellitus
                    ?.type ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        diabetesMellitus: {
                          ...formData.history?.medical?.conditions
                            ?.diabetesMellitus,
                          isDiagnosed: data.isTrue,
                          type: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Hypertension"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.hypertension
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions.hypertension?.type ??
                  "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  medical: {
                    ...formData.medical,
                    conditions: {
                      ...formData.medical.conditions,
                      hypertension: {
                        ...formData.medical.conditions.hypertension,
                        isDiagnosed: data.isTrue,
                        type: data.value,
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Heart Disease"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.heartDisease
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions.heartDisease?.details ??
                  "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        heartDisease: {
                          ...formData.history?.medical?.conditions
                            ?.heartDisease,
                          isDiagnosed: data.isTrue,
                          details: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Stroke"
              subTitle="Type of stroke (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.stroke?.isDiagnosed ??
                  null,
                value: formData.history?.medical?.conditions.stroke?.type ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        stroke: {
                          ...formData.history?.medical?.conditions.stroke,
                          isDiagnosed: data.isTrue,
                          type: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Bronchial Asthma"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.bronchialAsthma
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions.bronchialAsthma
                    ?.details ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        bronchialAsthma: {
                          ...formData.history?.medical?.conditions
                            ?.bronchialAsthma,
                          isDiagnosed: data.isTrue,
                          details: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="COPD or emphysema or bronchitis"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.copd?.isDiagnosed ??
                  null,
                value:
                  formData.history?.medical?.conditions.copd?.details ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        copd: {
                          ...formData.history?.medical?.conditions.copd,
                          isDiagnosed: data.isTrue,
                          details: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Tuberculosis"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.tuberculosis
                    ?.isDiagnosed ?? null,
                value:
                  formData.history?.medical?.conditions.tuberculosis?.details ??
                  "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        tuberculosis: {
                          ...formData.history?.medical?.conditions
                            ?.tuberculosis,
                          isDiagnosed: data.isTrue,
                          details: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="Others"
              subTitle="Details (optional)"
              description=""
              isTrueFieldName="hasIssues"
              placeholder="Enter here..."
              value={{
                isTrue:
                  formData.history?.medical?.conditions?.others?.isDiagnosed ??
                  null,
                value:
                  formData.history?.medical?.conditions.others?.details ?? "",
              }}
              onChange={(data) =>
                setFormData({
                  ...formData,
                  history: {
                    ...formData.history,
                    medical: {
                      ...formData.history?.medical,
                      conditions: {
                        ...formData.history?.medical?.conditions,
                        others: {
                          ...formData.history?.medical?.conditions.others,
                          isDiagnosed: data.isTrue,
                          details: data.value,
                        },
                      },
                    },
                  },
                })
              }
              required={false}
              fieldType="yes-no-with-input-short-text"
              inputTextCase="uppercase"
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div>
            <div className="w-full border-b border-gray-300 mb-2">
              <h1 className="text-lg font-semibold bg-blue-800 text-white py-2 px-4 w-fit rounded-t-lg ">
                PERTINENT PHYSICAL EXAMINATION FINDINGS
              </h1>
            </div>
            <FormMapper
              title="Blood Pressure"
              description=""
              placeholder="Enter Blood Pressure"
              value={
                formData?.physicalExam?.bloodPressure
                  ? {
                      category:
                        formData.physicalExam.bloodPressure.category ?? "",
                      systolic: String(
                        formData.physicalExam.bloodPressure.systolic ?? ""
                      ),
                      diastolic: String(
                        formData.physicalExam.bloodPressure.diastolic ?? ""
                      ),
                    }
                  : {
                      category: "",
                      systolic: "",
                      diastolic: "",
                    }
              }
              customOptions={[
                {
                  label: "Normal (120/80 mmHg)",
                  value: "normal",
                  systolicRange: [90, 120],
                  diastolicRange: [60, 80],
                  systolicDefaultValue: 120,
                  diastolicDefaultValue: 80,
                  color: "#4CAF50",
                },
                {
                  label: "Elevated (120-129/<80 mmHg)",
                  value: "elevated",
                  systolicRange: [121, 129],
                  diastolicRange: [60, 79],
                  systolicDefaultValue: 125,
                  diastolicDefaultValue: 79,
                  color: "#FFEB3B",
                },
                {
                  label: "Hypertension Stage 1 (130-139/80-89 mmHg)",
                  value: "htn_stage_1",
                  systolicRange: [130, 139],
                  diastolicRange: [80, 89],
                  systolicDefaultValue: 135,
                  diastolicDefaultValue: 85,
                  color: "#FF9800",
                },
                {
                  label: "Hypertension Stage 2 (140+/90+ mmHg)",
                  value: "htn_stage_2",
                  systolicRange: [140, 180],
                  diastolicRange: [90, 120],
                  systolicDefaultValue: 160,
                  diastolicDefaultValue: 100,
                  color: "#F44336",
                },
                {
                  label: "Hypertensive Crisis (180+/120+ mmHg)",
                  value: "htn_crisis",
                  systolicRange: [181, 220],
                  diastolicRange: [121, 130],
                  systolicDefaultValue: 190,
                  diastolicDefaultValue: 125,
                  color: "#9C27B0",
                },
              ]}
              onChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    bloodPressure: {
                      category: value.category ?? "other",
                      systolic: parseInt(value.systolic),
                      diastolic: parseInt(value.diastolic),
                    },
                  },
                }))
              }
              required={true}
              fieldType="blood-pressure"
              inputTextCase="uppercase"
            />

            <FormMapper
              title="Heart Rate"
              description=""
              placeholder="Select Heart Rate"
              value={formData?.physicalExam?.heartRate ?? ""}
              unit="/min"
              fieldType="dropdown-with-unit-inputs"
              inputTextCase="uppercase"
              onChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    heartRate: {
                      status: value.status,
                      value: parseInt(value.value),
                    },
                  },
                }))
              }
              otherValue={formData?.physicalExam?.heartRateOtherRate ?? ""}
              onOtherChange={(rate) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    heartRate: {
                      ...prev.physicalExam.heartRate,
                      status: rate.status,
                      value: parseInt(rate.value),
                    },
                  },
                }))
              }
              customOptions={[
                {
                  label: "Normal (60–100 /min)",
                  status: "normal",
                  value: 60,
                  color: "#22c55e", // Green for normal
                },
                {
                  label: "Slow heart rate (<60 /min)",
                  status: "slow_heart_rate",
                  value: 59,
                  color: "#eab308", // Yellow for caution
                },
                {
                  label: "Fast heart rate (>100 /min)",
                  status: "fast_heart_rate",
                  value: 101,
                  color: "#ef4444", // Red for warning
                },
                {
                  label: "Other",
                  value: "other",
                  color: "#9ca3af", // Gray for neutral
                },
              ]}
              required
            />

            <FormMapper
              title="Respiratory Rate"
              description=""
              placeholder="Select Respiratory Rate"
              value={
                formData?.physicalExam?.respiratoryRate ?? {
                  status: "",
                  value: "",
                }
              }
              unit="/min"
              fieldType="dropdown-with-unit-inputs"
              inputTextCase="uppercase"
              required
              onChange={(rate) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    respiratoryRate: {
                      status: rate.status,
                      value: parseInt(rate.value),
                    },
                  },
                }))
              }
              otherValue={formData?.physicalExam?.respiratoryRate?.value ?? ""}
              onOtherChange={(rate) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    respiratoryRate: {
                      status: rate.status,
                      value: parseInt(rate.value),
                    },
                  },
                }))
              }
              customOptions={[
                {
                  label: "Normal (12–20 /min)",
                  status: "normal",
                  value: 16,
                  color: "#22c55e", // Tailwind green-500
                },
                {
                  label: "Bradypnea (<12 /min)",
                  status: "bradypnea",
                  value: 11,
                  color: "#eab308", // Tailwind yellow-500
                },
                {
                  label: "Tachypnea (>20 /min)",
                  status: "tachypnea",
                  value: 21,
                  color: "#ef4444", // Tailwind red-500
                },
                {
                  label: "Other",
                  value: "other",
                  color: "#9ca3af", // Tailwind gray-400
                },
              ]}
            />

            <FormMapper
              title="Visual Acuity"
              description=""
              placeholder="Select Visual Acuity"
              value={formData.physicalExam.visualAcuity || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  physicalExam: {
                    ...formData.physicalExam,
                    visualAcuity: value,
                  },
                })
              }
              options={[
                {
                  value: "20/10",
                  label: "20/10 - Very sharp vision (rare)",
                  color: "#0ea5e9",
                }, // sky blue
                {
                  value: "20/15",
                  label: "20/15 - Better than average vision",
                  color: "#22c55e",
                }, // green
                {
                  value: "20/20",
                  label: "20/20 - Normal vision",
                  color: "#4ade80",
                }, // light green
                {
                  value: "20/25",
                  label: "20/25 - Slightly below perfect",
                  color: "#facc15",
                }, // yellow
                {
                  value: "20/30",
                  label: "20/30 - Mildly reduced clarity",
                  color: "#fbbf24",
                }, // amber
                {
                  value: "20/40",
                  label:
                    "20/40 - Often the minimum required for driver's license",
                  color: "#f97316", // orange
                },
                {
                  value: "20/50",
                  label: "20/50 - Moderate impairment",
                  color: "#fb923c",
                }, // orange-light
                {
                  value: "20/60",
                  label: "20/60 - Moderate impairment",
                  color: "#f87171",
                }, // soft red
                {
                  value: "20/70",
                  label: "20/70 - Moderate-severe impairment",
                  color: "#ef4444",
                }, // red
                {
                  value: "20/80",
                  label: "20/80 - Severe impairment",
                  color: "#dc2626",
                }, // deep red
                {
                  value: "20/100",
                  label: "20/100 - Severe impairment",
                  color: "#991b1b",
                }, // dark red
              ]}
              required={true}
              fieldType="dropdown"
              inputTextCase="uppercase"
            />
            <FormMapper
              title="BMI (Body Mass Index)"
              description=""
              placeholder=""
              value={{
                height: formData.physicalExam?.height ?? "",
                weight: formData.physicalExam?.weight ?? "",
                bmi: formData.physicalExam?.bmi ?? "",
              }}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  physicalExam: {
                    ...formData.physicalExam,
                    height: {
                      ...formData.physicalExam?.height,
                      centimeter: parseFloat(value.height.centimeter),
                      inches: parseFloat(value.height.inches),
                    },
                    weight: {
                      ...formData.physicalExam?.weight,
                      pounds: parseFloat(value.weight.pounds),
                      kilograms: parseFloat(value.weight.kilograms),
                    },
                    bmi: parseFloat(value.bmi),
                  },
                })
              }
              required={true}
              fieldType="bmi"
            />
            <FormMapper
              title="Temperature"
              description=""
              placeholder="Select Temperature"
              value={
                formData?.physicalExam?.temperature ?? {
                  status: "",
                  value: "",
                }
              }
              unit="°C"
              fieldType="dropdown-with-unit-inputs"
              inputTextCase="uppercase"
              required
              onChange={(temp) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    temperature: {
                      status: temp.status,
                      value: parseFloat(temp.value),
                    },
                  },
                }))
              }
              otherValue={formData?.physicalExam?.temperature?.value ?? ""}
              onOtherChange={(temp) =>
                setFormData((prev: any) => ({
                  ...prev,
                  physicalExam: {
                    ...prev.physicalExam,
                    temperature: {
                      status: temp.status,
                      value: parseFloat(temp.value),
                    },
                  },
                }))
              }
              customOptions={[
                {
                  label: "Normal (36.5–37.5 °C)",
                  status: "normal",
                  value: 37.0,
                  color: "#22c55e", // green-500
                },
                {
                  label: "Hypothermia (<36.5 °C)",
                  status: "hypothermia",
                  value: 35.5,
                  color: "#3b82f6", // blue-500
                },
                {
                  label: "Fever (>37.5 °C)",
                  status: "fever",
                  value: 38.0,
                  color: "#ef4444", // red-500
                },
                {
                  label: "Other",
                  value: "other",
                  color: "#9ca3af", // gray-400
                },
              ]}
            />

            {isPediatricClient(user?.person?.birthDate) && (
              <div>
                <div className="w-full border-b border-gray-300 mb-2">
                  <h1 className="text-lg font-semibold bg-gray-500 text-white py-2 px-4 w-fit rounded-t-lg ">
                    Pediatric Client aged 0-24 months
                  </h1>
                </div>
                <FormMapper
                  title="Length"
                  description=""
                  placeholder="Enter Length"
                  value={
                    formData?.pediatricData?.length
                      ? formData?.pediatricData?.length
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        length: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                <FormMapper
                  title="Head Circumference"
                  description=""
                  placeholder="Enter Head Circumference"
                  value={
                    formData?.pediatricData?.headCircumference
                      ? formData?.pediatricData?.headCircumference
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        headCircumference: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                <FormMapper
                  title="Skinfold Thickness"
                  description=""
                  placeholder="Enter Skinfold Thickness"
                  value={
                    formData?.pediatricData?.skinfoldThickness
                      ? formData?.pediatricData?.skinfoldThickness
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        skinfoldThickness: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                {/* <FormMapper
                  title="Skinfold Thickness"
                  description=""
                  placeholder="Enter Skinfold Thickness"
                  value={
                    formData?.pediatricData?.skinfoldThickness
                      ? formData?.pediatricData?.skinfoldThickness
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        skinfoldThickness: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                /> */}
                <p className="p-2 font-semibold">Body Circumference:</p>
                <FormMapper
                  title="Waist"
                  description=""
                  placeholder="Enter Waist"
                  value={
                    formData?.pediatricData?.waist
                      ? formData?.pediatricData?.waist
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        waist: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                <FormMapper
                  title="Hip"
                  description=""
                  placeholder="Enter Hip"
                  value={
                    formData?.pediatricData?.hip
                      ? formData?.pediatricData?.hip
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        hip: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                <FormMapper
                  title="Limbs"
                  description=""
                  placeholder="Enter Limbs"
                  value={
                    formData?.pediatricData?.limbs
                      ? formData?.pediatricData?.limbs
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        limbs: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
                <FormMapper
                  title="Middle Upper Arm
Circumference (MUAC)"
                  description=""
                  placeholder="Enter Middle Upper Arm
Circumference (MUAC)"
                  value={
                    formData?.pediatricData?.muac
                      ? formData?.pediatricData?.muac
                      : ""
                  }
                  unit="cm"
                  onChange={(value) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      pediatricData: {
                        ...prev.pediatricData,
                        muac: parseFloat(value),
                      },
                    }))
                  }
                  required={true}
                  fieldType="input-with-units"
                  inputTextCase="uppercase"
                />
              </div>
            )}
            <p className="p-2 font-semibold">Other:</p>
            <FormMapper
              title="Blood Type (as available)"
              description=""
              placeholder="Select Blood Type"
              value={formData.physicalExam.bloodType || ""}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  physicalExam: {
                    ...formData.physicalExam,
                    bloodType: value,
                  },
                })
              }
              options={[
                { value: "a_positive", label: "A+" },
                { value: "b_positive", label: "B+" },
                { value: "ab_positive", label: "AB+" },
                { value: "o_positive", label: "O+" },
                { value: "o_negative", label: "O-" },
                { value: "a_negative", label: "A-" },
                { value: "b_negative", label: "B-" },
                { value: "ab_negative", label: "AB-" },
              ]}
              required={false}
              fieldType="dropdown"
              inputTextCase="uppercase"
            />
          </div>
        </div>
      )}
    </>
  );
};
