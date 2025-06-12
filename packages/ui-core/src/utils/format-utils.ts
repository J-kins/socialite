/**
 * Format Utilities
 *
 * Provides comprehensive formatting functions for dates, numbers, text,
 * file sizes, currencies, and other common data types used in social media applications.
 */

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  format?: 'relative' | 'absolute' | 'short' | 'long' | 'custom';
  customFormat?: Intl.DateTimeFormatOptions;
  relativeThreshold?: number; // Days after which to show absolute date
}

export interface NumberFormatOptions {
  locale?: string;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
}

export interface TextFormatOptions {
  maxLength?: number;
  wordBreak?: boolean;
  preserveWhitespace?: boolean;
  removeExtraSpaces?: boolean;
  capitalizeWords?: boolean;
  ellipsis?: string;
}

export interface PhoneFormatOptions {
  format?: 'national' | 'international' | 'e164' | 'rfc3966';
  country?: string;
}

// Common locale mappings
export const COMMON_LOCALES = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'es-ES': 'Spanish (Spain)',
  'fr-FR': 'French (France)',
  'de-DE': 'German (Germany)',
  'it-IT': 'Italian (Italy)',
  'pt-BR': 'Portuguese (Brazil)',
  'ja-JP': 'Japanese (Japan)',
  'ko-KR': 'Korean (South Korea)',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ar-SA': 'Arabic (Saudi Arabia)',
  'hi-IN': 'Hindi (India)',
  'ru-RU': 'Russian (Russia)',
} as const;

/**
 * Formats a date with various options
 */
export const formatDate = (
  date: Date | string | number,
  options: DateFormatOptions = {},
): string => {
  const {
    locale = 'en-US',
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    format = 'relative',
    customFormat,
    relativeThreshold = 7,
  } = options;

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (format) {
    case 'relative':
      if (diffDays <= relativeThreshold) {
        return formatRelativeTime(dateObj, locale);
      }
      // Fall through to absolute if beyond threshold
      return formatAbsoluteDate(dateObj, locale, timeZone);

    case 'absolute':
      return formatAbsoluteDate(dateObj, locale, timeZone);

    case 'short':
      return dateObj.toLocaleDateString(locale, {
        timeZone,
        month: 'short',
        day: 'numeric',
        year: diffDays > 365 ? 'numeric' : undefined,
      });

    case 'long':
      return dateObj.toLocaleDateString(locale, {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'custom':
      if (customFormat) {
        return dateObj.toLocaleDateString(locale, {
          timeZone,
          ...customFormat,
        });
      }
      return dateObj.toLocaleDateString(locale, { timeZone });

    default:
      return dateObj.toLocaleDateString(locale, { timeZone });
  }
};

/**
 * Formats relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (
  date: Date | string | number,
  locale: string = 'en-US',
): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'short',
    });

    if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
    if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
    if (diffHours < 24) return rtf.format(-diffHours, 'hour');
    if (diffDays < 7) return rtf.format(-diffDays, 'day');
    if (diffWeeks < 4) return rtf.format(-diffWeeks, 'week');
    if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
    return rtf.format(-diffYears, 'year');
  }

  // Fallback for older browsers
  if (diffSeconds < 30) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

/**
 * Formats absolute date
 */
export const formatAbsoluteDate = (
  date: Date,
  locale: string = 'en-US',
  timeZone?: string,
): string => {
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(timeZone && { timeZone }),
  };

  if (!isCurrentYear) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString(locale, options);
};

/**
 * Formats time of day
 */
export const formatTime = (
  date: Date | string | number,
  options: {
    locale?: string;
    timeZone?: string;
    format?: '12h' | '24h';
    showSeconds?: boolean;
  } = {},
): string => {
  const {
    locale = 'en-US',
    timeZone,
    format = '12h',
    showSeconds = false,
  } = options;

  const dateObj = new Date(date);

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h',
    ...(timeZone && { timeZone }),
  };

  if (showSeconds) {
    formatOptions.second = '2-digit';
  }

  return dateObj.toLocaleTimeString(locale, formatOptions);
};

