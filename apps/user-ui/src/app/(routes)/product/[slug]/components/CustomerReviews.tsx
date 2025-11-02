"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js App Router
import { ReviewData, ReviewStats } from "../types/review";
import ReviewsOverview from "./ReviewsOverview";
import ReviewCard from "./ReviewCard";
import WriteReviewSidebar from "./WriteReviewSidebar";
import useUser from "apps/user-ui/src/app/hooks/useUser";

interface CustomerReviewsProps {
  stats: ReviewStats;
  reviews: ReviewData[];
  id: string;
  refetch: () => void;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  stats,
  reviews,
  id,
  refetch,
}) => {
  console.log("Stats", stats, "reviews", reviews.toString());
  const [isReviewSidebarOpen, setIsReviewSidebarOpen] = useState(false);
  const { user, isLoading } = useUser(); // 👈 check authentication
  const router = useRouter();

  const handleOpenSidebar = () => {
    if (isLoading) return; // wait until auth is resolved

    if (user) {
      setIsReviewSidebarOpen(true);
    } else {
      router.push("/login"); // 👈 redirect to login if not authenticated
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="border shadow-sm border-[#e2e8f0] bg-white p-6 mb-5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            className="border-2 border-red-500 text-red-500 px-6 py-2 rounded hover:bg-red-50 transition-colors"
            onClick={handleOpenSidebar}
          >
            WRITE A REVIEW →
          </button>
        </div>

        <ReviewsOverview stats={stats} />
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Sidebar (only renders if isReviewSidebarOpen is true) */}
      <WriteReviewSidebar
        isOpen={isReviewSidebarOpen}
        onClose={() => setIsReviewSidebarOpen(false)}
        productId={id}
        onReviewSubmitted={refetch}
      />
    </div>
  );
};

export default CustomerReviews;
