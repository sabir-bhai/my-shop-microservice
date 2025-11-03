"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormInputs) => {
      const response = await axios.post(
        "http://localhost:8080/api/reset-password",
        {
          token,
          newPassword: data.newPassword,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // Extract error message from nested structure: error.message or error.error.message
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to reset password. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = (data) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#faf8f7] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`w-full px-3 py-3 border rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                className={`w-full px-3 py-3 border rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6"
          >
            {resetPasswordMutation.isPending
              ? "Resetting Password..."
              : "RESET PASSWORD"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-[#773d4c] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
