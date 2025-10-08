import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/atoms/tabs";

import { useState } from "react";
import { TAB } from "~/app/configuration/const.config";
import { EncounterReportValidator } from "./encounter.report.validator";

interface EncounterExpandFeatureProps {
  encounter: any;
}

export default function EncounterExpandFeature({
  encounter,
}: EncounterExpandFeatureProps) {
  const [activeTab, setActiveTab] = useState(TAB.ENCOUNTER_FEATURES[0].id);

  return (
    <div className="space-y-4 px-4 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        {/* Tabs Header */}
        <TabsList className="w-fit border-b mb-4">
          {TAB.ENCOUNTER_FEATURES.filter((f) => f.isEnabled).map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="border-r w-full m-0 p-0 text-nowrap px-2"
            >
              {feature.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        {TAB.ENCOUNTER_FEATURES.filter((f) => f.isEnabled).map((feature) => (
          <TabsContent
            key={feature.id}
            value={feature.id}
            className="space-y-2 -mt-5 overflow-y-auto"
          >
            <div className="p-4  ">
              {feature.id === "tranche_validator" && (
                <div>
                  <EncounterReportValidator encounter={encounter} />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
