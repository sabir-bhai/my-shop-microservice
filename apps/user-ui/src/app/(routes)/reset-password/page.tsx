"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p className="mb-4 text-gray-700">Reset password for: {email}</p>

        {/* Your reset form (OTP + new password) here */}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
