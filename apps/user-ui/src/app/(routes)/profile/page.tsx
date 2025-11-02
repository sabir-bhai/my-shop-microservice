"use client";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import OrdersSection from "./components/OrdersSection";
import AddressesSection from "./components/AddressesSection";
import ChangePasswordSection from "./components/ChangePasswordSection";
import PaymentMethodsSection from "./components/PaymentMethodsSection";
import SupportSection from "./components/SupportSection";
import NotificationsSection from "./components/NotificationSection";
import ReviewsSection from "./components/ReviewSection";
import SettingsSection from "./components/SettingsSection";
import LogoutSection from "./components/LogoutSection";
import Sidebar from "./components/Sidebar";
import SupportChat from "./components/SupportSection";

const page = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "orders":
        return <OrdersSection />;
      case "addresses":
        return <AddressesSection />;
      case "password":
        return <ChangePasswordSection />;
      case "payment":
        return <PaymentMethodsSection />;
      case "support":
        return <SupportChat />;
      case "notifications":
        return <NotificationsSection />;
      case "reviews":
        return <ReviewsSection />;
      case "settings":
        return <SettingsSection />;
      case "logout":
        return <LogoutSection />;
      default:
        return <ProfileSection />;
    }
  };
  return (
    <div className="min-h-screen bg-[#fbf9f6]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#773d4c]">Dashboard</h1>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-6 bg-[#ffffff] shadow-sm">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default page;
