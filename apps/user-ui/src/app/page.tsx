"use client";
import React from "react";
import { useRealtime } from "./hooks/useRealtime";
import AutoCarousel from "./shared/componennts/AutoCarousel/AutoCarousel";
import CountdownBanner from "./(routes)/CountdownBanner/CountdownBanner";
import AllProduct from "./components/AllProduct";
import ProductCategories from "./components/ProductCategories";
import MakeupShowcase from "./components/MakeupShowcase";
const Page = () => {
  useRealtime();

  return (
    <div>
      <AutoCarousel />
      <MakeupShowcase />
      <AllProduct />
      <ProductCategories />
      <CountdownBanner />
    </div>
  );
};

export default Page;
