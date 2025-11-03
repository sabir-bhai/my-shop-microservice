"use client";
import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface OtpVerificationProps {
  email: string; // email or phone
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email }) => {
  const [otp, setOtp] = useState(Array(6).fill("")); // 6-digit OTP
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const [timer, setTimer] = useState(150); // 2 min 30 sec (OTP validity time)
  const [canResend, setCanResend] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(60); // 60 sec to enter OTP
  const [canVerify, setCanVerify] = useState(true);

  // Countdown effect for OTP validity (150 seconds)
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
      setOtpExpired(true);
      toast.error("OTP expired! Please request a new OTP.");
    }
  }, [timer]);

  // Countdown effect for verification time limit (60 seconds)
  useEffect(() => {
    if (verificationTimer > 0 && !otpExpired) {
      const countdown = setInterval(
        () => setVerificationTimer((prev) => prev - 1),
        1000
      );
      return () => clearInterval(countdown);
    } else if (verificationTimer === 0 && !otpExpired) {
      setCanVerify(false);
      toast.error("Time expired! Please resend OTP to verify.");
    }
  }, [verificationTimer, otpExpired]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const otpCode = otp.join("");

  // ✅ Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      axiosInstance.post("/api/verify-otp", {
        email,
        otp: otpCode,
      }),
    onSuccess: () => {
      toast.success("OTP verified successfully! Welcome!");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // Extract error message from nested structure: error.message or error.error.message
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Invalid OTP. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    },
  });

  const handleVerify = () => {
    verifyOtpMutation.mutate();
  };

  // ✅ Mutation for resending OTP
  const resendOtpMutation = useMutation({
    mutationFn: () => axiosInstance.post("/api/resend-otp", { email }),
    onSuccess: () => {
      toast.success("OTP resent successfully! Check your email.");
      setTimer(150); // Reset to 2 min 30 sec
      setVerificationTimer(60); // Reset verification timer to 60 sec
      setCanResend(false);
      setCanVerify(true); // Re-enable verification
      setOtpExpired(false); // Reset expired state
      setOtp(Array(6).fill("")); // Clear OTP input
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // Extract error message from nested structure: error.message or error.error.message
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to resend OTP. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#faf8f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-medium mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          Sent to <span className="text-purple-700 font-medium">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              disabled={!canVerify || otpExpired}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-10 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                !canVerify || otpExpired
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Verification Timer Display */}
        <div className="text-center mb-4">
          <p
            className={`text-sm font-medium ${
              verificationTimer <= 10
                ? "text-red-600"
                : verificationTimer <= 30
                ? "text-orange-500"
                : "text-gray-600"
            }`}
          >
            {canVerify && !otpExpired ? (
              <>
                Time to verify:{" "}
                <span className="font-bold">
                  {Math.floor(verificationTimer / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(verificationTimer % 60).toString().padStart(2, "0")}
                </span>
              </>
            ) : (
              <span className="text-red-600 font-bold">
                {otpExpired
                  ? "OTP Expired!"
                  : "Verification time expired!"}
              </span>
            )}
          </p>
        </div>

        {/* Verify Button - Only show when timer is active */}
        {canVerify && !otpExpired && (
          <button
            disabled={!isOtpComplete || verifyOtpMutation.isPending}
            onClick={handleVerify}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors mb-4
              ${
                isOtpComplete
                  ? "bg-[#773d4c] text-white hover:bg-purple-900"
                  : "bg-[#d6c5ca] text-white cursor-not-allowed"
              }`}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "VERIFY & LOGIN"}
          </button>
        )}

        {/* Resend OTP Section - Shows when verification time expires */}
        {(!canVerify || otpExpired) && (
          <div className="mb-4">
            <button
              type="button"
              disabled={resendOtpMutation.isPending}
              onClick={() => resendOtpMutation.mutate()}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendOtpMutation.isPending ? "Sending..." : "RESEND OTP"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Note: You can request OTP up to 3 times within 5 minutes
            </p>
          </div>
        )}

        <hr className="my-4" />
        <p className="text-sm text-gray-600">
          Having trouble logging in?{" "}
          <a href="#" className="font-medium text-purple-700 hover:underline">
            Get Help
          </a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
