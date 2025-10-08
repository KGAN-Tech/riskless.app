import { Button } from "@/components/atoms/button";
import { motion } from "framer-motion";

const testimonials = [
    {
      text: "The team members took time to listen and explain everything clearly. I finally feel confident about my family's healthcare.",
      name: "Frederic Hill",
      role: "Family patient",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
      rating: 5,
    },
    {
      text: "I needed urgent help late at night and received immediate, kind, and professional treatment. I'm very grateful.",
      name: "Julie Kyle",
      role: "Emergency visit",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
      rating: 5,
    },
    {
      text: "Booking was easy, the clinic was clean, and the staff were very welcoming. I highly recommend this place.",
      name: "Paige Lowery",
      role: "New patient",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop",
      rating: 5,
    },
    {
      text: "I've been coming here for years. The staff is always respectful, and I feel truly cared for during every visit.",
      name: "Brendan Buck",
      role: "Long-term patient",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
      rating: 5,
    },
    {
      text: "I didn't have an appointment, but they saw me quickly and explained everything clearly. It was a great experience from start to finish.",
      name: "Stefan Ball",
      role: "Walk-In visit",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
      rating: 5,
    }
  ];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function TestimonialSection() {
    return(
    <>
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24 px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="mb-6 md:mb-0 space-y-3 md:space-y-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Testimonials
                        </div>
                        <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        <span className="text-blue-600">Trusted</span> by our community
                        </h2>
                    </div>
                    <div className="max-w-md text-gray-600 text-base md:text-lg leading-relaxed">
                        <p>
                        Real stories from patients who received attentive, compassionate care and experienced positive outcomes at our medical clinic.
                        </p>
                    </div>
                    <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer flex items-center gap-2 group">
                        View all stories
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px] group cursor-pointer"
                    >
                        <div className="flex flex-col justify-between min-h-[240px] md:min-h-[280px]">
                            <div>
                                <div className="mb-4">
                                    <StarRating rating={testimonial.rating} />
                                </div>
                                <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-4 md:mb-6 group-hover:text-blue-600 transition-colors duration-300">
                                    "{testimonial.text}"
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors duration-300">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                                </div>
                                <div className="relative">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-600 transition-all duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px] flex items-center justify-center text-blue-600 font-semibold text-base md:text-lg cursor-pointer hover:text-blue-700 sm:col-span-2 lg:col-span-1 group">
                    <div className="flex items-center gap-2">
                        Read more reviews
                        <svg 
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
                </div>
            </div>
            </section>
    </>
    );
}