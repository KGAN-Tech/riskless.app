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

interface ConsultationReviewOfSystemsSectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export default function ConsultationReviewOfSystemsSection({
  encounterForm,
  setEncounterForm,
}: ConsultationReviewOfSystemsSectionProps) {
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
    </div>
  );
}
