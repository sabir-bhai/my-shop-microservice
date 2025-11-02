import React from "react";

interface RecommendationCircleProps {
  percentage: number;
  totalRecommendations: number;
}

const RecommendationCircle: React.FC<RecommendationCircleProps> = ({
  percentage,
  totalRecommendations,
}) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center ">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-[#9F1439]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#9F1439]">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-medium text-gray-800">
          {percentage}% of the users would
        </p>
        <p className="text-sm font-medium text-gray-800">
          recommend this product
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {totalRecommendations} recommendations
        </p>
      </div>
    </div>
  );
};

export default RecommendationCircle;
