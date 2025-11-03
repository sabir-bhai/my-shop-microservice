"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import OtpVerification from "../../shared/componennts/OtpVerification/OtpVerification"; // import the OTP component

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState(""); // save email for OTP verification

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const mutation = useMutation({
    mutationFn: (data: SignUpFormInputs) =>
      axios.post("http://localhost:8080/api/user-registration", data),
    onSuccess: (response, variables) => {
      const { otpPending } = response.data;

      if (otpPending) {
        // OTP already exists, redirect to verification page
        toast.info("OTP already sent to this email. Please check your inbox.");
      } else {
        // New OTP sent
        toast.success("OTP sent to your email successfully!");
      }

      setEmail(variables.email);
      setOtpSent(true);
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      if (error instanceof AxiosError) {
        // Extract error message from nested structure: error.message or error.error.message
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Signup failed, please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Signup failed, please try again.");
      }
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    mutation.mutate(data);
  };

  if (otpSent) {
    return <OtpVerification email={email} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Create An Account
          </h1>
          <p className="text-sm text-gray-600">
            Create your account and build your profile
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register("name", { required: "Full name is required" })}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min length is 6" },
                })}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm pr-10"
                placeholder="Create a password"
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
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm pr-10"
                placeholder="Confirm your password"
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
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-[#773d4c] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                {...register("agreed", {
                  required: "You must agree to continue",
                })}
                className="mt-1"
              />
              <span>
                By continuing, you agree to our{" "}
                <a href="#" className="text-[#773d4c] hover:underline">
                  Terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#773d4c] hover:underline">
                  Privacy policy.
                </a>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-red-600">{errors.agreed.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6"
          >
            {mutation.isPending ? "Creating..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#773d4c] hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
