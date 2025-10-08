import type { ChangeEvent } from "react";
import { Input, Textarea } from "~/app/components/atoms/input";
import type { EncounterForm } from "~/app/model/_encounter.model";

interface SocialHistoryProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const SocialHistorySection = ({
  encounterForm,
  setEncounterForm,
}: SocialHistoryProps) => {
  const social: any = encounterForm.interview?.history?.social ?? {
    isSmoker: false,
    cigarettePkgNo: "",
    isDrinker: false,
    bottlesNo: "",
    isIllicitDrugUser: false,
    isSexuallyActive: false,
    status: "unvalidated",
    remarks: {
      value: "None",
      type: "default",
    },
  };

  const handleChange = <K extends keyof typeof social>(
    field: K,
    value: (typeof social)[K]
  ) => {
    setEncounterForm((prev) => ({
      ...prev,
      interview: {
        ...prev.interview!,
        reviews: { ...prev.interview!.reviews },
        history: {
          ...prev.interview!.history,
          social: {
            ...prev.interview!.history.social,
            [field]: value,
          },
        },
        immunization: [...prev.interview!.immunization],
      },
    }));
  };

  return (
    <section className=" bg-white space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Social History
      </h2>

      {/* Smoking */}
      <div className="flex items-center gap-3">
        <input
          id="smoker"
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded"
          checked={social?.isSmoker}
          onChange={(e) => handleChange("isSmoker", e.target.checked)}
        />
        <label htmlFor="smoker" className="text-gray-700">
          Smoker
        </label>
        {social?.isSmoker && (
          <div className="ml-4 w-36">
            <Input
              type="number"
              variant="floating"
              label="Packs/day"
              value={social.cigarettePkgNo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                handleChange("cigarettePkgNo", val === "" ? "" : Number(val));
              }}
            />
          </div>
        )}
      </div>

      {/* Drinking */}
      <div className="flex items-center gap-3">
        <input
          id="drinker"
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded"
          checked={social.isDrinker}
          onChange={(e) => handleChange("isDrinker", e.target.checked)}
        />
        <label htmlFor="drinker" className="text-gray-700">
          Drinker
        </label>
        {social.isDrinker && (
          <div className="ml-4 w-40">
            <Input
              type="number"
              variant="floating"
              label="Bottles/week"
              value={social.bottlesNo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                handleChange("bottlesNo", val === "" ? "" : Number(val));
              }}
            />
          </div>
        )}
      </div>

      {/* Illicit drugs */}
      <div className="flex items-center gap-3">
        <input
          id="illicit-drug"
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded"
          checked={social.isIllicitDrugUser}
          onChange={(e) => handleChange("isIllicitDrugUser", e.target.checked)}
        />
        <label htmlFor="illicit-drug" className="text-gray-700">
          Illicit Drug Use
        </label>
      </div>

      {/* Sexually Active */}
      <div className="flex items-center gap-3">
        <input
          id="sexually-active"
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded"
          checked={social.isSexuallyActive}
          onChange={(e) => handleChange("isSexuallyActive", e.target.checked)}
        />
        <label htmlFor="sexually-active" className="text-gray-700">
          Sexually Active
        </label>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={social.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="unvalidated">Unvalidated</option>
          <option value="validated">Validated</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {/* Remarks */}
      <div>
        <Textarea
          variant="floating"
          label="Remarks"
          rows={3}
          value={social.remarks.value}
          onChange={(e) =>
            handleChange("remarks", {
              ...social.remarks,
              value: e.target.value,
            })
          }
        />
      </div>
    </section>
  );
};
