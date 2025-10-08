import { ReactNode } from "react";

interface FormSectionProps {
  ref?: React.RefObject<HTMLDivElement>;
  title?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

export const FormSection = ({
  ref,
  title,
  description,
  required = false,
  children,
}: FormSectionProps) => {
  return (
    <section
      ref={ref}
      id={`form-section-${title && title.replace(/\s/g, "-").toLowerCase()}`}
      className="bg-white rounded-lg border border-gray-200 p-6 mb-4 shadow-md"
    >
      {title && (
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h2>
      )}
      {description && description !== "" && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
};
