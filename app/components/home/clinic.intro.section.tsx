import { Button } from "@/components/atoms/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ClinicIntroSection() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="py-16 md:py-24 px-4 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Container */}
          <div
            className="relative w-full mx-auto cursor-pointer rounded-2xl overflow-hidden"
            style={{ perspective: 1200 }}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
            onTouchStart={() => setFlipped((f) => !f)}
          >
            <motion.div
              className="relative w-full"
              style={{
                height: "250px", // set a fixed height so the container is visible
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Front Side */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img
                  src="https://pia.gov.ph/uploads/2022/09/09ba4159814277d82a242511e454138d.png"
                  alt="FTCC Medical Clinic"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Back Side */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <img
                  src="/philhealth-banner.png"
                  alt="FTCC Clinic Alternate"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Welcome to Filipino Trusted Care Company (FTCC)
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              FTCC is a recognized and accredited of PhilHealth's Konsulta Package Provider, offering a comprehensive range of primary care services to ensure accessible and quality healthcare for its members.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              PhilHealth Konsulta aims to:
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Protect the health of every Filipinos against chronic illnesses",
                "Avoid complications through early detection",
                "To provide affordable drugs and medicines",
              ].map((text, i) => (
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
            <div className="pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer flex items-center gap-2 group">
                Register Your Family Now
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
        </div>
      </div>
    </section>
  );
}