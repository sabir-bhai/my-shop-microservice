// Updated interfaces to match your API response

export interface User {
  id: string;
  name: string;
}

export interface ReviewData {
  id: string;
  rating: number;
  title: string;
  comment: string; // ✅ Fixed: was "conment" - typo corrected
  images: string[]; // ✅ Changed: Array of image URLs instead of single image
  date: string; // ISO date string
  likes: number;
  isVerifiedPurchase: boolean;
  recommendsProduct: boolean;
  productId: string; // ✅ Added: from API response
  userId: string; // ✅ Added: from API response
  user: User; // ✅ Updated: matches API structure
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
  recommendationPercentage: number;
  totalRecommendations: number;
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ✅ New: Interface for the complete API response
export interface ReviewsApiResponse {
  success: boolean;
  data: {
    reviews: ReviewData[];
    pagination: ReviewPagination;
    statistics: ReviewStats;
  };
}

// Form interfaces (these remain mostly the same)
export interface ReviewFormData {
  rating: number;
  title: string;
  description: string; // This will map to "comment" in API
  images: File[]; // Files for upload
  wouldRecommend: boolean | null; // This will map to "recommendsProduct" in API
}

export interface UploadedImage {
  id: string;
  file: File;
  url: string; // Local URL for preview
}

// ✅ New: Interface for creating a review (request payload)
export interface CreateReviewRequest {
  rating: number;
  title: string;
  comment: string;
  images?: string[]; // ImageKit URLs after upload
  isVerifiedPurchase?: boolean;
  recommendsProduct?: boolean;
}

// ✅ New: Interface for single review API response
export interface SingleReviewApiResponse {
  success: boolean;
  message?: string;
  data: ReviewData;
}

// Utility type to get user initials (since API doesn't provide them)
export const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ✅ Helper function to transform form data to API request
export const transformFormDataToApiRequest = (
  formData: ReviewFormData,
  imageUrls: string[] = []
): CreateReviewRequest => {
  return {
    rating: formData.rating,
    title: formData.title,
    comment: formData.description, // Map description to comment
    images: imageUrls,
    recommendsProduct: formData.wouldRecommend || false,
    isVerifiedPurchase: false, // Default value, can be updated based on your logic
  };
};

// ✅ Helper function to transform API response to display format
export const transformApiResponseToDisplayFormat = (apiData: ReviewData) => {
  return {
    ...apiData,
    user: {
      ...apiData.user,
      initials: getUserInitials(apiData.user.name),
    },
  };
};

// ✅ Extended ReviewData with computed properties for display
export interface ReviewDataWithInitials extends ReviewData {
  user: User & {
    initials: string;
  };
}

// ✅ Type for query parameters
export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "rating" | "likes";
  sortOrder?: "asc" | "desc";
}

// ✅ Error response interface
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}
