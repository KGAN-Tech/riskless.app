import { Edit, Filter, Search, Trash, Upload } from "lucide-react";
import { Card } from "@/components/atoms/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Input } from "~/app/components/atoms/input";
import { libraryService } from "@/services/library.service";
import { useEffect, useState } from "react";
import { Button } from "~/app/components/atoms/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/components/atoms/dialog";
import FileUploadCard from "@/components/templates/cards/file.upload.card";
import FilterPanel, {
  type FilterField,
} from "~/app/components/molecules/filter.panel";
import { type Library, type LibraryFilterState } from "@/types/library";
// Minimal filter state for this page

export default function LibraryPage() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    status: string[];
    type: string[];
    category: string[];
  }>({
    status: [],
    type: [],
    category: [],
  });

  const filterFields: FilterField[] = [
    { key: "status", label: "Status", options: ["active", "inactive"] },
    {
      key: "type",
      label: "Type",
      options: [
        "abdomen",
        "chest",
        "chestxray_observation",
        "diagnosis",
        "diagnostic",
        "digital_rectal",
        "findings",
        "genitourinary",
        "heart",
        "heent",
        "immunization",
        "management",
        "mdiseases",
        "medicine",
        "medicine_form",
        "medicine_generic",
        "medicine_package",
        "medicine_salt",
        "medicine_strength",
        "medicine_unit",
        "neuro",
        "patient_diagnosis",
        "sign_symptoms",
      ],
    },
  ];

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      await libraryService.import(formData);
      setIsOpen(false);
      fetchLibraries(page, searchQuery, filters);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // ✅ now f is always passed explicitly
  const fetchLibraries = async (
    pageNumber: number,
    query = "",
    f: LibraryFilterState = filters
  ) => {
    try {
      setIsLoading(true);
      const res: any = await libraryService.getAll({
        page: pageNumber,
        limit: 10,
        query: searchQuery,
        ...f, // This will include the filter parameters
      });

      setLibraries(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Error fetching libraries:", error);
      setLibraries([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ pass filters in effect
  useEffect(() => {
    fetchLibraries(page, searchQuery, filters);
  }, [page, searchQuery, filters]);

  // debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLibraries(1, searchQuery, filters);
      setPage(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, filters]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Set filters from URL parameters (if any)
    const status = params.getAll("status");
    const type = params.getAll("type");
    const category = params.getAll("category");

    // Update state with the values from the URL
    setFilters({
      status: status.length ? status : [],
      type: type.length ? type : [],
      category: category.length ? category : [],
    });

    // Fetch the data with the updated filters
    fetchLibraries(page, searchQuery, { status, type, category });
  }, []); // Empty dependency array ensures this runs only on mount

  // ✅ now onFiltersChange uses LibraryFilterState
  const handleFiltersChange = (newFilters: LibraryFilterState) => {
    // Update filters state
    setFilters(newFilters);

    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    // Add the selected filters to the URL
    if (newFilters.status.length)
      params.set("status", newFilters.status.join(","));
    if (newFilters.type.length) params.set("type", newFilters.type.join(","));
    if (newFilters.category.length)
      params.set("category", newFilters.category.join(","));

    // Update the browser's URL without reloading the page
    window.history.pushState(null, "", `?${params.toString()}`);

    // Optionally log the applied filters
    console.log("Applied filters", newFilters);

    // Fetch libraries based on the new filters
    fetchLibraries(page, searchQuery, newFilters);
  };

  return (
    <div className="space-y-4 px-4 py-6">
      <Card>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search libraries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            <div>
              <Button variant="ghost" onClick={() => setIsOpen(true)}>
                <Upload />
              </Button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="w-[50%]">
                  <DialogHeader>
                    <DialogTitle>Upload Library</DialogTitle>
                    <DialogDescription>
                      Upload a library file to the system.
                    </DialogDescription>
                    <div>
                      <FileUploadCard onUpload={handleUpload} />
                    </div>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Button variant="ghost" onClick={() => setIsFilterOpen(true)}>
                <Filter />
              </Button>

              <FilterPanel
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={handleFiltersChange}
                currentFilters={filters}
                filterFields={filterFields}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : libraries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchQuery
                      ? "No results found for your search."
                      : "No libraries available."}
                  </TableCell>
                </TableRow>
              ) : (
                libraries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center px-6 py-1">
          <Button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
