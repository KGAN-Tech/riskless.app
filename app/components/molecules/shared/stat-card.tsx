import { motion } from "framer-motion";
import type { IconType } from "react-icons";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  index: number;
}

export const StatCard = ({ icon, value, label, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
  >
    <div className="mb-4 text-blue-600">{icon}</div>
    <div className="text-3xl font-bold text-blue-900 mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </motion.div>
); 