"use client";

import React, { useState, useEffect } from "react";
import timerBanner from "../../../../public/assets/images/timer-banner-images.jpg";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 2,
    hours: 10,
    minutes: 24,
    seconds: 54,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center mb-5">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${timerBanner.src})` }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {/* Gradient overlay for additional visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-indigo-900/70"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white">
        {/* Final Hours text */}
        <div className="mb-6">
          <h3 className="text-2xl font-light italic text-gray-200 mb-2">
            Final Hours
          </h3>
        </div>

        {/* Main heading */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">
            Last Chance to <span className="text-white">Save 50%</span> on All
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Sale Items!
          </h2>
        </div>

        {/* Countdown timer */}
        <div className="flex justify-center space-x-8 md:space-x-16 mb-12">
          <div className="text-center">
            <div className="text-7xl md:text-8xl font-bold leading-none drop-shadow-lg">
              {formatTime(timeLeft.days)}
            </div>
            <div className="text-lg md:text-xl text-gray-200 mt-2 drop-shadow-md">
              Days
            </div>
          </div>
          <div className="text-center">
            <div className="text-7xl md:text-8xl font-bold leading-none drop-shadow-lg">
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-lg md:text-xl text-gray-200 mt-2 drop-shadow-md">
              Hours
            </div>
          </div>
          <div className="text-center">
            <div className="text-7xl md:text-8xl font-bold leading-none drop-shadow-lg">
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-lg md:text-xl text-gray-200 mt-2 drop-shadow-md">
              Minutes
            </div>
          </div>
          <div className="text-center">
            <div className="text-7xl md:text-8xl font-bold leading-none drop-shadow-lg">
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-lg md:text-xl text-gray-200 mt-2 drop-shadow-md">
              Seconds
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="group relative overflow-hidden border border-gray-300 bg-black/10 backdrop-blur-sm hover:bg-white hover:text-gray-900 text-white px-8 py-4 text-lg font-semibold tracking-wider transition-all duration-300 ease-out drop-shadow-lg">
          <span className="relative z-10 flex items-center">
            SHOP NOW
            <svg
              className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
          <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
        </button>
      </div>

      {/* Subtle background patterns - now more subtle to work with the image */}
      <div className="absolute inset-0 opacity-5 z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-400 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/2 w-32 h-32 border border-pink-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default CountdownBanner;
