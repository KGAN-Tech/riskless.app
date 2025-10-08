import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/atoms/tabs";

import { useState } from "react";
import ExtractMasterlistPage from "./sub-pages/extract.masterlist.page";
import MembersPage from "../masterlist/masterlist.page";

export default function ExtractorPage() {
  const [activeTab, setActiveTab] = useState("extract-new");
  return (
    <div className="space-y-4 px-4 ">
      <div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-5"
        >
          <TabsList className="w-fit border-b mb-4">
            <TabsTrigger
              value="extract-new"
              className="border-r w-full m-0 p-0 text-nowrap px-2"
            >
              Extract New
            </TabsTrigger>
            <TabsTrigger value="patients" className="m-0 p-0 w-full px-2">
              Masterlist
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="extract-new"
            className="space-y-2 -mt-5 overflow-y-auto"
          >
            <ExtractMasterlistPage />
          </TabsContent>

          <TabsContent
            value="patients"
            className="space-y-2 -mt-5 overflow-y-auto"
          >
            <MembersPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
