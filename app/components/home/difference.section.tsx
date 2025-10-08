import React from "react";
import { motion } from "framer-motion";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded shadow-sm flex flex-col gap-4">
    <div className="text-blue-600 text-3xl">{icon}</div>
    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const DifferenceSection = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" />
        </svg>
      ),
      title: "Easy appointments",
      description: "Book online, by phone, or in person with flexible scheduling."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
        </svg>
      ),
      title: "Patient first approach",
      description: "Every treatment plan is designed with your needs in mind."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
      title: "Multiple locations",
      description: "Accessible clinics in your neighborhood for added convenience."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3v4M8 3v4" />
        </svg>
      ),
      title: "Modern Facilities",
      description: "State-of-the-art equipment and comfortable facilities for your care."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
        </svg>
      ),
      title: "Accredited & Trusted",
      description: "Recognized by PhilHealth and trusted by thousands of patients."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8M8 12h8" />
        </svg>
      ),
      title: "Comprehensive Services",
      description: "From preventive care to specialized treatments, all in one place."
    }
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-600 text-sm font-semibold">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 12h5M12 9.5v5" />
              </svg>
              Our Difference
            </div>
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900">
              Reliable, <span className="text-blue-600">accessible</span>, and patient-centered services
            </h2>
          </div>
          <p className="text-gray-600 max-w-xl">
            At our medical clinic, we prioritize patient-centered care, modern equipment, and a welcoming environment to ensure every visit is comfortable, and focused on your long-term well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;
