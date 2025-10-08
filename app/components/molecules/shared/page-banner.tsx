import { motion } from "framer-motion";

interface PageBannerProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export const PageBanner = ({ title, description, backgroundImage }: PageBannerProps) => (
  <section
    className="relative h-[300px] sm:h-[400px] flex items-center justify-center bg-blue-900 bg-cover bg-center w-full"
    style={{
      backgroundImage: `url('${backgroundImage}')`,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70" />
    <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-6xl font-bold text-white mb-4"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    </div>
  </section>
); 