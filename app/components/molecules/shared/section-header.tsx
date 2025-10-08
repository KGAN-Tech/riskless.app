import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  /**
   * Optional variant for custom layouts (e.g., 'icon')
   */
  variant?: 'default' | 'icon';
  /**
   * Optional icon to display (for 'icon' variant)
   */
  icon?: React.ReactNode;
  /**
   * Optional right-side content (e.g., button) for 'icon' variant
   */
  rightContent?: React.ReactNode;
  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * A reusable section header component with title, subtitle, description, and optional icon/button
 * @param id - Optional ID for accessibility
 * @param title - The section title
 * @param subtitle - Optional subtitle
 * @param description - Optional section description
 * @param variant - Optional variant for custom layouts (e.g., 'icon')
 * @param icon - Optional icon to display (for 'icon' variant)
 * @param rightContent - Optional right-side content (for 'icon' variant)
 * @param className - Optional className for custom styling
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  id,
  title, 
  subtitle,
  description,
  variant = 'default',
  icon,
  rightContent,
  className
}) => {
  if (variant === 'icon') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={twMerge("mb-12 md:mb-16", className)}
      >
        <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center md:gap-8">
          {/* Left: Icon + Title + Subtitle (widest) */}
          <div className="flex flex-col items-center md:items-start gap-2 md:col-span-5">
            {icon && (
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                {icon}
                <span className="ml-2">{title}</span>
              </span>
            )}
            {subtitle && (
              <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
                {subtitle}
              </h2>
            )}
          </div>
          {/* Center: Description (medium) */}
          <div className="flex justify-center md:justify-center md:col-span-5">
            {description && (
              <p className="max-w-md text-gray-600 text-base md:text-lg leading-relaxed text-center md:text-left">
                {description}
              </p>
            )}
          </div>
          {/* Right: Button or rightContent (smallest) */}
          <div className="flex justify-center md:justify-end items-center w-full md:w-auto mt-6 md:mt-0 md:col-span-2">
            {rightContent}
          </div>
        </div>
      </motion.div>
    );
  }
  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={twMerge("mb-12 text-center", className)}
    >
      <h2 
        id={id}
        className="text-3xl font-bold text-blue-900 mb-4"
      >
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}; 