import { useState } from "react";
import type { EncounterForm } from "~/app/model/_encounter.model";

interface ImmunizationSectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

const immunizationOptions: Record<
  string,
  { code: string; name: string; description: string }[]
> = {
  children: [
    {
      code: "BCG",
      name: "BCG",
      description: "Bacillus Calmette-Guérin vaccine for tuberculosis.",
    },
    {
      code: "OPV1",
      name: "OPV1",
      description: "Oral Polio Vaccine - first dose.",
    },
    {
      code: "OPV2",
      name: "OPV2",
      description: "Oral Polio Vaccine - second dose.",
    },
    {
      code: "OPV3",
      name: "OPV3",
      description: "Oral Polio Vaccine - third dose.",
    },
    {
      code: "DPT1",
      name: "DPT1",
      description: "Diphtheria, Pertussis, Tetanus - first dose.",
    },
    {
      code: "DPT2",
      name: "DPT2",
      description: "Diphtheria, Pertussis, Tetanus - second dose.",
    },
    {
      code: "DPT3",
      name: "DPT3",
      description: "Diphtheria, Pertussis, Tetanus - third dose.",
    },
    {
      code: "MEASLES",
      name: "Measles",
      description: "Measles vaccine for children.",
    },
    {
      code: "HEPB1",
      name: "Hepatitis B1",
      description: "First dose of Hepatitis B vaccine.",
    },
    {
      code: "HEPB2",
      name: "Hepatitis B2",
      description: "Second dose of Hepatitis B vaccine.",
    },
    {
      code: "HEPB3",
      name: "Hepatitis B3",
      description: "Third dose of Hepatitis B vaccine.",
    },
    { code: "HEPA", name: "Hepatitis A", description: "Hepatitis A vaccine." },
    {
      code: "VAR",
      name: "Varicella",
      description: "Varicella (Chicken Pox) vaccine.",
    },
    { code: "NONE", name: "None", description: "No immunization given." },
  ],
  adult: [
    { code: "HPV", name: "HPV", description: "Human Papillomavirus vaccine." },
    {
      code: "MMR",
      name: "MMR",
      description: "Measles, Mumps, Rubella vaccine.",
    },
    { code: "NONE", name: "None", description: "No immunization given." },
  ],
  pregnant_women: [
    {
      code: "TT",
      name: "Tetanus Toxoid",
      description: "Tetanus Toxoid vaccine for pregnant women.",
    },
    { code: "NONE", name: "None", description: "No immunization given." },
  ],
  elderly: [
    {
      code: "PNEUMO",
      name: "Pneumococcal Vaccine",
      description: "Pneumococcal vaccine for elderly.",
    },
    { code: "FLU", name: "Flu Vaccine", description: "Influenza vaccine." },
    { code: "NONE", name: "None", description: "No immunization given." },
  ],
  others: [
    { code: "Other", name: "Other", description: "Other immunization given." },
  ],
};

export const ImmunizationSection = ({
  encounterForm,
  setEncounterForm,
}: ImmunizationSectionProps) => {
  const immunizations = encounterForm.interview?.immunization ?? [];

  const [personType, setPersonType] = useState("children");
  const [customOther, setCustomOther] = useState("");

  const toggleImmunization = (
    code: string,
    name: string,
    description: string
  ) => {
    // Special case for NONE
    if (code === "NONE") {
      setEncounterForm((prev) => ({
        ...prev,
        interview: {
          ...prev.interview!,
          immunization: [],
        },
      }));
      return;
    }

    // Check if already selected
    const exists = immunizations.some(
      (imm) => imm.code === code && imm.personType === personType
    );

    if (exists) {
      // Remove if unchecked
      setEncounterForm((prev) => ({
        ...prev,
        interview: {
          ...prev.interview!,
          immunization: prev.interview!.immunization.filter(
            (imm) => !(imm.code === code && imm.personType === personType)
          ),
        },
      }));
    } else {
      // Add if checked
      setEncounterForm((prev) => ({
        ...prev,
        interview: {
          ...prev.interview!,
          immunization: [
            ...prev.interview!.immunization,
            { personType: personType as any, code, name, description },
          ],
        },
      }));
    }
  };

  const addCustomOther = () => {
    if (!customOther.trim()) return;
    setEncounterForm((prev) => ({
      ...prev,
      interview: {
        ...prev.interview!,
        immunization: [
          ...prev.interview!.immunization,
          {
            personType: personType as any,
            code: "Other",
            name: customOther,
            description: "Custom immunization specified by user.",
          },
        ],
      },
    }));
    setCustomOther("");
  };

  return (
    <section className="p-0  bg-white space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Immunizations</h2>

      {/* Person type select */}
      <select
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={personType}
        onChange={(e) => setPersonType(e.target.value)}
      >
        <option value="children">For Children</option>
        <option value="adult">For Adult</option>
        <option value="pregnant_women">For Pregnant Women</option>
        <option value="elderly">For Elderly / Immunocompromised</option>
        <option value="others">Others</option>
      </select>

      {/* Checkbox list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {immunizationOptions[personType].map((imm) => (
          <label
            key={imm.code}
            className="flex items-center space-x-2 border p-2 rounded-lg"
          >
            <input
              type="checkbox"
              checked={immunizations.some(
                (i) => i.code === imm.code && i.personType === personType
              )}
              onChange={() =>
                toggleImmunization(imm.code, imm.name, imm.description)
              }
            />
            <span className="text-sm text-gray-700">{imm.name}</span>
          </label>
        ))}
      </div>

      {/* Custom input for Other */}
      {personType === "others" && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Specify other immunization"
            value={customOther}
            onChange={(e) => setCustomOther(e.target.value)}
          />
          <button
            type="button"
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
            onClick={addCustomOther}
          >
            Add
          </button>
        </div>
      )}

      {/* List of selected immunizations */}
      {/* {immunizations.length > 0 && (
        <ul className="space-y-2 mt-4">
          {immunizations.map((imm, index) => (
            <li
              key={index}
              className="flex justify-between items-center border rounded-lg px-4 py-2 bg-gray-50"
            >
              <span className="text-gray-700">
                <strong>{imm.personType}</strong> – {imm.name}
              </span>
              <button
                type="button"
                className="text-red-500 text-sm hover:underline"
                onClick={() =>
                  setEncounterForm((prev) => ({
                    ...prev,
                    interview: {
                      ...prev.interview!,
                      immunization: prev.interview!.immunization.filter(
                        (_, i) => i !== index
                      ),
                    },
                  }))
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )} */}
    </section>
  );
};

export default ImmunizationSection;
