// "use client";

// import React, { useRef } from "react";
// import { Upload, Globe } from "lucide-react";

// interface ProductImagesProps {
//   uploadedImages: number;
//   handleImageUpload: (files: FileList) => void;
// }

// export default function ProductImages({
//   uploadedImages,
//   handleImageUpload,
// }: ProductImagesProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleImageUpload(e.dataTransfer.files);
//       e.dataTransfer.clearData();
//     }
//   };

//   return (
//     <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//       <div className="flex items-center mb-6">
//         <Globe className="w-5 h-5 text-purple-400 mr-2" />
//         <h2 className="text-xl font-semibold">Product Images</h2>
//       </div>

//       <div
//         className="border-2 border-dashed border-purple-500 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-700 transition-colors"
//         onClick={() => fileInputRef.current?.click()}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={handleDrop}
//       >
//         <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium mb-2">
//           Drag & Drop or Click to Upload
//         </h3>
//         <p className="text-gray-400 mb-4">Supports up to 8 images</p>

//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
//           className="hidden"
//         />

//         <p className="text-sm text-gray-500 mt-4">
//           {uploadedImages}/8 images uploaded
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useRef } from "react";
import { Upload, Globe, X } from "lucide-react";

interface ProductImagesProps {
  uploadedImages: string[];
  handleImageUpload: (files: FileList) => void;
  handleRemoveImage: (index: number) => void;
}

export default function ProductImages({
  uploadedImages,
  handleImageUpload,
  handleRemoveImage,
}: ProductImagesProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <Globe className="w-5 h-5 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold">Product Images</h2>
      </div>

      <div
        className="border-2 border-dashed border-purple-500 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Drag & Drop or Click to Upload
        </h3>
        <p className="text-gray-400 mb-4">Supports up to 8 images</p>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          className="hidden"
        />

        <p className="text-sm text-gray-500 mt-4">
          {uploadedImages.length}/8 images uploaded
        </p>
      </div>

      {/* Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-8">
          {uploadedImages.map((imgUrl, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-gray-700 bg-gray-900 shadow-lg"
            >
              <img
                src={imgUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-start p-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
