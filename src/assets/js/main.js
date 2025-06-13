// Socialite Main JavaScript
import { PostApi } from "../packages/utils/src/PostApi.js";
import { AuthApi } from "../packages/utils/src/AuthApi.js";
import { SessionUtils } from "../packages/utils/src/SessionUtils.js";
import { ValidationUtils } from "../packages/utils/src/ValidationUtils.js";

class SocialiteApp {
  constructor() {
    this.currentUser = null;
    this.posts = [];
    this.currentPage = 1;
    this.postsPerPage = 10;
    this.isLoading = false;

    this.initializeApp();
  }

  async initializeApp() {
    try {
      // Check authentication status
      await this.checkAuthStatus();

      // Initialize UI components
      this.initializeUI();

      // Load initial posts
      await this.loadPosts();

      // Hide loading spinner
      this.hideLoading();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.showToast("Failed to load application", "error");
      this.hideLoading();
    }
  }

  async checkAuthStatus() {
    try {
      const session = await SessionUtils.checkSession();
      if (session && session.user) {
        this.currentUser = session.user;
        this.updateUIForAuthenticatedUser();
      } else {
        this.updateUIForGuestUser();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.updateUIForGuestUser();
    }
  }

  initializeUI() {
    // Header interactions
    this.initializeHeader();

    // Post creation
    this.initializePostCreation();

    // Login modal
    this.initializeLoginModal();

    // Load more posts
    this.initializeLoadMore();

    // Dark mode toggle
    this.initializeDarkMode();

    // Search functionality
    this.initializeSearch();
  }

  initializeHeader() {
    // User menu dropdown
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", () => {
        userDropdown.classList.add("hidden");
      });
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }

    // Login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.showLoginModal());
    }
  }

  initializePostCreation() {
    const postContent = document.getElementById("postContent");
    const postBtn = document.getElementById("postBtn");

    if (postContent && postBtn) {
      postContent.addEventListener("input", () => {
        const hasContent = postContent.value.trim().length > 0;
        postBtn.disabled = !hasContent;
        postBtn.classList.toggle("bg-gray-400", !hasContent);
        postBtn.classList.toggle("bg-blue-500", hasContent);
      });

      postBtn.addEventListener("click", () => this.handleCreatePost());
    }
  }

  initializeLoginModal() {
    const loginModal = document.getElementById("loginModal");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const loginForm = document.getElementById("loginForm");

    if (closeLoginModal) {
      closeLoginModal.addEventListener("click", () => this.hideLoginModal());
    }

    if (loginModal) {
      loginModal.addEventListener("click", (e) => {
        if (e.target === loginModal) {
          this.hideLoginModal();
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }
  }

  initializeLoadMore() {
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => this.loadMorePosts());
    }
  }

  initializeDarkMode() {
    // Check system preference or stored preference
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }

  initializeSearch() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 300);
      });
    }
  }

  async loadPosts(page = 1) {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      const response = await PostApi.getPosts(page, this.postsPerPage);

      if (page === 1) {
        this.posts = response.posts || [];
        this.renderPosts();
      } else {
        this.posts = [...this.posts, ...(response.posts || [])];
        this.appendPosts(response.posts || []);
      }

      this.currentPage = page;

      // Show/hide load more button
      const hasMore = response.hasMore || false;
      this.toggleLoadMoreButton(hasMore);
    } catch (error) {
      console.error("Failed to load posts:", error);
      this.showToast("Failed to load posts", "error");

      if (page === 1) {
        this.renderErrorState();
      }
    } finally {
      this.isLoading = false;
    }
  }

  async loadMorePosts() {
    await this.loadPosts(this.currentPage + 1);
  }

  renderPosts() {
    const container = document.getElementById("postsContainer");
    if (!container) return;

    if (this.posts.length === 0) {
      container.innerHTML = this.getEmptyState();
      return;
    }

    container.innerHTML = this.posts
      .map((post) => this.createPostHTML(post))
      .join("");
    this.attachPostEventListeners();
  }

  appendPosts(newPosts) {
    const container = document.getElementById("postsContainer");
    if (!container || !newPosts.length) return;

    const newPostsHTML = newPosts
      .map((post) => this.createPostHTML(post))
      .join("");
    container.insertAdjacentHTML("beforeend", newPostsHTML);
    this.attachPostEventListeners();
  }

  createPostHTML(post) {
    const timeAgo = this.getTimeAgo(post.created_at);
    const userAvatar = post.user_avatar || "src/assets/img/default-avatar.png";
    const postImage = post.image_url
      ? `
            <div class="mt-3">
                <img src="${post.image_url}" alt="Post image" class="w-full rounded-lg object-cover max-h-96">
            </div>
        `
      : "";

    return `
            <article class="post-card bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 fade-in" data-post-id="${post.id}">
                <div class="p-6">
                    <!-- Post Header -->
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${userAvatar}" alt="${post.username}" class="w-10 h-10 rounded-full object-cover">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 dark:text-white">${post.username}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${timeAgo}</p>
                        </div>
                        <div class="relative">
                            <button class="post-menu-btn p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                                <ion-icon name="ellipsis-horizontal"></ion-icon>
                            </button>
                        </div>
                    </div>

                    <!-- Post Content -->
                    <div class="mb-4">
                        <p class="text-gray-900 dark:text-white whitespace-pre-wrap">${post.content}</p>
                        ${postImage}
                    </div>

                    <!-- Post Stats -->
                    <div class="flex items-center gap-6 py-3 border-t border-gray-200 dark:border-gray-700">
                        <button class="like-btn flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors ${post.is_liked ? "liked text-red-500" : ""}" data-post-id="${post.id}">
                            <ion-icon name="${post.is_liked ? "heart" : "heart-outline"}" class="w-5 h-5"></ion-icon>
                            <span class="like-count">${post.likes_count || 0}</span>
                        </button>
                        
                        <button class="comment-btn flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors" data-post-id="${post.id}">
                            <ion-icon name="chatbubble-outline" class="w-5 h-5"></ion-icon>
                            <span>${post.comments_count || 0}</span>
                        </button>
                        
                        <button class="share-btn flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors" data-post-id="${post.id}">
                            <ion-icon name="share-outline" class="w-5 h-5"></ion-icon>
                            <span>Share</span>
                        </button>
                    </div>

                    <!-- Comments Section -->
                    <div class="comments-section mt-4 hidden">
                        <div class="comments-list space-y-3"></div>
                        ${
                          this.currentUser
                            ? `
                            <div class="flex items-start gap-3 mt-4">
                                <img src="${this.currentUser.avatar || "src/assets/img/default-avatar.png"}" alt="Your avatar" class="w-8 h-8 rounded-full object-cover">
                                <div class="flex-1">
                                    <textarea class="comment-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                              placeholder="Write a comment..." rows="2"></textarea>
                                    <button class="submit-comment-btn mt-2 bg-blue-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-blue-600 transition-colors">
                                        Comment
                                    </button>
                                </div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </article>
        `;
  }

  attachPostEventListeners() {
    // Like buttons
    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleLike(e));
    });

    // Comment buttons
    document.querySelectorAll(".comment-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleShowComments(e));
    });

    // Share buttons
    document.querySelectorAll(".share-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleShare(e));
    });

    // Submit comment buttons
    document.querySelectorAll(".submit-comment-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleSubmitComment(e));
    });
  }

  async handleCreatePost() {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const content = document.getElementById("postContent").value.trim();
    if (!content) return;

    try {
      const postBtn = document.getElementById("postBtn");
      postBtn.disabled = true;
      postBtn.textContent = "Posting...";

      const newPost = await PostApi.createPost({ content });

      // Add new post to the beginning of the posts array
      this.posts.unshift(newPost);
      this.renderPosts();

      // Clear the form
      document.getElementById("postContent").value = "";
      postBtn.disabled = true;
      postBtn.textContent = "Post";

      this.showToast("Post created successfully!", "success");
    } catch (error) {
      console.error("Failed to create post:", error);
      this.showToast("Failed to create post", "error");

      const postBtn = document.getElementById("postBtn");
      postBtn.disabled = false;
      postBtn.textContent = "Post";
    }
  }

  async handleLike(e) {
    e.preventDefault();

    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const icon = btn.querySelector("ion-icon");
    const countSpan = btn.querySelector(".like-count");
    const isLiked = btn.classList.contains("liked");

    try {
      if (isLiked) {
        await PostApi.unlikePost(postId);
        btn.classList.remove("liked");
        btn.classList.remove("text-red-500");
        icon.setAttribute("name", "heart-outline");
        countSpan.textContent = parseInt(countSpan.textContent) - 1;
      } else {
        await PostApi.likePost(postId);
        btn.classList.add("liked", "text-red-500");
        icon.setAttribute("name", "heart");
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      this.showToast("Failed to update like", "error");
    }
  }

  async handleShowComments(e) {
    e.preventDefault();

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const postCard = btn.closest(".post-card");
    const commentsSection = postCard.querySelector(".comments-section");

    if (commentsSection.classList.contains("hidden")) {
      commentsSection.classList.remove("hidden");
      await this.loadComments(postId, postCard);
    } else {
      commentsSection.classList.add("hidden");
    }
  }

  async loadComments(postId, postCard) {
    try {
      const comments = await PostApi.getComments(postId);
      const commentsListContainer = postCard.querySelector(".comments-list");

      if (comments.length === 0) {
        commentsListContainer.innerHTML =
          '<p class="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>';
        return;
      }

      commentsListContainer.innerHTML = comments
        .map(
          (comment) => `
                <div class="flex items-start gap-3">
                    <img src="${comment.user_avatar || "src/assets/img/default-avatar.png"}" alt="${comment.username}" class="w-8 h-8 rounded-full object-cover">
                    <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <h4 class="font-medium text-gray-900 dark:text-white text-sm">${comment.username}</h4>
                        <p class="text-gray-800 dark:text-gray-200 text-sm mt-1">${comment.content}</p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">${this.getTimeAgo(comment.created_at)}</p>
                    </div>
                </div>
            `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load comments:", error);
      this.showToast("Failed to load comments", "error");
    }
  }

  async handleSubmitComment(e) {
    e.preventDefault();

    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const btn = e.currentTarget;
    const postCard = btn.closest(".post-card");
    const postId = postCard.dataset.postId;
    const textarea = postCard.querySelector(".comment-input");
    const content = textarea.value.trim();

    if (!content) return;

    try {
      btn.disabled = true;
      btn.textContent = "Posting...";

      const comment = await PostApi.createComment(postId, { content });

      // Add comment to the comments list
      const commentsListContainer = postCard.querySelector(".comments-list");
      const newCommentHTML = `
                <div class="flex items-start gap-3">
                    <img src="${this.currentUser.avatar || "src/assets/img/default-avatar.png"}" alt="${this.currentUser.username}" class="w-8 h-8 rounded-full object-cover">
                    <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <h4 class="font-medium text-gray-900 dark:text-white text-sm">${this.currentUser.username}</h4>
                        <p class="text-gray-800 dark:text-gray-200 text-sm mt-1">${content}</p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">Just now</p>
                    </div>
                </div>
            `;

      if (commentsListContainer.innerHTML.includes("No comments yet")) {
        commentsListContainer.innerHTML = newCommentHTML;
      } else {
        commentsListContainer.insertAdjacentHTML("beforeend", newCommentHTML);
      }

      // Update comment count
      const commentBtn = postCard.querySelector(".comment-btn span");
      commentBtn.textContent = parseInt(commentBtn.textContent) + 1;

      // Clear textarea
      textarea.value = "";

      this.showToast("Comment posted!", "success");
    } catch (error) {
      console.error("Failed to post comment:", error);
      this.showToast("Failed to post comment", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Comment";
    }
  }

  async handleShare(e) {
    e.preventDefault();

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Socialite Post",
          text: "Check out this post on Socialite!",
          url: `${window.location.origin}/post/${postId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${window.location.origin}/post/${postId}`,
        );
        this.showToast("Link copied to clipboard!", "success");
      }
    } catch (error) {
      console.error("Failed to share:", error);
      this.showToast("Failed to share post", "error");
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const errorDiv = document.getElementById("loginError");
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = document.getElementById("loginBtnText");
    const spinner = document.getElementById("loginSpinner");

    // Validate inputs
    if (!ValidationUtils.isValidEmail(email)) {
      this.showError(errorDiv, "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      this.showError(errorDiv, "Password must be at least 6 characters");
      return;
    }

    try {
      // Show loading state
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      spinner.classList.remove("hidden");
      errorDiv.classList.add("hidden");

      const response = await AuthApi.login(email, password);

      if (response.success) {
        this.currentUser = response.user;
        await SessionUtils.setSession(response.token, response.user);

        this.hideLoginModal();
        this.updateUIForAuthenticatedUser();
        this.showToast("Login successful!", "success");

        // Reload posts to show user-specific content
        await this.loadPosts();
      } else {
        this.showError(errorDiv, response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showError(errorDiv, "Login failed. Please try again.");
    } finally {
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      spinner.classList.add("hidden");
    }
  }

  async handleLogout() {
    try {
      await AuthApi.logout();
      await SessionUtils.clearSession();

      this.currentUser = null;
      this.updateUIForGuestUser();
      this.showToast("Logged out successfully", "info");

      // Reload posts to show public content
      await this.loadPosts();
    } catch (error) {
      console.error("Logout error:", error);
      this.showToast("Logout failed", "error");
    }
  }

  async handleSearch(query) {
    if (!query.trim()) {
      await this.loadPosts();
      return;
    }

    try {
      const results = await PostApi.searchPosts(query);
      this.posts = results.posts || [];
      this.renderPosts();
    } catch (error) {
      console.error("Search failed:", error);
      this.showToast("Search failed", "error");
    }
  }

  updateUIForAuthenticatedUser() {
    // Show user elements
    document.getElementById("userMenu").classList.remove("hidden");
    document.getElementById("createPostSection").classList.remove("hidden");
    document.getElementById("loginBtn").classList.add("hidden");

    // Update user avatar and info
    const userAvatar = document.getElementById("userAvatar");
    const createPostAvatar = document.getElementById("createPostAvatar");

    if (this.currentUser.avatar) {
      if (userAvatar) userAvatar.src = this.currentUser.avatar;
      if (createPostAvatar) createPostAvatar.src = this.currentUser.avatar;
    }
  }

  updateUIForGuestUser() {
    // Hide user elements
    document.getElementById("userMenu").classList.add("hidden");
    document.getElementById("createPostSection").classList.add("hidden");
    document.getElementById("loginBtn").classList.remove("hidden");
  }

  showLoginModal() {
    document.getElementById("loginModal").classList.remove("hidden");
    document.getElementById("email").focus();
  }

  hideLoginModal() {
    document.getElementById("loginModal").classList.add("hidden");
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").classList.add("hidden");
  }

  hideLoading() {
    document.getElementById("loadingSpinner").classList.add("hidden");
    document.getElementById("wrapper").classList.remove("hidden");
  }

  toggleLoadMoreButton(hasMore) {
    const container = document.getElementById("loadMoreContainer");
    if (container) {
      container.classList.toggle("hidden", !hasMore);
    }
  }

  showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  getEmptyState() {
    return `
            <div class="text-center py-12">
                <ion-icon name="document-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4"></ion-icon>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p class="text-gray-600 dark:text-gray-400">Be the first to share something!</p>
            </div>
        `;
  }

  renderErrorState() {
    const container = document.getElementById("postsContainer");
    if (container) {
      container.innerHTML = `
                <div class="text-center py-12">
                    <ion-icon name="warning-outline" class="w-16 h-16 text-red-400 mx-auto mb-4"></ion-icon>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading posts</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Something went wrong. Please try again.</p>
                    <button onclick="location.reload()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Retry
                    </button>
                </div>
            `;
    }
  }

  getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SocialiteApp();
});

// Handle theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.theme) {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  });
