import { Edit3, Star, Trash2 } from "lucide-react";
import { Review } from "../types/type";
import { useState } from "react";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      productName: "Wireless Headphones",
      productImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
      rating: 5,
      title: "Excellent sound quality",
      comment:
        "These headphones exceeded my expectations. Great bass and crystal clear highs.",
      date: "2024-01-10",
    },
    {
      id: "2",
      productName: "Smart Watch",
      productImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
      rating: 4,
      title: "Good value for money",
      comment:
        "Nice features and decent battery life. Could be more comfortable to wear.",
      date: "2024-01-05",
    },
  ]);

  const StarRating = ({
    rating,
    size = 16,
  }: {
    rating: number;
    size?: number;
  }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#773d4c] mb-6">
        My Reviews & Ratings
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-2xl p-4"
          >
            <div className="flex gap-4">
              <img
                src={review.productImage}
                alt={review.productName}
                className="w-16 h-16 rounded-2xl object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-[#773d4c]">
                      {review.productName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-gray-600">
                        {review.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-[#773d4c] hover:text-opacity-80 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewsSection;
