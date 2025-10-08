import { motion } from "framer-motion";
import type { Partner } from "@/types/about.types";

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

export const PartnerCard = ({ partner, index }: PartnerCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="flex items-center justify-center"
  >
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
    >
      <img
        src={partner.logo}
        alt={partner.name}
        className="h-30 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
      />
    </a>
  </motion.div>
); 