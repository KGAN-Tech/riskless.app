import { Plus, FileX } from "lucide-react";

export const CreateNewEncounterSection = () => {
  const handleCreateEncounter = () => {
    // Add your create encounter logic here
    console.log("Creating new encounter...");
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center w-full">
      {/* Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <FileX className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Records Found
      </h3>

      {/* Description */}
      <p className="text-gray-500 mb-8 max-w-md">
        You haven't created any encounters yet. Get started by creating your
        first encounter.
      </p>

      {/* Create Button */}
      <button
        onClick={handleCreateEncounter}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus className="w-5 h-5" />
        Create New Encounter
      </button>
    </div>
  );
};
