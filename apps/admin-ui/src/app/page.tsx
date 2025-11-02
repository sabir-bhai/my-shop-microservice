"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation<LoginResponse, any, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post(
        "http://localhost:8080/api/login-admin",
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Admin login successful:", data);
      router.push("/dashboard");
      // TODO: redirect to dashboard or save to state
    },
    onError: (error: any) => {
      console.error(
        "❌ Login failed:",
        error?.response?.data?.message || error.message
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0f1113] text-white">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1d21] shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2d31] px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="flex items-center gap-2 rounded-lg bg-[#2a2d31] px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
