// "use client";
// import React from "react";

// type CheckoutStepperProps = {
//   currentStep: number; // 0 = Review Order, 1 = Shipping, 2 = Payment
// };

// export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
//   const steps = ["Review Order", "Shipping & Address", "Payment"];

//   return (
//     <div className="bg-[#e8d7cc] w-full flex justify-center py-4">
//       <div className="flex items-center space-x-8">
//         {steps.map((label, index) => {
//           const isCompleted = index < currentStep;
//           const isActive = index === currentStep;

//           return (
//             <div key={index} className="flex items-center">
//               {/* Step Circle */}
//               <div
//                 className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors duration-300
//                   ${
//                     isCompleted || isActive
//                       ? "bg-[#6b2c3a] border-[#6b2c3a]"
//                       : "bg-transparent border-[#6b2c3a]"
//                   }`}
//               ></div>

//               {/* Step Label */}
//               <span
//                 className={`ml-2 text-sm font-medium transition-colors duration-300
//                   ${
//                     isCompleted || isActive ? "text-[#6b2c3a]" : "text-gray-600"
//                   }`}
//               >
//                 {label}
//               </span>

//               {/* Divider */}
//               {index < steps.length - 1 && (
//                 <div className="mx-6 w-20 border-t border-dashed border-[#6b2c3a]"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";

type CheckoutStepperProps = {
  currentStep: number;
  onStepClick: (step: number) => void;
};

export default function CheckoutStepper({
  currentStep,
  onStepClick,
}: CheckoutStepperProps) {
  const steps = ["Review Order", "Shipping & Address", "Payment"];

  return (
    <div className="bg-[#e8d7cc] w-full flex justify-center py-4">
      <div className="flex items-center space-x-8">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle + Label (clickable if going back) */}
              <div
                onClick={() => {
                  if (index <= currentStep) onStepClick(index);
                }}
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors duration-300
                    ${
                      isCompleted || isActive
                        ? "bg-[#6b2c3a] border-[#6b2c3a]"
                        : "bg-transparent border-[#6b2c3a]"
                    }`}
                ></div>

                <span
                  className={`ml-2 text-sm font-medium transition-colors duration-300
                    ${
                      isCompleted || isActive
                        ? "text-[#6b2c3a]"
                        : "text-gray-600"
                    }`}
                >
                  {label}
                </span>
              </div>

              {/* Divider */}
              {index < steps.length - 1 && (
                <div className="mx-6 w-20 border-t border-dashed border-[#6b2c3a]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

