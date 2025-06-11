import React, { useState } from "react";
import { Icon } from "./Icon";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showLoader?: boolean;
  aspectRatio?: "square" | "16/9" | "4/3" | "3/2" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  overlay?: React.ReactNode;
  lazy?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc,
  showLoader = true,
  aspectRatio = "auto",
  objectFit = "cover",
  overlay,
  lazy = true,
  onError,
  onLoad,
  className = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  };

  const getAspectRatioClass = () => {
    const ratios = {
      square: "aspect-square",
      "16/9": "aspect-video",
      "4/3": "aspect-[4/3]",
      "3/2": "aspect-[3/2]",
      auto: "",
    };
    return ratios[aspectRatio];
  };

  const getObjectFitClass = () => {
    const fits = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
      "scale-down": "object-scale-down",
    };
    return fits[objectFit];
  };

  return (
    <div
      className={`relative overflow-hidden ${getAspectRatioClass()} ${className}`}
    >
      {/* Loading state */}
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <Icon name="image" className="w-8 h-8 mb-2" />
          <span className="text-sm">Failed to load</span>
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={currentSrc}
          alt={alt}
          loading={lazy ? "lazy" : "eager"}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${getObjectFitClass()}`}
          {...props}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};
