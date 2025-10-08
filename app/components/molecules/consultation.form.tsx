import React, { useState } from "react";

export interface ConsultationData {
  reasonForConsultation: string;
  findings: string;
  plan: string;
  medication: string[];
}

interface ConsultationFormProps {
    consultationData?: {
        chiefComplaint: string[];
        historyOfIllness: string;
        findings: {
          heent: string[];
          chestBreastLungs: string[];
          heart: string[];
          abdomen: string[];
          genitourinary: string[];
          dre: string[];
          extremities: string[];
          neurological: string[];
        };
        diagnosis: {
          entries: {
            value: string;
            notes: string;
          }[];
          medications: {
            name: string;
            quantity: string;
            remarks: string;
          }[];
          additionalNotes: string;
        };
        plan: {
          medications: string[];
          laboratoryTests: Record<
            string,
            {
              doctor: string;
              client: string;
            }
          >;
          otherExams: string;
          referrals: string[];
          followUp: string;
          managementNotApplicable: boolean;
          managementItems: string[];
        }
    };
    onConsultationChange: (data: ConsultationData) => void;
    chiefComplaint: boolean,
    physicalExamFindings: boolean,
    diagnosis: boolean,
    planManagement: boolean,
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
    consultationData,
    onConsultationChange,
    chiefComplaint = false,
    physicalExamFindings = false,
    diagnosis = false,
    planManagement = false,
})=> {
    const activeSection: "chief-complaint" | "physical-exam-findings" | "diagnosis" | "plan-management" | null =
        chiefComplaint ? "chief-complaint" :
        physicalExamFindings ? "physical-exam-findings" :
        diagnosis ? "diagnosis" :
        planManagement ? "plan-management" : null;

    const updateConsultation = (path: string[], val: any) => {
        if (!onConsultationChange || !consultationData) return;
        const clone = JSON.parse(JSON.stringify(consultationData));
        let obj: any = clone;
        for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
        obj[path[path.length - 1]] = val;
        onConsultationChange(clone);
    };

    const diagnosisSuggestions = [
      "Hypertension",
      "Diabetes Mellitus",
      "Pneumonia",
      "Asthma",
      "Gastritis",
      "Migraine",
      "Urinary Tract Infection",
      "Tuberculosis",
      "COVID-19",
    ];
  
    const medicationSuggestions = [
      "Paracetamol",
      "Amoxicillin",
      "Metformin",
      "Losartan",
      "Salbutamol",
      "Omeprazole",
      "Atorvastatin",
      "Cefalexin",
      "Ibuprofen",
    ];

    const AutocompleteInput: React.FC<{
      value: string;
      onChange: (val: string) => void;
      suggestions: string[];
      placeholder: string;
    }> = ({ value, onChange, suggestions, placeholder }) => {
      const [show, setShow] = useState(false);
      const filtered = suggestions.filter(
        (s) => s.toLowerCase().includes(value.toLowerCase()) && value.length > 0
      );
  
      return (
        <div className="relative w-full">
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 200)}
          />
          {show && filtered.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
              {filtered.map((s) => (
                <li
                  key={s}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    onChange(s);
                    setShow(false);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };

    const chiefComplaintOptions = [
      { label: "Abdominal Cramp/Pain", value: "abdominal_cramp_pain" },
      { label: "Altered Mental Sensorium", value: "altered_mental_sensorium" },
      { label: "Anorexia", value: "anorexia" },
      { label: "Bleeding Gums", value: "bleeding_gums" },
      { label: "Blurring of Vision", value: "blurring_of_vision" },
      { label: "Body Weakness", value: "body_weakness" },
      { label: "Chest Pain/Discomfort", value: "chest_pain_discomfort" },
      { label: "Constipation", value: "constipation" },
      { label: "Diarrhea", value: "diarrhea" },
      { label: "Dizziness", value: "dizziness" },
      { label: "Dysphagia", value: "dysphagia" },
      { label: "Dyspnea", value: "dyspnea" },
      { label: "Dysuria", value: "dysuria" },
      { label: "Epistaxis", value: "epistaxis" },
      { label: "Frequency of Urination", value: "frequency_of_urination" },
      { label: "Headache", value: "headache" },
      { label: "Hematemesis", value: "hematemesis" },
      { label: "Hematuria", value: "hematuria" },
      { label: "Hemoptysis", value: "hemoptysis" },
    ];
  
    const laboratoryTests = [
      "Random Blood Sugar",
      "CBC w/ platelet count",
      "Chest X-Ray",
      "Creatinine",
      "Electrocardiogram (ECG)",
      "Fasting Blood Sugar",
      "Fecal Occult Blood",
      "Pecalyxia",
      "HbA1c",
      "Lipid Profile",
      "Oral Glucose Tolerance Test",
      "Pap Smear",
      "PPD Test (Tuberculosis)",
      "Sputum Microscopy",
      "Urinalysis",
      "Others",
    ];


  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {activeSection === "chief-complaint" && consultationData && (
            <div>
                <div className="font-semibold text-gray-800 mb-4">
                    Chief Complaint
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chiefComplaintOptions.map((option) => {
                  const checked = consultationData.chiefComplaint.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="inline-flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...consultationData.chiefComplaint, option.value]
                            : consultationData.chiefComplaint.filter(
                                (x: string) => x !== option.value
                              );
                              updateConsultation(["chiefComplaint"], next);
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-semibold text-gray-800 mb-2">
                  History of Present Illness
                </div>
                <textarea
                  className="w-full px-3 py-2 border rounded min-h-32"
                  placeholder="Describe the history of present illness..."
                  value={consultationData.historyOfIllness}
                  onChange={(e) => updateConsultation(["historyOfIllness"], e.target.value)}
                />
              </div>
            </div>
        )}

        {activeSection === "physical-exam-findings" && consultationData &&(
          <div className="space-y-4">
            {[
              {
                key: "heent",
                title: "A. HEENT",
                items: [
                  "Essentially normal",
                  "Abnormal pupillary reaction",
                  "Cervical lymphadenopathy",
                  "Dry mucous membrane",
                  "Icteric sclerae",
                  "Pale conjunctivae",
                  "Sunken eyeballs",
                  "Sunken fontanelle",
                  "Others",
                ],
              },
              {
                key: "chestBreastLungs",
                title: "B. Chest/Breast/Lungs",
                items: [
                  "Essentially normal",
                  "Asymmetrical chest expansion",
                  "Decreased breath sounds",
                  "Wheezes",
                  "Lumps over breast(s)",
                  "Crackles/rales",
                  "Retractions",
                  "Others",
                ],
              },
              {
                key: "heart",
                title: "C. Heart",
                items: [
                  "Essentially normal",
                  "Displaced apex beat",
                  "Heaves/thrills",
                  "Irregular rhythm",
                  "Muffled heart sounds",
                  "Murmurs",
                  "Pericardial bulge",
                  "Others",
                ],
              },
              {
                key: "abdomen",
                title: "D. Abdomen",
                items: [
                  "Essentially normal",
                  "Abdominal rigidity",
                  "Abdominal tenderness",
                  "Hyperactive bowel sounds",
                  "Palpable mass(es)",
                  "Tympanic/dull abdomen",
                  "Uterine contraction",
                  "Others",
                ],
              },
              {
                key: "genitourinary",
                title: "E. Genitourinary",
                items: [
                  "Essentially normal",
                  "Blood stained in exam finger",
                  "Cervical dilatation",
                  "Presence of abnormal discharge",
                  "Others",
                ],
              },
              {
                key: "dre",
                title: "F. Digital Rectal Examination",
                items: [
                  "Essentially normal",
                  "Enlarge Prostate",
                  "Mass",
                  "Hemorrhoids",
                  "Pus",
                  "Not Applicable",
                  "Others",
                ],
              },
              {
                key: "extremities",
                title: "G. Extremities",
                items: [
                  "Essentially normal",
                  "Edema",
                  "Clubbing",
                  "Cyanosis",
                  "Deformity",
                  "Weak pulses",
                  "Varicosities",
                  "Others",
                ],
              },
              {
                key: "neurological",
                title: "H. Neurological",
                items: [
                  "Essentially normal",
                  "Altered mental status",
                  "Motor weakness",
                  "Sensory deficit",
                  "Abnormal reflexes",
                  "Seizure activity",
                  "Gait abnormality",
                  "Others",
                ],
              },
            ].map((section: any) => (
              <div key={section.key} className="border rounded-lg p-4">
                <div className="font-semibold text-gray-800 mb-2">
                  {section.title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {section.items.map((label: string) => {
                    const checked = (consultationData.findings as any)[
                      section.key
                    ]?.includes(label);
                    return (
                      <label
                        key={label}
                        className="inline-flex items-center space-x-2 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={Boolean(checked)}
                          onChange={(e) => {
                            const current: string[] =
                              (consultationData.findings as any)[section.key] || [];
                            const next = e.target.checked
                              ? [...current, label]
                              : current.filter((x) => x !== label);
                            updateConsultation(["findings", section.key], next);
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "diagnosis" && consultationData && (
          <div className="space-y-6">
            {/* Diagnosis Section */}
            <div className="bg-white shadow rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
              <div className="space-y-4">
                {consultationData.diagnosis.entries.map((entry: { value: string; notes: string | number | readonly string[] | undefined }, index: React.Key | null | undefined) => (
                  <div key={index} className="relative border rounded-lg p-4 bg-gray-50 space-y-3">
                    {/* Remove button top-right */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                      onClick={() => {
                        const updated = consultationData.diagnosis.entries.filter((_, i) => i !== index);
                        updateConsultation(["diagnosis", "entries"], updated); // Use updateConsultation instead of set
                      }}
                    >
                      Remove
                    </button>

                    {/* Diagnosis input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis {index != null ? (index as number) + 1 : "N/A"}
                      </label>
                      <AutocompleteInput
                        value={entry.value}
                        onChange={(val) => {
                          const updated = [...consultationData.diagnosis.entries];
                          const numericIndex = index as number;
                          updated[numericIndex] = { ...updated[numericIndex], value: val };
                          updateConsultation(["diagnosis", "entries"], updated);
                        }}
                        suggestions={diagnosisSuggestions}
                        placeholder="Enter diagnosis..."
                      />
                    </div>

                    {/* Notes textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg min-h-[70px] text-sm"
                        placeholder="Notes for this diagnosis..."
                        value={entry.notes}
                        onChange={(e) => {
                          const updated = [...consultationData.diagnosis.entries];
                          const numericIndex = index as number;
                          updated[numericIndex!].notes = e.target.value;
                          updateConsultation(["diagnosis", "entries"], updated); // Use updateConsultation instead of set
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add button */}
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                  onClick={() =>
                    updateConsultation(["diagnosis", "entries"], [
                      ...consultationData.diagnosis.entries,
                      { value: "", notes: "" },
                    ]) // Use updateConsultation instead of set
                  }
                >
                  + Add Diagnosis
                </button>
              </div>
            </div>

            {/* Medications Section */}
            <div className="bg-white shadow rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
              <div className="space-y-4">
                {consultationData.diagnosis.medications.map((med: { name: string; quantity: string | number | readonly string[] | undefined; remarks: string | number | readonly string[] | undefined }, index: React.Key | null | undefined) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    {/* Top row: med name + quantity + remove */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <AutocompleteInput
                          value={med.name}
                          onChange={(val) => {
                            const updated = [...consultationData.diagnosis.medications];
                            const numericIndex = index as number;
                            updated[numericIndex!] = { ...updated[numericIndex!], name: val }; // Ensure index is non-null
                            updateConsultation(["diagnosis", "medications"], updated); // Use updateConsultation instead of set
                          }}
                          suggestions={medicationSuggestions}
                          placeholder={`Medication #${index as number + 1}`}
                        />
                      </div>
                      <input
                        type="text"
                        className="w-32 px-3 py-2 border rounded-lg text-sm"
                        placeholder="Quantity"
                        value={med.quantity}
                        onChange={(e) => {
                          const updated = [...consultationData.diagnosis.medications];
                          const numericIndex = index as number;
                          updated[numericIndex!].quantity = e.target.value; // Ensure index is non-null
                          updateConsultation(["diagnosis", "medications"], updated); // Use updateConsultation instead of set
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                        onClick={() => {
                          const updated = consultationData.diagnosis.medications.filter((_, i) => i !== index);
                          updateConsultation(["diagnosis", "medications"], updated); // Use updateConsultation instead of set
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Remarks below */}
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg min-h-[60px] text-sm"
                      placeholder="Remarks..."
                      value={med.remarks}
                      onChange={(e) => {
                        const updated = [...consultationData.diagnosis.medications];
                        const numericIndex = index as number;
                        updated[numericIndex!].remarks = e.target.value; // Ensure index is non-null
                        updateConsultation(["diagnosis", "medications"], updated); // Use updateConsultation instead of set
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                  onClick={() =>
                    updateConsultation(["diagnosis", "medications"], [
                      ...consultationData.diagnosis.medications,
                      { name: "", quantity: "", remarks: "" },
                    ]) // Use updateConsultation instead of set
                  }
                >
                  + Add Medication
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "plan-management" && consultationData && (
          <div className="space-y-4">
            {/* Laboratory/Imaging Examination Table */}
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-gray-800 mb-4">
                A. Laboratory/Imaging Examination
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Laboratory/Imaging</th>
                    <th className="border p-2 text-center" colSpan={3}>
                      Doctor Recommendation
                    </th>
                    <th className="border p-2 text-center" colSpan={3}>
                      Client
                    </th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left"></th>
                    <th className="border p-2 text-center w-20">Yes</th>
                    <th className="border p-2 text-center w-20">No</th>
                    <th className="border p-2 text-center w-20">Desired</th>
                    <th className="border p-2 text-center w-20">Request</th>
                    <th className="border p-2 text-center w-20">Refuse</th>
                    <th className="border p-2 text-center w-20">Desired</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratoryTests.map((test) => (
                    <tr key={test}>
                      <td className="border p-2">{test}</td>
                      {/* Doctor Recommendation */}
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-doctor`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.doctor === "yes"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].doctor = "yes";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-doctor`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.doctor === "no"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].doctor = "no";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-doctor`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.doctor ===
                            "desired"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].doctor = "desired";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                      {/* Client Response */}
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-client`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.client ===
                            "request"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].client = "request";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-client`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.client === "refuse"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].client = "refuse";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="radio"
                          name={`${test}-client`}
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={
                            consultationData.plan.laboratoryTests[test]?.client ===
                            "desired"
                          }
                          onChange={() => {
                            const updated = { ...consultationData.plan.laboratoryTests };
                            if (!updated[test])
                              updated[test] = { doctor: "", client: "" };
                            updated[test].client = "desired";
                            updateConsultation(["plan", "laboratoryTests"], updated);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* Other Diagnostic Exam */}
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-gray-800 mb-2">
                OTHER DIAGNOSTIC EXAM
              </div>
              <textarea
                className="w-full px-3 py-2 border rounded min-h-20"
                placeholder="Enter other diagnostic exams..."
                value={consultationData.plan.otherExams}
                onChange={(e) => updateConsultation(["plan", "otherExams"], e.target.value)}
              />
            </div>
  
            {/* Management Section */}
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-gray-800 mb-2">
                B. Management (check if done)
              </div>
  
              <div className="space-y-1">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                    checked={consultationData.plan.managementNotApplicable || false}
                    onChange={(e) => {
                      updateConsultation(["plan", "managementNotApplicable"], e.target.checked);
                      // If "Not Applicable" is checked, uncheck all other items
                      if (e.target.checked) {
                        updateConsultation(["plan", "managementItems"], []);
                      }
                    }}
                  />
                  <span>Not Applicable</span>
                </label>
  
                {[
                  "Breastfeeding Program Education",
                  "Counseling for Smoking Cessation",
                  "Counseling for Lifestyle Modification",
                  "Oral Check-up and Prophylaxis",
                  "Others",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                      checked={
                        consultationData.plan.managementItems?.includes(item) || false
                      }
                      onChange={(e) => {
                        // If checking any item, uncheck "Not Applicable"
                        if (e.target.checked) {
                          updateConsultation(["plan", "managementNotApplicable"], false);
                        }
  
                        const current = consultationData.plan.managementItems || [];
                        const next = e.target.checked
                          ? [...current, item]
                          : current.filter((x) => x !== item);
                          updateConsultation(["plan", "managementItems"], next);
                      }}
                      disabled={consultationData.plan.managementNotApplicable}
                    />
                    <span
                      className={
                        consultationData.plan.managementNotApplicable ? "text-gray-400" : ""
                      }
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
