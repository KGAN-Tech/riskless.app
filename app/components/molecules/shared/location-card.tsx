import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import type { ContactLocation } from "@/types/contact.types";

interface LocationCardProps {
  location: ContactLocation;
  className?: string;
}

export function LocationCard({ location, className = "" }: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="aspect-video">
        <iframe
          src={location.mapUrl}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{location.name}</h3>
        <div className="space-y-3">
          <p className="text-gray-600 flex items-start gap-2">
            <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mt-1" />
            <span>{location.address}</span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaPhone className="w-5 h-5 text-blue-600" />
            <span>{location.phone}</span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="w-5 h-5 text-blue-600" />
            <span>{location.email}</span>
          </p>
          <div className="pt-2">
            <h4 className="font-semibold text-gray-900 mb-2">Operating Hours:</h4>
            <p className="text-gray-600 whitespace-pre-line">{location.hours}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 