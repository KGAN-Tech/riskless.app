import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "~/app/components/atoms/tabs";
  import { useState } from "react";
  import GeneratorXMLViewPage from "./generator.xml.view.page";
  import GeneratorXMLTableViewPage from "./generator.xml.table.page";
  
  export default function KonsultaRegistrationPage() {
    const [activeTab, setActiveTab] = useState("register-new");
    return (
      <div className="space-y-4 px-4 py-6">
        <div className="border-b pb-2">
          <h1 className="text-2xl font-semibold text-gray-800  border-gray-200 ">
            KONSULTA/ <span className="text-gray-500">XML Generator</span>
          </h1>
          <p className="text-sm text-gray-500">
            Choose the type of XML you want to use
          </p>
        </div>
  
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mt-5"
          >
            <TabsList className="w-fit border bg-transparent rounded-sm shadow-none p-0">
              <TabsTrigger
                value="xml-view"
                className="border-r w-full m-0 p-0 text-nowrap px-2"
              >
                XML View
              </TabsTrigger>
              <TabsTrigger value="table-view" className="m-0 p-0 w-full px-2">
                Table View
              </TabsTrigger>
            </TabsList>
  
            <TabsContent
              value="register-new"
              className="space-y-2 -mt-5 overflow-y-auto"
            >
              <GeneratorXMLViewPage />
            </TabsContent>
  
            <TabsContent
              value="patients"
              className="space-y-2 -mt-5 overflow-y-auto"
            >
              <GeneratorXMLViewPage />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
  