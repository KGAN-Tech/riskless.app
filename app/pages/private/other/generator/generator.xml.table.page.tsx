import { useState } from "react";
import FloatingFilterControl from "./FloatingFilterControl";

const mockRecords = [
  {
    id: 1,
    name: "John Doe",
    type: "Consultation",
    date: "2024-03-15",
    status: "Completed",
  },
  {
    id: 2,
    name: "Jane Smith",
    type: "Laboratory",
    date: "2024-03-14",
    status: "Pending",
  },
];

export default function GeneratorXMLIndividualPage() {
    const [records] = useState(mockRecords);
    return(
        <div className="p-6 max-w-3xl mx-auto">
            <FloatingFilterControl />
            <h1 className="text-2xl font-bold mb-4">XML TABLE VIEW</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">ID</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Type</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((rec) => (
                            <tr key={rec.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-800">{rec.id}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{rec.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{rec.type}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{rec.date}</td>
                                <td className="px-4 py-2 text-sm">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                        rec.status === "Completed"
                                            ? "bg-green-100 text-green-800"
                                            : rec.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}>
                                        {rec.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}