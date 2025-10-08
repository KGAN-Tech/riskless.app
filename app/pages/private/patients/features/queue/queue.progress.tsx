import { useState } from "react";
import {
  Loader2,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Queue = {
  id: string;
  number: string;
  position: string;
  status: "waiting" | "in_progress" | "completed" | "cancelled";
  date: string;
  startAt?: string;
  endAt?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  facilty: {
    id: string;
    name: string;
  };
  counter: {
    id: string;
    name: string;
    code: string;
  };
};

interface QueueProgressPageProps {
  queues: Queue[];
  loading?: boolean;
}

export default function QueueProgressPage({
  queues,
  loading = false,
}: QueueProgressPageProps) {
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

  const getStatusIcon = (status: Queue["status"]) => {
    switch (status) {
      case "waiting":
        return <Clock className="text-gray-500 w-5 h-5" />;
      case "in_progress":
        return <PlayCircle className="text-blue-500 w-5 h-5" />;
      case "completed":
        return <CheckCircle2 className="text-green-500 w-5 h-5" />;
      case "cancelled":
        return <XCircle className="text-red-500 w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Queue["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-gray-100 text-gray-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
    }
  };

  const formatName = (p: Queue["patient"]) =>
    `${p.lastName}, ${p.firstName} ${p.middleName ?? ""}`.trim();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Queue Progress</h1>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Patient
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Counter
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Facility
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queues.map((queue) => (
                <tr
                  key={queue.id}
                  onClick={() => setSelectedQueue(queue.id)}
                  className={`cursor-pointer transition ${
                    selectedQueue === queue.id
                      ? "bg-teal-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">{queue.number}</td>
                  <td className="px-4 py-3">{formatName(queue.patient)}</td>
                  <td className="px-4 py-3">{queue.counter.name}</td>
                  <td className="px-4 py-3">{queue.facilty.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        queue.status
                      )}`}
                    >
                      {getStatusIcon(queue.status)}
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(queue.date).toLocaleString()}
                  </td>
                </tr>
              ))}
              {queues.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No queues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
