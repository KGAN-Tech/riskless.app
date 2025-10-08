import React, { useState, useMemo } from 'react';
import { type FilterState, type ReportType } from '../../../types/reports';
import { Badge } from '../../../components/atoms/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/atoms/table';
import { Button } from '../../../components/atoms/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportsTableProps {
  reportType: ReportType;
  filters: FilterState;
}

// Mock data for demonstration
const mockTableData = {
  registration: [
    { name: 'Jane Smith', status: 'Completed', date: '2025-08-21', location: 'New York', organization: 'Tech Solutions Inc.' },
    { name: 'Lisa Davis', status: 'Completed', date: '2025-08-21', location: 'Chicago', organization: 'Acme Corp' },
    { name: 'Jane Smith', status: 'Completed', date: '2025-08-20', location: 'Chicago', organization: 'Global Services Ltd.' },
    { name: 'John Doe', status: 'Completed', date: '2025-08-20', location: 'New York', organization: 'Global Services Ltd.' },
    { name: 'David Brown', status: 'Completed', date: '2025-08-19', location: 'New York', organization: 'Tech Solutions Inc.' },
    { name: 'Sarah Johnson', status: 'Completed', date: '2025-08-18', location: 'Los Angeles', organization: 'Tech Solutions Inc.' },
    { name: 'Mike Wilson', status: 'Completed', date: '2025-08-18', location: 'Chicago', organization: 'Acme Corp' },
    { name: 'Emily Davis', status: 'Completed', date: '2025-08-17', location: 'Houston', organization: 'Global Services Ltd.' },
    { name: 'Chris Brown', status: 'Completed', date: '2025-08-17', location: 'New York', organization: 'Tech Solutions Inc.' },
    { name: 'Amy Wilson', status: 'Completed', date: '2025-08-16', location: 'Chicago', organization: 'Acme Corp' },
    { name: 'Michael Johnson', status: 'Completed', date: '2025-08-16', location: 'Los Angeles', organization: 'Global Services Ltd.' },
    { name: 'Jessica Davis', status: 'Completed', date: '2025-08-15', location: 'New York', organization: 'Tech Solutions Inc.' },
  ],
  fpe: [
    { name: 'Sarah Wilson', status: 'Completed', date: '2025-08-19', location: 'Los Angeles', organization: 'Global Services Ltd.' },
    { name: 'David Brown', status: 'Completed', date: '2025-08-18', location: 'Chicago', organization: 'Acme Corp' },
  ],
  consultation: [
    { name: 'John Doe', status: 'Completed', date: '2025-08-17', location: 'New York', organization: 'Tech Solutions Inc.' },
    { name: 'Sarah Wilson', status: 'Completed', date: '2025-08-17', location: 'Houston', organization: 'Global Services Ltd.' },
  ]
};

const ITEMS_PER_PAGE = 5;

export const ReportsTable: React.FC<ReportsTableProps> = ({
  reportType,
  filters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const data = mockTableData[reportType] || [];

  // Apply filters to the data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter by location - compare directly with the data values
      if (filters.location !== "all") {
        // Convert filter value to match data format (e.g., "new-york" -> "New York")
        const filterLocation = filters.location
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        if (item.location !== filterLocation) {
          return false;
        }
      }
      
      // Filter by organization - compare directly with the data values
      if (filters.organization !== "all") {
        // Convert filter value to match data format
        const filterOrganization = filters.organization
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Handle special case for "Acme Corp" vs "Acme Corporation"
        let expectedOrg = filterOrganization;
        if (filters.organization === 'acme-corp') {
          expectedOrg = 'Acme Corp';
        }
        
        if (item.organization !== expectedOrg) {
          return false;
        }
      }
      
      // Filter by date range
      if (filters.dateRange.from && filters.dateRange.to) {
        const itemDate = new Date(item.date);
        if (itemDate < filters.dateRange.from! || itemDate > filters.dateRange.to!) {
          return false;
        }
      }
      
      return true;
    });
  }, [data, filters]);

  // Calculate pagination data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'twofaq': return 'warning';
      case 'cristobal': return 'secondary';
      default: return 'default';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Page info
    buttons.push(
      <span key="page-info" className="text-sm text-muted-foreground px-2">
        Page {currentPage} of {totalPages}
      </span>
    );

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold capitalize">{reportType} Reports</h2>
        <p className="text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer hover:bg-accent">Date ↓</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Organization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(item.status) as any}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.organization}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2">
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </div>
  );
};