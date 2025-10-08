interface StepperProps {
  step: number;
  steps: string[];
}

const Default = ({ step, steps }: StepperProps) => {
  const percentage = Math.min((step / steps.length) * 100, 100);

  return (
    <div className="w-full h-2 bg-gray-200   overflow-hidden">
      <div
        className="h-full bg-[#283484] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const Chevron = ({ step, steps }: StepperProps) => {
  return (
    <div className="flex w-full">
      {steps.map((label, index) => {
        const isActive = index + 1 === step;
        const isCompleted = index + 1 < step;

        return (
          <div
            key={index}
            className={`flex items-center justify-center px-4 py-2 border ${
              isActive ? "bg-[#283484] text-white" : "bg-white text-gray-600"
            } ${isCompleted ? "border-[#283484]" : "border-gray-300"} ${
              index !== steps.length - 1 ? "border-r-0" : ""
            }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

const ArrowButton = ({ step, steps }: StepperProps) => {
  return (
    <div className="flex w-full overflow-hidden rounded-lg">
      {steps.map((label, index) => {
        const isActive = index + 1 === step;
        const isCompleted = index + 1 < step;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center justify-center px-6 py-3 border ${
              isActive ? "bg-[#283484] text-white" : "bg-white text-gray-600"
            } ${isCompleted ? "border-[#283484]" : "border-gray-300"} ${
              !isLast ? "border-r-0" : ""
            }`}
            style={{
              clipPath: isLast
                ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 0, 85% 0, 92% 50%, 85% 100%, 0 100%)",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};
const Stepper = {
  Default,
  Chevron,
  ArrowButton,
};

export default Stepper;
