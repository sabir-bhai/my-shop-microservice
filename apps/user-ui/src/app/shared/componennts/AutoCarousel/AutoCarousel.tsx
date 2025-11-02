import React, { useState, useEffect } from "react";

// TypeScript interfaces
interface CarouselItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  productImage: string;
}

// Sample data with dummy images
const carouselData: CarouselItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    title: "Great Hair Days",
    subtitle: "Begin with the Right Shampoo!",
    buttonText: "SHOP SHAMPOOS",
    productImage:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    title: "Nourish & Strengthen",
    subtitle: "Premium Hair Treatment Collection",
    buttonText: "SHOP TREATMENTS",
    productImage:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    title: "Style & Protect",
    subtitle: "Professional Styling Solutions",
    buttonText: "SHOP STYLING",
    productImage:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Calculate slide positions for dramatic edge-to-edge effect
  const getSlidePosition = (index: number) => {
    const totalSlides = carouselData.length;
    const diff = (index - currentIndex + totalSlides) % totalSlides;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === totalSlides - 1) return "left";
    return "hidden";
  };

  // Get CSS classes for edge-visible transitions
  const getSlideClass = (position: string) => {
    const baseClasses =
      "absolute inset-0 transition-all duration-1000 ease-in-out";

    switch (position) {
      case "center":
        return `${baseClasses} transform translate-x-0 opacity-100 scale-100 z-20`;
      case "left":
        return `${baseClasses} transform -translate-x-3/4 opacity-70 scale-90 z-10`;
      case "right":
        return `${baseClasses} transform translate-x-3/4 opacity-70 scale-90 z-10`;
      default:
        return `${baseClasses} transform translate-x-full opacity-0 scale-95 z-0`;
    }
  };

  return (
    <div className="w-full mb-4">
      {/* Carousel Container - Full viewport width with visible edges */}
      <div className="relative h-96 md:h-[600px] overflow-visible">
        <div className="relative h-full overflow-hidden ">
          {carouselData.map((item, index) => {
            const position = getSlidePosition(index);

            return (
              <div key={item.id} className={getSlideClass(position)}>
                <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "auto" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-6 md:px-16 max-w-7xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-white space-y-6">
                          <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                              <span className="block">
                                {item.title.split(" ")[0]}
                              </span>
                              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                {item.title.split(" ").slice(1).join(" ")}
                              </span>
                            </h1>
                            <p className="text-xl md:text-3xl font-light opacity-90 leading-relaxed">
                              {item.subtitle}
                            </p>
                          </div>

                          <button className="group  text-[#ffffff] px-10 py-4 text-lg font-bold border border-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
                            <span className="relative z-10">
                              {item.buttonText}
                            </span>
                            <div className="absolute inset-0  transition-opacity duration-300"></div>
                          </button>
                        </div>

                        {/* Product Image */}
                        <div className="flex justify-center lg:justify-end">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-3xl opacity-20 scale-110"></div>
                            <div className="relative w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]">
                              <img
                                src={item.productImage}
                                alt="Product"
                                className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                style={{ imageRendering: "auto" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Indicators */}
        <div className="flex justify-center mt-8 space-x-4">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-12 h-4 bg-gradient-to-r bg-[#773d4c]"
                  : "w-4 h-4 bg-gray-400 hover:bg-gray-300 hover:scale-110"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <div className="absolute inset-0 bg-gradient-to-r bg-[#773d4c] animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
