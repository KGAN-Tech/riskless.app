import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules/shared/section-header';
import { createSvgIcon } from '@/utils/svg.utils';
import type { Service } from '@/types/home.types';

interface ServicesSectionProps {
  services: Service[];
}

/**
 * A section component that displays the clinic's services in a grid layout
 * @param services - Array of service objects containing title, description, and icon path
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <section 
      className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gray-50"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="mb-6 md:mb-0 space-y-3 md:space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Our Services
            </div>
            <h2 
              id="services-heading"
              className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900"
            >
              <span className="text-blue-600">Comprehensive</span> Healthcare Solutions
            </h2>
          </div>
          <div className="max-w-md text-gray-600 text-base md:text-lg leading-relaxed">
            <p>
              We offer a wide range of medical services to meet your healthcare needs, from routine check-ups to specialized treatments.
            </p>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          role="list"
          aria-label="List of healthcare services"
        >
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              role="listitem"
              tabIndex={0}
            >
              <div 
                className="text-blue-600 text-4xl mb-2"
                aria-hidden="true"
              >
                {createSvgIcon({ path: service.icon, size: 'lg' })}
              </div>
              <h3 
                className="font-semibold text-lg text-gray-900 group-hover:text-blue-700 transition-colors duration-300"
                id={`service-title-${index}`}
              >
                {service.title}
              </h3>
              <p 
                className="text-gray-600 text-sm mb-2"
                aria-labelledby={`service-title-${index}`}
              >
                {service.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}; 