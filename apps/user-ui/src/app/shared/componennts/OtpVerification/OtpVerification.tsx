"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface OtpVerificationProps {
  email: string; // email or phone
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email }) => {
  const [otp, setOtp] = useState(Array(6).fill("")); // 6-digit OTP
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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
      axios.post("http://localhost:8080/api/verify-otp", {
        email,
        otp: otpCode,
      }),
    onSuccess: () => {
      alert("OTP Verified Successfully ✅");
      router.push("/");
    },
    onError: () => {
      alert("Invalid OTP ❌. Please try again.");
    },
  });

  const handleVerify = () => {
    verifyOtpMutation.mutate();
  };

  // ✅ Mutation for resending OTP
  const resendOtpMutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:8080/api/resend-otp", { email }),
    onSuccess: () => {
      alert("OTP resent successfully ✅");
      setTimer(30);
      setCanResend(false);
    },
    onError: () => {
      alert("Failed to resend OTP ❌");
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
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        {/* Verify Button */}
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

        {/* Resend OTP */}
        <button
          type="button"
          disabled={!canResend || resendOtpMutation.isPending}
          onClick={() => resendOtpMutation.mutate()}
          className={`w-full font-medium text-sm mb-4 ${
            canResend
              ? "text-[#773d4c] hover:underline"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {canResend
            ? "RESEND OTP"
            : `Resend OTP in 00:${timer.toString().padStart(2, "0")}`}
        </button>

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
