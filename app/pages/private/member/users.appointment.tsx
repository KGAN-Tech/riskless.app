import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Modal } from "@/components/atoms/modal";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { BaseCard } from "@/components/organisms/cards";
import AOS from "aos";
import "aos/dist/aos.css";
import { appointmentService } from "~/app/services/appointment.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Appointment {
  id: string;
  date: string;
  time?: string;
  serviceType?: string;
  reason?: string;
  status: "pending" | "confirmed" | "canceled" | "done" | "rescheduled";
  facility?: {
    id: string;
    name: string;
  };
  createdAt: string;
  patientId?: string;
}

interface BookingForm {
  date: string;
}

export const AppointmentPage = () => {
  const getUserdata = getUserFromLocalStorage();
  const patientId = getUserdata?.user?.person?.id;
  const facilityId = getUserdata?.user?.facilityId;

  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({ date: "" });
  const [isBooking, setIsBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!patientId) return;

        setIsLoading(true);
        const params = { "fields.patientId": patientId };

        const response = await appointmentService.getAll(params);
        setAppointments(response.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("Failed to fetch appointments");
        setTimeout(() => setMessage(""), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "done":
        return "bg-blue-100 text-blue-800";
      case "rescheduled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "canceled":
        return <XCircle className="w-4 h-4" />;
      case "done":
        return <CheckCircle className="w-4 h-4" />;
      case "rescheduled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Book Appointment
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setMessage("");

    try {
      const apiData = {
        patientId,
        facilityId,
        status: "pending" as const,
        date: bookingForm.date,
      };

      await appointmentService.create(apiData);

      // re-fetch
      const params = { "fields.patientId": patientId };
      const response = await appointmentService.getAll(params);
      setAppointments(response.data || []);

      setMessage("Appointment booked successfully!");
      setShowBookingForm(false);
      setBookingForm({ date: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Cancel Appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.patch(appointmentId, { status: "canceled" });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "canceled" } : apt
        )
      );
      setMessage("Appointment canceled successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Cancel error:", error);
      setMessage("Failed to cancel appointment.");
    }
  };

  // Filtering Logic (with date + clinic search)
  const filteredAppointments = appointments.filter((appointment) => {
    const search = searchTerm.toLowerCase();

    const formattedDate = new Date(appointment.date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const matchesSearch =
      search === "" ||
      (appointment.serviceType?.toLowerCase() ?? "").includes(search) ||
      (appointment.reason?.toLowerCase() ?? "").includes(search) ||
      (appointment.facility?.name?.toLowerCase() ?? "").includes(search) ||
      formattedDate.toLowerCase().includes(search) ||
      appointment.date.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(appointment.date);

    if (activeTab === "upcoming") {
      const isUpcoming = appointmentDate >= today;
      return (
        matchesSearch &&
        matchesStatus &&
        isUpcoming &&
        appointment.status !== "canceled" &&
        appointment.status !== "done"
      );
    } else {
      const isPast = appointmentDate < today;
      return (
        matchesSearch &&
        matchesStatus &&
        (isPast ||
          appointment.status === "done" ||
          appointment.status === "canceled")
      );
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFacilityName = (appointment: Appointment): string => {
    return (
      appointment.facility?.name || "MARY MEDIATRIX OF ANGELES MEDICAL CLINIC"
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa]">
        <Headerbackbutton title="Appointments" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f6f8fa]">
      {/* Header */}
      <Headerbackbutton title="Appointments" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          {/* Success/Error Message */}
          {message && (
            <BaseCard
              className={`${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              dataAos="fade-up"
              dataAosDelay="100"
            >
              <div className="p-3 rounded-lg text-sm font-medium">
                {message}
              </div>
            </BaseCard>
          )}

          {/* Search and Filter */}
          <BaseCard dataAos="fade-down" dataAosDelay="200">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>

                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Book
                </Button>
              </div>
            </div>
          </BaseCard>

          {/* Tab Navigation */}
          <BaseCard dataAos="fade-up" dataAosDelay="300">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "upcoming"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "past"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Past
              </button>
            </div>
          </BaseCard>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <BaseCard dataAos="fade-up" dataAosDelay="400">
                <div className="text-center py-8">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No {activeTab} appointments
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === "upcoming"
                      ? "You don't have any upcoming appointments."
                      : "You don't have any past appointments."}
                  </p>
                </div>
              </BaseCard>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <BaseCard
                  key={appointment.id}
                  dataAos="fade-up"
                  dataAosDelay={`${400 + index * 100}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1">
                        {getFacilityName(appointment)}
                      </h3>

                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mb-3">
                          {appointment.reason}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        {appointment.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{"Doctor's Checkup"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {(appointment.status === "pending" ||
                        appointment.status === "confirmed") &&
                        activeTab === "upcoming" && (
                          <Button
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-300"
                          >
                            Cancel
                          </Button>
                        )}
                    </div>
                  </div>
                </BaseCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingForm}
        onClose={() => {
          setShowBookingForm(false);
          setBookingForm({ date: "" });
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Book Appointment
            </h2>
            <button
              onClick={() => {
                setShowBookingForm(false);
                setBookingForm({ date: "" });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) =>
                  setBookingForm((prev) => ({ ...prev, date: e.target.value }))
                }
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBookingForm(false);
                  setBookingForm({ date: "" });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isBooking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentPage;
