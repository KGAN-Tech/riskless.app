import React, { useState, useEffect } from 'react';

interface AvailmentService {
  name: string;
  description?: string;
  isPerformed: boolean;
  datePerformed?: Date;
  performedBy: string;
}

interface PlanManagementSectionProps {
  consultationData: any;
  updateConsultation: (path: string[], value: any) => void;
}

export const PlanManagementSection: React.FC<PlanManagementSectionProps> = ({
  consultationData,
  updateConsultation,
}) => {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const laboratoryTests = [
    "Random Blood Sugar",
    "CBC w/ platelet count",
    "Chest X-Ray",
    "Creatinine",
    "Electrocardiogram (ECG)",
    "Fasting Blood Sugar",
    "Fecal Occult Blood",
    "Pecalyxia",
    "HbA1c",
    "Lipid Profile",
    "Oral Glucose Tolerance Test",
    "Pap Smear",
    "PPD Test (Tuberculosis)",
    "Sputum Microscopy",
    "Urinalysis",
    "Others",
  ];

  // Initialize laboratoryTests as empty array if it doesn't exist
  useEffect(() => {
    if (!isInitialized && consultationData.plan && !consultationData.plan.laboratoryTests) {
      updateConsultation(['plan', 'laboratoryTests'], []);
      setIsInitialized(true);
    }
  }, [consultationData, isInitialized, updateConsultation]);

  const addLaboratoryTest = () => {
    if (!selectedTest) return;

    const currentTests = Array.isArray(consultationData.plan?.laboratoryTests) 
      ? consultationData.plan.laboratoryTests 
      : [];
    
    const newTest: AvailmentService = {
      name: selectedTest,
      description: '',
      isPerformed: false,
      datePerformed: undefined,
      performedBy: '',
    };

    // Check if test already exists
    const exists = currentTests.some((test: AvailmentService) => test.name === selectedTest);
    if (!exists) {
      updateConsultation(['plan', 'laboratoryTests'], [...currentTests, newTest]);
    }
    setSelectedTest('');
  };

  // Handle Enter key press on dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLaboratoryTest();
    }
  };

  const updateTest = (index: number, field: keyof AvailmentService, value: any) => {
    const currentTests = Array.isArray(consultationData.plan?.laboratoryTests) 
      ? [...consultationData.plan.laboratoryTests] 
      : [];
    
    if (currentTests[index]) {
      currentTests[index] = { ...currentTests[index], [field]: value };
      updateConsultation(['plan', 'laboratoryTests'], currentTests);
    }
  };

  const removeTest = (index: number) => {
    const currentTests = Array.isArray(consultationData.plan?.laboratoryTests) 
      ? consultationData.plan.laboratoryTests 
      : [];
    const updatedTests = currentTests.filter((_: any, i: number) => i !== index);
    updateConsultation(['plan', 'laboratoryTests'], updatedTests);
  };

  // Get current tests for display
  const getCurrentTests = () => {
    if (!consultationData.plan) return [];
    return Array.isArray(consultationData.plan.laboratoryTests) 
      ? consultationData.plan.laboratoryTests 
      : [];
  };

  const currentTests = getCurrentTests();

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      {/* Laboratory/Imaging Examination Section */}
      <div className="border rounded-lg p-4">
        <div className="font-semibold text-gray-800 mb-4">
          A. Laboratory/Imaging Examination
        </div>

        {/* Dropdown to add tests */}
        <div className="flex gap-2 mb-4">
          <select
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            onKeyDown={handleKeyDown}
          >
            <option value="">Select a laboratory test...</option>
            {laboratoryTests.map((test) => (
              <option key={test} value={test}>
                {test}
              </option>
            ))}
          </select>
          <button
            onClick={addLaboratoryTest}
            disabled={!selectedTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Test
          </button>
        </div>

        {/* Test Cards */}
        <div className="space-y-3">
          {currentTests.map((test: AvailmentService, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-800">{test.name}</h4>
                <button
                  onClick={() => removeTest(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Enter description..."
                    value={test.description || ''}
                    onChange={(e) => updateTest(index, 'description', e.target.value)}
                  />
                </div>

                {/* Performed By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Performed By
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter performer name..."
                    value={test.performedBy || ''}
                    onChange={(e) => updateTest(index, 'performedBy', e.target.value)}
                  />
                </div>

                {/* Is Performed */}
                <div>
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                      checked={test.isPerformed || false}
                      onChange={(e) => updateTest(index, 'isPerformed', e.target.checked)}
                    />
                    <span>Test Performed</span>
                  </label>
                </div>

                {/* Date Performed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Performed
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={test.datePerformed ? new Date(test.datePerformed).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updateTest(index, 'datePerformed', e.target.value ? new Date(e.target.value) : undefined)}
                    disabled={!test.isPerformed}
                  />
                </div>
              </div>
            </div>
          ))}

          {currentTests.length === 0 && (
            <div className="text-gray-500 text-center py-4 border rounded-lg bg-gray-50">
              No laboratory tests added yet. Select a test from the dropdown above to get started.
            </div>
          )}
        </div>
      </div>

      {/* Management Section */}
      <div className="border rounded-lg p-4">
        <div className="font-semibold text-gray-800 mb-2">
          B. Management (check if done)
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 mr-2"
              checked={consultationData.plan?.managementNotApplicable || false}
              onChange={(e) => {
                updateConsultation(['plan', 'managementNotApplicable'], e.target.checked);
                if (e.target.checked) {
                  updateConsultation(['plan', 'managementItems'], []);
                }
              }}
            />
            <span>Not Applicable</span>
          </label>

          {[
            'Breastfeeding Program Education',
            'Counseling for Smoking Cessation',
            'Counseling for Lifestyle Modification',
            'Oral Check-up and Prophylaxis',
            'Others',
          ].map((item) => (
            <label key={item} className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                checked={consultationData.plan?.managementItems?.includes(item) || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateConsultation(['plan', 'managementNotApplicable'], false);
                  }

                  const current = consultationData.plan?.managementItems || [];
                  const next = e.target.checked
                    ? [...current, item]
                    : current.filter((x: string) => x !== item);
                  updateConsultation(['plan', 'managementItems'], next);
                }}
                disabled={consultationData.plan?.managementNotApplicable}
              />
              <span className={consultationData.plan?.managementNotApplicable ? 'text-gray-400' : ''}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};