import React, { useState, useEffect } from "react";

export interface ImageSlide {
  image: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  slides: ImageSlide[];
  autoPlayInterval?: number; // ms, default 5000
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides, autoPlayInterval = 5000, className = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.image}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {(slide.title || slide.description) && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
                  {slide.title && <h3 className="text-xl sm:text-2xl font-bold mb-2">{slide.title}</h3>}
                  {slide.description && <p className="text-sm sm:text-base text-white/90">{slide.description}</p>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300"
            aria-label="Previous slide"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300"
            aria-label="Next slide"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-3 sm:w-4" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider; 