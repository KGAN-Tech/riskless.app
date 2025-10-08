interface YesNoWithTextValue {
  isTrue: boolean | null;
  details: string;
}

const QuestionCard: React.FC<{
  title: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ title, required, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-3 text-sm font-medium text-gray-900">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      {children}
    </div>
  );
};

import { useState } from "react";

export type YesNoTextValue = {
  answer: "yes" | "no" | null;
  details: string;
};

type YesNoTextProps = {
  label: string;
  value: YesNoTextValue;
  onChange: (val: YesNoTextValue) => void;
};

export default function YesNoText({ label, value, onChange }: YesNoTextProps) {
  const handleAnswerChange = (answer: "yes" | "no") => {
    onChange({ ...value, answer });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, details: e.target.value });
  };

  return (
    <div className="flex flex-col gap-2 p-2 border rounded-md">
      <label className="font-medium">{label}</label>

      <div className="flex gap-4">
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            value.answer === "yes" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleAnswerChange("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            value.answer === "no" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleAnswerChange("no")}
        >
          No
        </button>
      </div>

      {/* Show text box only if Yes */}
      {value.answer === "yes" && (
        <input
          type="text"
          value={value.details}
          placeholder="Provide details"
          className="border rounded p-2 w-full"
          onChange={handleDetailsChange}
        />
      )}
    </div>
  );
}
