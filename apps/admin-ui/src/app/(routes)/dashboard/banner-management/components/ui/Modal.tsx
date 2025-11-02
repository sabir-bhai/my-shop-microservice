// import React, { useEffect } from "react";
// import { X } from "lucide-react";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
//   size?: "sm" | "md" | "lg" | "xl";
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = "md",
// }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: "w-96",
//     md: "w-[32rem]",
//     lg: "w-[48rem]",
//     xl: "w-[64rem]",
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
//       {/* Backdrop */}
//       <div className="absolute inset-0" onClick={onClose} />

//       {/* Modal Container - Centered */}
//       <div className="flex items-center justify-center min-h-screen p-4">
//         <div
//           className={`relative bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} max-w-[90vw] max-h-[90vh] overflow-y-auto`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {title && (
//             <div className="flex justify-between items-center p-6 border-b border-gray-700">
//               <h2 className="text-2xl font-semibold text-white">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//           )}
//           <div className="p-6">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "w-80",
    md: "w-[32rem]",
    lg: "w-[48rem]",
    xl: "w-[64rem]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer Modal */}
          <motion.div
            className={`absolute right-0 top-0 h-full bg-gray-800 shadow-xl ${sizeClasses[size]} max-w-[90vw] overflow-y-auto`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            {title && (
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
