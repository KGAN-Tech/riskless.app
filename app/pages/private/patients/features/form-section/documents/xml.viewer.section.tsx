import React, { useState } from 'react';

// Sample XML data for both tranches (replace with real XML data or API response)
const xmlData = {
  firstTranche: `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <header>
    <id>1st_Tranche</id>
    <date>2025-08-29</date>
  </header>
  <content>
    <item>
      <name>Item 1</name>
      <value>100</value>
    </item>
    <item>
      <name>Item 2</name>
      <value>200</value>
    </item>
  </content>
</document>`,
  
  secondTranche: `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <header>
    <id>2nd_Tranche</id>
    <date>2025-09-01</date>
  </header>
  <content>
    <item>
      <name>Item A</name>
      <value>300</value>
    </item>
    <item>
      <name>Item B</name>
      <value>400</value>
    </item>
  </content>
</document>`
};

export const XMLViewerSection: React.FC = () => {
  // State to keep track of selected tranche (1st or 2nd)
  const [selectedTranche, setSelectedTranche] = useState<string | null>(null);
  // State to toggle between Readable and Encrypted XML views
  const [viewMode, setViewMode] = useState<'readable' | 'encrypted'>('readable');

  // Handle the click to select a tranche
  const handleTrancheClick = (tranche: string) => {
    setSelectedTranche(tranche);
  };

  // Render XML in Encrypted View (this is just a placeholder)
  const renderEncryptedXML = (xml: string) => {
    return xml.split('').map(() => String.fromCharCode(Math.floor(Math.random() * 94) + 33)).join('');
  };

  // Get the XML content based on the selected tranche
  const getSelectedXML = () => {
    if (selectedTranche === 'firstTranche') return xmlData.firstTranche;
    if (selectedTranche === 'secondTranche') return xmlData.secondTranche;
    return '';
  };

  return (
    <div className="flex space-x-4">
      {/* Left Container (List of Clickable Items) */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Tranches</h3>
        <ul className="space-y-2">
          <li
            className={`p-2 rounded-md cursor-pointer hover:bg-blue-200 ${
              selectedTranche === 'firstTranche' ? 'bg-blue-300 text-white' : 'bg-white'
            }`}
            onClick={() => handleTrancheClick('firstTranche')}
          >
            1st Tranche
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer hover:bg-blue-200 ${
              selectedTranche === 'secondTranche' ? 'bg-blue-300 text-white' : 'bg-white'
            }`}
            onClick={() => handleTrancheClick('secondTranche')}
          >
            2nd Tranche
          </li>
        </ul>
      </div>

      {/* Right Container (XML Viewer with Tabs for Readable/Encrypted View) */}
      <div className="w-2/3 bg-white p-4 rounded-lg shadow-md max-w-3xl">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">XML Viewer</h3>

        {/* Tab Navigation */}
        <div className="mb-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm mr-2 ${viewMode === 'readable' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('readable')}
          >
            Readable View
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm ${viewMode === 'encrypted' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('encrypted')}
          >
            Encrypted View
          </button>
        </div>

        {/* Display XML content */}
        {selectedTranche ? (
          <div className="border p-4 rounded-lg bg-gray-50">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              {selectedTranche === 'firstTranche' ? '1st Tranche' : '2nd Tranche'}
            </h4>
            <pre className="text-xs text-gray-600 text-wrap">
              {viewMode === 'readable'
                ? getSelectedXML()
                : renderEncryptedXML(getSelectedXML())}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">Select a tranche to view XML.</p>
        )}
      </div>
    </div>
  );
};
