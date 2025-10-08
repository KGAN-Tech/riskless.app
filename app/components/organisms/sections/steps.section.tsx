import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/button';
import { createSvgIcon } from '@/utils/svg.utils';
import type { Step } from '@/types/home.types';

interface StepsSectionProps {
  steps: Step[];
  title: string;
  description: string;
}

export const StepsSection: React.FC<StepsSectionProps> = ({ steps, title, description }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !backgroundRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const sectionTop = sectionRect.top + scrollPosition;
      const sectionHeight = sectionRect.height;
      
      const scrollProgress = (scrollPosition - sectionTop) / sectionHeight;
      const translateY = scrollProgress * 600;
      backgroundRef.current.style.transform = `translateZ(-300px) translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden min-h-screen"
      style={{ perspective: '4000px' }}
    >
      {/* Full Width Background - outside of content container */}
      <div
        ref={backgroundRef}
        className="absolute top-0 left-0 w-screen h-full overflow-hidden z-0"
        aria-hidden="true"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1642977058952-8a7903b1cb3f?w=1920&h=1080&fit=crop&q=100"
          alt="Background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ y: 0 }}
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-lg text-gray-200">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {steps.map((step: Step, index: number) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.18 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 32px 0 rgba(0, 80, 200, 0.10)",
                backgroundColor: "rgba(255,255,255,0.18)",
              }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group cursor-pointer"
              style={{ transition: "box-shadow 0.3s, background 0.3s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:bg-blue-500/30"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {createSvgIcon({ path: step.icon, size: 'md' })}
                </motion.div>
                <motion.span
                  className="text-4xl font-bold text-blue-300/50 group-hover:text-blue-300"
                  initial={{ x: 0 }}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {step.number}
                </motion.span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-24">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-blue-900 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer inline-flex items-center gap-2 group"
          >
            Start Your Journey
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};
