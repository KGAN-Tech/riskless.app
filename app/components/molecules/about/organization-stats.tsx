import { motion } from "framer-motion";
import type { Organization } from "@/types/about.types";

interface OrganizationStatsProps {
  organization: Organization;
}

export const OrganizationStats = ({ organization }: OrganizationStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-6">
        {organization.name}
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        {organization.description}
      </p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-4"
    >
      {organization.stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <p className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</p>
          <p className="text-gray-600">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
); 