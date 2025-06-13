// PostApi.js - Post-related API utilities
import { AjaxUtils } from "./AjaxUtils.js";
import { ErrorHandler } from "./ErrorHandler.js";

export class PostApi {
  static baseUrl = "/api/posts";

  /**
   * Get paginated posts
   * @param {number} page - Page number
   * @param {number} limit - Posts per page
   * @returns {Promise<Object>} Response with posts array and metadata
   */
  static async getPosts(page = 1, limit = 10) {
    try {
      const url = `${this.baseUrl}?page=${page}&limit=${limit}`;
      const response = await AjaxUtils.get(url);

      return {
        posts: response.data || [],
        hasMore: response.hasMore || false,
        total: response.total || 0,
        currentPage: response.currentPage || page,
      };
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load posts");
      throw error;
    }
  }

  /**
   * Get a single post by ID
   * @param {string|number} postId - Post ID
   * @returns {Promise<Object>} Post object
   */
  static async getPost(postId) {
    try {
      const response = await AjaxUtils.get(`${this.baseUrl}/${postId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load post");
      throw error;
    }
  }

  /**
   * Create a new post
   * @param {Object} postData - Post data (content, image, etc.)
   * @returns {Promise<Object>} Created post object
   */
  static async createPost(postData) {
    try {
      const response = await AjaxUtils.post(this.baseUrl, postData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to create post");
      throw error;
    }
  }

  /**
   * Update an existing post
   * @param {string|number} postId - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post object
   */
  static async updatePost(postId, postData) {
    try {
      const response = await AjaxUtils.put(
        `${this.baseUrl}/${postId}`,
        postData,
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to update post");
      throw error;
    }
  }

  /**
   * Delete a post
   * @param {string|number} postId - Post ID
   * @returns {Promise<Object>} Success response
   */
  static async deletePost(postId) {
    try {
      const response = await AjaxUtils.delete(`${this.baseUrl}/${postId}`);
      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to delete post");
      throw error;
    }
  }

  /**
   * Like a post
   * @param {string|number} postId - Post ID
   * @returns {Promise<Object>} Like response
   */
  static async likePost(postId) {
    try {
      const response = await AjaxUtils.post(`${this.baseUrl}/${postId}/like`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to like post");
      throw error;
    }
  }

  /**
   * Unlike a post
   * @param {string|number} postId - Post ID
   * @returns {Promise<Object>} Unlike response
   */
  static async unlikePost(postId) {
    try {
      const response = await AjaxUtils.delete(`${this.baseUrl}/${postId}/like`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to unlike post");
      throw error;
    }
  }

  /**
   * Get comments for a post
   * @param {string|number} postId - Post ID
   * @param {number} page - Page number
   * @param {number} limit - Comments per page
   * @returns {Promise<Array>} Array of comments
   */
  static async getComments(postId, page = 1, limit = 20) {
    try {
      const url = `${this.baseUrl}/${postId}/comments?page=${page}&limit=${limit}`;
      const response = await AjaxUtils.get(url);
      return response.data || [];
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load comments");
      throw error;
    }
  }

  /**
   * Create a comment on a post
   * @param {string|number} postId - Post ID
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} Created comment object
   */
  static async createComment(postId, commentData) {
    try {
      const response = await AjaxUtils.post(
        `${this.baseUrl}/${postId}/comments`,
        commentData,
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to post comment");
      throw error;
    }
  }

  /**
   * Update a comment
   * @param {string|number} postId - Post ID
   * @param {string|number} commentId - Comment ID
   * @param {Object} commentData - Updated comment data
   * @returns {Promise<Object>} Updated comment object
   */
  static async updateComment(postId, commentId, commentData) {
    try {
      const response = await AjaxUtils.put(
        `${this.baseUrl}/${postId}/comments/${commentId}`,
        commentData,
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to update comment");
      throw error;
    }
  }

  /**
   * Delete a comment
   * @param {string|number} postId - Post ID
   * @param {string|number} commentId - Comment ID
   * @returns {Promise<Object>} Success response
   */
  static async deleteComment(postId, commentId) {
    try {
      const response = await AjaxUtils.delete(
        `${this.baseUrl}/${postId}/comments/${commentId}`,
      );
      return response;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to delete comment");
      throw error;
    }
  }

  /**
   * Search posts
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} limit - Posts per page
   * @returns {Promise<Object>} Search results
   */
  static async searchPosts(query, page = 1, limit = 10) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/search?q=${encodedQuery}&page=${page}&limit=${limit}`;
      const response = await AjaxUtils.get(url);

      return {
        posts: response.data || [],
        hasMore: response.hasMore || false,
        total: response.total || 0,
        query: query,
      };
    } catch (error) {
      ErrorHandler.handleApiError(error, "Search failed");
      throw error;
    }
  }

  /**
   * Get posts by user
   * @param {string|number} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Posts per page
   * @returns {Promise<Object>} User's posts
   */
  static async getUserPosts(userId, page = 1, limit = 10) {
    try {
      const url = `/api/users/${userId}/posts?page=${page}&limit=${limit}`;
      const response = await AjaxUtils.get(url);

      return {
        posts: response.data || [],
        hasMore: response.hasMore || false,
        total: response.total || 0,
      };
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load user posts");
      throw error;
    }
  }

  /**
   * Get trending posts
   * @param {number} limit - Number of trending posts
   * @returns {Promise<Array>} Array of trending posts
   */
  static async getTrendingPosts(limit = 10) {
    try {
      const url = `${this.baseUrl}/trending?limit=${limit}`;
      const response = await AjaxUtils.get(url);
      return response.data || [];
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load trending posts");
      throw error;
    }
  }

  /**
   * Report a post
   * @param {string|number} postId - Post ID
   * @param {string} reason - Report reason
   * @returns {Promise<Object>} Report response
   */
  static async reportPost(postId, reason) {
    try {
      const response = await AjaxUtils.post(
        `${this.baseUrl}/${postId}/report`,
        { reason },
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to report post");
      throw error;
    }
  }

  /**
   * Share a post
   * @param {string|number} postId - Post ID
   * @param {string} platform - Sharing platform (optional)
   * @returns {Promise<Object>} Share response
   */
  static async sharePost(postId, platform = null) {
    try {
      const payload = platform ? { platform } : {};
      const response = await AjaxUtils.post(
        `${this.baseUrl}/${postId}/share`,
        payload,
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to share post");
      throw error;
    }
  }

  /**
   * Get post analytics (for post owner)
   * @param {string|number} postId - Post ID
   * @returns {Promise<Object>} Post analytics data
   */
  static async getPostAnalytics(postId) {
    try {
      const response = await AjaxUtils.get(
        `${this.baseUrl}/${postId}/analytics`,
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleApiError(error, "Failed to load post analytics");
      throw error;
    }
  }
}
