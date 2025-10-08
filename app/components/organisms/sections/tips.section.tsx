import React from 'react';
import { Button } from '@/components/atoms/button';
import { TipCard } from '@/components/molecules/tip-card';
import type { Tip } from '@/types/home.types';

interface TipsSectionProps {
  tips: Tip[];
}

export const TipsSection: React.FC<TipsSectionProps> = ({ tips }) => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Health Tips & Updates
          </h2>
          <p className="text-lg text-gray-600">
            Stay informed with the latest health tips and medical advice from our experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <TipCard
              key={tip.title}
              tip={tip}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer inline-flex items-center gap-2 group">
            Read More Articles
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}; 