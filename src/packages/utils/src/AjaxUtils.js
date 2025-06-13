// AjaxUtils.js - HTTP request utilities
import { SessionUtils } from "./SessionUtils.js";

export class AjaxUtils {
  static baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  /**
   * Get authentication headers including JWT token and CSRF token
   * @returns {Object} Headers object
   */
  static async getAuthHeaders() {
    const headers = { ...this.baseHeaders };

    // Add JWT token if available
    const token = await SessionUtils.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add CSRF token if available
    const csrfToken = await SessionUtils.getCsrfToken();
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    return headers;
  }

  /**
   * Make a generic HTTP request
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  static async request(url, options = {}) {
    try {
      const headers = await this.getAuthHeaders();

      const config = {
        headers,
        credentials: "include",
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(
          responseData.message || `HTTP error! status: ${response.status}`,
        );
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        error.message = "Network error. Please check your connection.";
      }

      // Handle authentication errors
      if (error.status === 401) {
        await SessionUtils.clearSession();
        window.location.reload();
      }

      throw error;
    }
  }

  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  static async get(url, params = {}, options = {}) {
    // Add query parameters to URL
    const searchParams = new URLSearchParams(params);
    const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

    return this.request(fullUrl, {
      method: "GET",
      ...options,
    });
  }

  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  static async post(url, data = null, options = {}) {
    const config = {
      method: "POST",
      ...options,
    };

    if (data !== null) {
      if (data instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it with boundary
        delete config.headers?.["Content-Type"];
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    return this.request(url, config);
  }

  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  static async put(url, data = null, options = {}) {
    const config = {
      method: "PUT",
      ...options,
    };

    if (data !== null) {
      if (data instanceof FormData) {
        delete config.headers?.["Content-Type"];
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    return this.request(url, config);
  }

  /**
   * Make a PATCH request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  static async patch(url, data = null, options = {}) {
    const config = {
      method: "PATCH",
      ...options,
    };

    if (data !== null) {
      config.body = JSON.stringify(data);
    }

    return this.request(url, config);
  }

  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  static async delete(url, options = {}) {
    return this.request(url, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * Upload files using FormData
   * @param {string} url - Upload URL
   * @param {FileList|File|Array} files - Files to upload
   * @param {Object} data - Additional form data
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<any>} Response data
   */
  static async uploadFiles(url, files, data = {}, onProgress = null) {
    const formData = new FormData();

    // Add files to FormData
    if (files instanceof FileList) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]);
      }
    } else if (files instanceof File) {
      formData.append("file", files);
    } else if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }

    // Add additional data
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Create XMLHttpRequest for progress tracking
    if (onProgress && typeof onProgress === "function") {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", url);

        // Add auth headers
        SessionUtils.getToken().then((token) => {
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }

          SessionUtils.getCsrfToken().then((csrfToken) => {
            if (csrfToken) {
              xhr.setRequestHeader("X-CSRF-Token", csrfToken);
            }
            xhr.send(formData);
          });
        });
      });
    }

    // Use regular fetch for simple uploads without progress
    return this.post(url, formData);
  }

  /**
   * Download a file
   * @param {string} url - Download URL
   * @param {string} filename - Filename for download
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  static async downloadFile(url, filename = null, options = {}) {
    try {
      const response = await this.request(url, {
        method: "GET",
        ...options,
      });

      // Create blob from response
      const blob = new Blob([response], {
        type: options.mimeType || "application/octet-stream",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Make multiple concurrent requests
   * @param {Array} requests - Array of request configurations
   * @returns {Promise<Array>} Array of responses
   */
  static async batch(requests) {
    const promises = requests.map((request) => {
      const { url, method = "GET", data = null, ...options } = request;

      switch (method.toLowerCase()) {
        case "post":
          return this.post(url, data, options);
        case "put":
          return this.put(url, data, options);
        case "patch":
          return this.patch(url, data, options);
        case "delete":
          return this.delete(url, options);
        default:
          return this.get(url, data, options);
      }
    });

    return Promise.allSettled(promises);
  }

  /**
   * Check if a URL is reachable
   * @param {string} url - URL to check
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} True if reachable
   */
  static async ping(url, timeout = 5000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
