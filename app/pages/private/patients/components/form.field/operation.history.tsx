import React, { useState } from "react";

export interface OperationItem {
  name: string;
  date?: string;
}

interface OperationHistoryProps {
  items: OperationItem[];
  onChange: (items: OperationItem[]) => void;
}

const OperationHistory: React.FC<OperationHistoryProps> = ({ items, onChange }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const addItem = () => {
    if (!name.trim()) return;
    onChange([...items, { name: name.trim(), date }]);
    setName("");
    setDate("");
  };

  const removeItem = (index: number) => {
    const next = [...items];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter operation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <ul className="divide-y border rounded-lg">
          {items.map((op, idx) => (
            <li key={`${op.name}-${idx}`} className="flex items-center justify-between px-3 py-2">
              <div className="text-sm text-gray-800">
                <span className="font-medium">{op.name}</span>
                {op.date && <span className="text-gray-500 ml-2">{op.date}</span>}
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OperationHistory;
