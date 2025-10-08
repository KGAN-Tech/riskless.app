import { Button } from "@/components/atoms/button";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1642977058952-8a7903b1cb3f?w=1920&h=1080&fit=crop",
    title: "Your Trusted Healthcare Partner",
    subtitle: "Experience world-class medical care with Filipino warmth and expertise at FTCC",
    cta: "Book Appointment",
  },
  {
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1920&h=1080&fit=crop",
    title: "Comprehensive Medical Services",
    subtitle: "From primary care to specialized treatments, FTCC has got you covered",
    cta: "Our Clinics",
  },
  {
    image: "https://images.unsplash.com/photo-1631217873436-b0fa88e71f0a?w=1920&h=1080&fit=crop",
    title: "Expert Medical Professionals",
    subtitle: "Our team of experienced healthcare professionals at FTCC is dedicated to your health",
    cta: "Meet Our Team",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleSlideChange = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <section className="relative h-[350px] sm:h-[450px] md:h-[600px] lg:h-[650px] mb-[32px] sm:mb-[50px] overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt="FTCC Medical Clinic"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-start h-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute left-0 right-0 mx-auto top-1/2 transform -translate-y-1/2 transition-all duration-1000 max-w-full sm:max-w-6xl px-10 sm:px-4 md:px-5 ${
                index === currentSlide
                  ? "translate-x-0 opacity-100"
                  : index < currentSlide
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              } text-left`}
            >
              <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-full sm:max-w-3xl">
                {/* Company Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold animate-fade-in">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Filipino Trusted Care Company
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <div className="animate-fade-in-up animation-delay-400">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer flex items-center gap-2 group w-full sm:w-auto">
                    {slide.cta}
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
            </div>
          ))}
        </div>
      </div>


      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 cursor-pointer hidden md:flex items-center justify-center transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 cursor-pointer hidden md:flex items-center justify-center transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            disabled={isAnimating}
            className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer transform hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentSlide === index 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
