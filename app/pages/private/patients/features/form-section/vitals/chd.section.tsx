import React from "react";

interface CHDSectionProps {
  vitalsData: any;
  updateVitals: (path: string[], value: any) => void;
}

export const CHDSection: React.FC<CHDSectionProps> = ({
  vitalsData,
  updateVitals
}) => {
  // Define questions and options data for mapping
  const questions = [
    {
      key: 'highFatHighSalt',
      label: 'High Fat/High Salt Food Intake - Eats processed/fast foods (e.g. instant noodles, hamburgers, fries, fried chicken skin etc.) and inaw-inaw (e.g. isaw, adidas, etc.) weekly'
    },
    {
      key: 'fiberVeg',
      label: 'Dietary Fiber Intake - 3 servings vegetables daily'
    },
    {
      key: 'fiberFruits',
      label: 'Dietary Fiber Intake - 2-3 servings of fruits daily'
    },
    {
      key: 'physicalActivity',
      label: 'Physical Activities - Does at least 2.5 hours a week of moderate-intensity physical activity'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Render each question dynamically */}
      {questions.map((q) => (
        <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">{q.label}</div>
          <div className="flex items-center space-x-6 text-sm">
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={(vitalsData.chd as any)[q.key] === 'yes'}
                onChange={() => updateVitals(['chd', q.key], 'yes')}
              />
              <span>Yes</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                className="form-radio text-blue-600"
                checked={(vitalsData.chd as any)[q.key] === 'no'}
                onChange={() => updateVitals(['chd', q.key], 'no')}
              />
              <span>No</span>
            </label>
          </div>
        </div>
      ))}

      {/* Diabetes Diagnosed Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Presence or absence of Diabetes - 1. Was patient diagnosed as having diabetes?
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={vitalsData.chd.diabetesDiagnosed === 'yes'}
              onChange={() => updateVitals(['chd', 'diabetesDiagnosed'], 'yes')}
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={vitalsData.chd.diabetesDiagnosed === 'no'}
              onChange={() => updateVitals(['chd', 'diabetesDiagnosed'], 'no')}
            />
            <span>No</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={vitalsData.chd.diabetesDiagnosed === 'unknown'}
              onChange={() => updateVitals(['chd', 'diabetesDiagnosed'], 'unknown')}
            />
            <span>Do Not Know</span>
          </label>
        </div>
      </div>
    </div>
  );
};
