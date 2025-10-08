import React from "react";
import { Button } from "@/components/atoms/button";
import { motion } from "framer-motion";

type TipCardProps = {
  image: string;
  title: string;
  date: string;
  commentsCount: number;
  description: string;
};

const TipCard: React.FC<TipCardProps> = ({ image, title, date, commentsCount, description }) => (
  <motion.div
    className="bg-blue-50 p-6 flex flex-col gap-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.025] hover:shadow-lg"
    whileHover={{ scale: 1.025, boxShadow: "0 8px 32px 0 rgba(0, 80, 200, 0.10)" }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <motion.img
      src={image}
      alt="Tip"
      className="w-full h-48 object-cover rounded-lg"
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
    <div className="flex items-center text-sm text-gray-600 gap-4">
      <span className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" />
        </svg>
        {date}
      </span>
      <span className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-4 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {commentsCount}
      </span>
    </div>
    <p className="text-gray-700 text-sm">{description}</p>
    <Button className="mt-auto bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-blue-700 w-fit flex items-center gap-2">
      Read more
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Button>
  </motion.div>
);

const TipsSection = () => {
  const tips = [
    {
      image: "https://images.unsplash.com/photo-1612375689547-b5351e63050b?w=360&h=200&fit=crop",
      title: "Why annual checkups are essential for your long-term health",
      date: "AUGUST 21, 2023",
      commentsCount: 3,
      description: "Adopt simple, sustainable habits to stay healthy year-round and enhance your..."
    },
    {
      image: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=360&h=200&fit=crop",
      title: "5 Lifestyle changes to help lower your blood pressure",
      date: "AUGUST 21, 2023",
      commentsCount: 3,
      description: "Learn when to seek medical help by recognizing warning signs that…"
    },
    {
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=360&h=200&fit=crop",
      title: "Essential health screenings every woman should have",
      date: "AUGUST 21, 2023",
      commentsCount: 3,
      description: "Boost your immune system with these effective habits that promote better…"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="mb-6 md:mb-0 space-y-3 md:space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Health Updates
                </div>
                <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                <span className="text-blue-600">Latest</span> clinic news & tips
                </h2>
            </div>
            <div className="max-w-md text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                Explore helpful articles, health tips, and clinic updates to stay informed and make better decisions about your care.
                </p>
            </div>
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer flex items-center gap-2 group">
                Read all articles
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <TipCard {...tip} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
