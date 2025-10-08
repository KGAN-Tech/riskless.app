import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}

export const ServiceCard = ({ icon, title, description, features, index }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
          <span className="text-blue-600 mr-2">•</span>
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
); 