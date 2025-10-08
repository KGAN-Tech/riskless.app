import React from "react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

const FooterSection = () => {
  return (
    <footer className="bg-white text-gray-800 pt-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-b pb-8">
          <div className="flex items-center space-x-2 mb-6 lg:mb-0">
            <img src="/ftcc-logo2.png" alt="FTCC Solutions Inc. Logo" className="w-32 h-auto" />
            {/*<span className="font-semibold text-xl text-gray-900">Filipino Trusted Care Company(FTCC)</span>*/}
          </div>
          <div className="flex space-x-4">
            <a href="#" className="bg-blue-50 p-2 rounded">
              <FaFacebookF className="text-blue-500" />
            </a>
            <a href="#" className="bg-blue-50 p-2 rounded">
              <FaXTwitter className="text-blue-500" />
            </a>
            <a href="#" className="bg-blue-50 p-2 rounded">
              <FaLinkedinIn className="text-blue-500" />
            </a>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h3 className="font-semibold mb-4">Clinics</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#">Primary Care</a></li>
              <li><a href="#">Specialized Care</a></li>
              <li><a href="#">Emergency Care</a></li>
              <li><a href="#">Laboratory Services</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Our Vision</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Our Location</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#">Phone</a></li>
              <li><a href="#">Email</a></li>
              <li><a href="#">Address</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex justify-between"><span>Weekdays</span><span>08:00 AM - 08:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>09:00 AM - 05:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t py-6 flex flex-col md:flex-row justify-between text-sm text-gray-600">
          <p>© Filipino Trusted Care Company(FTCC). All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">Terms & Conditions</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
