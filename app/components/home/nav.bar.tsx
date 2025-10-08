import { FaFacebookF, FaTwitter, FaLinkedinIn, FaClock, FaPhone } from "react-icons/fa";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="hidden lg:flex bg-[#0b2239] text-white text-sm justify-between items-center px-4 md:px-10 py-3">
        {/* Social Icons */}
        <div className="flex space-x-6">
          <FaFacebookF className="cursor-pointer hover:text-blue-400 transition-colors duration-300" />
          <FaTwitter className="cursor-pointer hover:text-blue-400 transition-colors duration-300" />
          <FaLinkedinIn className="cursor-pointer hover:text-blue-400 transition-colors duration-300" />
        </div>

        {/* Working Hours & Emergency */}
        <div className="flex space-x-6 md:space-x-10 items-center text-xs md:text-sm">
          <div className="flex items-center space-x-2 md:space-x-3">
            <FaClock className="text-blue-400" />
            <span className="text-gray-300">Mon - Fri: 09:00 AM - 10:00 PM</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <FaPhone className="text-blue-400" />
            <span className="text-gray-300">Emergency Line: <span className="text-yellow-400 font-semibold">+63 917 123 4567</span></span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-5 bg-white shadow-md relative">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/ftcc-logo2.png" alt="FTCC Solutions Inc. Logo" className="w-32 h-auto" />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-10 text-gray-800 font-medium">
          <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300" onClick={() => navigate("/")}>Home</li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300" onClick={() => navigate("/about")}>About</li>
          <li className="hover:text-blue-600 cursor-pointer relative group">
            <span onClick={() => navigate("/clinics")}>Clinics</span>
            {/* Clinics Dropdown */}
            {/*
            <div className="hidden absolute bg-white shadow-lg rounded-lg py-2 group-hover:block mt-2 min-w-[200px]">
              <a href="#" className="block px-6 py-3 hover:bg-blue-50 transition-colors duration-300">Service 1</a>
              <a href="#" className="block px-6 py-3 hover:bg-blue-50 transition-colors duration-300">Service 2</a>
            </div>
            */}
          </li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300" onClick={() => navigate("/our-team")}>Our Team</li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300" onClick={() => navigate("/contact")}>Contact</li>
        </ul>

        {/* Desktop Download App Button */}
        <div className="hidden lg:block">
          <Button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px]">
            Download our App
          </Button>
        </div>

        {/* Burger Menu Icon */}
        <button
          className="lg:hidden text-3xl text-gray-800 focus:outline-none ml-4"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)} />
        )}
        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-lg transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <img src="/ftcc-logo2.png" alt="FTCC Solutions Inc. Logo" className="w-28 h-auto" />
            <button className="text-2xl text-gray-800" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <FiX />
            </button>
          </div>
          <ul className="flex flex-col space-y-2 px-6 py-6 text-gray-800 font-medium">
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300 py-2" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300 py-2" onClick={() => navigate("/about")}>About</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300 py-2" onClick={() => navigate("/clinics")}>Clinics</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300 py-2" onClick={() => navigate("/our-team")}>Our Team</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-300 py-2" onClick={() => navigate("/contact")}>Contact</li>
          </ul>
          <div className="px-6 pb-8">
            <Button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
              Book appointment
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
