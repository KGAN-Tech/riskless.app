import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router";
import {
  COMPANY_INFO,
  IMAGE_PATHS,
} from "~/app/configuration/others/constConfig.config";

const WebsiteTopNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => `
    transition-colors duration-300 cursor-pointer
    ${
      isActive(path)
        ? "text-blue-600 font-semibold"
        : "text-gray-800 hover:text-blue-600"
    }
  `;

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 bg-white shadow-md relative">
        <div className="flex items-center space-x-3">
          <img
            src={COMPANY_INFO.LOGO}
            alt={`${COMPANY_INFO.NAME} Logo`}
            className="w-55 h-auto"
          />
        </div>

        <ul className="hidden lg:flex space-x-10 text-gray-800 font-medium">
          <li className={navLinkClass("/")} onClick={() => navigate("/")}>
            Home
          </li>
          <li
            className={navLinkClass("/about")}
            onClick={() => navigate("/about")}
          >
            About
          </li>
          <li className={navLinkClass("/clinics")}>
            <span onClick={() => navigate("/clinics")}>Clinics</span>
          </li>
          <li
            className={navLinkClass("/our-team")}
            onClick={() => navigate("/our-team")}
          >
            Our Team
          </li>
          <li
            className={navLinkClass("/articles")}
            onClick={() => navigate("/articles")}
          >
            Articles
          </li>
          <li
            className={navLinkClass("/contact")}
            onClick={() => navigate("/contact")}
          >
            Contact
          </li>
        </ul>

        <div className="hidden lg:block">
          <div className="flex gap-4">
            <Button
              onClick={() => {
                navigate("/0/register");
                setMobileOpen(false);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Register to Konsulta
            </Button>
            <Button
              onClick={() => {
                navigate("/0/");
                setMobileOpen(false);
              }}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Login
            </Button>
          </div>
        </div>

        <button
          className="lg:hidden text-3xl text-gray-800 focus:outline-none ml-4"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-lg transform transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <img
              src={IMAGE_PATHS.LOGOS.ALTERNATIVE}
              alt={`${COMPANY_INFO.NAME} Logo`}
              className="w-36 h-auto"
            />
            <button
              className="text-2xl text-gray-800"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>
          <ul className="flex flex-col space-y-2 px-6 py-6 text-gray-800 font-medium">
            <li
              className={`${navLinkClass("/")} py-2`}
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
            >
              Home
            </li>
            <li
              className={`${navLinkClass("/about")} py-2`}
              onClick={() => {
                navigate("/about");
                setMobileOpen(false);
              }}
            >
              About
            </li>
            <li
              className={`${navLinkClass("/clinics")} py-2`}
              onClick={() => {
                navigate("/clinics");
                setMobileOpen(false);
              }}
            >
              Clinics
            </li>
            <li
              className={`${navLinkClass("/our-team")} py-2`}
              onClick={() => {
                navigate("/our-team");
                setMobileOpen(false);
              }}
            >
              Our Team
            </li>
            <li
              className={`${navLinkClass("/articles")} py-2`}
              onClick={() => {
                navigate("/articles");
                setMobileOpen(false);
              }}
            >
              Articles
            </li>
            <li
              className={`${navLinkClass("/contact")} py-2`}
              onClick={() => {
                navigate("/contact");
                setMobileOpen(false);
              }}
            >
              Contact
            </li>
          </ul>
          <div className="px-6 pb-8">
            <div className="px-6 pb-8 space-y-3">
              <Button
                onClick={() => {
                  navigate("/0/");
                  setMobileOpen(false);
                }}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  navigate("/0/register");
                  setMobileOpen(false);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Register to Konsulta
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default WebsiteTopNav;
