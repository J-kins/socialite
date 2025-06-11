import React, { useState } from "react";
import { Input, type InputProps } from "../atoms/Input";

export interface SearchBoxProps
  extends Omit<InputProps, "leftIcon" | "rightIcon" | "type"> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  instantSearch?: boolean;
  debounceMs?: number;
}

/**
 * SearchBox molecule - Input with search functionality
 * Matches the search styling from the existing header design
 */
export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  onClear,
  showClearButton = true,
  searchIcon,
  clearIcon,
  instantSearch = false,
  debounceMs = 300,
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  className = "",
  ...inputProps
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasValue = Boolean(value);

  // Default icons
  const defaultSearchIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const defaultClearIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(e);
    }

    // Handle instant search with debouncing
    if (instantSearch && onSearch) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);

      setDebounceTimer(timer);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch && !instantSearch) {
      e.preventDefault();
      onSearch(value);
    }

    if (inputProps.onKeyDown) {
      inputProps.onKeyDown(e);
    }
  };

  const handleClear = () => {
    const newValue = "";

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (onClear) {
      onClear();
    }

    if (onSearch) {
      onSearch(newValue);
    }

    // Create synthetic event for onChange if needed
    if (onChange) {
      const syntheticEvent = {
        target: { value: newValue },
        currentTarget: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  // Determine right icon
  const rightIcon =
    hasValue && showClearButton ? (
      <button
        type="button"
        onClick={handleClear}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -m-1 rounded"
        aria-label="Clear search"
      >
        {clearIcon || defaultClearIcon}
      </button>
    ) : null;

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leftIcon={searchIcon || defaultSearchIcon}
      rightIcon={rightIcon}
      className={`search-box ${className}`}
      {...inputProps}
    />
  );
};

export default SearchBox;
