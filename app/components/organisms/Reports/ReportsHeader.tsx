import React from 'react';
import { Filter, BarChart3, Table, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Input } from '../../../components/atoms/input';
import { type ViewType } from '../../../types/reports';

interface ReportsHeaderProps {
  onFilterToggle: () => void;
  onViewTypeChange: (viewType: ViewType) => void;
  viewType: ViewType;
  isFilterOpen: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onFilterToggle,
  onViewTypeChange,
  viewType,
  isFilterOpen,
  onBack,
  showBackButton = false,
}) => {
  return (
    <header className="bg-surface border-b border-card-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Monitor and analyze registration data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search reports..."
            className="w-64"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewTypeChange('table')}
              className={viewType === 'table' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewTypeChange('chart')}
              className={viewType === 'chart' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Chart
            </Button>
          </div>
          
          <Button
            variant={isFilterOpen ? 'default' : 'outline'}
            onClick={onFilterToggle}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </header>
  );
};
