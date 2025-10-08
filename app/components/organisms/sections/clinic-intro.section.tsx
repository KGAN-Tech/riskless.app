import React from 'react';
import { motion } from 'framer-motion';
import type { ClinicIntro } from '@/types/home.types';

interface ClinicIntroSectionProps {
  clinicIntro: ClinicIntro;
}

export const ClinicIntroSection: React.FC<ClinicIntroSectionProps> = ({ clinicIntro }) => {
  return (
    <section className="py-16 md:py-24 px-4 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="relative w-full mx-auto rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={clinicIntro.images.front}
              alt="FTCC Medical Clinic"
              className="w-full object-cover"
            />
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {clinicIntro.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {clinicIntro.description}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              PhilHealth Konsulta aims to:
            </p>
            <div className="space-y-4 pt-4">
              {clinicIntro.objectives.map((text, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 