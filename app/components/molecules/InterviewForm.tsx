import React from "react";

interface YesNoWithTextValue {
  isTrue: boolean | null;
  details: string;
}

const QuestionCard: React.FC<{
  title: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ title, required, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-3 text-sm font-medium text-gray-900">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      {children}
    </div>
  );
};

const YesNoWithText: React.FC<{
  label: string;
  value: YesNoWithTextValue;
  onChange: (val: YesNoWithTextValue) => void;
  required?: boolean;
}> = ({ label, value, onChange, required }) => {
  return (
    <QuestionCard title={label} required={required}>
      <div className="flex items-center space-x-6">
        <label className="inline-flex items-center space-x-2">
          <input
            type="radio"
            name={label.replace(/\s+/g, "-")}
            checked={value.isTrue === true}
            onChange={() => onChange({ ...value, isTrue: true })}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="text-sm">Yes</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input
            type="radio"
            name={label.replace(/\s+/g, "-")}
            checked={value.isTrue === false}
            onChange={() => onChange({ ...value, isTrue: false, details: "" })}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="text-sm">No</span>
        </label>
      </div>
      {value.isTrue === true && (
        <textarea
          value={value.details}
          onChange={(e) => onChange({ ...value, details: e.target.value })}
          rows={3}
          className="w-full mt-3 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Explain here..."
        />
      )}
    </QuestionCard>
  );
};

export interface ImmunizationItem {
  isTrue: boolean;
  date: string;
}

export interface InterviewFormProps {
  interviewData?: {
    reviewOfSystems: {
      mental: YesNoWithTextValue;
      respiratory: YesNoWithTextValue;
      gi: YesNoWithTextValue;
      urinary: YesNoWithTextValue;
      genital: YesNoWithTextValue;
      female?: {
        lastMenstrualPeriod?: string;
        firstMenstrualPeriod?: string;
        pregnancyCount?: string;
      };
    };
    pastMedicalHistory: Record<string, YesNoWithTextValue>;
    familyMedicalHistory: Record<string, YesNoWithTextValue>;
    socialHistory?: {
      smoker: { isTrue: boolean | null; years: string; sticksPerDay: string };
      alcohol: { isTrue: boolean | null; years: string; qtyPerWeek: string };
      sexuallyActive: YesNoWithTextValue;
    };
    immunizations?: Record<string, ImmunizationItem> & { othersText?: string };
    operations?: { name: string; date?: string }[];
    obGyne?: {
      familyPlanningAccess: 'yes' | 'no' | null;
      menstrual: {
        applicable: boolean;
        menarcheAge: string;
        onsetSexAge: string;
        menopause: 'yes' | 'no' | null;
        menopauseAge: string;
        lastMenstrualPeriod: string;
        birthControlMethod: string;
        periodDurationDays: string;
        intervalCycleDays: string;
        padsPerDay: string;
      };
      pregnancy: {
        applicable: boolean;
        gravidity: string;
        parity: string;
        typeOfDelivery: string;
        numFullTerm: string;
        numPremature: string;
        numAbortion: string;
        numLivingChildren: string;
        preeclampsia: boolean;
      };
    };
  };
  onInterviewChange?: (data: InterviewFormProps["interviewData"]) => void;
  isFemale?: boolean;
  showReviewOfSystems?: boolean;
  showPastMedicalHistory?: boolean;
  showFamilyHistory?: boolean;
  showImmunizations?: boolean;
  showFormHeader?: boolean;
  showObGyne?: boolean;
}

