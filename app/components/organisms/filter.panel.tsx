import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Checkbox } from '@/components/atoms/checkbox';

import { ScrollArea } from '@/components/atoms/scroll-area';
import { X, Filter, MapPin, Users, Stethoscope, DollarSign, Activity } from 'lucide-react';


export interface FilterState {
  // Facility/Location Filters
  facilityName: string[];
  region: string[];
  province: string[];
  city: string[];
  municipality: string[];
  barangay: string[];
  urbanRural: string[];
  accreditationType: string[];
  facilityType: string[];

  // Time Filters
  dateRange: { from: Date | null; to: Date | null };
  timePeriod: string;
  fiscalYear: string;

  // Demographics Filters
  ageGroup: string[];
  gender: string[];
  membershipType: string[];
  philhealthCategory: string[];

  // Program/Service Filters
  program: string[];
  serviceType: string[];
  diseaseGroup: string[];
  labTestType: string[];
  medicineCategory: string[];
  prescriptionStatus: string[];

  // Financial/Claim Filters
  claimStatus: string[];
  fundingSource: string[];
  costBracket: string[];

  // Provider/Staff Filters
  provider: string[];
  department: string[];
  staffShift: string[];

  // Outcome/Quality Filters
  screeningStatus: string[];
  controlStatus: string[];
  followupAdherence: string[];
  satisfactionCategory: string[];

