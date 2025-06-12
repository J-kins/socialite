import React, { useState, useRef, useEffect } from "react";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  delay?: number;
  disabled?: boolean;
  trigger?: "hover" | "click" | "focus";
  className?: string;
  contentClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  variant = "dark",
  size = "md",
  delay = 200,
  disabled = false,
  trigger = "hover",
  className = "",
  contentClassName = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let x = 0,
      y = 0;

    switch (position) {
      case "top":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - 8;
        break;
      case "bottom":
        x =
          triggerRect.left +
          scrollX +
          (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + scrollY + 8;
        break;
      case "left":
        x = triggerRect.left + scrollX - tooltipRect.width - 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - tooltipRect.height) / 2;
        break;
      case "right":
        x = triggerRect.right + scrollX + 8;
        y =
          triggerRect.top +
          scrollY +
          (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible, position]);

  const getSizeClass = () => {
    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const variants = {
      dark: "bg-gray-900 text-white border-gray-700",
      light: "bg-white text-gray-900 border-gray-200 shadow-lg",
    };
    return variants[variant];
  };

  const getArrowClass = () => {
    const arrowClasses = {
      top: `border-l-transparent border-r-transparent border-b-transparent ${
        variant === "dark" ? "border-t-gray-900" : "border-t-white"
      } top-full left-1/2 transform -translate-x-1/2`,
      bottom: `border-l-transparent border-r-transparent border-t-transparent ${
        variant === "dark" ? "border-b-gray-900" : "border-b-white"
      } bottom-full left-1/2 transform -translate-x-1/2`,
      left: `border-t-transparent border-b-transparent border-l-transparent ${
        variant === "dark" ? "border-r-gray-900" : "border-r-white"
      } right-full top-1/2 transform -translate-y-1/2`,
      right: `border-t-transparent border-b-transparent border-r-transparent ${
        variant === "dark" ? "border-l-gray-900" : "border-l-white"
      } left-full top-1/2 transform -translate-y-1/2`,
    };
    return arrowClasses[position];
  };

  const handleTriggerEvents = () => {
    if (trigger === "hover") {
      return {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      };
    }

    if (trigger === "click") {
      return {
        onClick: () => (isVisible ? hideTooltip() : showTooltip()),
      };
    }

    if (trigger === "focus") {
      return {
        onFocus: showTooltip,
        onBlur: hideTooltip,
      };
    }

    return {};
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        {...handleTriggerEvents()}
      >
        {children}
      </div>

      {/* Tooltip Portal */}
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-[9999] pointer-events-none opacity-0 animate-in fade-in-0 duration-200
            ${isVisible ? "opacity-100" : ""}
          `}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          <div
            className={`
              relative max-w-xs border rounded-lg break-words
              ${getSizeClass()}
              ${getVariantClass()}
              ${contentClassName}
            `}
          >
            {content}

            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-4 ${getArrowClass()}`} />
          </div>
        </div>
      )}
    </>
  );
};
