// AuthApi.js - Authentication API utilities
import { AjaxUtils } from "./AjaxUtils.js";
import { SessionUtils } from "./SessionUtils.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { ValidationUtils } from "./ValidationUtils.js";

export class AuthApi {
  static baseUrl = "/api/auth";

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  static async login(email, password) {
    try {
      // Validate inputs
      if (!ValidationUtils.isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/login`, {
        email: email.toLowerCase().trim(),
        password: password,
      });

      // Store session data
      if (response.success && response.token) {
        await SessionUtils.setSession(response.token, response.user);

        // Store CSRF token if provided
        if (response.csrfToken) {
          await SessionUtils.setCsrfToken(response.csrfToken);
        }
      }

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Login failed");
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  static async register(userData) {
    try {
      const {
        email,
        password,
        confirmPassword,
        username,
        firstName,
        lastName,
      } = userData;

      // Validate inputs
      if (!ValidationUtils.isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!ValidationUtils.isValidPassword(password)) {
        throw new Error(
          "Password must be at least 8 characters with uppercase, lowercase, number and special character",
        );
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!username || username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }

      if (!ValidationUtils.isValidUsername(username)) {
        throw new Error(
          "Username can only contain letters, numbers, underscores and hyphens",
        );
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/register`, {
        email: email.toLowerCase().trim(),
        password: password,
        username: username.toLowerCase().trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
      });

      // Auto-login after successful registration
      if (response.success && response.token) {
        await SessionUtils.setSession(response.token, response.user);

        if (response.csrfToken) {
          await SessionUtils.setCsrfToken(response.csrfToken);
        }
      }

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Registration failed");
      throw error;
    }
  }

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout response
   */
  static async logout() {
    try {
      // Call logout endpoint
      const response = await AjaxUtils.post(`${this.baseUrl}/logout`);

      // Clear local session data
      await SessionUtils.clearSession();

      return response;
    } catch (error) {
      // Even if the API call fails, clear local session
      await SessionUtils.clearSession();
      ErrorHandler.handleApiError(error, "Logout failed");
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh response with new token
   */
  static async refreshToken() {
    try {
      const refreshToken = await SessionUtils.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/refresh`, {
        refreshToken: refreshToken,
      });

      if (response.success && response.token) {
        await SessionUtils.setToken(response.token);

        if (response.refreshToken) {
          await SessionUtils.setRefreshToken(response.refreshToken);
        }
      }

      return response;
    } catch (error) {
      // If refresh fails, clear session and redirect to login
      await SessionUtils.clearSession();
      ErrorHandler.handleApiError(error, "Session expired");
      throw error;
    }
  }

  /**
   * Verify email address
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Verification response
   */
  static async verifyEmail(token) {
    try {
      if (!token) {
        throw new Error("Verification token is required");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/verify-email`, {
        token: token,
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Email verification failed");
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset response
   */
  static async requestPasswordReset(email) {
    try {
      if (!ValidationUtils.isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/forgot-password`, {
        email: email.toLowerCase().trim(),
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Password reset request failed");
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<Object>} Password reset response
   */
  static async resetPassword(token, newPassword, confirmPassword) {
    try {
      if (!token) {
        throw new Error("Reset token is required");
      }

      if (!ValidationUtils.isValidPassword(newPassword)) {
        throw new Error(
          "Password must be at least 8 characters with uppercase, lowercase, number and special character",
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/reset-password`, {
        token: token,
        password: newPassword,
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Password reset failed");
      throw error;
    }
  }

  /**
   * Change current user's password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise<Object>} Password change response
   */
  static async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      if (!ValidationUtils.isValidPassword(newPassword)) {
        throw new Error(
          "New password must be at least 8 characters with uppercase, lowercase, number and special character",
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/change-password`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Password change failed");
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  static async getCurrentUser() {
    try {
      const response = await AjaxUtils.get(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to get user profile");
      throw error;
    }
  }

  /**
   * Update current user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user profile
   */
  static async updateProfile(userData) {
    try {
      const response = await AjaxUtils.put(`${this.baseUrl}/me`, userData);

      // Update stored user data
      if (response.success && response.data) {
        const currentSession = await SessionUtils.getSession();
        if (currentSession) {
          await SessionUtils.setSession(currentSession.token, response.data);
        }
      }

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Profile update failed");
      throw error;
    }
  }

  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if available
   */
  static async checkUsernameAvailability(username) {
    try {
      if (!username || username.length < 3) {
        return false;
      }

      const response = await AjaxUtils.get(`${this.baseUrl}/check-username`, {
        username: username.toLowerCase().trim(),
      });

      return response.available || false;
    } catch (error) {
      console.error("Username check failed:", error);
      return false;
    }
  }

  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if available
   */
  static async checkEmailAvailability(email) {
    try {
      if (!ValidationUtils.isValidEmail(email)) {
        return false;
      }

      const response = await AjaxUtils.get(`${this.baseUrl}/check-email`, {
        email: email.toLowerCase().trim(),
      });

      return response.available || false;
    } catch (error) {
      console.error("Email check failed:", error);
      return false;
    }
  }

  /**
   * Enable two-factor authentication
   * @returns {Promise<Object>} 2FA setup data (QR code, secret)
   */
  static async enable2FA() {
    try {
      const response = await AjaxUtils.post(`${this.baseUrl}/2fa/enable`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to enable 2FA");
      throw error;
    }
  }

  /**
   * Verify and confirm 2FA setup
   * @param {string} token - 2FA token from authenticator app
   * @returns {Promise<Object>} 2FA confirmation response
   */
  static async confirm2FA(token) {
    try {
      if (!token || token.length !== 6) {
        throw new Error("Please enter a valid 6-digit code");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/2fa/confirm`, {
        token: token,
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "2FA setup failed");
      throw error;
    }
  }

  /**
   * Disable two-factor authentication
   * @param {string} password - User password for confirmation
   * @returns {Promise<Object>} 2FA disable response
   */
  static async disable2FA(password) {
    try {
      if (!password) {
        throw new Error("Password is required to disable 2FA");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/2fa/disable`, {
        password: password,
      });

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to disable 2FA");
      throw error;
    }
  }

  /**
   * Verify 2FA token during login
   * @param {string} token - 2FA token
   * @param {string} loginToken - Temporary login token
   * @returns {Promise<Object>} Login completion response
   */
  static async verify2FALogin(token, loginToken) {
    try {
      if (!token || token.length !== 6) {
        throw new Error("Please enter a valid 6-digit code");
      }

      const response = await AjaxUtils.post(`${this.baseUrl}/2fa/verify`, {
        token: token,
        loginToken: loginToken,
      });

      // Store session data on successful 2FA verification
      if (response.success && response.token) {
        await SessionUtils.setSession(response.token, response.user);

        if (response.csrfToken) {
          await SessionUtils.setCsrfToken(response.csrfToken);
        }
      }

      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "2FA verification failed");
      throw error;
    }
  }
}
