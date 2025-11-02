// "use client";
// import React from "react";

// interface ConfirmModalProps {
//   isModalOpen: boolean;
//   title?: string;
//   message: string;
//   onCancel: () => void;
//   onConfirm: (id: string) => void;
// }

// const ConfirmModal: React.FC<ConfirmModalProps> = ({
//   isModalOpen,
//   title = "Confirm",
//   message,
//   onCancel,
//   onConfirm,
// }) => {
//   console.log("isOpen", isModalOpen);
//   if (!isModalOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
//       <div className="bg-[#1d1d1f] p-6 rounded-lg w-80">
//         <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
//         <p className="text-gray-300 mb-4">{message}</p>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             className="px-4 py-1 rounded bg-gray-600 text-white"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onConfirm("")}
//             className="px-4 py-1 rounded bg-red-600 text-white"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;

"use client";

import React, { useEffect } from "react";

interface ConfirmModalProps {
  isModalOpen: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isModalOpen,
  title = "Confirm",
  message,
  onCancel,
  onConfirm,
}) => {
  // Handle clicking outside the modal to close it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, onCancel]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-[#1d1d1f] p-6 rounded-lg w-80 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
