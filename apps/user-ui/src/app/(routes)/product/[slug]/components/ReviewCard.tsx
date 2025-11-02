import React from "react";
import StarRating from "./StarRating";

interface User {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  isVerifiedPurchase: boolean;
  recommendsProduct: boolean;
  user: User;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString();

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex items-start space-x-4 border border-red-300">
        {/* User initials avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {review.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        </div>

        <div className="flex-1">
          {/* Rating & badges */}
          <div className="flex items-center space-x-2 mb-2">
            <StarRating rating={review.rating} />
            {review.recommendsProduct && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                RECOMMENDS PRODUCT
              </span>
            )}
            {review.isVerifiedPurchase && (
              <span className="border border-red-500 text-red-500 text-xs px-2 py-1 rounded">
                ✓ VERIFIED PURCHASE
              </span>
            )}
          </div>

          {/* Title & comment */}
          <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
            {review.comment}
          </p>

          {/* Footer with user & likes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {review.user.name}
              </span>
              <span className="text-gray-500 text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span className="text-sm text-gray-500">{review.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
