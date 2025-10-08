import React from "react";
import type { EncounterForm } from "~/app/model/_encounter.model";
import {
  MiscType,
  ReportStatus,
  PhysicalExamStatus,
} from "~/app/model/vitals.model";

const findingsData = [
  {
    key: MiscType.heent,
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
    key: MiscType.chest,
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
    key: MiscType.heart,
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
    key: MiscType.abdomen,
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
    key: MiscType.genitourinary,
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
    key: MiscType.digital_rectal,
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
    key: MiscType.skin, // using skin as placeholder for extremities
    title: "G. Extremities",
    items: [
      "Essentially normal",
      "Clubbing",
      "Deformity",
      "Varicosities",
      "Edema",
      "Cyanosis",
      "Weak pulses",
      "Others",
    ],
  },
  {
    key: MiscType.neurological,
    title: "H. Neurological",
    items: [
      "Essentially normal",
      "Motor weakness",
      "Abnormal reflexes",
      "Gait abnormality",
      "Altered mental status",
      "Sensory deficit",
      "Seizure activity",
      "Others",
    ],
  },
];

interface PertinentFindingSectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const PertinentFindingsSection = ({
  encounterForm,
  setEncounterForm,
}: PertinentFindingSectionProps) => {
  return (
    <div className="space-y-4">
      {findingsData.map((section) => {
        // Current Misc entries for this section
        const current =
          encounterForm.vital?.misc?.filter((m) => m.type === section.key) ??
          [];

        return (
          <div key={section.key} className="border rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-2">
              {section.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {section.items.map((label) => {
                const checked = current.some((m) => m.description === label);

                return (
                  <label
                    key={label}
                    className="inline-flex items-center space-x-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [
                              ...current,
                              {
                                description: label,
                                type: section.key,
                                status: ReportStatus.completed,
                                tag:
                                  label === "Essentially normal"
                                    ? PhysicalExamStatus.normal
                                    : PhysicalExamStatus.abnormal,
                              },
                            ]
                          : current.filter((m) => m.description !== label);

                        setEncounterForm((prev) => ({
                          ...prev,
                          vital: {
                            ...prev.vital!,
                            misc: [
                              ...(prev.vital?.misc?.filter(
                                (m) => m.type !== section.key
                              ) ?? []),
                              ...next,
                            ],
                          },
                        }));
                      }}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
