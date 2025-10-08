import { useState } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useToast } from "~/app/components/atoms/use-toast";

type Counter = {
  id: string;
  name: string;
  status: "active" | "inactive" | "deleted";
  type: string[];
  category: string;
  code: string;
};

interface CreateQueuePageProps {
  counters: Counter[];
  patientId: string;
  facilityId: string;
  userId: string;
  onCreate?: (payload: any) => Promise<void>;
}

export default function CreateQueuePage({
  counters,
  patientId,
  facilityId,
  userId,
  onCreate,
}: CreateQueuePageProps) {
  const [selectedCounter, setSelectedCounter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!selectedCounter) return;

    const payload = {
      process: "default",
      patientId,
      facilityId: facilityId,
      counterId: selectedCounter,
      userId,
    };

    try {
      setLoading(true);
      // simulate API call if no handler is provided
      if (onCreate) {
        await onCreate(payload);
      } else {
        await new Promise((res) => setTimeout(res, 1500));
      }

      toast({
        title: "Queue Created",
        description: "The patient has been added to the queue successfully.",
        className: "bg-green-50 border-green-300 text-green-800",
      });
      setSelectedCounter(null);
    } catch (error) {
      toast({
        title: "Failed to Create Queue",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Create Queue</h1>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {counters.map((counter) => {
          const isSelected = selectedCounter === counter.id;
          return (
            <div
              key={counter.id}
              onClick={() => {
                if (counter.status !== "active") return;

                setSelectedCounter((prev) =>
                  prev === counter.id ? null : counter.id
                );
              }}
              className={`relative cursor-pointer rounded-2xl border p-4 shadow-sm transition 
                ${
                  isSelected
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:shadow-md"
                }
                ${
                  counter.status !== "active"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {/* Selection Icon */}
              <div className="absolute top-3 right-3">
                {isSelected ? (
                  <CheckCircle className="text-teal-500 w-6 h-6" />
                ) : (
                  <Circle className="text-gray-400 w-6 h-6" />
                )}
              </div>

              {/* Counter Info */}
              <h2 className="text-lg font-medium">{counter.name}</h2>
              <p className="text-sm text-gray-600">{counter.category}</p>
              <p className="text-xs text-gray-500 mt-2">Code: {counter.code}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {counter.type.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!selectedCounter || loading}
          className={`px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 transition
            ${
              !selectedCounter || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }
          `}
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Creating..." : "Create Queue"}
        </button>
      </div>
    </div>
  );
}
