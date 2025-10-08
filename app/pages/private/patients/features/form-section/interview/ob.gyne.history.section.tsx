import { Input } from "~/app/components/atoms/input";
import type { EncounterForm } from "~/app/model/_encounter.model";

interface OBGyneHistorySectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const OBGyneHistorySection = ({
  encounterForm,
  setEncounterForm,
}: OBGyneHistorySectionProps) => {
  const menstrual = encounterForm.interview?.history?.menstrual;
  const pregnancy = encounterForm.interview?.history?.pregnancy;

  const handleChange = (
    section: "menstrual" | "pregnancy",
    field: string,
    value: any
  ) => {
    setEncounterForm((prev) => ({
      ...prev,
      interview: {
        ...prev.interview!,
        history: {
          ...prev.interview!.history,
          [section]: {
            ...prev.interview!.history[section],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleNumberChange = (
    section: "menstrual" | "pregnancy",
    field: string,
    value: string
  ) => {
    handleChange(section, field, value === "" ? "" : Number(value));
  };

  return (
    <div className=" bg-white space-y-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        OB-Gyne History
      </h2>

      {/* Menstrual History */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
          Menstrual History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="number"
            variant="floating"
            label="Menarche Period (age)"
            value={menstrual?.menarchePeriod ?? ""}
            onChange={(e) =>
              handleNumberChange("menstrual", "menarchePeriod", e.target.value)
            }
          />

          <Input
            type="date"
            variant="floating"
            label="Last Menstrual Period"
            value={
              menstrual?.lastMensPeriod
                ? new Date(menstrual.lastMensPeriod).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleChange(
                "menstrual",
                "lastMensPeriod",
                new Date(e.target.value)
              )
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Duration of Period (days)"
            value={menstrual?.durationPeriod ?? ""}
            onChange={(e) =>
              handleNumberChange("menstrual", "durationPeriod", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Interval Between Periods (days)"
            value={menstrual?.mensInterval ?? ""}
            onChange={(e) =>
              handleNumberChange("menstrual", "mensInterval", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Pads Per Day"
            value={menstrual?.padsPerday ?? ""}
            onChange={(e) =>
              handleNumberChange("menstrual", "padsPerday", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Age at First Sexual Intercourse"
            value={menstrual?.onSetSexIc ?? ""}
            onChange={(e) =>
              handleNumberChange("menstrual", "onSetSexIc", e.target.value)
            }
          />

          <Input
            type="text"
            variant="floating"
            label="Birth Control Method"
            value={menstrual?.birthControlMethod ?? ""}
            onChange={(e) =>
              handleChange("menstrual", "birthControlMethod", e.target.value)
            }
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={menstrual?.isMenopause ?? false}
              onChange={(e) =>
                handleChange("menstrual", "isMenopause", e.target.checked)
              }
            />
            <span className="text-gray-700">Menopause</span>
          </div>

          {menstrual?.isMenopause && (
            <Input
              type="number"
              variant="floating"
              label="Menopause Age"
              value={menstrual?.menopauseAge ?? ""}
              onChange={(e) =>
                handleNumberChange("menstrual", "menopauseAge", e.target.value)
              }
            />
          )}
        </div>
      </section>

      {/* Pregnancy History */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
          Pregnancy History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="number"
            variant="floating"
            label="Pregnancy Count"
            value={pregnancy?.pregnancyCount ?? ""}
            onChange={(e) =>
              handleNumberChange("pregnancy", "pregnancyCount", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Delivery Count"
            value={pregnancy?.deliveryCount ?? ""}
            onChange={(e) =>
              handleNumberChange("pregnancy", "deliveryCount", e.target.value)
            }
          />

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Type
            </label>
            <select
              value={pregnancy?.deliveryType ?? "not_applicable"}
              onChange={(e) =>
                handleChange("pregnancy", "deliveryType", e.target.value)
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="not_applicable">Not Applicable</option>
              <option value="normal">Normal</option>
              <option value="cesarean">Cesarean</option>
            </select>
          </div>

          <Input
            type="number"
            variant="floating"
            label="Full Term Count"
            value={pregnancy?.fullTermCount ?? ""}
            onChange={(e) =>
              handleNumberChange("pregnancy", "fullTermCount", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Premature Count"
            value={pregnancy?.prematureCount ?? ""}
            onChange={(e) =>
              handleNumberChange("pregnancy", "prematureCount", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Abortion Count"
            value={pregnancy?.abortionCount ?? ""}
            onChange={(e) =>
              handleNumberChange("pregnancy", "abortionCount", e.target.value)
            }
          />

          <Input
            type="number"
            variant="floating"
            label="Live Children Count"
            value={pregnancy?.liveChildrenCount ?? ""}
            onChange={(e) =>
              handleNumberChange(
                "pregnancy",
                "liveChildrenCount",
                e.target.value
              )
            }
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={pregnancy?.withPregIndhyp ?? false}
              onChange={(e) =>
                handleChange("pregnancy", "withPregIndhyp", e.target.checked)
              }
            />
            <span className="text-gray-700">
              With Pregnancy-Induced Hypertension
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={pregnancy?.withFamilyPlan ?? false}
              onChange={(e) =>
                handleChange("pregnancy", "withFamilyPlan", e.target.checked)
              }
            />
            <span className="text-gray-700">With Family Planning</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OBGyneHistorySection;
