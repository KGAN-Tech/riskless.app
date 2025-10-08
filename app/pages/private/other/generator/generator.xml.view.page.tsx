import { useState } from "react";
import FloatingFilterControl from "./FloatingFilterControl";

const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<Records>
  <Record>
    <ID>1</ID>
    <Name>John Doe</Name>
    <Type>Consultation</Type>
    <Date>2024-03-15</Date>
    <Status>Completed</Status>
  </Record>
  <Record>
    <ID>2</ID>
    <Name>Jane Smith</Name>
    <Type>Laboratory</Type>
    <Date>2024-03-14</Date>
    <Status>Pending</Status>
  </Record>
</Records>`;

export default function GeneratorXMLBatchPage() {
    const [xml] = useState(mockXML);
    return(
        <div className="p-6 max-w-2xl mx-auto">
            <FloatingFilterControl />
            <h1 className="text-2xl font-bold mb-4">XML VIEW</h1>
            <pre className="bg-gray-100 rounded p-4 overflow-x-auto text-sm text-gray-800 border border-gray-200 whitespace-pre-wrap">
                {xml}
            </pre>
        </div>
    );
}