import { Request, Response } from "express";
import { prisma } from "../../../../packages/libs/prisma";
import { imagekit } from "../../../../packages/libs/imagekit";

const uploadImagesToImageKit = async (images: any[]): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    try {
      // Assuming image is a base64 string or buffer
      const uploadResponse = await imagekit.upload({
        file: image, // base64 string or buffer
        fileName: `review_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        folder: "/reviews", // organize in folders
      });
      return uploadResponse.url;
    } catch (error) {
      console.error("Error uploading image to ImageKit:", error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};

export const addReviewToProduct = async (req: any, res: Response) => {
  try {
    const { id: productId } = req.params;
    const userId = req.user?.id;

    const {
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase,
      recommendsProduct,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!rating || !title || !comment) {
      return res.status(400).json({
        message: "Rating, title, and comment are required",
      });
    }

    // Validate rating range
    const parsedRating = parseInt(rating, 10);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // Upload images to ImageKit if provided
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      try {
        imageUrls = await uploadImagesToImageKit(images);
      } catch (error) {
        return res.status(500).json({
          message: "Error uploading images",
          error: error,
        });
      }
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: parsedRating,
        title,
        comment,
        isVerifiedPurchase: Boolean(isVerifiedPurchase),
        recommendsProduct: Boolean(recommendsProduct),
        productId,
        userId,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        images: true, // include the newly created images
      },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error: any) {
    console.error("Add Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

// Get Reviews for a Product
export const getReviewsByProduct = async (req: any, res: Response) => {
  try {
    // Change this line to match your route parameter
    const { id: productId } = req.params; // If using /:id/reviews
    // OR const { productId } = req.params; // If using /:productId/reviews

    const {
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    console.log("Product ID received:", productId); // Debug log

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId as string },
    });

    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build sort object
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Get reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId: productId as string },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.review.count({
        where: { productId: productId as string },
      }),
    ]);

    // Calculate review statistics
    const reviewStats = await prisma.review.aggregate({
      where: { productId: productId as string },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId: productId as string },
      _count: {
        rating: true,
      },
    });

    // Calculate recommendation statistics
    const recommendationStats = await prisma.review.groupBy({
      by: ["recommendsProduct"],
      where: { productId: productId as string },
      _count: {
        recommendsProduct: true,
      },
    });

    // Calculate recommendation percentage
    const totalRecommendations = recommendationStats.find(
      (stat) => stat.recommendsProduct === true
    )?._count.recommendsProduct || 0;

    const totalReviewsForRecommendation = recommendationStats.reduce(
      (sum, stat) => sum + stat._count.recommendsProduct,
      0
    );

    const recommendationPercentage =
      totalReviewsForRecommendation > 0
        ? Math.round((totalRecommendations / totalReviewsForRecommendation) * 100)
        : 0;

    const totalPages = Math.ceil(totalCount / take);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalCount,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
        statistics: {
          averageRating: reviewStats._avg.rating || 0,
          totalReviews: reviewStats._count.rating || 0,
          ratingDistribution: ratingDistribution.reduce((acc, curr) => {
            acc[curr.rating] = curr._count.rating;
            return acc;
          }, {} as Record<number, number>),
          recommendationPercentage,
          totalRecommendations,
        },
      },
    });
  } catch (error: any) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};
