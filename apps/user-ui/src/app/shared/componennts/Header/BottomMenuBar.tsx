import React from "react";

const BottomMenuBar = () => {
  return (
    <nav className="bg-[#ffffff] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-8 text-sm font-medium">
        <a href="#" className=" transition-colors">
          Home
        </a>
        <a href="#" className="transition-colors">
          Electronics
        </a>
        <a href="#" className=" transition-colors">
          Fashion
        </a>
        <a href="#" className=" transition-colors">
          Home & Garden
        </a>
        <a href="#" className="transition-colors">
          Deals
        </a>
        <a href="#" className=" transition-colors">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default BottomMenuBar;
