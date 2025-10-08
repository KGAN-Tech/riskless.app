import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/components/atoms/tabs";
import YakapRegistrationTypePage from "./registration.type.page";
import { useState } from "react";
import MembersPage from "../masterlist/masterlist.page";

export default function YakapRegistrationPage() {
  const [activeTab, setActiveTab] = useState("register-new");
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
              value="register-new"
              className="border-r w-full m-0 p-0 text-nowrap px-2"
            >
              Register New
            </TabsTrigger>
            <TabsTrigger value="patients" className="m-0 p-0 w-full px-2">
              Masterlist
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="register-new"
            className="space-y-2 -mt-5 overflow-y-auto"
          >
            <YakapRegistrationTypePage />
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
