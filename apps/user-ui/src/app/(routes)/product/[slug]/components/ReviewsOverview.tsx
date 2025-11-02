import React from "react";
import { ReviewStats } from "../types/review";
import StarRating from "./StarRating";
import RatingBar from "./RatingBar";
import RecommendationCircle from "./RecommendationCircle";

interface ReviewsOverviewProps {
  stats: ReviewStats;
}

const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Overall Rating */}
      <div>
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {stats.averageRating}
        </div>
        <StarRating rating={stats.averageRating} size="lg" />
        <p className="text-gray-600 text-sm mt-2">
          based on {stats.totalReviews} reviews
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <RatingBar
            key={rating}
            rating={rating}
            count={stats.ratingDistribution[rating] || 0}
            totalReviews={stats.totalReviews}
          />
        ))}
      </div>

      {/* Recommendation Percentage */}
      <div className="flex justify-center">
        <RecommendationCircle
          percentage={stats.recommendationPercentage}
          totalRecommendations={stats.totalRecommendations}
        />
      </div>
    </div>
  );
};

export default ReviewsOverview;
