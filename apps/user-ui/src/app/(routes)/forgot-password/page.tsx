"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // or use any toast lib you use
import axios from "axios";

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormInputs>({
    mode: "onChange",
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormInputs) => {
      const response = await axios.post(
        "http://localhost:8080/api/forgot-password ",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent successfully");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(msg);
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#faf8f7] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-medium mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email below and we’ll send you an OTP to reset your
          password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-3 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || forgotPasswordMutation.isPending}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors mb-6 ${
              isValid
                ? "bg-[#773d4c] text-white"
                : "bg-[#d6c5ca] text-white cursor-not-allowed"
            }`}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "SEND OTP"}
          </button>
        </form>

        <Link href="/login" className="text-sm text-[#773d4c] hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
