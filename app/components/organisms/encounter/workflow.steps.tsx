import { Check } from 'lucide-react';

interface StepProps {
    number: number,
    title: string,
    description: string,
}

interface WorkflowStepsProps {
  currentStep: number,
  steps: StepProps[],
}

export function WorkflowSteps({ currentStep, steps }: WorkflowStepsProps) {

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors
              ${currentStep > step.number 
                ? 'bg-green-500 text-white' 
                : currentStep === step.number 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="ml-4">
              <p className={`text-sm ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className={`
              flex-1 h-px mx-8 transition-colors
              ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  );
}