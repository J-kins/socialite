import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSliderOptions {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  onChangeStart?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface UseSliderReturn {
  value: number;
  setValue: (value: number) => void;
  isDragging: boolean;
  sliderRef: React.RefObject<HTMLDivElement>;
  thumbRef: React.RefObject<HTMLDivElement>;
  trackRef: React.RefObject<HTMLDivElement>;
  getThumbProps: () => {
    onMouseDown: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
    style: React.CSSProperties;
    'aria-valuemin': number;
    'aria-valuemax': number;
    'aria-valuenow': number;
    'aria-orientation': string;
    role: string;
    tabIndex: number;
  };
  getTrackProps: () => {
    onClick: (event: React.MouseEvent) => void;
    style: React.CSSProperties;
  };
  getSliderProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
  };
  percentage: number;
}

export const useSlider = (options: UseSliderOptions = {}): UseSliderReturn => {
  const {
    min = 0,
    max = 100,
    step = 1,
    defaultValue = min,
    value: controlledValue,
    onChange,
    onChangeStart,
    onChangeEnd,
    disabled = false,
    orientation = 'horizontal',
  } = options;

  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: number) => {
      if (disabled) return;

      const clampedValue = Math.min(Math.max(newValue, min), max);
      const steppedValue = Math.round(clampedValue / step) * step;

      if (!isControlled) {
        setInternalValue(steppedValue);
      }

      onChange?.(steppedValue);
    },
    [disabled, min, max, step, isControlled, onChange]
  );

  const getValueFromEvent = useCallback(
    (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
      if (!sliderRef.current) return value;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX =
        'touches' in event
          ? (event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX)
          : event.clientX;
      const clientY =
        'touches' in event
          ? (event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY)
          : event.clientY;

      let percentage: number;

      if (orientation === 'horizontal') {
        percentage = (clientX - rect.left) / rect.width;
      } else {
        percentage = 1 - (clientY - rect.top) / rect.height;
      }

      percentage = Math.min(Math.max(percentage, 0), 1);
      return min + (max - min) * percentage;
    },
    [value, min, max, orientation]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;

      event.preventDefault();
      setIsDragging(true);
      onChangeStart?.(value);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newValue = getValueFromEvent(moveEvent);
        setValue(newValue);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        onChangeEnd?.(value);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, value, getValueFromEvent, setValue, onChangeStart, onChangeEnd]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (disabled) return;

      event.preventDefault();
      setIsDragging(true);
      onChangeStart?.(value);

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const newValue = getValueFromEvent(moveEvent);
        setValue(newValue);
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        onChangeEnd?.(value);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [disabled, value, getValueFromEvent, setValue, onChangeStart, onChangeEnd]
  );

  const handleTrackClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled || isDragging) return;

      const newValue = getValueFromEvent(event);
      setValue(newValue);
    },
    [disabled, isDragging, getValueFromEvent, setValue]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;
      const largeStep = (max - min) / 10;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = value + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = value - step;
          break;
        case 'PageUp':
          newValue = value + largeStep;
          break;
        case 'PageDown':
          newValue = value - largeStep;
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        default:
          return;
      }

      event.preventDefault();
      setValue(newValue);
    },
    [disabled, value, step, min, max, setValue]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  const getThumbProps = () => ({
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
    onKeyDown: handleKeyDown,
    style: {
      [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
      transform: orientation === 'horizontal' ? 'translateX(-50%)' : 'translateY(50%)',
    } as React.CSSProperties,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': value,
    'aria-orientation': orientation,
    role: 'slider',
    tabIndex: disabled ? -1 : 0,
  });

  const getTrackProps = () => ({
    onClick: handleTrackClick,
    style: {
      cursor: disabled ? 'default' : 'pointer',
    } as React.CSSProperties,
  });

  const getSliderProps = () => ({
    ref: sliderRef,
    style: {
      position: 'relative',
      touchAction: 'none',
      userSelect: 'none',
    } as React.CSSProperties,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
  }, [isDragging]);

  return {
    value,
    setValue,
    isDragging,
    sliderRef,
    thumbRef,
    trackRef,
    getThumbProps,
    getTrackProps,
    getSliderProps,
    percentage,
  };
};

export default useSlider;
