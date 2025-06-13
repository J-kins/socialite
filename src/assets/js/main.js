// Socialite Main JavaScript - Fixed for initial setup
class SocialiteApp {
  constructor() {
    this.currentUser = null;
    this.posts = [];
    this.currentPage = 1;
    this.postsPerPage = 10;
    this.isLoading = false;

    // Initialize app immediately
    this.initializeApp();
  }

  async initializeApp() {
    try {
      console.log("Initializing Socialite app...");

      // Check authentication status
      await this.checkAuthStatus();

      // Initialize UI components
      this.initializeUI();

      // Load initial posts (fallback to sample data if backend not available)
      await this.loadPosts();

      // Hide loading spinner and show content
      this.hideLoading();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.showToast("Failed to load application", "error");
      this.hideLoading();
      // Show login modal if initialization fails
      this.showLoginModal();
    }
  }

  async checkAuthStatus() {
    try {
      // Check localStorage for existing session
      const token = localStorage.getItem("socialite_token");
      const userStr = localStorage.getItem("socialite_user");

      if (token && userStr) {
        try {
          this.currentUser = JSON.parse(userStr);
          console.log("Found existing session for:", this.currentUser.username);
          this.updateUIForAuthenticatedUser();
          return;
        } catch (e) {
          console.warn("Invalid user data in localStorage");
          localStorage.removeItem("socialite_token");
          localStorage.removeItem("socialite_user");
        }
      }

      // Try to validate session with backend (if available)
      try {
        const response = await fetch("/api/auth/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid && data.user) {
            this.currentUser = data.user;
            this.updateUIForAuthenticatedUser();
            return;
          }
        }
      } catch (apiError) {
        console.warn(
          "Backend API not available, using fallback authentication",
        );
      }

      // No valid session found
      this.updateUIForGuestUser();
    } catch (error) {
      console.error("Auth check failed:", error);
      this.updateUIForGuestUser();
    }
  }

  initializeUI() {
    console.log("Initializing UI components...");

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
      let posts = [];

      // Try to fetch from backend API
      try {
        const response = await fetch(
          `/api/posts?page=${page}&limit=${this.postsPerPage}`,
        );
        if (response.ok) {
          const data = await response.json();
          posts = data.data || [];
        } else {
          throw new Error("API not available");
        }
      } catch (apiError) {
        console.warn("Backend API not available, using sample data");
        // Fallback to sample data
        posts = this.getSamplePosts();
      }

      if (page === 1) {
        this.posts = posts;
        this.renderPosts();
      } else {
        this.posts = [...this.posts, ...posts];
        this.appendPosts(posts);
      }

      this.currentPage = page;

      // Show/hide load more button
      const hasMore = posts.length === this.postsPerPage;
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

  getSamplePosts() {
    return [
      {
        id: 1,
        username: "john_doe",
        first_name: "John",
        last_name: "Doe",
        user_avatar: "src/assets/img/default-avatar.png",
        content:
          "Welcome to Socialite! This is a sample post to show how the platform works. The backend API will provide real data once configured.",
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        likes_count: 15,
        comments_count: 3,
        is_liked: false,
      },
      {
        id: 2,
        username: "jane_smith",
        first_name: "Jane",
        last_name: "Smith",
        user_avatar: "src/assets/img/default-avatar.png",
        content:
          "Just finished working on a new design project. Really excited about the direction we're taking! #design #creativity",
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        likes_count: 8,
        comments_count: 1,
        is_liked: true,
      },
      {
        id: 3,
        username: "john_doe",
        first_name: "John",
        last_name: "Doe",
        user_avatar: "src/assets/img/default-avatar.png",
        content:
          "Beautiful sunset today! Sometimes you need to take a break from coding and appreciate nature. 🌅",
        created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        likes_count: 23,
        comments_count: 5,
        is_liked: false,
      },
    ];
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

    return `
            <article class="post-card bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 fade-in" data-post-id="${post.id}">
                <div class="p-6">
                    <!-- Post Header -->
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${userAvatar}" alt="${post.username}" class="w-10 h-10 rounded-full object-cover bg-gray-200">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 dark:text-white">${post.first_name} ${post.last_name}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">@${post.username} • ${timeAgo}</p>
                        </div>
                    </div>

                    <!-- Post Content -->
                    <div class="mb-4">
                        <p class="text-gray-900 dark:text-white whitespace-pre-wrap">${post.content}</p>
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

      // Try to create post via API
      let newPost;
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("socialite_token")}`,
          },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          const data = await response.json();
          newPost = data.data;
        } else {
          throw new Error("API not available");
        }
      } catch (apiError) {
        // Fallback: create post locally
        newPost = {
          id: Date.now(),
          username: this.currentUser.username,
          first_name: this.currentUser.first_name,
          last_name: this.currentUser.last_name,
          user_avatar:
            this.currentUser.avatar_url || "src/assets/img/default-avatar.png",
          content: content,
          created_at: new Date().toISOString(),
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
        };
      }

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

    // Optimistic update
    if (isLiked) {
      btn.classList.remove("liked", "text-red-500");
      icon.setAttribute("name", "heart-outline");
      countSpan.textContent = parseInt(countSpan.textContent) - 1;
    } else {
      btn.classList.add("liked", "text-red-500");
      icon.setAttribute("name", "heart");
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }

    // Try to sync with backend
    try {
      const method = isLiked ? "DELETE" : "POST";
      await fetch(`/api/posts/${postId}/like`, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("socialite_token")}`,
        },
      });
    } catch (apiError) {
      console.warn("Could not sync like with backend");
    }
  }

  async handleShowComments(e) {
    e.preventDefault();
    this.showToast("Comments feature coming soon!", "info");
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

    // Basic validation
    if (!email || !password) {
      this.showError(errorDiv, "Please enter both email and password");
      return;
    }

    try {
      // Show loading state
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      spinner.classList.remove("hidden");
      errorDiv.classList.add("hidden");

      let loginSuccess = false;
      let userData = null;

      // Try backend authentication
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            localStorage.setItem("socialite_token", data.token);
            localStorage.setItem("socialite_user", JSON.stringify(data.user));
            userData = data.user;
            loginSuccess = true;
          }
        }
      } catch (apiError) {
        console.warn("Backend login not available, using demo credentials");
      }

      // Fallback demo authentication
      if (!loginSuccess) {
        if (
          (email === "john@example.com" || email === "jane@example.com") &&
          password === "password123"
        ) {
          userData = {
            id: email === "john@example.com" ? 1 : 2,
            email: email,
            username: email === "john@example.com" ? "john_doe" : "jane_smith",
            first_name: email === "john@example.com" ? "John" : "Jane",
            last_name: email === "john@example.com" ? "Doe" : "Smith",
            avatar_url: "src/assets/img/default-avatar.png",
          };

          localStorage.setItem("socialite_token", "demo-token-" + Date.now());
          localStorage.setItem("socialite_user", JSON.stringify(userData));
          loginSuccess = true;
        } else {
          this.showError(
            errorDiv,
            "Invalid credentials. Try john@example.com or jane@example.com with password: password123",
          );
        }
      }

      if (loginSuccess) {
        this.currentUser = userData;
        this.hideLoginModal();
        this.updateUIForAuthenticatedUser();
        this.showToast("Login successful!", "success");

        // Reload posts to show user-specific content
        await this.loadPosts();
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
      // Try to logout via API
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("socialite_token")}`,
          },
        });
      } catch (apiError) {
        console.warn("Backend logout not available");
      }

      // Clear local storage
      localStorage.removeItem("socialite_token");
      localStorage.removeItem("socialite_user");

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

    // Simple client-side search for now
    const filteredPosts = this.posts.filter(
      (post) =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase()) ||
        `${post.first_name} ${post.last_name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );

    const container = document.getElementById("postsContainer");
    if (container) {
      container.innerHTML = filteredPosts
        .map((post) => this.createPostHTML(post))
        .join("");
      this.attachPostEventListeners();
    }
  }

  updateUIForAuthenticatedUser() {
    console.log(
      "Updating UI for authenticated user:",
      this.currentUser.username,
    );

    // Show user elements
    const userMenu = document.getElementById("userMenu");
    const createPostSection = document.getElementById("createPostSection");
    const loginBtn = document.getElementById("loginBtn");

    if (userMenu) userMenu.classList.remove("hidden");
    if (createPostSection) createPostSection.classList.remove("hidden");
    if (loginBtn) loginBtn.classList.add("hidden");

    // Update user avatar and info
    const userAvatar = document.getElementById("userAvatar");
    const createPostAvatar = document.getElementById("createPostAvatar");

    if (this.currentUser.avatar_url) {
      if (userAvatar) userAvatar.src = this.currentUser.avatar_url;
      if (createPostAvatar) createPostAvatar.src = this.currentUser.avatar_url;
    }
  }

  updateUIForGuestUser() {
    console.log("Updating UI for guest user");

    // Hide user elements
    const userMenu = document.getElementById("userMenu");
    const createPostSection = document.getElementById("createPostSection");
    const loginBtn = document.getElementById("loginBtn");

    if (userMenu) userMenu.classList.add("hidden");
    if (createPostSection) createPostSection.classList.add("hidden");
    if (loginBtn) loginBtn.classList.remove("hidden");
  }

  showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.remove("hidden");
      document.getElementById("email").focus();
    }
  }

  hideLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.add("hidden");
      document.getElementById("loginForm").reset();
      document.getElementById("loginError").classList.add("hidden");
    }
  }

  hideLoading() {
    console.log("Hiding loading spinner...");
    const spinner = document.getElementById("loadingSpinner");
    const wrapper = document.getElementById("wrapper");

    if (spinner) spinner.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("hidden");
  }

  toggleLoadMoreButton(hasMore) {
    const container = document.getElementById("loadMoreContainer");
    if (container) {
      container.classList.toggle("hidden", !hasMore);
    }
  }

  showError(errorDiv, message) {
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove("hidden");
    }
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type} fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white`;

    // Set background color based on type
    const colors = {
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
      success: "bg-green-500",
    };

    toast.classList.add(colors[type] || colors.info);

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
  }

  getEmptyState() {
    if (!this.currentUser) {
      return `
                <div class="text-center py-12">
                    <ion-icon name="person-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4"></ion-icon>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to Socialite!</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Please log in to see posts and start sharing.</p>
                    <button onclick="app.showLoginModal()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </div>
            `;
    }

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
let app;
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing Socialite...");
  app = new SocialiteApp();
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
