// ValidationUtils.js - Input validation utilities
export class ValidationUtils {
  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  static isValidEmail(email) {
    if (!email || typeof email !== "string") {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets requirements
   */
  static isValidPassword(password) {
    if (!password || typeof password !== "string") {
      return false;
    }

    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Get password strength score
   * @param {string} password - Password to evaluate
   * @returns {Object} Password strength data
   */
  static getPasswordStrength(password) {
    if (!password) {
      return {
        score: 0,
        level: "empty",
        feedback: "Password is required",
      };
    }

    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 2;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character (@$!%*?&)");
    }

    // Extra length bonus
    if (password.length >= 12) {
      score += 1;
    }

    // Mixed case and numbers bonus
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      score += 1;
    }

    let level = "weak";
    if (score >= 7) level = "strong";
    else if (score >= 5) level = "medium";

    return {
      score,
      level,
      feedback: feedback.length
        ? `Missing: ${feedback.join(", ")}`
        : "Strong password",
    };
  }

  /**
   * Validate username
   * @param {string} username - Username to validate
   * @returns {boolean} True if valid username
   */
  static isValidUsername(username) {
    if (!username || typeof username !== "string") {
      return false;
    }

    // 3-30 characters, letters, numbers, underscores, hyphens only
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone number
   */
  static isValidPhone(phone) {
    if (!phone || typeof phone !== "string") {
      return false;
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Check if it's 10-15 digits (international format)
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  static isValidUrl(url) {
    if (!url || typeof url !== "string") {
      return false;
    }

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date string
   * @param {string} dateString - Date string to validate
   * @returns {boolean} True if valid date
   */
  static isValidDate(dateString) {
    if (!dateString) {
      return false;
    }

    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Validate age (must be at least 13 years old)
   * @param {string} birthDate - Birth date string
   * @returns {boolean} True if valid age
   */
  static isValidAge(birthDate) {
    if (!this.isValidDate(birthDate)) {
      return false;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= 13;
    }

    return age >= 13;
  }

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Array of allowed MIME types
   * @returns {boolean} True if valid file type
   */
  static isValidFileType(file, allowedTypes) {
    if (!file || !allowedTypes || !Array.isArray(allowedTypes)) {
      return false;
    }

    return allowedTypes.includes(file.type);
  }

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean} True if valid file size
   */
  static isValidFileSize(file, maxSize) {
    if (!file || !maxSize || typeof maxSize !== "number") {
      return false;
    }

    return file.size <= maxSize;
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes (default 5MB)
   * @returns {Object} Validation result
   */
  static validateImageFile(file, maxSize = 5 * 1024 * 1024) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!file) {
      return {
        valid: false,
        error: "No file provided",
      };
    }

    if (!this.isValidFileType(file, allowedTypes)) {
      return {
        valid: false,
        error:
          "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      };
    }

    if (!this.isValidFileSize(file, maxSize)) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.formatFileSize(maxSize)}.`,
      };
    }

    return {
      valid: true,
      error: null,
    };
  }

  /**
   * Sanitize string input
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeString(input) {
    if (!input || typeof input !== "string") {
      return "";
    }

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove < and > to prevent basic XSS
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove event handlers
  }

  /**
   * Sanitize HTML content
   * @param {string} html - HTML to sanitize
   * @returns {string} Sanitized HTML
   */
  static sanitizeHtml(html) {
    if (!html || typeof html !== "string") {
      return "";
    }

    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "");
  }

  /**
   * Validate and sanitize post content
   * @param {string} content - Post content to validate
   * @returns {Object} Validation result
   */
  static validatePostContent(content) {
    if (!content || typeof content !== "string") {
      return {
        valid: false,
        error: "Content is required",
        sanitized: "",
      };
    }

    const sanitized = this.sanitizeString(content);

    if (sanitized.length === 0) {
      return {
        valid: false,
        error: "Content cannot be empty",
        sanitized: "",
      };
    }

    if (sanitized.length > 5000) {
      return {
        valid: false,
        error: "Content is too long (maximum 5000 characters)",
        sanitized: sanitized.substring(0, 5000),
      };
    }

    return {
      valid: true,
      error: null,
      sanitized: sanitized,
    };
  }

  /**
   * Validate search query
   * @param {string} query - Search query to validate
   * @returns {Object} Validation result
   */
  static validateSearchQuery(query) {
    if (!query || typeof query !== "string") {
      return {
        valid: false,
        error: "Search query is required",
        sanitized: "",
      };
    }

    const sanitized = this.sanitizeString(query);

    if (sanitized.length < 2) {
      return {
        valid: false,
        error: "Search query must be at least 2 characters",
        sanitized: sanitized,
      };
    }

    if (sanitized.length > 100) {
      return {
        valid: false,
        error: "Search query is too long (maximum 100 characters)",
        sanitized: sanitized.substring(0, 100),
      };
    }

    return {
      valid: true,
      error: null,
      sanitized: sanitized,
    };
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Check if string contains profanity (basic check)
   * @param {string} text - Text to check
   * @returns {boolean} True if contains profanity
   */
  static containsProfanity(text) {
    if (!text || typeof text !== "string") {
      return false;
    }

    // Basic profanity filter - in production, use a more comprehensive solution
    const profanityWords = [
      "damn",
      "hell",
      "shit",
      "fuck",
      "bitch",
      "asshole",
      "bastard",
    ];

    const lowerText = text.toLowerCase();
    return profanityWords.some((word) => lowerText.includes(word));
  }

  /**
   * Validate hex color code
   * @param {string} color - Color code to validate
   * @returns {boolean} True if valid hex color
   */
  static isValidHexColor(color) {
    if (!color || typeof color !== "string") {
      return false;
    }

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  /**
   * Validate credit card number (basic Luhn algorithm)
   * @param {string} cardNumber - Credit card number
   * @returns {boolean} True if valid card number
   */
  static isValidCreditCard(cardNumber) {
    if (!cardNumber || typeof cardNumber !== "string") {
      return false;
    }

    // Remove all non-digit characters
    const cleaned = cardNumber.replace(/\D/g, "");

    // Check length (13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate postal/ZIP code
   * @param {string} postalCode - Postal code to validate
   * @param {string} country - Country code (US, CA, UK, etc.)
   * @returns {boolean} True if valid postal code
   */
  static isValidPostalCode(postalCode, country = "US") {
    if (!postalCode || typeof postalCode !== "string") {
      return false;
    }

    const patterns = {
      US: /^\d{5}(-\d{4})?$/, // 12345 or 12345-6789
      CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, // A1A 1A1
      UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/, // SW1A 1AA
      DE: /^\d{5}$/, // 12345
      FR: /^\d{5}$/, // 12345
    };

    const pattern = patterns[country.toUpperCase()];
    return pattern ? pattern.test(postalCode.trim()) : true;
  }
}
