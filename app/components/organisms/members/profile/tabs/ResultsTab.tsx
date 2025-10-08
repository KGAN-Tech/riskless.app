import { useState } from "react";

import { Calendar, Download, FileText, Plus, FileUp } from "lucide-react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

interface TestResult {
  id: number;
  date: string;
  testName: string;
  category: string;
  status: "pending" | "completed" | "cancelled";
  result?: string;
  referenceRange?: string;
  unit?: string;
  notes?: string;
  attachments?: {
    id: number;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
}

interface ResultsTabProps {
  results: TestResult[];
}

export function ResultsTab({ results }: ResultsTabProps) {
  const [selectedResult, setSelectedResult] = useState<number | null>(
    results.find((r) => r.status === "completed")?.id || null
  );

  const currentResult = results.find((r) => r.id === selectedResult);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Results List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Test
          </Button>
        </div>
        <div className="space-y-2">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-gray-50",
                selectedResult === result.id ? "bg-blue-50" : ""
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{result.date}</span>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    result.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : result.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {result.status.charAt(0).toUpperCase() +
                    result.status.slice(1)}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-600">{result.testName}</p>
                <p className="text-xs text-gray-500">{result.category}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Result Details */}
      <Card className="p-6 md:col-span-2">
        {currentResult ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {currentResult.testName}
                </h3>
                <p className="text-sm text-gray-500">{currentResult.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentResult.attachments?.map((attachment) => (
                  <Button
                    key={attachment.id}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(attachment.url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    {attachment.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{currentResult.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{currentResult.status}</p>
              </div>
            </div>

            {currentResult.status === "completed" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Result</p>
                    <p className="font-medium">{currentResult.result}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reference Range</p>
                    <p className="font-medium">
                      {currentResult.referenceRange}
                    </p>
                  </div>
                  {currentResult.unit && (
                    <div>
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="font-medium">{currentResult.unit}</p>
                    </div>
                  )}
                </div>

                {currentResult.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">
                      {currentResult.notes}
                    </p>
                  </div>
                )}
              </>
            )}

            {currentResult.status === "pending" && (
              <div className="text-center py-8">
                <FileUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Results are pending. Please check back later.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No test results found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
