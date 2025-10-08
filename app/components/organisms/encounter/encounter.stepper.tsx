import React from "react";
import { Check, Lock } from "lucide-react";

interface EncounterStepperProps {
  currentStep: number;
  steps: string[];
  onStepChange: (step: number) => void;
  completedSteps?: number[];
  validationErrors?: Record<number, string[]>;
  stepValidators?: ((stepData: any) => { isValid: boolean; errors: string[] })[];
  stepData?: any;
}

export const EncounterStepper: React.FC<EncounterStepperProps> = ({
  currentStep,
  steps,
  onStepChange,
  completedSteps = [],
  validationErrors = {},
  stepValidators = [],
  stepData,
}) => {
  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  const isStepAccessible = (stepIndex: number) => {
    // Allow access to all steps - no validation required
    return true;
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex === currentStep) return "current";
    if (isStepCompleted(stepIndex)) return "completed";
    if (isStepAccessible(stepIndex)) return "accessible";
    return "locked";
  };

  const handleStepClick = (stepIndex: number) => {
    if (isStepAccessible(stepIndex)) {
      onStepChange(stepIndex);
    }
  };

  const getStepIcon = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "locked":
        return <Lock className="w-4 h-4" />;
      default:
        return <span className="text-sm font-medium">{stepIndex + 1}</span>;
    }
  };

  const getStepClasses = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const hasErrors = validationErrors[stepIndex] && validationErrors[stepIndex].length > 0;
    
    const baseClasses = "flex-1 py-3 px-4 text-center transition-all duration-200 flex items-center justify-center gap-2";
    
    switch (status) {
      case "current":
        return `${baseClasses} bg-blue-600 text-white font-medium shadow-md`;
      case "completed":
        return `${baseClasses} bg-green-600 text-white font-medium hover:bg-green-700 cursor-pointer`;
      case "accessible":
        return `${baseClasses} bg-white text-gray-600 hover:bg-gray-50 cursor-pointer border-l border-gray-200`;
      case "locked":
        return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed border-l border-gray-200`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="mb-3">
      <nav className="flex items-center justify-center">
        <div className="flex w-full bg-white rounded-lg shadow overflow-hidden">
          {steps.map((step, index) => (
            <div key={step} className="relative flex-1">
              <button
                onClick={() => handleStepClick(index)}
                className={getStepClasses(index)}
                disabled={!isStepAccessible(index)}
              >
                {getStepIcon(index)}
                <span className="text-sm">{step}</span>
              </button>
              
              {/* Error indicator */}
              {validationErrors[index] && validationErrors[index].length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {validationErrors[index].length}
                  </span>
                </div>
              )}
              
              {/* Progress indicator */}
              {index < steps.length - 1 && (
                <div className={`absolute top-1/2 -right-0.5 w-1 h-8 transform -translate-y-1/2 ${
                  isStepCompleted(index) ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </nav>
      
      {/* Validation errors display */}
      {validationErrors[currentStep] && validationErrors[currentStep].length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following issues to continue:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors[currentStep].map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
