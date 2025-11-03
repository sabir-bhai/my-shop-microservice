// "use client";
// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import axios, { AxiosError } from "axios";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import axiosInstance from "../../utils/axiosinstance";

// // Add google property to window type
// declare global {
//   interface Window {
//     google?: any;
//   }
// }

// interface LoginFormInputs {
//   email: string;
//   password: string;
//   agreed: boolean;
// }

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormInputs>();

//   // 🔑 Axios login mutation
//   const loginMutation = useMutation({
//     mutationFn: (data: LoginFormInputs) =>
//       axios.post("http://localhost:8080/api/login", data, {
//         withCredentials: true,
//       }),
//     onSuccess: (res) => {
//       const { user } = res.data;
//       router.push("/");
//       toast.success("Welcome back, " + user.name);
//     },
//     onError: (err: unknown) => {
//       const axiosError = err as AxiosError<any>;
//       const message =
//         axiosError?.response?.data?.error?.message || "Something went wrong";

//       toast.error(message);
//     },
//   });

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:8080/api/login-with-google";
//   };

//   return (
//     <>
//       {/* Google Sign-In Script */}
//       <script src="https://accounts.google.com/gsi/client" async defer></script>

//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-medium text-gray-900 mb-2">Login</h1>
//             <p className="text-sm text-gray-600">
//               To access account and build your profile
//             </p>
//           </div>

//           {/* Google Sign-In Button */}
//           <button
//             onClick={handleGoogleLogin}
//             // onClick={() => googleLoginMutation.mutate()}
//             className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             {/* {googleLoginMutation.isPending
//               ? "Signing in..."
//               : "Continue with Google"} */}
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-white px-4 text-gray-500">
//                 Or continue with email
//               </span>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Email */}
//             <div className="mb-6">
//               <label className="block text-sm text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className={`w-full px-3 py-3 border rounded-md text-sm ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="block text-sm text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: { value: 6, message: "Minimum 6 characters" },
//                   })}
//                   className={`w-full px-3 py-3 border rounded-md text-sm pr-10 ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Forgot Password */}
//             <div className="text-right mb-6">
//               <Link href="/forgot-password" className="text-sm">
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Terms */}
//             <div className="mb-6">
//               <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agreed}
//                   onChange={(e) => setAgreed(e.target.checked)}
//                   className="mt-1"
//                 />
//                 <span>
//                   By continuing, you agree to our{" "}
//                   <a href="#" className="text-purple-700 hover:underline">
//                     Terms of use
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="text-purple-700 hover:underline">
//                     Privacy policy
//                   </a>
//                   .
//                 </span>
//               </label>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loginMutation.isPending}
//               className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6"
//             >
//               {loginMutation.isPending ? "Logging in..." : "Log In"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;

"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "../../utils/axiosinstance";

// Add google property to window type
declare global {
  interface Window {
    google?: any;
  }
}

interface LoginFormInputs {
  email: string;
  password: string;
  agreed: boolean;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // 🔥 NEW: Function to sync cart items from localStorage to server
  const syncCartToServer = async () => {
    try {
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems) {
        const parsedCartItems = JSON.parse(cartItems);

        // Send cart items to server
        for (const item of parsedCartItems) {
          // await axiosInstance.post("/add-to-cart", {
          //   productId: item.productId,
          //   quantity: item.quantity,
          //   // Add other necessary fields based on your cart item structure
          // });
          debugger;

          const res = await axiosInstance.post("/cart/api/add-to-cart", {
            productId: item.id,
            quantity: item.quantity,
          });
          return res.data;
        }

        // Clear localStorage after successful sync
        localStorage.removeItem("cartItems");
        console.log("Cart synced successfully");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      // Don't show error to user as this is a background operation
    }
  };

  // 🔑 Axios login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) =>
      axios.post("http://localhost:8080/api/login", data, {
        withCredentials: true,
      }),
    onSuccess: async (res) => {
      const { user } = res.data;

      // 🔥 NEW: Sync cart items after successful login
      await syncCartToServer();

      router.push("/");
      toast.success("Welcome back, " + user.name);
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<any>;
      const message =
        axiosError?.response?.data?.error?.message || "Something went wrong";

      toast.error(message);
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
 
    const existingCartItems = localStorage.getItem("cartItems");
    if (existingCartItems) {
      // Cart items already exist, they will be synced after OAuth callback
      console.log("Cart items found, will sync after login");
    }

    window.location.href = "http://localhost:8080/api/login-with-google";
  };

