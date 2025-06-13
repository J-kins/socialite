// ErrorHandler.js - Centralized error handling utilities
export class ErrorHandler {
  static logErrors = true;
  static showUserFriendlyMessages = true;
  static errorQueue = [];
  static maxErrorQueueSize = 100;

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   * @param {boolean} showToUser - Whether to show error to user
   */
  static handleApiError(error, context = "Unknown", showToUser = false) {
    const errorInfo = {
      type: "API_ERROR",
      message: error.message,
      context: context,
      timestamp: new Date().toISOString(),
      status: error.status || null,
      data: error.data || null,
      stack: error.stack || null,
    };

    this.logError(errorInfo);

    if (showToUser) {
      this.showUserError(this.getUserFriendlyMessage(errorInfo));
    }

    // Store in error queue for analytics
    this.addToErrorQueue(errorInfo);

    // Handle specific HTTP status codes
    this.handleHttpStatusCode(error.status, context);
  }

  /**
   * Handle JavaScript errors
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  static handleJavaScriptError(error, context = "JavaScript") {
    const errorInfo = {
      type: "JAVASCRIPT_ERROR",
      message: error.message,
      context: context,
      timestamp: new Date().toISOString(),
      filename: error.filename || null,
      lineno: error.lineno || null,
      colno: error.colno || null,
      stack: error.stack || null,
    };

    this.logError(errorInfo);
    this.addToErrorQueue(errorInfo);

    if (this.showUserFriendlyMessages) {
      this.showUserError("An unexpected error occurred. Please try again.");
    }
  }

  /**
   * Handle validation errors
   * @param {Array|Object} errors - Validation errors
   * @param {string} context - Context where error occurred
   */
  static handleValidationError(errors, context = "Validation") {
    const errorInfo = {
      type: "VALIDATION_ERROR",
      message: "Validation failed",
      context: context,
      timestamp: new Date().toISOString(),
      validationErrors: errors,
    };

    this.logError(errorInfo);
    this.addToErrorQueue(errorInfo);

    // Show validation errors to user
    if (Array.isArray(errors)) {
      errors.forEach((error) => this.showUserError(error.message || error));
    } else if (typeof errors === "object") {
      Object.values(errors).forEach((error) => this.showUserError(error));
    } else {
      this.showUserError(errors);
    }
  }

  /**
   * Handle network errors
   * @param {Error} error - Network error
   * @param {string} context - Context where error occurred
   */
  static handleNetworkError(error, context = "Network") {
    const errorInfo = {
      type: "NETWORK_ERROR",
      message: error.message,
      context: context,
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
    };

    this.logError(errorInfo);
    this.addToErrorQueue(errorInfo);

    if (!navigator.onLine) {
      this.showUserError(
        "You appear to be offline. Please check your internet connection.",
      );
    } else {
      this.showUserError(
        "Network error. Please check your connection and try again.",
      );
    }
  }

  /**
   * Handle file upload errors
   * @param {Error} error - Upload error
   * @param {string} filename - Name of file being uploaded
   */
  static handleUploadError(error, filename = "file") {
    const errorInfo = {
      type: "UPLOAD_ERROR",
      message: error.message,
      context: `File upload: ${filename}`,
      timestamp: new Date().toISOString(),
      filename: filename,
    };

    this.logError(errorInfo);
    this.addToErrorQueue(errorInfo);

    let userMessage = `Failed to upload ${filename}. `;

    if (error.message.includes("size")) {
      userMessage += "File is too large.";
    } else if (error.message.includes("type")) {
      userMessage += "File type not supported.";
    } else {
      userMessage += "Please try again.";
    }

    this.showUserError(userMessage);
  }

  /**
   * Handle authentication errors
   * @param {Error} error - Auth error
   * @param {string} action - Authentication action (login, register, etc.)
   */
  static handleAuthError(error, action = "authentication") {
    const errorInfo = {
      type: "AUTH_ERROR",
      message: error.message,
      context: `Authentication: ${action}`,
      timestamp: new Date().toISOString(),
      status: error.status || null,
    };

    this.logError(errorInfo);
    this.addToErrorQueue(errorInfo);

    if (error.status === 401) {
      this.showUserError(
        "Invalid credentials. Please check your email and password.",
      );
    } else if (error.status === 403) {
      this.showUserError("You do not have permission to perform this action.");
    } else if (error.status === 429) {
      this.showUserError("Too many attempts. Please try again later.");
    } else {
      this.showUserError(
        `${action.charAt(0).toUpperCase() + action.slice(1)} failed. Please try again.`,
      );
    }
  }

  /**
   * Log error to console and/or external service
   * @param {Object} errorInfo - Error information object
   */
  static logError(errorInfo) {
    if (!this.logErrors) return;

    // Log to console
    console.error(`[${errorInfo.type}] ${errorInfo.context}:`, errorInfo);

    // Send to external logging service (implement as needed)
    this.sendToLoggingService(errorInfo);
  }

