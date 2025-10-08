import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/atoms/toast";
import { format } from "date-fns";
import { Search, User } from "lucide-react";
import { userService } from "@/services/user.service";
import { appointmentService } from "@/services/appointment.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// Define enums
enum Sex {
  male = "male",
  female = "female",
}

enum CivilStatus {
  single = "single",
  married = "married",
  legally_separated = "legally_separated",
  annulled = "annulled",
  widow = "widow",
  cohabiting = "cohabiting",
}

enum Citizenship {
  filipino = "filipino",
  foreign_national = "foreign_national",
  dual_citizen = "dual_citizen",
}

enum Role {
  user = "user",
  admin = "admin",
  staff = "staff",
}

// Types
interface Address {
  unit?: string;
  buildingName?: string;
  houseNo?: string;
  street?: string;
  province?: { value: string; code: string };
  city?: { value: string; code: string };
  barangay?: { value: string; code: string };
  description?: string;
  zipCode?: string;
  country?: string;
  type?: string;
}

interface Image {
  title: string;
  url: string;
  captureDate: string;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  extensionName?: string;
  sex?: Sex;
  birthDate?: string;
  birthPlace?: string;
  age?: number;
  religion?: string;
  civilStatus?: CivilStatus;
  addresses: Address[];
  citizenship?: Citizenship;
  images: Image[];
  contacts?: Array<{ type: string; provider: string; value: string }>;
}

interface User {
  id: string;
  userName: string;
  role: Role;
  type: string;
  status: string;
  person: Person;
  facility?: { id: string; name: string };
}

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: {
    patientId: string;
    facilityId: string;
    status: "pending";
    date: string;
    patient: Person; // Add patient object here
  }) => void;
  selectedDate: Date;
}

interface ToastState {
  open: boolean;
  title: string;
  description: string;
  variant: "default" | "destructive" | "success";
}

