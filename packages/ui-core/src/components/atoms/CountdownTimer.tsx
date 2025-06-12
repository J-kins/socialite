import React, { useState, useEffect } from "react";

export interface CountdownTimerProps {
  targetDate: Date | string;
  format?: "full" | "compact" | "minimal";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "outlined";
  showLabels?: boolean;
  separator?: string;
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  format = "full",
  size = "md",
  variant = "default",
  showLabels = true,
  separator = ":",
  onComplete,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const getSizeClass = () => {
    const sizes = {
      sm: {
        number: "text-lg",
        label: "text-xs",
        container: "gap-1",
      },
      md: {
        number: "text-2xl",
        label: "text-sm",
        container: "gap-2",
      },
      lg: {
        number: "text-4xl",
        label: "text-base",
        container: "gap-3",
      },
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const variants = {
      default: {
        container:
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
        number: "text-gray-900 dark:text-white",
        label: "text-gray-500 dark:text-gray-400",
      },
      gradient: {
        container:
          "bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white",
        number: "text-white",
        label: "text-white/80",
      },
      outlined: {
        container: "border-2 border-gray-300 dark:border-gray-600 rounded-lg",
        number: "text-gray-900 dark:text-white",
        label: "text-gray-500 dark:text-gray-400",
      },
    };
    return variants[variant];
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const sizeClasses = getSizeClass();
  const variantClasses = getVariantClass();

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <div className={`${variantClasses.container} p-4`}>
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold`}
          >
            Time's Up!
          </div>
          <div className={`${sizeClasses.label} ${variantClasses.label} mt-1`}>
            The countdown has ended
          </div>
        </div>
      </div>
    );
  }

  if (format === "minimal") {
    return (
      <div
        className={`inline-flex items-center ${sizeClasses.container} ${className}`}
      >
        <span
          className={`${sizeClasses.number} ${variantClasses.number} font-mono font-bold`}
        >
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {formatNumber(timeLeft.hours)}
          {separator}
          {formatNumber(timeLeft.minutes)}
          {separator}
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  if (format === "compact") {
    return (
      <div
        className={`inline-flex items-center ${sizeClasses.container} ${variantClasses.container} p-3 ${className}`}
      >
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div
              className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
            >
              {formatNumber(timeLeft.days)}
            </div>
            {showLabels && (
              <div className={`${sizeClasses.label} ${variantClasses.label}`}>
                d
              </div>
            )}
          </div>
        )}

        {timeLeft.days > 0 && (
          <span className="mx-1 opacity-50">{separator}</span>
        )}

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.hours)}
          </div>
          {showLabels && (
            <div className={`${sizeClasses.label} ${variantClasses.label}`}>
              h
            </div>
          )}
        </div>

        <span className="mx-1 opacity-50">{separator}</span>

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.minutes)}
          </div>
          {showLabels && (
            <div className={`${sizeClasses.label} ${variantClasses.label}`}>
              m
            </div>
          )}
        </div>

        <span className="mx-1 opacity-50">{separator}</span>

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.seconds)}
          </div>
          {showLabels && (
            <div className={`${sizeClasses.label} ${variantClasses.label}`}>
              s
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full format (default)
  return (
    <div className={`${variantClasses.container} p-4 ${className}`}>
      <div
        className={`flex justify-center items-center ${sizeClasses.container}`}
      >
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div
              className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
            >
              {formatNumber(timeLeft.days)}
            </div>
            {showLabels && (
              <div
                className={`${sizeClasses.label} ${variantClasses.label} mt-1`}
              >
                Day{timeLeft.days !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        {timeLeft.days > 0 && (
          <div
            className={`mx-3 ${sizeClasses.number} ${variantClasses.number} opacity-50`}
          >
            :
          </div>
        )}

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.hours)}
          </div>
          {showLabels && (
            <div
              className={`${sizeClasses.label} ${variantClasses.label} mt-1`}
            >
              Hour{timeLeft.hours !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div
          className={`mx-3 ${sizeClasses.number} ${variantClasses.number} opacity-50`}
        >
          :
        </div>

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.minutes)}
          </div>
          {showLabels && (
            <div
              className={`${sizeClasses.label} ${variantClasses.label} mt-1`}
            >
              Minute{timeLeft.minutes !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div
          className={`mx-3 ${sizeClasses.number} ${variantClasses.number} opacity-50`}
        >
          :
        </div>

        <div className="text-center">
          <div
            className={`${sizeClasses.number} ${variantClasses.number} font-bold font-mono`}
          >
            {formatNumber(timeLeft.seconds)}
          </div>
          {showLabels && (
            <div
              className={`${sizeClasses.label} ${variantClasses.label} mt-1`}
            >
              Second{timeLeft.seconds !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
