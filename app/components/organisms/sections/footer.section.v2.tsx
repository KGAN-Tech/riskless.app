import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/atoms/button";
import { useNavigate } from "react-router";
import FTCCLogo from "@/assets/imgs/FTCC-Health-Tech-Clinic-with-bg.png";
import {
  COMPANY_INFO,
  CONTACT_INFO,
  IMAGE_PATHS,
} from "~/app/configuration/others/constConfig.config";

const FooterSection = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <img
              src={COMPANY_INFO.LOGO_WITH_BG}
              alt={`${COMPANY_INFO.NAME} Logo`}
              className="w-65 h-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {COMPANY_INFO.DESCRIPTION}
            </p>
            <div className="flex space-x-4">
              <a
                href={CONTACT_INFO.SOCIAL_MEDIA.FACEBOOK}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href={CONTACT_INFO.SOCIAL_MEDIA.TWITTER}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href={CONTACT_INFO.SOCIAL_MEDIA.LINKEDIN}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/clinics"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Our Clinics
                </a>
              </li>
              <li>
                <a
                  href="/our-team"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="text-gray-400">📍</span>
                <span className="text-gray-400">
                  {CONTACT_INFO.ADDRESS.MAIN_OFFICE}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-400">📞</span>
                <span className="text-gray-400">{CONTACT_INFO.PHONE.MAIN}</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-400">✉️</span>
                <span className="text-gray-400">
                  {CONTACT_INFO.EMAIL.GENERAL}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and health
              tips.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 {COMPANY_INFO.NAME}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
