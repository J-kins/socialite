import React from "react";
import { Button, Icon } from "../atoms";

export interface SliderNavProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onGoToSlide?: (index: number) => void;
  variant?: "dots" | "arrows" | "both" | "numbered";
  size?: "sm" | "md" | "lg";
  position?: "inside" | "outside";
  showCounter?: boolean;
  autoPlay?: boolean;
  onToggleAutoPlay?: () => void;
  className?: string;
}

export const SliderNav: React.FC<SliderNavProps> = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  variant = "both",
  size = "md",
  position = "inside",
  showCounter = false,
  autoPlay = false,
  onToggleAutoPlay,
  className = "",
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: {
        button: "w-8 h-8",
        icon: "w-4 h-4",
        dot: "w-2 h-2",
        text: "text-sm",
      },
      md: {
        button: "w-10 h-10",
        icon: "w-5 h-5",
        dot: "w-3 h-3",
        text: "text-base",
      },
      lg: {
        button: "w-12 h-12",
        icon: "w-6 h-6",
        dot: "w-4 h-4",
        text: "text-lg",
      },
    };
    return sizes[size];
  };

  const sizeClasses = getSizeClass();

  const renderDots = () => {
    if (!["dots", "both"].includes(variant)) return null;

    return (
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide?.(index)}
            className={`
              ${sizeClasses.dot} rounded-full transition-all duration-200
              ${
                index === currentSlide
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/60 hover:bg-white/80"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  const renderArrows = () => {
    if (!["arrows", "both"].includes(variant)) return null;

    return (
      <>
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className={`
            ${sizeClasses.button} ${position === "inside" ? "absolute left-4 top-1/2 transform -translate-y-1/2" : ""}
            bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 flex items-center justify-center
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          aria-label="Previous slide"
        >
          <Icon name="chevron-back" className={sizeClasses.icon} />
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className={`
            ${sizeClasses.button} ${position === "inside" ? "absolute right-4 top-1/2 transform -translate-y-1/2" : ""}
            bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 flex items-center justify-center
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          aria-label="Next slide"
        >
          <Icon name="chevron-forward" className={sizeClasses.icon} />
        </button>
      </>
    );
  };

  const renderNumbered = () => {
    if (variant !== "numbered") return null;

    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous slide"
        >
          <Icon name="chevron-back" className={sizeClasses.icon} />
        </button>

        <div
          className={`${sizeClasses.text} text-white font-medium px-3 py-1 bg-black/30 rounded-full`}
        >
          {currentSlide + 1} / {totalSlides}
        </div>

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next slide"
        >
          <Icon name="chevron-forward" className={sizeClasses.icon} />
        </button>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Arrows */}
      {position === "inside" && renderArrows()}

      {/* Bottom Controls */}
      <div
        className={`
        ${position === "inside" ? "absolute bottom-4 left-1/2 transform -translate-x-1/2" : ""}
        flex items-center justify-center space-x-4
      `}
      >
        {/* Outside Arrows */}
        {position === "outside" && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
              disabled={currentSlide === 0}
              className={`
                ${sizeClasses.button} bg-white hover:bg-gray-50 text-gray-800 rounded-full shadow-lg border border-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              aria-label="Previous slide"
            >
              <Icon name="chevron-back" className={sizeClasses.icon} />
            </button>
          </div>
        )}

        {/* Dots */}
        {renderDots()}

        {/* Numbered */}
        {renderNumbered()}

        {/* Counter */}
        {showCounter && variant !== "numbered" && (
          <div
            className={`${sizeClasses.text} text-white font-medium px-3 py-1 bg-black/50 rounded-full`}
          >
            {currentSlide + 1} / {totalSlides}
          </div>
        )}

        {/* Auto-play Toggle */}
        {onToggleAutoPlay && (
          <button
            onClick={onToggleAutoPlay}
            className={`
              ${sizeClasses.button} bg-black/50 hover:bg-black/70 text-white rounded-full
              transition-all duration-200 flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            <Icon
              name={autoPlay ? "pause" : "play"}
              className={sizeClasses.icon}
            />
          </button>
        )}

        {/* Outside Arrows */}
        {position === "outside" && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className={`
                ${sizeClasses.button} bg-white hover:bg-gray-50 text-gray-800 rounded-full shadow-lg border border-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              aria-label="Next slide"
            >
              <Icon name="chevron-forward" className={sizeClasses.icon} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
