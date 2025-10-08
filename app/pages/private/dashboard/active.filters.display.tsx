import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { X } from 'lucide-react';
import { type FilterState } from '@/components/organisms/filter.panel';

interface ActiveFiltersDisplayProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({ filters, onRemoveFilter, onClearAll }: ActiveFiltersDisplayProps) {
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: keyof FilterState; label: string; value: string; displayValue: string }> = [];

    Object.entries(filters).forEach(([key, value]) => {
      const filterKey = key as keyof FilterState;
      
      if (filterKey === 'dateRange') {
        const dateRange = value as { from: Date | null; to: Date | null };
        if (dateRange.from || dateRange.to) {
          const fromStr = dateRange.from ? dateRange.from.toLocaleDateString() : '';
          const toStr = dateRange.to ? dateRange.to.toLocaleDateString() : '';
          activeFilters.push({
            key: filterKey,
            label: 'Date Range',
            value: 'dateRange',
            displayValue: `${fromStr} - ${toStr}`
          });
        }
      } else if (filterKey === 'timePeriod' || filterKey === 'fiscalYear') {
        if (value) {
          activeFilters.push({
            key: filterKey,
            label: filterKey === 'timePeriod' ? 'Time Period' : 'Fiscal Year',
            value: value as string,
            displayValue: value as string
          });
        }
      } else if (Array.isArray(value) && value.length > 0) {
        value.forEach(item => {
          activeFilters.push({
            key: filterKey,
            label: getFilterLabel(filterKey),
            value: item,
            displayValue: item
          });
        });
      }
    });

    return activeFilters;
  };

  const getFilterLabel = (key: keyof FilterState): string => {
    const labels: Record<keyof FilterState, string> = {
      facilityName: 'Facility',
      region: 'Region',
      province: 'Province',
      city: 'City',
      municipality: 'Municipality',
      barangay: 'Barangay',
      urbanRural: 'Area Type',
      accreditationType: 'Accreditation',
      facilityType: 'Facility Type',
      dateRange: 'Date Range',
      timePeriod: 'Time Period',
      fiscalYear: 'Fiscal Year',
      ageGroup: 'Age Group',
      gender: 'Gender',
      membershipType: 'Membership',
      philhealthCategory: 'PhilHealth Category',
      program: 'Program',
      serviceType: 'Service Type',
      diseaseGroup: 'Disease Group',
      labTestType: 'Lab Test',
      medicineCategory: 'Medicine Category',
      prescriptionStatus: 'Prescription Status',
      claimStatus: 'Claim Status',
      fundingSource: 'Funding Source',
      costBracket: 'Cost Bracket',
      provider: 'Provider',
      department: 'Department',
      staffShift: 'Staff Shift',
      screeningStatus: 'Screening Status',
      controlStatus: 'Control Status',
      followupAdherence: 'Follow-up',
      satisfactionCategory: 'Satisfaction',
      visitType: 'Visit Type',
      referralStatus: 'Referral Status',
      stockStatus: 'Stock Status'
    };
    return labels[key] || key;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap p-4 bg-muted/50 border-b">
      <span className="text-sm font-medium">Active Filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge key={`${filter.key}-${filter.value}-${index}`} variant="secondary" className="flex items-center gap-1">
          <span className="text-xs font-medium">{filter.label}:</span>
          <span className="text-xs">{filter.displayValue}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1 hover:bg-transparent"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs"
        onClick={onClearAll}
      >
        Clear All
      </Button>
    </div>
  );
}