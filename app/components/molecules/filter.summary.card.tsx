import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { type FilterState } from '@/components/organisms/filter.panel';
import { CalendarIcon, MapPin, Users, Building } from 'lucide-react';

interface FilterSummaryCardProps {
  filters: FilterState;
}

export function FilterSummaryCard({ filters }: FilterSummaryCardProps) {
  const getActiveSummary = () => {
    const summary = {
      facilities: filters.facilityName.length,
      regions: filters.region.length,
      demographics: filters.ageGroup.length + filters.gender.length + filters.membershipType.length,
      programs: filters.program.length + filters.serviceType.length,
      hasDateFilter: !!(filters.dateRange.from || filters.dateRange.to || filters.timePeriod),
      totalActiveFilters: 0
    };

    // Count total active filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'dateRange') {
        if ((value as any).from || (value as any).to) summary.totalActiveFilters++;
      } else if (key === 'timePeriod' || key === 'fiscalYear') {
        if (value) summary.totalActiveFilters++;
      } else if (Array.isArray(value) && value.length > 0) {
        summary.totalActiveFilters++;
      }
    });

    return summary;
  };

  const summary = getActiveSummary();

  if (summary.totalActiveFilters === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No filters applied</p>
            <p className="text-xs">Showing data for all facilities and time periods</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">{summary.totalActiveFilters}</Badge>
          Active Filters Applied
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {summary.facilities > 0 && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span>{summary.facilities} facilities</span>
            </div>
          )}
          
          {summary.regions > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{summary.regions} regions</span>
            </div>
          )}
          
          {summary.demographics > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>{summary.demographics} demographics</span>
            </div>
          )}
          
          {summary.hasDateFilter && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              <span>Date filtered</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}