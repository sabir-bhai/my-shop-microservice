"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Star, Upload, Plus } from "lucide-react";
import axiosInstance from "apps/user-ui/src/app/utils/axiosinstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewFormData = {
  rating: number;
  title: string;
  description: string;
  images: File[];
  wouldRecommend: boolean | null;
};

interface WriteReviewSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onReviewSubmitted?: () => void;
}

const WriteReviewSidebar: React.FC<WriteReviewSidebarProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,

    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      title: "",
      description: "",
      images: [],
      wouldRecommend: null,
    },
  });

  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; file: File; url: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Handle file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }

      if (uploadedImages.length >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);

      setUploadedImages((prev) => [...prev, { id, file, url }]);
      setValue("images", [...watch("images"), file]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (imageId: string) => {
    const imageToRemove = uploadedImages.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);

      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
      setValue(
        "images",
        watch("images").filter((file) => file !== imageToRemove.file)
      );
    }
  };

  //=========================== Submit review
  // const onSubmit = async (data: ReviewFormData) => {
  //   try {
  //     // Convert images to base64
  //     const base64Images = await Promise.all(
  //       data.images.map(
  //         (file) =>
  //           new Promise<string>((resolve, reject) => {
  //             const reader = new FileReader();
  //             reader.onloadend = () => resolve(reader.result as string);
  //             reader.onerror = reject;
  //             reader.readAsDataURL(file);
  //           })
  //       )
  //     );

  //     const payload = {
  //       rating: data.rating,
  //       title: data.title,
  //       comment: data.description,
  //       images: base64Images,
  //       isVerifiedPurchase: true, // optional: set from logic
  //       recommendsProduct: data.wouldRecommend,
  //     };

  //     await axiosInstance.post(
  //       `product/api/${productId}/reviews`,
  //       payload
  //     );
  //     onReviewSubmitted?.();
  //     alert("Review submitted successfully!");
  //     reset();
  //     setUploadedImages([]);
  //     onClose();
  //   } catch (error) {
  //     console.error("Submit Review Error:", error);
  //     alert("Failed to submit review. Please try again.");
  //   }
  // };
  const { mutate } = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      // Convert images to Base64
      const base64Images = await Promise.all(
        data.images.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      const payload = {
        rating: data.rating,
        title: data.title,
        comment: data.description,
        images: base64Images,
        isVerifiedPurchase: true,
        recommendsProduct: data.wouldRecommend,
      };

      return axiosInstance.post(
        `product/api/${productId}/reviews`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!", {
        icon: "✅",
        duration: 3000,
      });
      reset();
      setUploadedImages([]);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to submit review. Please try again.";

      // Show specific error message based on response
      if (errorMessage.includes("already reviewed")) {
        toast.error("You have already reviewed this product", {
          icon: "⚠️",
          duration: 4000,
        });
      } else if (errorMessage.includes("Unauthorized")) {
        toast.error("Please login to submit a review", {
          icon: "🔒",
          duration: 4000,
        });
      } else {
        toast.error(errorMessage, {
          icon: "❌",
          duration: 4000,
        });
      }
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    mutate(data);
  };
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Write a Review</h2>
            <button type="button" onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || watch("rating"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm">Rating is required</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Type here"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Review Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full border rounded-md px-3 py-2 resize-none"
                rows={4}
                placeholder="Type here"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add Images
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Review"
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 border-2 border-dashed flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border rounded-md"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload Images</span>
              </button>
            </div>

            {/* Would Recommend */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Would you recommend this product?
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setValue("wouldRecommend", true)}
                  className={`px-6 py-2 border rounded-md ${
                    watch("wouldRecommend") === true
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "border-gray-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setValue("wouldRecommend", false)}
                  className={`px-6 py-2 border rounded-md ${
                    watch("wouldRecommend") === false
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "border-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0 p-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#773d4c] text-white py-3 rounded-md font-medium hover:bg-purple-700"
            >
              {isSubmitting ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WriteReviewSidebar;
