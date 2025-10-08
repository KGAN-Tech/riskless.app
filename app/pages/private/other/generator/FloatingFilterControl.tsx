import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const cityOptions = [
  "Manila",
  "Quezon City",
  "Makati",
  "Pasig",
  "Taguig",
  "Caloocan",
];

export default function FloatingFilterControl() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("individual");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition mb-2"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle Filters"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
      {open && (
        <div className="w-80 bg-white rounded-xl shadow-2xl p-6 border border-gray-200 flex flex-col gap-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="individual">Individual</option>
              <option value="batch">Batch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {/* You can add an Apply/Reset button here if needed */}
        </div>
      )}
    </div>
  );
} 