// "use client";

// import React from "react";
// import { Eye, Edit, Trash2 } from "lucide-react";

// export default function ActionMenu({ product, onAction, onClose }: any) {
//   return (
//     <div className="absolute right-0 top-8 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-100 min-w-[120px]">
//       <button
//         onClick={() => {
//           onAction(product, "view");
//           onClose();
//         }}
//         className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
//       >
//         <Eye className="w-4 h-4 mr-2" />
//         View
//       </button>
//       <button
//         onClick={() => {
//           onAction(product, "edit");
//           onClose();
//         }}
//         className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
//       >
//         <Edit className="w-4 h-4 mr-2" />
//         Edit
//       </button>
//       <button
//         onClick={() => {
//           onAction(product, "delete");
//           onClose();
//         }}
//         className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
//       >
//         <Trash2 className="w-4 h-4 mr-2" />
//         Delete
//       </button>
//     </div>
//   );
// }

"use client";

import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function ActionMenu({ product, onAction, onClose }: any) {
  return (
    <div className="absolute right-0 top-10 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[140px]">
      <button
        onClick={() => {
          onAction(product, "view");
          onClose();
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
      >
        <Eye className="w-4 h-4 mr-2" /> View
      </button>
      <button
        onClick={() => {
          onAction(product, "edit");
          onClose();
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
      >
        <Edit className="w-4 h-4 mr-2" /> Edit
      </button>
      <button
        onClick={() => {
          onAction(product, "delete");
          onClose();
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </button>
    </div>
  );
}
