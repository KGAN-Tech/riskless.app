import React from "react";
import Navbar from "@/components/organisms/navigation/website.top.nav";
import { PageBanner } from "@/components/molecules/shared/page-banner";
import FooterSectionV2 from "@/components/organisms/sections/footer.section.v2";

// Locally define PageBannerProps since it's not exported
interface PageBannerProps {
  title: string;
  description: string;
  backgroundImage: string;
}

interface GuestLayoutProps {
  children: React.ReactNode;
  bannerProps?: PageBannerProps;
  showBanner?: boolean;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({
  children,
  bannerProps,
  showBanner = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {showBanner && bannerProps && <PageBanner {...bannerProps} />}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">{children}</main>
      <FooterSectionV2 />
    </div>
  );
};

export default GuestLayout; 