/**
 * Formats numbers with various options
 */
export const formatNumber = (
  value: number,
  options: NumberFormatOptions = {},
): string => {
  const {
    locale = 'en-US',
    notation = 'standard',
    compactDisplay = 'short',
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping = true,
  } = options;

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale, {
      notation,
      compactDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
    }).format(value);
  }

  // Fallback for older browsers
  return value.toLocaleString(locale);
};

/**
 * Formats numbers in compact form (e.g., 1.2K, 1.5M)
 */
export const formatCompactNumber = (
  value: number,
  locale: string = 'en-US',
): string => {
  if (Math.abs(value) < 1000) {
    return value.toString();
  }

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  }

  // Fallback
  const units = ['', 'K', 'M', 'B', 'T'];
  const tier = (Math.log10(Math.abs(value)) / 3) | 0;

  if (tier === 0) return value.toString();

  const unit = units[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return scaled.toFixed(1).replace(/\.0$/, '') + unit;
};

/**
 * Formats currency values
 */
export const formatCurrency = (
  value: number,
  options: CurrencyFormatOptions = {},
): string => {
  const {
    locale = 'en-US',
    currency = 'USD',
    currencyDisplay = 'symbol',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  // Fallback
  const symbol = currency === 'USD' ? '$' : currency;
  return `${symbol}${value.toFixed(2)}`;
};

/**
 * Formats percentage values
 */
export const formatPercentage = (
  value: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
  } = options;

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value / 100);
  }

  // Fallback
  return `${value.toFixed(maximumFractionDigits)}%`;
};

/**
 * Formats file sizes
 */
export const formatFileSize = (
  bytes: number,
  options: {
    locale?: string;
    binary?: boolean;
    precision?: number;
  } = {},
): string => {
  const { locale = 'en-US', binary = false, precision = 1 } = options;

  if (bytes === 0) return '0 B';

  const base = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const exp = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, exp);

  const formattedValue = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(value);

  return `${formattedValue} ${units[exp]}`;
};

/**
 * Formats text with various options
 */
export const formatText = (
  text: string,
  options: TextFormatOptions = {},
): string => {
  const {
    maxLength,
    wordBreak = true,
    preserveWhitespace = false,
    removeExtraSpaces = true,
    capitalizeWords = false,
    ellipsis = '...',
  } = options;

  let formatted = text;

  // Remove extra spaces
  if (removeExtraSpaces && !preserveWhitespace) {
    formatted = formatted.replace(/\s+/g, ' ').trim();
  }

  // Capitalize words
  if (capitalizeWords) {
    formatted = formatted.replace(/\b\w/g, char => char.toUpperCase());
  }

  // Truncate if needed
  if (maxLength && formatted.length > maxLength) {
    if (wordBreak) {
      // Find last space before maxLength
      const lastSpace = formatted.lastIndexOf(' ', maxLength - ellipsis.length);
      if (lastSpace > 0) {
        formatted = formatted.substring(0, lastSpace) + ellipsis;
      } else {
        formatted =
          formatted.substring(0, maxLength - ellipsis.length) + ellipsis;
      }
    } else {
      formatted =
        formatted.substring(0, maxLength - ellipsis.length) + ellipsis;
    }
  }

  return formatted;
};

/**
 * Formats phone numbers
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  options: PhoneFormatOptions = {},
): string => {
  const { format = 'national', country = 'US' } = options;

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Simple US phone number formatting
  if (country === 'US' && cleaned.length === 10) {
    switch (format) {
      case 'national':
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      case 'international':
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      case 'e164':
        return `+1${cleaned}`;
      default:
        return cleaned;
    }
  }

  // For other countries or invalid numbers, return as-is
  return phoneNumber;
};

/**
 * Formats duration in seconds to human readable format
 */
