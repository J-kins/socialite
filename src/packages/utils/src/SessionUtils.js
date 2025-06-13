// SessionUtils.js - Session management utilities
export class SessionUtils {
  static TOKEN_KEY = "socialite_token";
  static USER_KEY = "socialite_user";
  static REFRESH_TOKEN_KEY = "socialite_refresh_token";
  static CSRF_TOKEN_KEY = "socialite_csrf_token";
  static SESSION_KEY = "socialite_session";

  /**
   * Set user session with token and user data
   * @param {string} token - JWT token
   * @param {Object} userData - User data
   * @param {string} refreshToken - Refresh token (optional)
   */
  static async setSession(token, userData, refreshToken = null) {
    try {
      const sessionData = {
        token: token,
        user: userData,
        timestamp: Date.now(),
        expiresAt: this.getTokenExpiration(token),
      };

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));

      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }

      // Dispatch session change event
      window.dispatchEvent(
        new CustomEvent("sessionChanged", {
          detail: { user: userData, action: "login" },
        }),
      );
    } catch (error) {
      console.error("Failed to set session:", error);
      throw new Error("Session storage failed");
    }
  }

  /**
   * Get current session data
   * @returns {Promise<Object|null>} Session data or null
   */
  static async getSession() {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);

      if (!sessionData) {
        return null;
      }

      const session = JSON.parse(sessionData);

      // Check if session is expired
      if (this.isSessionExpired(session)) {
        await this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Failed to get session:", error);
      await this.clearSession();
      return null;
    }
  }

  /**
   * Get JWT token
   * @returns {Promise<string|null>} JWT token or null
   */
  static async getToken() {
    try {
      const session = await this.getSession();
      return session ? session.token : null;
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }

  /**
   * Set JWT token
   * @param {string} token - JWT token
   */
  static async setToken(token) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);

      const session = await this.getSession();
      if (session) {
        session.token = token;
        session.expiresAt = this.getTokenExpiration(token);
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error("Failed to set token:", error);
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object|null>} User data or null
   */
  static async getCurrentUser() {
    try {
      const session = await this.getSession();
      return session ? session.user : null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  /**
   * Update current user data
   * @param {Object} userData - Updated user data
   */
  static async updateCurrentUser(userData) {
    try {
      const session = await this.getSession();
      if (session) {
        session.user = { ...session.user, ...userData };
        localStorage.setItem(this.USER_KEY, JSON.stringify(session.user));
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

        // Dispatch user update event
        window.dispatchEvent(
          new CustomEvent("userUpdated", {
            detail: { user: session.user },
          }),
        );
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  /**
   * Get refresh token
   * @returns {Promise<string|null>} Refresh token or null
   */
  static async getRefreshToken() {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  }

  /**
   * Set refresh token
   * @param {string} refreshToken - Refresh token
   */
  static async setRefreshToken(refreshToken) {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error("Failed to set refresh token:", error);
    }
  }

  /**
   * Get CSRF token
   * @returns {Promise<string|null>} CSRF token or null
   */
  static async getCsrfToken() {
    try {
      let csrfToken = localStorage.getItem(this.CSRF_TOKEN_KEY);

      // If no CSRF token, fetch one from the server
      if (!csrfToken) {
        csrfToken = await this.fetchCsrfToken();
      }

      return csrfToken;
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      return null;
    }
  }

  /**
   * Set CSRF token
   * @param {string} csrfToken - CSRF token
   */
  static async setCsrfToken(csrfToken) {
    try {
      localStorage.setItem(this.CSRF_TOKEN_KEY, csrfToken);
    } catch (error) {
      console.error("Failed to set CSRF token:", error);
    }
  }

  /**
   * Fetch CSRF token from server
   * @returns {Promise<string|null>} CSRF token or null
   */
  static async fetchCsrfToken() {
    try {
      const response = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const csrfToken = data.csrfToken;

        if (csrfToken) {
          await this.setCsrfToken(csrfToken);
          return csrfToken;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if authenticated
   */
  static async isAuthenticated() {
    try {
      const session = await this.getSession();
      return session !== null && !this.isSessionExpired(session);
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  }

  /**
   * Check current session with server
   * @returns {Promise<Object|null>} Session validation response
   */
  static async checkSession() {
    try {
      const token = await this.getToken();

      if (!token) {
        return null;
      }

      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.valid) {
          return {
            user: data.user,
            token: token,
          };
        }
      }

      // If validation fails, clear session
      await this.clearSession();
      return null;
    } catch (error) {
      console.error("Session validation failed:", error);
      await this.clearSession();
      return null;
    }
  }

  /**
   * Clear all session data
   */
  static async clearSession() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.CSRF_TOKEN_KEY);
      localStorage.removeItem(this.SESSION_KEY);

      // Dispatch session change event
      window.dispatchEvent(
        new CustomEvent("sessionChanged", {
          detail: { user: null, action: "logout" },
        }),
      );
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  }

  /**
   * Check if session is expired
   * @param {Object} session - Session object
   * @returns {boolean} True if expired
   */
  static isSessionExpired(session) {
    if (!session || !session.expiresAt) {
      return true;
    }

    return Date.now() >= session.expiresAt;
  }

  /**
   * Get token expiration timestamp
   * @param {string} token - JWT token
   * @returns {number} Expiration timestamp
   */
  static getTokenExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("Failed to parse token:", error);
      // Default to 1 hour from now
      return Date.now() + 60 * 60 * 1000;
    }
  }

  /**
   * Get session duration in minutes
   * @returns {Promise<number>} Session duration in minutes
   */
  static async getSessionDuration() {
    try {
      const session = await this.getSession();

      if (!session || !session.timestamp) {
        return 0;
      }

      return Math.floor((Date.now() - session.timestamp) / (60 * 1000));
    } catch (error) {
      console.error("Failed to get session duration:", error);
      return 0;
    }
  }

  /**
   * Check if session is about to expire (within 5 minutes)
   * @returns {Promise<boolean>} True if expiring soon
   */
  static async isSessionExpiringSoon() {
    try {
      const session = await this.getSession();

      if (!session || !session.expiresAt) {
        return false;
      }

      const fiveMinutes = 5 * 60 * 1000;
      return session.expiresAt - Date.now() <= fiveMinutes;
    } catch (error) {
      console.error("Failed to check session expiration:", error);
      return false;
    }
  }

  /**
   * Extend session if possible
   * @returns {Promise<boolean>} True if session was extended
   */
  static async extendSession() {
    try {
      const { AuthApi } = await import("./AuthApi.js");
      await AuthApi.refreshToken();
      return true;
    } catch (error) {
      console.error("Failed to extend session:", error);
      return false;
    }
  }

  /**
   * Start session monitoring
   */
  static startSessionMonitoring() {
    // Check session every minute
    setInterval(async () => {
      const isExpiringSoon = await this.isSessionExpiringSoon();

      if (isExpiringSoon) {
        // Try to extend session
        const extended = await this.extendSession();

        if (!extended) {
          // If extension fails, dispatch warning event
          window.dispatchEvent(
            new CustomEvent("sessionExpiring", {
              detail: { message: "Your session is about to expire" },
            }),
          );
        }
      }
    }, 60000); // Check every minute

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener("storage", (e) => {
      if (e.key === this.SESSION_KEY) {
        window.dispatchEvent(
          new CustomEvent("sessionChanged", {
            detail: {
              user: e.newValue ? JSON.parse(e.newValue).user : null,
              action: e.newValue ? "sync" : "logout",
            },
          }),
        );
      }
    });
  }

  /**
   * Get user permissions
   * @returns {Promise<Array>} Array of user permissions
   */
  static async getUserPermissions() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.permissions || [] : [];
    } catch (error) {
      console.error("Failed to get user permissions:", error);
      return [];
    }
  }

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>} True if user has permission
   */
  static async hasPermission(permission) {
    try {
      const permissions = await this.getUserPermissions();
      return permissions.includes(permission);
    } catch (error) {
      console.error("Failed to check permission:", error);
      return false;
    }
  }

  /**
   * Get user role
   * @returns {Promise<string|null>} User role or null
   */
  static async getUserRole() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.role : null;
    } catch (error) {
      console.error("Failed to get user role:", error);
      return null;
    }
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} True if user has role
   */
  static async hasRole(role) {
    try {
      const userRole = await this.getUserRole();
      return userRole === role;
    } catch (error) {
      console.error("Failed to check role:", error);
      return false;
    }
  }
}

// Start session monitoring when module loads
SessionUtils.startSessionMonitoring();
