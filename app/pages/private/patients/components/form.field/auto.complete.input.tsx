import { useState } from "react";

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  placeholder: string;
}

const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
}: AutocompleteInputProps) => {
  const [show, setShow] = useState(false);
  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  return (
    <div className="relative w-full">
      <input
        className="w-full px-3 py-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
      />
      {show && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <li
              key={s}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onChange(s);
                setShow(false);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