export function AppointmentFormModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: AppointmentFormModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: "",
    description: "",
    variant: "default",
  });

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" = "default"
  ) => {
    setToast({ open: true, title, description, variant });
  };

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params = {
        search: query,
        role: "user",
        limit: 20,
      };
      const response = await userService.getAll(params);

      let userResults = response.users
        ? response.users.filter((user: User) => user.role === "user")
        : [];

      // Optimized ranking
      if (query.trim()) {
        const queryLower = query.toLowerCase().trim();
        userResults.sort((a: User, b: User) => {
          const aName =
            `${a.person.firstName} ${a.person.lastName}`.toLowerCase();
          const bName =
            `${b.person.firstName} ${b.person.lastName}`.toLowerCase();
          const aUserName = a.userName.toLowerCase();
          const bUserName = b.userName.toLowerCase();

          // Exact matches first
          if (aName === queryLower || aUserName === queryLower) return -1;
          if (bName === queryLower || bUserName === queryLower) return 1;

          // Starts with matches second
          if (aName.startsWith(queryLower) || aUserName.startsWith(queryLower))
            return -1;
          if (bName.startsWith(queryLower) || bUserName.startsWith(queryLower))
            return 1;

          // Contains matches last
          if (aName.includes(queryLower) || aUserName.includes(queryLower))
            return -1;
          if (bName.includes(queryLower) || bUserName.includes(queryLower))
            return 1;

          return 0;
        });
      }

      setSearchResults(userResults.slice(0, 10));
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      showToast(
        "Search Error",
        "Failed to search patients. Please try again.",
        "destructive"
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search with useCallback
  const debouncedSearch = useCallback(debounce(performSearch, 300), []);

  // Trigger search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      debouncedSearch.cancel?.();
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    debouncedSearch.cancel?.();
    await performSearch(searchQuery);
  };

  const handleSelectPatient = (user: User) => {
    setSelectedPatient(user);
    setSearchQuery("");
    setSearchResults([]);

    showToast(
      "Patient Selected",
      `${formatName(user.person)} has been selected for the appointment.`
    );
  };

  const handleCreateAppointment = async () => {
    if (!selectedPatient?.person?.id) {
      showToast(
        "Missing Patient",
        "Please search and select a patient before creating an appointment.",
        "destructive"
      );
      return;
    }

    setIsCreatingAppointment(true);

    try {
      const currentUser = getUserFromLocalStorage();
      const facilityId = currentUser?.user?.facilityId;

      if (!facilityId) {
        showToast(
          "Missing Facility",
          "No facility is associated with the current user. Please log in again or contact support.",
          "destructive"
        );
        return;
      }

      const appointmentData = {
        patientId: selectedPatient.person.id,
        facilityId,
        status: "pending" as const,
        date: format(selectedDate, "yyyy-MM-dd"),
        patient: selectedPatient.person, // Pass the selected patient's person object
      };

      console.log("📤 Preparing appointment data for parent:", appointmentData);

      // Removed the direct call to appointmentService.create here.
      // The parent component (AppointmentPage) will handle the actual API call.

      // Call onSave with the full appointment data including patient
      onSave(appointmentData);

      showToast(
        "Appointment Data Prepared",
        `Appointment data for ${formatName(selectedPatient.person)} has been sent for scheduling.`,
        "success"
      );

      handleClose();
    } catch (error: any) {
      console.error("❌ Error preparing appointment data:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      const message =
        error?.response?.status === 500
          ? "A server error occurred. Please try again later."
          : error?.response?.data?.message ||
            "Failed to prepare appointment. Please try again.";

      showToast("Appointment Preparation Failed", message, "destructive");
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPatient(null);
    setIsSearching(false);
    setIsCreatingAppointment(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.houseNo,
      address.street,
      address.barangay?.value,
      address.city?.value,
      address.province?.value,
      address.country,
    ].filter(Boolean);

    return parts.join(", ") || address.description || "No address available";
  };

  const formatName = (person: Person) =>
    `${person.firstName} ${person.middleName || ""} ${person.lastName} ${
      person.extensionName || ""
    }`
      .replace(/\s+/g, " ")
      .trim();

  const formatBirthDate = (birthDate?: string) =>
    birthDate ? format(new Date(birthDate), "MMMM d, yyyy") : "N/A";

  const getPrimaryContact = (
    contacts?: Array<{ type: string; value: string }>
  ) => {
    if (!contacts || contacts.length === 0) return "N/A";
    const mobile = contacts.find((c) => c.type === "mobile_number");
    const email = contacts.find((c) => c.type === "email");
    return mobile?.value || email?.value || "N/A";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <p className="text-sm text-gray-600">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search Section */}
            {!selectedPatient && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientSearch">Search Patient</Label>
                  <div className="flex gap-2">
                    <Input
                      id="patientSearch"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Start typing to search patients..."
                      className="flex-1"
                      disabled={isSearching}
                    />
                    <Button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="flex items-center gap-2"
                    >
                      <Search size={16} />
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Search automatically as you type • Only patients will be
                    shown
                  </p>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    <div className="p-2 bg-gray-50 border-b">
                      <p className="text-sm font-medium">
                        Search Results ({searchResults.length})
                      </p>
                    </div>
                    <div className="divide-y">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectPatient(user)}
                          className="w-full p-3 text-left hover:bg-blue-50 transition-colors focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              {user.person.images?.length ? (
                                <img
                                  src={user.person.images[0].url}
                                  alt={formatName(user.person)}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {formatName(user.person)}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                @{user.userName} • Age:{" "}
                                {user.person.age || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {getPrimaryContact(user.person.contacts)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Searching patients...
                    </div>
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-4 text-gray-500">
                    No patients found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}

            {/* Selected Patient Info */}
            {selectedPatient && (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-800">
                    Selected Patient ✓
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(null);
                      showToast(
                        "Patient Deselected",
                        "Please select another patient for the appointment."
                      );
                    }}
                    disabled={isCreatingAppointment}
                  >
                    Change Patient
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Patient Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      {selectedPatient.person.images?.length ? (
                        <img
                          src={selectedPatient.person.images[0].url}
                          alt={formatName(selectedPatient.person)}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User size={40} className="text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      ID: {selectedPatient.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{selectedPatient.userName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize bg-green-100 px-2 py-1 rounded">
                      {selectedPatient.role}
                    </p>
                  </div>

                  {/* Patient Details */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Full Name
                        </label>
                        <p className="font-medium">
                          {formatName(selectedPatient.person)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Age
                        </label>
                        <p>{selectedPatient.person.age || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Sex
                        </label>
                        <p>
                          {selectedPatient.person.sex
                            ? selectedPatient.person.sex
                                .charAt(0)
                                .toUpperCase() +
                              selectedPatient.person.sex.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Civil Status
                        </label>
                        <p>
                          {selectedPatient.person.civilStatus
                            ? selectedPatient.person.civilStatus
                                .charAt(0)
                                .toUpperCase() +
                              selectedPatient.person.civilStatus.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Birth Date
                        </label>
                        <p>
                          {formatBirthDate(selectedPatient.person.birthDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Birth Place
                        </label>
                        <p>{selectedPatient.person.birthPlace || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Religion
                        </label>
                        <p>{selectedPatient.person.religion || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Citizenship
                        </label>
                        <p>
                          {selectedPatient.person.citizenship
                            ? selectedPatient.person.citizenship
                                .charAt(0)
                                .toUpperCase() +
                              selectedPatient.person.citizenship.slice(1)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Contact Information
                      </label>
                      <p>
                        {getPrimaryContact(selectedPatient.person.contacts)}
                      </p>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="text-sm">
                        {selectedPatient.person.addresses?.length
                          ? formatAddress(selectedPatient.person.addresses[0])
                          : "No address available"}
                      </p>
                    </div>

                    {/* Create Appointment Button */}
                    <div className="pt-4">
                      <Button
                        type="button"
                        onClick={handleCreateAppointment}
                        disabled={isCreatingAppointment}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {isCreatingAppointment ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creating Appointment...
                          </div>
                        ) : (
                          `Create Appointment for ${selectedPatient.person.firstName}`
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Component */}

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        variant={toast.variant}
      >
        <ToastTitle>{toast.title}</ToastTitle>
        <ToastDescription>{toast.description}</ToastDescription>
      </Toast>
      <ToastViewport />
    </>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel?: () => void } {
  let timeoutId: NodeJS.Timeout;

  const debounced = ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel?: () => void };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}
