"use client";
import React from "react";
import { BannerManagement } from "./components/BannerManagement";

const HomePage: React.FC = () => {
  return (
    <main className=" bg-gray-900 px-2">
      <BannerManagement />
    </main>
  );
};

export default HomePage;
