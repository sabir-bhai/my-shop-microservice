// "use client";
// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   // const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleSignUp = () => {
//     console.log("Sign up data:", formData);
//   };

//   const handleGoogleSignUp = () => {
//     console.log("Continue with Google");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-medium text-gray-900 mb-2">
//             Create An Account
//           </h1>
//           <p className="text-sm text-gray-600">
//             Create your account and build your profile
//           </p>
//         </div>

//         {/* Name Field */}
//         <div className="mb-6">
//           <label className="block text-sm text-gray-700 mb-2">Full Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             placeholder="Enter your full name"
//           />
//         </div>

//         {/* Email Field */}
//         <div className="mb-6">
//           <label className="block text-sm text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleInputChange("email", e.target.value)}
//             className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             placeholder="Enter your email address"
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-6">
//           <label className="block text-sm text-gray-700 mb-2">Password</label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={formData.password}
//               onChange={(e) => handleInputChange("password", e.target.value)}
//               className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
//               placeholder="Create a password"
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? (
//                 <EyeOff className="w-5 h-5" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Confirm Password Field */}
//         <div className="mb-6">
//           <label className="block text-sm text-gray-700 mb-2">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               value={formData.confirmPassword}
//               onChange={(e) =>
//                 handleInputChange("confirmPassword", e.target.value)
//               }
//               className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
//               placeholder="Confirm your password"
//             />
//             <button
//               type="button"
//               onClick={toggleConfirmPasswordVisibility}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             >
//               {showConfirmPassword ? (
//                 <EyeOff className="w-5 h-5" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Terms and Privacy */}
//         <div className="mb-6">
//           <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
//             <div className="relative flex-shrink-0 mt-0.5">
//               <input
//                 type="checkbox"
//                 checked={agreed}
//                 onChange={(e) => setAgreed(e.target.checked)}
//                 className="sr-only"
//               />
//               <div
//                 className={`w-4 h-4 border border-gray-300 rounded flex items-center justify-center ${
//                   agreed ? "" : "bg-white"
//                 }`}
//               >
//                 {agreed && (
//                   <svg
//                     className="w-3 h-3 text-white"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 )}
//               </div>
//             </div>
//             <span>
//               By continuing, you agree to our{" "}
//               <a href="#" className="text-[#773d4c] hover:underline">
//                 Terms of use
//               </a>{" "}
//               and{" "}
//               <a href="#" className="text-[#773d4c] hover:underline">
//                 Privacy policy.
//               </a>
//             </span>
//           </label>
//         </div>

//         {/* Sign Up Button */}
//         <button
//           onClick={handleSignUp}
//           className="w-full bg-[#773d4c] text-white py-3 px-4 rounded-md font-medium hover:bg-purple-800 transition-colors mb-6"
//         >
//           CREATE ACCOUNT
//         </button>

//         {/* Divider */}
//         <div className="relative mb-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-white text-gray-500">OR</span>
//           </div>
//         </div>

//         {/* Google Sign Up */}
//         <button
//           onClick={handleGoogleSignUp}
//           className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mb-6"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24">
//             <path
//               fill="#4285F4"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="#34A853"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               fill="#EA4335"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           CONTINUE WITH GOOGLE
//         </button>

//         {/* Login Link */}
//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link href="login" className="text-[#773d4c]">
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;

"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
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
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setOtpSent(true);
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      alert("Signup failed, please try again.");
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
          <div className="mb-6">
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
      </div>
    </div>
  );
};

export default SignUpPage;
