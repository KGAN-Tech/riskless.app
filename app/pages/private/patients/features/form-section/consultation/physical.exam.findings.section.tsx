import React from "react";

interface PhysicalExamFindingsSectionProps {
  consultationData: any;
  updateConsultation: (path: string[], value: any) => void;
}

const examFindingsSections = [
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
];

export const PhysicalExamFindingsSection: React.FC<PhysicalExamFindingsSectionProps> = ({
  consultationData,
  updateConsultation,
}) => {

  return (
    <div className="space-y-4">
      {examFindingsSections.map((section) => (
        <div key={section.key} className="border rounded-lg p-4">
          {/* Section Title */}
          <div className="font-semibold text-gray-800 mb-2">
            {section.title}
          </div>

          {/* Checkboxes for Each Item */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {section.items.map((label: string) => {
              const checked = (consultationData.findings as any)[section.key]?.includes(label);
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
  );
};
