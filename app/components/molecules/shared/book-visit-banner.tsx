import { Button } from "@/components/atoms/button";
import { FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import type { BookVisit } from "@/types/about.types";

interface BookVisitSectionProps {
  bookVisit: BookVisit;
}

export const BookVisitSection = ({ bookVisit }: BookVisitSectionProps) => (
  <section className="relative w-full">
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-xl p-12 flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <img
            src={bookVisit.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white mb-6">
            {bookVisit.title}
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl">
            {bookVisit.description}
          </p>
          <div className="flex justify-center mt-4">
            <Button 
              className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-3 text-md"
            >
              {bookVisit.buttonText} <FaUserMd className="text-md" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
); 