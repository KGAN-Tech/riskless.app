import type { EncounterForm } from "~/app/model/_encounter.model";
import type { Explain, ReviewOfSystems } from "~/app/model/interview.model";
import { ChiefComplaintInput } from "../_common/chief.of.complaints.section";

interface YesNoWithTextProps {
  label: string;
  value: {
    hasIssues: boolean;
    explain?: string;
  };
  onChange: (value: { hasIssues: boolean; explain?: string }) => void;
}

const YesNoWithText = ({ label, value, onChange }: YesNoWithTextProps) => {
  const handleYesNoChange = (hasIssues: boolean) => {
    onChange({ ...value, hasIssues });
  };

  const handleDetailsChange = (explain: string) => {
    onChange({ ...value, explain });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex space-x-4 mb-3">
        <div className="flex items-center">
          <input
            type="radio"
            id={`${label}-yes`}
            name={label}
            checked={value.hasIssues === true}
            onChange={() => handleYesNoChange(true)}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <label
            htmlFor={`${label}-yes`}
            className="ml-2 block text-sm text-gray-700"
          >
            Yes
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id={`${label}-no`}
            name={label}
            checked={value.hasIssues === false}
            onChange={() => handleYesNoChange(false)}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <label
            htmlFor={`${label}-no`}
            className="ml-2 block text-sm text-gray-700"
          >
            No
          </label>
        </div>
      </div>

      <textarea
        value={value.explain ?? ""}
        onChange={(e) => handleDetailsChange(e.target.value)}
        placeholder="Additional details..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        rows={3}
      />
    </div>
  );
};

interface ReviewOfSystemsSectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
  isFemale?: boolean;
}

export default function ReviewOfSystemsSection({
  encounterForm,
  setEncounterForm,
  isFemale,
}: ReviewOfSystemsSectionProps) {
  const reviews = encounterForm.interview?.reviews;
  const defaultExplain: Explain = { hasIssues: false, explain: "" };

  const handleReviewChange = (
    field: keyof NonNullable<ReviewOfSystems>,
    value: any
  ) => {
    setEncounterForm((prev) => ({
      ...prev,
      interview: {
        ...prev.interview!,
        reviews: {
          ...prev.interview?.reviews,
          [field]: value,
        },
      },
    }));
  };

  if (!reviews) {
    return <p className="text-gray-500">No review data available.</p>;
  }

  return (
    <div className="mb-8  bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-5">
        Review of Systems
      </h3>

      <ChiefComplaintInput
        complaints={reviews.chiefComplaint as string[]}
        onChange={(updated) =>
          setEncounterForm((prev) => ({
            ...prev,
            interview: {
              ...prev.interview!,
              reviews: {
                ...prev.interview!.reviews,
                chiefComplaint: updated,
              },
            },
          }))
        }
      />

      {/* YesNoWithText Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <YesNoWithText
          label="General/Neuro/Psych: Loss of appetite, lack of sleep, unexplained weight loss, depression, fever, headache, memory loss, blurred vision, hearing loss"
          value={reviews.mental ?? defaultExplain}
          onChange={(v) => handleReviewChange("mental", v)}
        />
        <YesNoWithText
          label="Respiratory/Cardiovascular: Cough/colds, chest pain, palpitations, difficulty breathing"
          value={reviews.respiratory ?? defaultExplain}
          onChange={(v) => handleReviewChange("respiratory", v)}
        />
        <YesNoWithText
          label="Gastrointestinal: Abdominal pain, vomiting, change in bowel movement, rectal bleeding, bloody/tarry stools"
          value={reviews.gi ?? defaultExplain}
          onChange={(v) => handleReviewChange("gi", v)}
        />
        <YesNoWithText
          label="Endocrine: Frequent urination, frequent eating, frequent fluid intake"
          value={reviews.endocrine ?? defaultExplain}
          onChange={(v) => handleReviewChange("endocrine", v)}
        />
        <YesNoWithText
          label="Genital: Painful urination, frequent urination, dribbling, pain with/after sex, blood in urine, foul-smelling discharge"
          value={reviews.genital ?? defaultExplain}
          onChange={(v) => handleReviewChange("genital", v)}
        />
      </div>

      {/* Female-specific section */}
      {isFemale && encounterForm.interview && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Female Health Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last menstrual period
              </label>
              <input
                type="date"
                value={
                  encounterForm.interview.history.menstrual.lastMensPeriod
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setEncounterForm((prev) => ({
                    ...prev,
                    interview: {
                      ...prev.interview!,
                      history: {
                        ...prev.interview!.history,
                        menstrual: {
                          ...prev.interview!.history.menstrual,
                          lastMensPeriod: new Date(e.target.value),
                        },
                      },
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Menarche period (age)
              </label>
              <input
                type="number"
                min={0}
                value={encounterForm.interview.history.menstrual.menarchePeriod}
                onChange={(e) =>
                  setEncounterForm((prev) => ({
                    ...prev,
                    interview: {
                      ...prev.interview!,
                      history: {
                        ...prev.interview!.history,
                        menstrual: {
                          ...prev.interview!.history.menstrual,
                          menarchePeriod: Number(e.target.value),
                        },
                      },
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Number of pregnancy
              </label>
              <input
                type="number"
                min={0}
                value={encounterForm.interview.history.pregnancy.pregnancyCount}
                onChange={(e) =>
                  setEncounterForm((prev) => ({
                    ...prev,
                    interview: {
                      ...prev.interview!,
                      history: {
                        ...prev.interview!.history,
                        pregnancy: {
                          ...prev.interview!.history.pregnancy,
                          pregnancyCount: Number(e.target.value),
                        },
                      },
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
