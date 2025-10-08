import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules/shared/section-header';
import type { Feature } from '@/types/home.types';

interface FeaturesSectionProps {
  features: Feature[];
}

/**
 * A section component that displays the clinic's key features
 * @param features - Array of feature objects containing icon, title, and description
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  const renderIcon = (path: string) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-12 w-12" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={path} 
      />
    </svg>
  );

  return (
    <section 
      className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          id="features-heading"
          title="Why Choose FTCC Medical Clinic"
          description="Experience healthcare that puts you first"
        />
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          role="list"
          aria-label="Clinic features"
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              role="listitem"
              tabIndex={0}
            >
              <div 
                className="text-blue-600 mb-6 flex items-center justify-center"
                aria-hidden="true"
              >
                {renderIcon(feature.icon)}
              </div>
              <h3 
                className="text-xl font-semibold mb-3 text-center text-gray-900"
                id={`feature-title-${index}`}
              >
                {feature.title}
              </h3>
              <p 
                className="text-gray-600 text-center"
                aria-labelledby={`feature-title-${index}`}
              >
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}; 