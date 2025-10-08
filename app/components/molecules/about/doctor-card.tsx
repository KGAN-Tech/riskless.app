import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import type { Doctor } from "@/types/about.types";
import type { TeamMember } from "@/types/our-team.types";

interface DoctorCardProps {
  doctor: Doctor | TeamMember;
  index: number;
}

export const DoctorCard = ({ doctor, index }: DoctorCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
          {doctor.social.linkedin && (
            <a href={doctor.social.linkedin} className="text-white hover:text-blue-400 transition-colors">
              <FaLinkedin className="text-xl" />
            </a>
          )}
          {doctor.social.twitter && (
            <a href={doctor.social.twitter} className="text-white hover:text-blue-400 transition-colors">
              <FaTwitter className="text-xl" />
            </a>
          )}
          {doctor.social.email && (
            <a href={`mailto:${doctor.social.email}`} className="text-white hover:text-blue-400 transition-colors">
              <FaEnvelope className="text-xl" />
            </a>
          )}
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-blue-900 mb-1">{doctor.name}</h3>
      <p className="text-blue-600 font-medium mb-3">{'role' in doctor ? doctor.role : (doctor as any).specialty}</p>
      <p className="text-gray-700">{doctor.description}</p>
    </div>
  </motion.div>
); 