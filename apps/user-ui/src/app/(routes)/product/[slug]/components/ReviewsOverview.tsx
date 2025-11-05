import React from "react";
import { ReviewStats } from "../types/review";
import StarRating from "./StarRating";
import RatingBar from "./RatingBar";
import RecommendationCircle from "./RecommendationCircle";

interface ReviewsOverviewProps {
  stats: ReviewStats;
}

const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ stats }) => {
  // Provide default values if stats is undefined
  const safeStats = stats || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    recommendationPercentage: 0,
    totalRecommendations: 0,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Overall Rating */}
      <div>
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {safeStats.averageRating}
        </div>
        <StarRating rating={safeStats.averageRating} size="lg" />
        <p className="text-gray-600 text-sm mt-2">
          based on {safeStats.totalReviews} reviews
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <RatingBar
            key={rating}
            rating={rating}
            count={safeStats.ratingDistribution[rating] || 0}
            totalReviews={safeStats.totalReviews}
          />
        ))}
      </div>

      {/* Recommendation Percentage */}
      <div className="flex justify-center">
        <RecommendationCircle
          percentage={safeStats.recommendationPercentage}
          totalRecommendations={safeStats.totalRecommendations}
        />
      </div>
    </div>
  );
};

export default ReviewsOverview;
