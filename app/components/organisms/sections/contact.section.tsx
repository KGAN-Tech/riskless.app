import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SectionHeader } from "@/components/molecules/shared/section-header";
import { ContactForm } from "@/components/molecules/shared/contact-form";
import type { ContactData } from "@/types/home.types";
import { CONTACT_INFO } from "~/app/configuration/others/constConfig.config";

interface ContactSectionProps {
  contactData: ContactData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactData,
}) => {
  return (
    <section className="py-16 md:py-24 px-4 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={contactData.title}
          description={contactData.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ContactForm showTitle={false} />

          <div className="bg-white rounded-2xl shadow-xl p-0 flex flex-col overflow-hidden">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.3159392375123!2d121.04999336955684!3d14.58404089911878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c83eb36af479%3A0x31150a9b87e5e5ce!2sGlobal%20Link%20Center!5e0!3m2!1sen!2sph!4v1751546528194!5m2!1sen!2sph"
                className="w-full h-full rounded-t-2xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <FaMapMarkerAlt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Visit Us
                  </h3>
                  <p className="text-gray-600">
                    {CONTACT_INFO.ADDRESS.MAIN_OFFICE}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <FaPhone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Call Us
                  </h3>
                  <p className="text-gray-600">{CONTACT_INFO.PHONE.MAIN}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Us
                  </h3>
                  <p className="text-gray-600">{CONTACT_INFO.EMAIL.GENERAL}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
