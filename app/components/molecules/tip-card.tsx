import React from 'react';
import { motion } from 'framer-motion';
import type { Tip } from '@/types/home.types';

interface TipCardProps {
  tip: Tip;
  index: number;
}

/**
 * A card component that displays a health tip with image, title, date, and description
 * @param tip - The tip data to display
 * @param index - The index of the tip in the list (used for animation delay)
 */
export const TipCard: React.FC<TipCardProps> = ({ tip, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <img
          src={tip.image}
          alt={tip.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{tip.date}</span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {tip.commentsCount}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
        <p className="text-gray-600">{tip.description}</p>
      </div>
    </motion.div>
  );
}; 