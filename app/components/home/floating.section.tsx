import { FaRegHospital, FaCalendarAlt } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

const FloatingSection = () => {
  return (
    <div className="w-full flex justify-center md:relative md:mt-0 mt-6">
      {/* Floating on md+, normal on mobile */}
      <div className="bg-blue-50 rounded-xl shadow-lg w-[95%] max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-8 md:absolute md:-top-30 md:left-0 md:right-0 md:mx-auto">
        {/* Emergency */}
        <div className="flex items-start space-x-4">
          <MdLocalHospital className="text-blue-500 text-4xl" />
          <div>
            <h4 className="font-semibold text-lg">24/7 Emergency</h4>
            <p className="text-gray-600 text-sm">Immediate care available any time, day or night.</p>
            <a href="tel:+63 917 123 4567" className="text-blue-600 font-semibold text-sm">Call us: +63 917 123 4567</a>
          </div>
        </div>

        {/* Locations */}
        <div className="flex items-start space-x-4">
          <FaRegHospital className="text-blue-500 text-4xl" />
          <div>
            <h4 className="font-semibold text-lg">Our Location</h4>
            <p className="text-gray-600 text-sm">Multiple clinics conveniently located for quick access.</p>
            <a href="#" className="text-blue-600 font-semibold text-sm">Find our Location</a>
          </div>
        </div>

        {/* Schedule Hours */}
        <div className="flex items-start space-x-4">
          <FaCalendarAlt className="text-blue-500 text-4xl" />
          <div>
            <h4 className="font-semibold text-lg">Schedule Hours</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="flex justify-between"><span>Weekdays</span><span>09:00 AM - 10:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>09:00 AM - 06:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSection;