export const formatDuration = (
  seconds: number,
  options: {
    format?: 'short' | 'long' | 'clock';
    showSeconds?: boolean;
    showMilliseconds?: boolean;
  } = {},
): string => {
  const {
    format = 'short',
    showSeconds = true,
    showMilliseconds = false,
  } = options;

  const ms = showMilliseconds ? Math.floor((seconds % 1) * 1000) : 0;
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  const remainingHrs = hrs % 24;
  const remainingMins = mins % 60;
  const remainingSecs = totalSeconds % 60;

  switch (format) {
    case 'clock':
      if (hrs > 0) {
        return `${hrs}:${remainingMins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
      }
      return `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;

    case 'long':
      const parts: string[] = [];
      if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
      if (remainingHrs > 0)
        parts.push(`${remainingHrs} hour${remainingHrs > 1 ? 's' : ''}`);
      if (remainingMins > 0)
        parts.push(`${remainingMins} minute${remainingMins > 1 ? 's' : ''}`);
      if (showSeconds && remainingSecs > 0)
        parts.push(`${remainingSecs} second${remainingSecs > 1 ? 's' : ''}`);
      return parts.join(', ') || '0 seconds';

    case 'short':
    default:
      const shortParts: string[] = [];
      if (days > 0) shortParts.push(`${days}d`);
      if (remainingHrs > 0) shortParts.push(`${remainingHrs}h`);
      if (remainingMins > 0) shortParts.push(`${remainingMins}m`);
      if (showSeconds && remainingSecs > 0)
        shortParts.push(`${remainingSecs}s`);
      if (showMilliseconds && ms > 0) shortParts.push(`${ms}ms`);
      return shortParts.join(' ') || '0s';
  }
};

/**
 * Formats lists with proper conjunctions
 */
export const formatList = (
  items: string[],
  options: {
    locale?: string;
    style?: 'long' | 'short' | 'narrow';
    type?: 'conjunction' | 'disjunction' | 'unit';
  } = {},
): string => {
  const { locale = 'en-US', style = 'long', type = 'conjunction' } = options;

  if (items.length === 0) return '';
  if (items.length === 1) return items[0];

  if (typeof Intl !== 'undefined' && Intl.ListFormat) {
    return new Intl.ListFormat(locale, { style, type }).format(items);
  }

  // Fallback
  if (items.length === 2) {
    return type === 'disjunction'
      ? `${items[0]} or ${items[1]}`
      : `${items[0]} and ${items[1]}`;
  }

  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  const conjunction = type === 'disjunction' ? 'or' : 'and';

  return `${rest.join(', ')}, ${conjunction} ${last}`;
};

/**
 * Formats addresses
 */
export const formatAddress = (
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  },
  options: {
    format?: 'single-line' | 'multi-line';
    includeCountry?: boolean;
  } = {},
): string => {
  const { format = 'single-line', includeCountry = false } = options;

  const { street, city, state, zipCode, country } = address;
  const parts: string[] = [];

  if (street) parts.push(street);

  const cityStateZip = [city, state, zipCode].filter(Boolean).join(', ');
  if (cityStateZip) parts.push(cityStateZip);

  if (includeCountry && country) parts.push(country);

  return format === 'multi-line' ? parts.join('\n') : parts.join(', ');
};

/**
 * Formats social media metrics (likes, followers, etc.)
 */
export const formatSocialMetric = (
  value: number,
  metric: string,
  options: {
    showMetric?: boolean;
    compact?: boolean;
    locale?: string;
  } = {},
): string => {
  const { showMetric = true, compact = true, locale = 'en-US' } = options;

  const formattedValue = compact
    ? formatCompactNumber(value, locale)
    : formatNumber(value, { locale });

  if (!showMetric) return formattedValue;

  const pluralMetric = value === 1 ? metric : `${metric}s`;
  return `${formattedValue} ${pluralMetric}`;
};

export default {
  formatDate,
  formatRelativeTime,
  formatAbsoluteDate,
  formatTime,
  formatNumber,
  formatCompactNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatText,
  formatPhoneNumber,
  formatDuration,
  formatList,
  formatAddress,
  formatSocialMetric,
  COMMON_LOCALES,
};
