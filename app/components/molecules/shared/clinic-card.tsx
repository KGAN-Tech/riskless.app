import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { Clinic } from "@/types/clinic.types";

interface ClinicCardProps {
  clinic: Clinic;
  index: number;
}

export const ClinicCard = ({ clinic, index }: ClinicCardProps) => {
  const navigate = useNavigate();
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);

  // Convert 24-hour format to 12-hour format
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if clinic is currently open
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const todaySchedule = clinic.schedule.find(s => s.day === currentDay);
      
      if (!todaySchedule || !todaySchedule.isOpen) {
        setIsCurrentlyOpen(false);
        return;
      }

      const openTime = todaySchedule.openTime;
      const closeTime = todaySchedule.closeTime;
      
      // Handle cases where clinic is open past midnight
      if (closeTime < openTime) {
        // Clinic is open past midnight
        setIsCurrentlyOpen(currentTime >= openTime || currentTime <= closeTime);
      } else {
        // Normal operating hours
        setIsCurrentlyOpen(currentTime >= openTime && currentTime <= closeTime);
      }
    };

    checkIfOpen();
    // Update every minute
    const interval = setInterval(checkIfOpen, 60000);
    
    return () => clearInterval(interval);
  }, [clinic.schedule]);

  const getTypeBadge = (type: string) => {
    const badges = {
      main: "bg-blue-600 text-white",
      branch: "bg-green-600 text-white",
      specialty: "bg-purple-600 text-white"
    };
    return badges[type as keyof typeof badges] || "bg-gray-600 text-white";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      main: "Main Clinic",
      branch: "Branch",
      specialty: "Specialty"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleCardClick = () => {
    navigate(`/clinics/${clinic.id}`);
  };

  // Get today's schedule
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = clinic.schedule.find(s => s.day === today);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:scale-[1.02]"
    >
      {/* Clinic Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(clinic.type)}`}>
            {getTypeLabel(clinic.type)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isCurrentlyOpen 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {isCurrentlyOpen ? "Open Now" : "Closed"}
          </span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>

      {/* Clinic Content */}
      <div className="p-6">
        {/* Clinic Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {clinic.name}
        </h3>

        {/* Location */}
        <div className="flex items-start space-x-3 mb-4">
          <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium">{clinic.location.city}, {clinic.location.province}</p>
            <p className="text-gray-500 truncate">{clinic.location.address}</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaClock className="text-blue-600 text-sm" />
            <span className="text-sm font-medium text-gray-800">Today's Hours</span>
          </div>
          <div className="text-sm text-gray-700">
            {todaySchedule && todaySchedule.isOpen ? (
              <span>
                {formatTime(todaySchedule.openTime)} - {formatTime(todaySchedule.closeTime)}
              </span>
            ) : (
              <span className="text-red-600">Closed Today</span>
            )}
          </div>
        </div>

        {/* View Details Hint */}
        <div className="mt-4 text-center">
          <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
}; 