  /**
   * Send error to external logging service
   * @param {Object} errorInfo - Error information object
   */
  static async sendToLoggingService(errorInfo) {
    try {
      // Only send critical errors to avoid spam
      if (this.isCriticalError(errorInfo)) {
        await fetch("/api/logs/error", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorInfo),
        });
      }
    } catch (logError) {
      console.warn("Failed to send error to logging service:", logError);
    }
  }

  /**
   * Check if error is critical and should be reported
   * @param {Object} errorInfo - Error information object
   * @returns {boolean} True if critical
   */
  static isCriticalError(errorInfo) {
    const criticalTypes = ["JAVASCRIPT_ERROR", "NETWORK_ERROR"];
    const criticalStatuses = [500, 502, 503, 504];

    return (
      criticalTypes.includes(errorInfo.type) ||
      criticalStatuses.includes(errorInfo.status)
    );
  }

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   * @param {string} type - Error type (error, warning, info)
   */
  static showUserError(message, type = "error") {
    // Create and show toast notification
    this.showToast(message, type);

    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("userError", {
        detail: { message, type },
      }),
    );
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type
   */
  static showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.className = `toast ${type} fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white`;

    // Set background color based on type
    const colors = {
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
      success: "bg-green-500",
    };

    toast.classList.add(colors[type] || colors.error);

    toast.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="flex-1">${message}</span>
                <button class="close-toast text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

    document.body.appendChild(toast);

    // Add close functionality
    toast.querySelector(".close-toast").addEventListener("click", () => {
      toast.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
      toast.style.opacity = "1";
    });
  }

  /**
   * Get user-friendly error message
   * @param {Object} errorInfo - Error information object
   * @returns {string} User-friendly message
   */
  static getUserFriendlyMessage(errorInfo) {
    const { type, status, message } = errorInfo;

    // Map common error scenarios to user-friendly messages
    const messageMap = {
      400: "Invalid request. Please check your input and try again.",
      401: "Please log in to continue.",
      403: "You do not have permission to perform this action.",
      404: "The requested resource was not found.",
      408: "Request timed out. Please try again.",
      409: "A conflict occurred. The resource may have been modified.",
      422: "Please check your input and correct any errors.",
      429: "Too many requests. Please wait a moment and try again.",
      500: "Server error. Please try again later.",
      502: "Service temporarily unavailable. Please try again later.",
      503: "Service unavailable. Please try again later.",
      504: "Request timed out. Please try again later.",
    };

    if (status && messageMap[status]) {
      return messageMap[status];
    }

    // Type-specific messages
    switch (type) {
      case "NETWORK_ERROR":
        return "Network error. Please check your connection.";
      case "VALIDATION_ERROR":
        return "Please correct the highlighted fields.";
      case "UPLOAD_ERROR":
        return "File upload failed. Please try again.";
      case "AUTH_ERROR":
        return "Authentication failed. Please try again.";
      default:
        return "An error occurred. Please try again.";
    }
  }

  /**
   * Add error to queue for analytics
   * @param {Object} errorInfo - Error information object
   */
  static addToErrorQueue(errorInfo) {
    this.errorQueue.push(errorInfo);

    // Keep queue size manageable
    if (this.errorQueue.length > this.maxErrorQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  static getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      byType: {},
      byContext: {},
      recentErrors: this.errorQueue.slice(-10),
    };

    this.errorQueue.forEach((error) => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.byContext[error.context] =
        (stats.byContext[error.context] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear error queue
   */
  static clearErrorQueue() {
    this.errorQueue = [];
  }

  /**
   * Handle specific HTTP status codes
   * @param {number} status - HTTP status code
   * @param {string} context - Error context
   */
  static handleHttpStatusCode(status, context) {
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        window.dispatchEvent(
          new CustomEvent("unauthorizedAccess", {
            detail: { context },
          }),
        );
        break;
      case 403:
        // Forbidden - show permission error
        window.dispatchEvent(
          new CustomEvent("permissionDenied", {
            detail: { context },
          }),
        );
        break;
      case 404:
        // Not found
        window.dispatchEvent(
          new CustomEvent("resourceNotFound", {
            detail: { context },
          }),
        );
        break;
      case 429:
        // Too many requests - implement rate limiting UI
        window.dispatchEvent(
          new CustomEvent("rateLimitExceeded", {
            detail: { context },
          }),
        );
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - show maintenance message
        window.dispatchEvent(
          new CustomEvent("serverError", {
            detail: { status, context },
          }),
        );
        break;
    }
  }

  /**
   * Initialize global error handlers
   */
  static initializeGlobalHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener("error", (event) => {
      this.handleJavaScriptError(
        event.error || new Error(event.message),
        "Global",
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.handleJavaScriptError(new Error(event.reason), "Promise Rejection");
    });

    // Handle network status changes
    window.addEventListener("online", () => {
      this.showUserError("Connection restored", "success");
    });

    window.addEventListener("offline", () => {
      this.showUserError("You are now offline", "warning");
    });
  }

  /**
   * Create error boundary for React-like error handling in vanilla JS
   * @param {Function} fn - Function to wrap
   * @param {string} context - Context for error reporting
   * @returns {Function} Wrapped function
   */
  static createErrorBoundary(fn, context = "Unknown") {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleJavaScriptError(error, context);
        throw error;
      }
    };
  }
}

// Initialize global error handlers when module loads
ErrorHandler.initializeGlobalHandlers();
