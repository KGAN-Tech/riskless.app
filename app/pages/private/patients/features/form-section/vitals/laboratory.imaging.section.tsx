import React from "react";

interface LaboratoryImagingSectionProps {
  vitalsData: any;
  updateVitals: (path: string[], value: any) => void;
}

export const LaboratoryImagingSection: React.FC<LaboratoryImagingSectionProps> = ({
  vitalsData,
  updateVitals
}) => {
  // Safely access labImaging with fallbacks
  const labImaging = vitalsData?.labImaging || {
    facilityType: '',
    date: '',
    fee: '',
    fbsMgDl: '',
    fbsMmol: '',
    rbsMgDl: '',
    rbsMmol: ''
  };

  return (
    <div className="space-y-4">
      {/* Facility Type Section */}
      <div className="border rounded-lg p-4">
        <div className="font-semibold text-gray-800 mb-2">Facility Type</div>
        <div className="flex items-center space-x-6 text-sm">
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={labImaging.facilityType === 'within'}
              onChange={() => updateVitals(['labImaging', 'facilityType'], 'within')}
            />
            <span>Within facility</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={labImaging.facilityType === 'partner'}
              onChange={() => updateVitals(['labImaging', 'facilityType'], 'partner')}
            />
            <span>Partner facility</span>
          </label>
        </div>
      </div>

      {/* Date, Fee, and Fasting Blood Sugar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Date of Laboratory Imaging</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={labImaging.date}
            onChange={(e) => updateVitals(['labImaging', 'date'], e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Laboratory/Imaging Fee</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Amount"
            value={labImaging.fee}
            onChange={(e) => updateVitals(['labImaging', 'fee'], e.target.value)}
          />
        </div>
      </div>

      {/* Fasting Blood Sugar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Fasting Blood Sugar (FBS)</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="70-100 mg/dL"
            value={labImaging.fbsMgDl}
            onChange={(e) => updateVitals(['labImaging', 'fbsMgDl'], e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">FBS (mmol/L)</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="3.9-5.5 mmol/L"
            value={labImaging.fbsMmol}
            onChange={(e) => updateVitals(['labImaging', 'fbsMmol'], e.target.value)}
          />
        </div>
      </div>

      {/* Random Blood Sugar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Random Blood Sugar (RBS)</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Less than 200 mg/dL"
            value={labImaging.rbsMgDl}
            onChange={(e) => updateVitals(['labImaging', 'rbsMgDl'], e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">RBS (mmol/L)</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Less than 11.1 mmol/L"
            value={labImaging.rbsMmol}
            onChange={(e) => updateVitals(['labImaging', 'rbsMmol'], e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};