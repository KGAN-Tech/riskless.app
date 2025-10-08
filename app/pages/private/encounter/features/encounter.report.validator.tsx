import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { CheckCircle, Copy, XCircle } from "lucide-react";

interface EncounterReportValidatorProps {
  encounter: any;
}

export const EncounterReportValidator = ({
  encounter,
}: EncounterReportValidatorProps) => {
  const [selectedTranche, setSelectedTranche] = useState<string>("");

  const handleValidate = () => {
    console.log(
      "Validating encounter:",
      encounter,
      "Tranche:",
      selectedTranche
    );
    // TODO: add real validation logic here
  };

  const handleSubmit = () => {
    console.log(
      "Submitting encounter:",
      encounter,
      "Tranche:",
      selectedTranche
    );
    // TODO: add real submit logic here
  };

  return (
    <div className=" w-full">
      <div className="space-y-4 ">
        {/* Dropdown */}
        <Select value={selectedTranche} onValueChange={setSelectedTranche}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tranche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tranche-1">Tranche 1</SelectItem>
            <SelectItem value="tranche-2">Tranche 2</SelectItem>
          </SelectContent>
        </Select>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleValidate}
            disabled={!selectedTranche}
          >
            Validate
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedTranche}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
