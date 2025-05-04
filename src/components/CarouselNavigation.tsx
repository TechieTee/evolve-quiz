import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalSlides: number;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onPrevious,
  onNext,
  currentIndex,
  totalSlides,
}) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={onPrevious}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex space-x-2 mx-4">
        {[...Array(totalSlides)].map((_, idx) => (
          <span
            key={idx}
            className={`block rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-3 h-3 bg-teal-400"
                : "w-2 h-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default CarouselNavigation;
