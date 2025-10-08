import React from 'react';
import { motion } from 'framer-motion';
import type { Feature } from '@/types/home.types';

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

/**
 * A card component that displays a feature with icon, title, and description
 * @param feature - The feature data to display
 * @param index - The index of the feature in the list (used for animation delay)
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-primary mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  );
}; 