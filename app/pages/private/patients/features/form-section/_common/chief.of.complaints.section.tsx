import { useState, type KeyboardEvent } from "react";
import { CHIEF_COMPLAINTS } from "~/app/configuration/others/constant.config.complaints";

interface ChiefComplaintInputProps {
  complaints: string[];
  onChange: (updated: string[]) => void;
}

export const ChiefComplaintInput = ({
  complaints,
  onChange,
}: ChiefComplaintInputProps) => {
  const [query, setQuery] = useState("");

  const filteredSuggestions = CHIEF_COMPLAINTS.filter(
    (c) =>
      c.toLowerCase().includes(query.toLowerCase()) && !complaints.includes(c)
  );

  const addComplaint = (complaint: string) => {
    if (complaint.trim() && !complaints.includes(complaint)) {
      onChange([...complaints, complaint]);
    }
    setQuery("");
  };

  const removeComplaint = (complaint: string) => {
    onChange(complaints.filter((c) => c !== complaint));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === ",") && query.trim()) {
      e.preventDefault();
      addComplaint(query.trim());
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Chief Complaint
      </label>

      {/* Container that stacks chips inline, textarea always last line */}
      <div
        className="p-2 border border-gray-300 rounded-md shadow-sm
                   focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
      >
        {/* Chips flow inline */}
        <div className="flex flex-wrap gap-2 mb-2">
          {complaints.map((c) => (
            <span
              key={c}
              className="flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
            >
              {c}
              <button
                onClick={() => removeComplaint(c)}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Textarea always in last line */}
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or select..."
          rows={2}
          className="w-full resize-none min-h-[40px] px-2 py-1 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Suggestion dropdown */}
      {query && filteredSuggestions.length > 0 && (
        <ul className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map((c) => (
            <li
              key={c}
              onClick={() => addComplaint(c)}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-50"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
