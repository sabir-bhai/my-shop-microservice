"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      {/* Top benefits section */}
      <div className="bg-[#773d4c] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm opacity-90">Only for gold members</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">24/7 Chat Support</div>
                <div className="text-sm opacity-90">
                  Outstanding premium support
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">100% Authentic</div>
                <div className="text-sm opacity-90">
                  Enjoy the joy of shopping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="bg-[#fbf9f6] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-medium text-[#353433] mb-2">
                Stay updated with [<span className="italic">formula</span>]
              </h3>
              <p className="text-[#353433] opacity-75">
                Subscribe for exclusive offers, skincare tips and early access
                to new products!
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#773d4c]"
              />
              <button className="px-6 py-2 bg-[#773d4c] text-white rounded hover:bg-opacity-90 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-[#fbf9f6] pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Shop Section */}
            <div>
              <h4 className="font-medium text-[#353433] mb-4 uppercase text-sm tracking-wider">
                SHOP
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [Skin Care]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [Hair Care]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [Body Care]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [Wellness]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [Makeup]
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories Section */}
            <div>
              <ul className="space-y-2 mt-8">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [for Men]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [for Mom & Baby]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [for You]
                  </a>
                </li>
              </ul>
            </div>

            {/* Shop by Routine Section */}
            <div>
              <ul className="space-y-2 mt-8">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Shop by [Routine]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Korean [formula]
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h4 className="font-medium text-[#353433] mb-4 uppercase text-sm tracking-wider">
                COMPANY
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Returns & Exchange
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Formula Book Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-gray-200">
            <div>
              <h4 className="font-medium text-[#353433] mb-4 uppercase text-sm tracking-wider">
                FORMULA BOOK
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Routines 101
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Ingredients Lab
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-2 mt-8">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Gro Skincare
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Seasonal Skincare
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-2 mt-8">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    [formula] Digest
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Support Section */}
            <div>
              <h4 className="font-medium text-[#353433] mb-4 uppercase text-sm tracking-wider">
                CUSTOMER SUPPORT
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    FAQ's
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#353433] hover:text-[#773d4c] transition-colors"
                  >
                    Help Centre
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-[#fbf9f6] py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[#353433] text-sm">
                © 2024 The Formula Shop. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Brand Logo */}
              <div className="text-[#773d4c]">
                <span className="text-lg font-light">The </span>
                <span className="text-lg italic">[formula]</span>
                <span className="text-sm font-light ml-1">Shop</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-[#353433] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#353433] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.029 12.017.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#353433] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
