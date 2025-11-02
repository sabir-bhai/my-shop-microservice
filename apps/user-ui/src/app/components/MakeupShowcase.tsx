// import React, { useRef } from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// const categories = [
//   {
//     label: "Face",
//     image:
//       "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     label: "Lips",
//     image:
//       "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     label: "Eyes",
//     image:
//       "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     label: "Nails",
//     image:
//       "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     label: "Lips",
//     image:
//       "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     label: "Eyes",
//     image:
//       "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
//   },
//   {
//     category: "Eyes",
//     image:
//       "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
//   },
// ];

// const MakeupShowcase = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: -310, // width of one card + gap
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: 310,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-3xl font-semibold">My Product</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={scrollLeft}
//             className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer shadow-md"
//             aria-label="Previous product"
//           >
//             <ArrowLeft size={18} className="text-gray-600" />
//           </button>
//           <button
//             onClick={scrollRight}
//             className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer shadow-md"
//             aria-label="Next product"
//           >
//             <ArrowRight size={18} className="text-gray-600" />
//           </button>
//         </div>
//       </div>

//       <div
//         ref={scrollRef}
//         className="flex flex-row gap-3 overflow-x-auto scrollbar-hide"
//         style={{ scrollBehavior: "smooth" }}
//       >
//         {categories.map((cat, index) => (
//           <div key={index}>
//             <div className="overflow-hidden rounded-lg w-[300px] h-[190px]">
//               <img
//                 src={cat.image}
//                 alt={cat.label}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p className="mt-2 text-base">{cat.label}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MakeupShowcase;

import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Face",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Lips",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Eyes",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Nails",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Lips",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Eyes",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
  },
  {
    label: "Eyes",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center",
  },
];

const MakeupShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // custom smooth animation function
  const animateScroll = (offset: number) => {
    if (!scrollRef.current) return;
    let start = scrollRef.current.scrollLeft;
    let end = start + offset;
    let step = offset / 10; // number of steps
    let count = 0;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += step;
      }
      count++;
      if (count === 10) clearInterval(interval);
    }, 15); // speed
  };

  const handleScrollLeft = () => {
    animateScroll(-310);
  };

  const handleScrollRight = () => {
    animateScroll(310);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">My Product</h2>
        <div className="flex gap-2">
          <button
            onClick={handleScrollLeft}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer shadow-md"
            aria-label="Previous product"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <button
            onClick={handleScrollRight}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer shadow-md"
            aria-label="Next product"
          >
            <ArrowRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-row gap-3 overflow-x-auto scrollbar-hide"
      >
        {categories.map((cat, index) => (
          <div key={index}>
            <div className="overflow-hidden rounded-lg w-[300px] h-[190px]">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-base">{cat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeupShowcase;
