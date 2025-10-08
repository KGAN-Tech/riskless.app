"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Checkbox } from "@/components/atoms/checkbox";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Filter, X } from "lucide-react";

export interface FilterField {
  key: "status" | "type" | "category";
  label: string;
  options: string[];
}

export interface LibraryFilterState {
  status: string[];
  type: string[];
  category: string[];
}

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: LibraryFilterState) => void;
  currentFilters: LibraryFilterState;
  filterFields: FilterField[];
}

export default function FilterPanel({
  open,
  onOpenChange,
  onApply,
  currentFilters,
  filterFields,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<LibraryFilterState>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const toggleOption = (field: keyof LibraryFilterState, value: string) => {
    setLocalFilters((prev) => {
      const list = prev[field];
      const newList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [field]: newList };
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const cleared: LibraryFilterState = {
      status: [],
      type: [],
      category: [],
    };
    setLocalFilters(cleared);
    onApply(cleared);
    onOpenChange(false);
  };

  const activeCount = Object.values(localFilters).reduce((sum, arr) => sum + arr.length, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex justify-end">
      <div className="bg-white dark:bg-zinc-900 h-full w-[320px] border-l shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeCount} active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-6">
            {filterFields.map((field) => (
              <Card key={field.key}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{field.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Checkbox
                          checked={localFilters[field.key].includes(option)}
                          onCheckedChange={() => toggleOption(field.key, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t flex gap-2">
          <Button className="w-full" onClick={handleApply}>
            Apply
          </Button>
          <Button className="w-full" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