  return (
    <>
      {/* Google Sign-In Script */}
      <script src="https://accounts.google.com/gsi/client" async defer></script>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Login</h1>
            <p className="text-sm text-gray-600">
              To access account and build your profile
            </p>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-3 py-3 border rounded-md text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className={`w-full px-3 py-3 border rounded-md text-sm pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
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
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <Link href="/forgot-password" className="text-sm">
                Forgot password?
              </Link>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-purple-700 hover:underline">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-700 hover:underline">
                    Privacy policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#773d4c] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

// "use client";
// import React, { useState, useEffect } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import axios, { AxiosError } from "axios";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import useUser from "../../hooks/useUser";

// // Add google property to window type
// declare global {
//   interface Window {
//     google?: any;
//   }
// }

// interface LoginFormInputs {
//   email: string;
//   password: string;
//   agreed: boolean;
// }

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user } = useUser();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormInputs>();

//   // Check if user is already logged in and handle redirect
//   useEffect(() => {
//     if (user) {
//       handleSuccessfulLogin();
//     }
//   }, [user]);

//   const handleSuccessfulLogin = () => {
//     // Method 1: Check for redirect parameter in URL
//     const redirectUrl = searchParams.get("redirect");
//     if (redirectUrl) {
//       const decodedUrl = decodeURIComponent(redirectUrl);
//       router.replace(decodedUrl);
//       return;
//     }

//     // Method 2: Check localStorage as fallback
//     const storedRedirect = localStorage.getItem("redirectAfterLogin");
//     if (storedRedirect) {
//       localStorage.removeItem("redirectAfterLogin");
//       router.replace(storedRedirect);
//       return;
//     }

//     // Default redirect
//     router.replace("/"); // Default to home page
//   };

//   // 🔑 Axios login mutation
//   const loginMutation = useMutation({
//     mutationFn: (data: LoginFormInputs) =>
//       axios.post("http://localhost:8080/api/login", data, {
//         withCredentials: true,
//       }),
//     onSuccess: (res) => {
//       const { user } = res.data;
//       toast.success("Welcome back, " + user.name);
//       // The useEffect above will handle the redirect when user state updates
//       setTimeout(() => {
//         window.location.reload(); // Force refresh to update user context
//       }, 1000);
//     },
//     onError: (err: unknown) => {
//       const axiosError = err as AxiosError<any>;
//       const message =
//         axiosError?.response?.data?.error?.message || "Something went wrong";
//       toast.error(message);
//     },
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
//     loginMutation.mutate(data);
//   };

//   const handleGoogleLogin = () => {
//     // Store redirect info before Google OAuth
//     const redirectUrl = searchParams.get("redirect");
//     if (redirectUrl) {
//       localStorage.setItem(
//         "redirectAfterLogin",
//         decodeURIComponent(redirectUrl)
//       );
//     }

//     // Include redirect parameter in Google OAuth URL
//     let googleAuthUrl = "http://localhost:8080/api/login-with-google";
//     if (redirectUrl) {
//       googleAuthUrl += `?redirect=${redirectUrl}`;
//     }

//     window.location.href = googleAuthUrl;
//   };

//   return (
//     <>
//       {/* Google Sign-In Script */}
//       <script src="https://accounts.google.com/gsi/client" async defer></script>

//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-medium text-gray-900 mb-2">Login</h1>
//             <p className="text-sm text-gray-600">
//               To access account and build your profile
//             </p>
//             {searchParams.get("redirect") && (
//               <p className="mt-2 text-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
//                 Please login to continue with your checkout
//               </p>
//             )}
//           </div>

//           {/* Google Sign-In Button */}
//           <button
//             onClick={handleGoogleLogin}
//             disabled={loginMutation.isPending}
//             className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-white px-4 text-gray-500">
//                 Or continue with email
//               </span>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Email */}
//             <div className="mb-6">
//               <label className="block text-sm text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className={`w-full px-3 py-3 border rounded-md text-sm ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="block text-sm text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: { value: 6, message: "Minimum 6 characters" },
//                   })}
//                   className={`w-full px-3 py-3 border rounded-md text-sm pr-10 ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Forgot Password */}
//             <div className="text-right mb-6">
//               <Link href="/forgot-password" className="text-sm">
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Terms */}
//             <div className="mb-6">
//               <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agreed}
//                   onChange={(e) => setAgreed(e.target.checked)}
//                   className="mt-1"
//                 />
//                 <span>
//                   By continuing, you agree to our{" "}
//                   <a href="#" className="text-purple-700 hover:underline">
//                     Terms of use
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="text-purple-700 hover:underline">
//                     Privacy policy
//                   </a>
//                   .
//                 </span>
//               </label>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loginMutation.isPending || !agreed}
//               className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loginMutation.isPending ? "Logging in..." : "Log In"}
//             </button>
//           </form>

//           {/* Sign Up Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{" "}
//               <Link
//                 href="/register"
//                 className="text-[#773d4c] hover:underline font-medium"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;
