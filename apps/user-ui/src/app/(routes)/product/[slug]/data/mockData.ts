import { ReviewData, ReviewStats } from "../types/review";

export const mockReviewStats: ReviewStats = {
  averageRating: 4.5,
  totalReviews: 153,
  ratingDistribution: {
    5: 30,
    4: 50,
    3: 20,
    2: 3,
    1: 0,
  },
  recommendationPercentage: 70,
  totalRecommendations: 107,
};

export const mockReviews: ReviewData[] = [
  {
    id: "1",
    rating: 5,
    title: "Good Product, works well",
    conment:
      "I am diligent when it comes to using a refrigerated caffeine eye serum in the morning to help de-puff and revive my eyes. I had gone through two bottles of a different caffeine eye serum before splurging on this. This is formulated with slightly less caffeine but feels more elegant (less filmy) and absorbs better! My eyes have definitel...",
    user: {
      name: "Robert Karmazov",
      initials: "RK",
    },
    date: "1 week ago",
    likes: 2,
    isVerifiedPurchase: true,
    recommendsProduct: true,
  },
  {
    id: "2",
    rating: 4,
    title: "Great value for money",
    conment:
      "This eye serum has been a game changer for my morning routine. The caffeine really helps with puffiness and the texture is smooth and lightweight.",
    user: {
      name: "Sarah Johnson",
      initials: "SJ",
    },
    date: "2 weeks ago",
    likes: 5,
    isVerifiedPurchase: true,
    recommendsProduct: true,
  },
];