  // Operational Filters
  visitType: string[];
  referralStatus: string[];
  stockStatus: string[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  metrics: any;
}

export function FilterPanel({ isOpen, onClose, filters, onFiltersChange, metrics }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const facilityNames: string[] = Array.from(
    new Set(
      (metrics?.encounter?.encountersByFacilityName ?? []).map(
        (i: any) => i.facilityName as string
      )
    )
  );

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
  const currentArray = localFilters[key] as string[];
  const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      facilityName: [],
      region: [],
      province: [],
      city: [],
      municipality: [],
      barangay: [],
      urbanRural: [],
      accreditationType: [],
      facilityType: [],
      dateRange: { from: null, to: null },
      timePeriod: '',
      fiscalYear: '',
      ageGroup: [],
      gender: [],
      membershipType: [],
      philhealthCategory: [],
      program: [],
      serviceType: [],
      diseaseGroup: [],
      labTestType: [],
      medicineCategory: [],
      prescriptionStatus: [],
      claimStatus: [],
      fundingSource: [],
      costBracket: [],
      provider: [],
      department: [],
      staffShift: [],
      screeningStatus: [],
      controlStatus: [],
      followupAdherence: [],
      satisfactionCategory: [],
      visitType: [],
      referralStatus: [],
      stockStatus: []
    };
    setLocalFilters(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (key === 'dateRange') {
        if (value.from || value.to) count++;
      } else if (key === 'timePeriod' || key === 'fiscalYear') {
        if (value) count++;
      } else if (Array.isArray(value) && value.length > 0) {
        count++;
      }
    });
    return count;
  };

  const renderFacilityFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Facility & Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Facility Name</Label>
          <Select
            value={localFilters.facilityName[0] || ""}
            onValueChange={(value) =>
              updateFilter("facilityName", value ? [value] : [])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {facilityNames.map((facilityName) => (
                <SelectItem key={facilityName} value={facilityName}>
                  {facilityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Region</Label>
            <Select value={localFilters.region[0] || ''} onValueChange={(value) => updateFilter('region', value ? [value] : [])}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ncr">NCR</SelectItem>
                <SelectItem value="region-3">Region III</SelectItem>
                <SelectItem value="region-4a">Region IV-A</SelectItem>
                <SelectItem value="region-7">Region VII</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Province</Label>
            <Select value={localFilters.province[0] || ''} onValueChange={(value) => updateFilter('province', value ? [value] : [])}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metro-manila">Metro Manila</SelectItem>
                <SelectItem value="bulacan">Bulacan</SelectItem>
                <SelectItem value="rizal">Rizal</SelectItem>
                <SelectItem value="laguna">Laguna</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Urban vs Rural</Label>
          <div className="flex gap-4 mt-2">
            {['Urban', 'Rural'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.urbanRural.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('urbanRural', type)}
                />
                <Label className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Accreditation Type</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Level 1', 'Level 2', 'Level 3', 'Primary Care'].map(level => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.accreditationType.includes(level)}
                  onCheckedChange={() => toggleArrayFilter('accreditationType', level)}
                />
                <Label className="text-sm">{level}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Facility Type</Label>
          <div className="flex gap-4 mt-2">
            {['Public', 'Private'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.facilityType.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('facilityType', type)}
                />
                <Label className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTimeFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Time Period
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Date Range</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                value={localFilters.dateRange.from ? localFilters.dateRange.from.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  updateFilter('dateRange', {
                    ...localFilters.dateRange,
                    from: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                type="date"
                value={localFilters.dateRange.to ? localFilters.dateRange.to.toISOString().split('T')[0] : ''}
                onChange={(e) => updateFilter('dateRange', { 
                  ...localFilters.dateRange, 
                  to: e.target.value ? new Date(e.target.value) : null 
                })}
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Quick Time Periods</Label>
          <Select value={localFilters.timePeriod} onValueChange={(value) => updateFilter('timePeriod', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fiscal Year</Label>
          <Select value={localFilters.fiscalYear} onValueChange={(value) => updateFilter('fiscalYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fiscal year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">FY 2024</SelectItem>
              <SelectItem value="2023">FY 2023</SelectItem>
              <SelectItem value="2022">FY 2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderDemographicFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Member Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Age Group</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['0-14', '15-49', '50-64', '65+'].map(age => (
              <div key={age} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.ageGroup.includes(age)}
                  onCheckedChange={() => toggleArrayFilter('ageGroup', age)}
                />
                <Label className="text-sm">{age}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Gender</Label>
          <div className="flex gap-4 mt-2">
            {['Male', 'Female'].map(gender => (
              <div key={gender} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.gender.includes(gender)}
                  onCheckedChange={() => toggleArrayFilter('gender', gender)}
                />
                <Label className="text-sm">{gender}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Membership Type</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Indigent', 'Employed', 'Lifetime', 'Dependent'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.membershipType.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('membershipType', type)}
                />
                <Label className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>PhilHealth Category</Label>
          <div className="flex gap-4 mt-2">
            {['YAKAP Enrollee', 'Non-YAKAP'].map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.philhealthCategory.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('philhealthCategory', category)}
                />
                <Label className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProgramServiceFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Programs & Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Program</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['YAKAP', 'GAMOT', 'Laboratory', 'Cancer Screening'].map(program => (
              <div key={program} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.program.includes(program)}
                  onCheckedChange={() => toggleArrayFilter('program', program)}
                />
                <Label className="text-sm">{program}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Service Type</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Consultation', 'Screening', 'Lab Test', 'Medicines', 'Procedures'].map(service => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.serviceType.includes(service)}
                  onCheckedChange={() => toggleArrayFilter('serviceType', service)}
                />
                <Label className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Disease/Diagnosis Group</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Hypertension', 'Diabetes', 'TB', 'Cancer', 'Maternal Health', 'Respiratory'].map(disease => (
              <div key={disease} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.diseaseGroup.includes(disease)}
                  onCheckedChange={() => toggleArrayFilter('diseaseGroup', disease)}
                />
                <Label className="text-sm">{disease}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Medicine Category</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Antihypertensives', 'Insulin', 'Antibiotics', 'Pain Relief', 'Cardiovascular'].map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.medicineCategory.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('medicineCategory', category)}
                />
                <Label className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financial & Claims
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Claim Status</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Submitted', 'Pending', 'Approved', 'Denied'].map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.claimStatus.includes(status)}
                  onCheckedChange={() => toggleArrayFilter('claimStatus', status)}
                />
                <Label className="text-sm">{status}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Funding Source</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['PhilHealth', 'LGU Subsidy', 'Patient OOP'].map(source => (
              <div key={source} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.fundingSource.includes(source)}
                  onCheckedChange={() => toggleArrayFilter('fundingSource', source)}
                />
                <Label className="text-sm">{source}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Cost Bracket</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['₱0-5k', '₱5k-10k', '₱10k-25k', '₱25k+'].map(bracket => (
              <div key={bracket} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.costBracket.includes(bracket)}
                  onCheckedChange={() => toggleArrayFilter('costBracket', bracket)}
                />
                <Label className="text-sm">{bracket}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderQualityFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Quality & Outcomes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Screening Status</Label>
          <div className="flex gap-4 mt-2">
            {['Eligible', 'Screened', 'Overdue'].map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.screeningStatus.includes(status)}
                  onCheckedChange={() => toggleArrayFilter('screeningStatus', status)}
                />
                <Label className="text-sm">{status}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Control Status</Label>
          <div className="flex gap-4 mt-2">
            {['Controlled', 'Uncontrolled'].map(status => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.controlStatus.includes(status)}
                  onCheckedChange={() => toggleArrayFilter('controlStatus', status)}
                />
                <Label className="text-sm">{status}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Satisfaction Category</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Excellent', 'Good', 'Fair', 'Poor'].map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={localFilters.satisfactionCategory.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('satisfactionCategory', category)}
                />
                <Label className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end">
      <div className="bg-background w-[800px] h-full shadow-xl border-l">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2>Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-70px)]">
          <div className="p-6 space-y-6">
            {renderTimeFilters()}
            {renderFacilityFilters()}
            {renderDemographicFilters()}
            {renderProgramServiceFilters()}
            {renderFinancialFilters()}
            {renderQualityFilters()}
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}