export const ImmunizationsForm: React.FC<{
  sections?: { title: string; items: { key: string; label: string }[] }[];
  items?: { key: string; label: string }[];
  values?: Record<string, ImmunizationItem> & { othersText?: string };
  onChangeItem: (key: string, value: ImmunizationItem) => void;
  onChangeOthers?: (text: string) => void;
}> = ({ sections, items, values = {}, onChangeItem, onChangeOthers }) => {
  const renderItems = (list: { key: string; label: string }[]) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {list.map(({ key, label }) => {
        const item = values[key] || { isTrue: false, date: "" };
        return (
          <label key={key} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={item.isTrue === true}
              onChange={(e) => onChangeItem(key, { ...item, isTrue: e.target.checked })}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-800">{label}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {sections
        ? sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="text-sm font-semibold text-gray-700">{section.title}</div>
              {renderItems(section.items)}
            </div>
          ))
        : items && <div className="space-y-2">{renderItems(items)}</div>}
      {onChangeOthers && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Others, please specify:</label>
          <textarea
            value={values.othersText || ""}
            onChange={(e) => onChangeOthers(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter other immunizations..."
          />
        </div>
      )}
    </div>
  );
};

export const InterviewForm: React.FC<InterviewFormProps> = ({
  interviewData,
  onInterviewChange,
  isFemale = false,
  showReviewOfSystems = false,
  showPastMedicalHistory = false,
  showFamilyHistory = false,
  showImmunizations = false,
  showFormHeader = false,
  showObGyne = false,
}) => {
  const activeSection: "ros" | "pmh" | "fmh" | "ob" | "imm" | null =
    showReviewOfSystems ? "ros" :
    showPastMedicalHistory ? "pmh" :
    showFamilyHistory ? "fmh" :
    showObGyne ? "ob" :
    showImmunizations ? "imm" : null;

  const updateInterview = (path: string[], val: any) => {
    if (!onInterviewChange || !interviewData) return;
    const clone = JSON.parse(JSON.stringify(interviewData));
    let obj: any = clone;
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[path.length - 1]] = val;
    onInterviewChange(clone);
  };

  const pmhList = [
    { key: "cancer", label: "Cancer" },
    { key: "allergies", label: "Allergies" },
    { key: "diabetesMellitus", label: "Diabetes Mellitus" },
    { key: "hypertension", label: "Hypertension" },
    { key: "heartDisease", label: "Heart Disease" },
    { key: "stroke", label: "Stroke" },
    { key: "bronchialAsthma", label: "Bronchial Asthma" },
    { key: "copd", label: "COPD / Emphysema / Bronchitis" },
    { key: "tuberculosis", label: "Tuberculosis" },
    { key: "cerebrovascularDisease", label: "Cerebrovascular Disease" },
    { key: "coronaryArteryDisease", label: "Coronary Artery Disease" },
    { key: "emphysema", label: "Emphysema" },
    { key: "epilepsy", label: "Epilepsy/Seizure Disorder" },
    { key: "hepatitis", label: "Hepatitis" },
    { key: "hyperlipidemia", label: "Hyperlipidemia" },
    { key: "pulmonaryTuberculosis", label: "Pulmonary Tuberculosis" },
    { key: "extrapulmonaryTuberculosis", label: "Extrapulmonary Tuberculosis" },
    { key: "urinaryTractInfection", label: "Urinary Tract Infection" },
    { key: "mentalIllness", label: "Mental Illness" },
    { key: "others", label: "Others" },
  ];

  const immunizationList = [
    { key: "tetanus", label: "Tetanus" },
    { key: "measlesMumpsRubella", label: "Measles, Mumps, Rubella (MMR)" },
    { key: "hepatitisB", label: "Hepatitis B" },
    { key: "influenza", label: "Influenza" },
    { key: "covid19", label: "COVID-19" },
  ];

  const immunizationSections = [
    {
      title: "For Children",
      items: [
        { key: "bcg", label: "BCG" },
        { key: "opv1", label: "OPV1" },
        { key: "opv2", label: "OPV2" },
        { key: "opv3", label: "OPV3" },
        { key: "dpt1", label: "DPT1" },
        { key: "dpt2", label: "DPT2" },
        { key: "dpt3", label: "DPT3" },
        { key: "measles", label: "Measles" },
        { key: "hepatitisB1", label: "Hepatitis B1" },
        { key: "hepatitisB2", label: "Hepatitis B2" },
        { key: "hepatitisB3", label: "Hepatitis B3" },
        { key: "hepatitisA", label: "Hepatitis A" },
        { key: "varicella", label: "Varicella (Chicken Pox)" },
        { key: "none_children", label: "None" },
      ],
    },
    {
      title: "For Adult",
      items: [
        { key: "hpv", label: "HPV" },
        { key: "mmr_adult", label: "MMR" },
        { key: "none_adult", label: "None" },
      ],
    },
    {
      title: "For Pregnant Women",
      items: [
        { key: "tetanusToxoid", label: "Tetanus Toxoid" },
        { key: "none_pregnant", label: "None" },
      ],
    },
    {
      title: "For Elderly and Immunocompromised",
      items: [
        { key: "pneumococcal", label: "Pneumococcal Vaccine" },
        { key: "fluVaccine", label: "Flu Vaccine" },
        { key: "none_elderly", label: "None" },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {showFormHeader && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-7 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Consultation Form</h2>
          </div>
        </div>
      )}

      {/* Review of Systems */}
      {activeSection === "ros" && interviewData && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Interview: Review of Systems</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <YesNoWithText
              label="Mental/General (e.g., loss of appetite, lack of sleep, weight loss, feeling down/depressed, fever, headache, memory loss, blurring of vision, hearing loss)"
              value={interviewData.reviewOfSystems.mental}
              onChange={(v) => updateInterview(["reviewOfSystems", "mental"], v)}
            />
            <YesNoWithText
              label="Respiratory/Cardiovascular (e.g., cough/colds, chest pain, palpitations, difficulty breathing)"
              value={interviewData.reviewOfSystems.respiratory}
              onChange={(v) => updateInterview(["reviewOfSystems", "respiratory"], v)}
            />
            <YesNoWithText
              label="Gastrointestinal (e.g., abdominal pain, vomiting, change in bowel movement, rectal bleeding)"
              value={interviewData.reviewOfSystems.gi}
              onChange={(v) => updateInterview(["reviewOfSystems", "gi"], v)}
            />
            <YesNoWithText
              label="Urinary (e.g., frequency of urination, dysuria)"
              value={interviewData.reviewOfSystems.urinary}
              onChange={(v) => updateInterview(["reviewOfSystems", "urinary"], v)}
            />
            <YesNoWithText
              label="Genital (e.g., pain during/after sex, foul-smelling discharge, blood in urine)"
              value={interviewData.reviewOfSystems.genital}
              onChange={(v) => updateInterview(["reviewOfSystems", "genital"], v)}
            />
          </div>
          {isFemale && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Last menstrual period</label>
                <input
                  type="date"
                  value={interviewData.reviewOfSystems.female?.lastMenstrualPeriod || ""}
                  onChange={(e) =>
                    updateInterview(["reviewOfSystems", "female"], {
                      ...interviewData.reviewOfSystems.female,
                      lastMenstrualPeriod: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">First menstrual period</label>
                <input
                  type="date"
                  value={interviewData.reviewOfSystems.female?.firstMenstrualPeriod || ""}
                  onChange={(e) =>
                    updateInterview(["reviewOfSystems", "female"], {
                      ...interviewData.reviewOfSystems.female,
                      firstMenstrualPeriod: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Number of pregnancy</label>
                <input
                  type="number"
                  min={0}
                  value={interviewData.reviewOfSystems.female?.pregnancyCount || ""}
                  onChange={(e) =>
                    updateInterview(["reviewOfSystems", "female"], {
                      ...interviewData.reviewOfSystems.female,
                      pregnancyCount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past Medical History */}
      {activeSection === "pmh" && interviewData && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Past Medical History</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pmhList.map(({ key, label }) => (
              <YesNoWithText
                key={key}
                label={label}
                value={interviewData.pastMedicalHistory?.[key] || { isTrue: null, details: "" }}
                onChange={(v) => updateInterview(["pastMedicalHistory", key], v)}
              />
            ))}
          </div>

          {/* Operation History */}
          <div className="mt-8">
            <div className="inline-block px-3 py-1 bg-gray-300 text-gray-800 text-xs font-semibold rounded">OPERATION HISTORY</div>
            <div className="mt-3 p-4 border rounded-lg bg-white">
              <div className="text-sm font-semibold text-gray-800 mb-2">Past Operations</div>
              <OperationHistory
                items={interviewData.operations || []}
                onChange={(items) => updateInterview(["operations"], items)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Family Medical History */}
      {activeSection === "fmh" && interviewData && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Family Medical History</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pmhList.map(({ key, label }) => (
              <YesNoWithText
                key={`family-${key}`}
                label={label}
                value={interviewData.familyMedicalHistory?.[key] || { isTrue: null, details: "" }}
                onChange={(v) => updateInterview(["familyMedicalHistory", key], v)}
              />
            ))}
          </div>

          {/* Personal / Social History (part of Family tab) */}
          {interviewData.socialHistory && (
            <div className="mt-8">
              <div className="inline-block px-3 py-1 bg-amber-200 text-amber-900 text-xs font-semibold rounded">PERSONAL/SOCIAL HISTORY</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Do you smoke cigar, cigarette, e-cigarette, vape, or other similar products?</label>
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={interviewData.socialHistory?.smoker?.isTrue === true}
                        onChange={() =>
                          updateInterview(["socialHistory", "smoker"], {
                            ...interviewData.socialHistory?.smoker,
                            isTrue: true,
                          })
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={interviewData.socialHistory?.smoker?.isTrue === false}
                        onChange={() =>
                          updateInterview(["socialHistory", "smoker"], {
                            ...interviewData.socialHistory?.smoker,
                            isTrue: false,
                          })
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                  {interviewData.socialHistory?.smoker?.isTrue === true && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Years"
                        value={interviewData.socialHistory?.smoker?.years || ""}
                        onChange={(e) =>
                          updateInterview(["socialHistory", "smoker"], {
                            ...interviewData.socialHistory?.smoker,
                            years: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Sticks/day"
                        value={interviewData.socialHistory?.smoker?.sticksPerDay || ""}
                        onChange={(e) =>
                          updateInterview(["socialHistory", "smoker"], {
                            ...interviewData.socialHistory?.smoker,
                            sticksPerDay: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Do you drink alcohol or alcohol-containing beverages?</label>
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={interviewData.socialHistory?.alcohol?.isTrue === true}
                        onChange={() =>
                          updateInterview(["socialHistory", "alcohol"], {
                            ...interviewData.socialHistory?.alcohol,
                            isTrue: true,
                          })
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={interviewData.socialHistory?.alcohol?.isTrue === false}
                        onChange={() =>
                          updateInterview(["socialHistory", "alcohol"], {
                            ...interviewData.socialHistory?.alcohol,
                            isTrue: false,
                          })
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                  {interviewData.socialHistory?.alcohol?.isTrue === true && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Years"
                        value={interviewData.socialHistory?.alcohol?.years || ""}
                        onChange={(e) =>
                          updateInterview(["socialHistory", "alcohol"], {
                            ...interviewData.socialHistory?.alcohol,
                            years: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Qty/week"
                        value={interviewData.socialHistory?.alcohol?.qtyPerWeek || ""}
                        onChange={(e) =>
                          updateInterview(["socialHistory", "alcohol"], {
                            ...interviewData.socialHistory?.alcohol,
                            qtyPerWeek: e.target.value,
                          })
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <YesNoWithText
                    label="Sexually Active"
                    value={interviewData.socialHistory?.sexuallyActive || { isTrue: null, details: "" }}
                    onChange={(v) => updateInterview(["socialHistory", "sexuallyActive"], v)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OB-Gyne History */}
      {activeSection === "ob" && interviewData && (
        <div className="space-y-6">
          <div className="bg-white-50 border border-white-100 rounded-lg p-4">
            <div className="text-sm font-semibold text-white-900 mb-2">Family Planning</div>
            <div className="flex items-center gap-6 text-sm">
              <span>With access to family planning counseling?</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" className="form-radio text-blue-600" checked={interviewData.obGyne?.familyPlanningAccess === 'yes'} onChange={() => updateInterview(['obGyne','familyPlanningAccess'],'yes')} />
                <span>Yes</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" className="form-radio text-blue-600" checked={interviewData.obGyne?.familyPlanningAccess === 'no'} onChange={() => updateInterview(['obGyne','familyPlanningAccess'],'no')} />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Menstrual History */}
          <div className="bg-white-50 border border-white-100 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white-900">Menstrual History</div>
              <div className="flex items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-1">
                  <input type="radio" className="form-radio" checked={interviewData.obGyne?.menstrual?.applicable === true} onChange={() => updateInterview(['obGyne','menstrual'], { ...(interviewData.obGyne?.menstrual||{}), applicable: true })} />
                  <span>Applicable</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input type="radio" className="form-radio" checked={interviewData.obGyne?.menstrual?.applicable === false} onChange={() => updateInterview(['obGyne','menstrual'], { ...(interviewData.obGyne?.menstrual||{}), applicable: false })} />
                  <span>Not Applicable</span>
                </label>
              </div>
            </div>
            {interviewData.obGyne?.menstrual?.applicable !== false && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Menarche (yrs. old)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.menarcheAge||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), menarcheAge:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Onset of sexual intercourse (yrs. old)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.onsetSexAge||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), onsetSexAge:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Menopause?</label>
                  <div className="flex items-center gap-6 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" className="form-radio text-blue-600" checked={interviewData.obGyne?.menstrual?.menopause==='yes'} onChange={()=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), menopause:'yes'})} />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" className="form-radio text-blue-600" checked={interviewData.obGyne?.menstrual?.menopause==='no'} onChange={()=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), menopause:'no'})} />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">If yes, what age?</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.menopauseAge||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), menopauseAge:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Last menstrual period</label>
                  <input type="date" className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.lastMenstrualPeriod||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), lastMenstrualPeriod:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Birth control method</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.birthControlMethod||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), birthControlMethod:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Period duration (days)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.periodDurationDays||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), periodDurationDays:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Interval cycle (days)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.intervalCycleDays||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), intervalCycleDays:e.target.value})} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">No. of pads/day during menstruation</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.menstrual?.padsPerDay||''} onChange={(e)=>updateInterview(['obGyne','menstrual'],{...(interviewData.obGyne?.menstrual||{}), padsPerDay:e.target.value})} />
                </div>
              </div>
            )}
          </div>

          {/* Pregnancy History */}
          <div className="bg-white-50 border border-white   -100 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white-900">Pregnancy History</div>
              <div className="flex items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-1">
                  <input type="radio" className="form-radio" checked={interviewData.obGyne?.pregnancy?.applicable === true} onChange={() => updateInterview(['obGyne','pregnancy'], { ...(interviewData.obGyne?.pregnancy||{}), applicable: true })} />
                  <span>Applicable</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input type="radio" className="form-radio" checked={interviewData.obGyne?.pregnancy?.applicable === false} onChange={() => updateInterview(['obGyne','pregnancy'], { ...(interviewData.obGyne?.pregnancy||{}), applicable: false })} />
                  <span>Not Applicable</span>
                </label>
              </div>
            </div>
            {interviewData.obGyne?.pregnancy?.applicable !== false && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gravidity (no. of pregnancy)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.gravidity||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), gravidity:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Parity (no. of delivery)</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.parity||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), parity:e.target.value})} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Type of delivery</label>
                  <select className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.typeOfDelivery||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), typeOfDelivery:e.target.value})}>
                    <option value="">NOT APPLICABLE</option>
                    <option>Normal Spontaneous Vaginal Delivery</option>
                    <option>Cesarean Section</option>
                    <option>Assisted (Forceps/Vacuum)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">No. of full term</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.numFullTerm||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), numFullTerm:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">No. of premature</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.numPremature||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), numPremature:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">No. of abortion</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.numAbortion||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), numAbortion:e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">No. of living children</label>
                  <input className="w-full px-3 py-2 border rounded" value={interviewData.obGyne?.pregnancy?.numLivingChildren||''} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), numLivingChildren:e.target.value})} />
                </div>
                <div className="space-y-1 md:col-span-4">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="form-checkbox text-blue-600" checked={Boolean(interviewData.obGyne?.pregnancy?.preeclampsia)} onChange={(e)=>updateInterview(['obGyne','pregnancy'],{...(interviewData.obGyne?.pregnancy||{}), preeclampsia:e.target.checked})} />
                    <span>Pregnancy-induced hypertension (Pre-eclampsia)</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Immunizations */}
      {activeSection === "imm" && interviewData && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Immunizations</h3>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <ImmunizationsForm
              sections={immunizationSections}
              values={interviewData.immunizations}
              onChangeItem={(key, value) => updateInterview(["immunizations", key], value)}
              onChangeOthers={(text) => updateInterview(["immunizations"], { ...(interviewData.immunizations || {}), othersText: text })}
            />
          </div>
        </div>
      )}

      
    </div>
  );
};

const OperationHistory: React.FC<{
  items: { name: string; date?: string }[];
  onChange: (items: { name: string; date?: string }[]) => void;
}> = ({ items, onChange }) => {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");

  const addItem = () => {
    if (!name.trim()) return;
    onChange([...(items || []), { name: name.trim(), date }]);
    setName("");
    setDate("");
  };

  const removeItem = (index: number) => {
    const next = [...items];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter operation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button onClick={addItem} className="px-4 py-2 rounded bg-indigo-500 text-white">Add</button>
      </div>
      {items && items.length > 0 && (
        <ul className="divide-y border rounded-lg">
          {items.map((op, idx) => (
            <li key={`${op.name}-${idx}`} className="flex items-center justify-between px-3 py-2">
              <div className="text-sm text-gray-800">
                <span className="font-medium">{op.name}</span>
                {op.date ? <span className="text-gray-500 ml-2">{op.date}</span> : null}
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


