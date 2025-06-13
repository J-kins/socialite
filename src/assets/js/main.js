// Nexify Main JavaScript - Dynamic functionality for the original Nexify template
class NexifyApp {
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
      console.log("Initializing Nexify app...");

      // Check authentication status
      await this.checkAuthStatus();

      // Initialize UI components
      this.initializeUI();

      // Load sample stories
      this.loadStories();

      // Load initial posts
      await this.loadPosts();

      // Hide loading spinner and show content
      this.hideLoading();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.showToast("Failed to load application", "error");
      this.hideLoading();
    }
  }

  async checkAuthStatus() {
    try {
      // Check localStorage for existing session
      const token = localStorage.getItem("nexify_token");
      const userStr = localStorage.getItem("nexify_user");

      if (token && userStr) {
        try {
          this.currentUser = JSON.parse(userStr);
          console.log("Found existing session for:", this.currentUser.username);
          this.updateUIForAuthenticatedUser();
          return;
        } catch (e) {
          console.warn("Invalid user data in localStorage");
          localStorage.removeItem("nexify_token");
          localStorage.removeItem("nexify_user");
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
    // Handle "What do you have in mind?" click to open create modal
    const createPostTriggers = document.querySelectorAll(
      '[uk-toggle="target: #create-status"]',
    );
    createPostTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (!this.currentUser) {
          this.showLoginModal();
        }
      });
    });
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

  loadStories() {
    const storiesList = document.getElementById("storiesList");
    if (!storiesList) return;

    const sampleStories = [
      {
        id: 1,
        username: "monroe",
        avatar: "assets/images/avatars/avatar-3.jpg",
      },
      { id: 2, username: "john", avatar: "assets/images/avatars/avatar-5.jpg" },
      {
        id: 3,
        username: "alexa",
        avatar: "assets/images/avatars/avatar-6.jpg",
      },
      {
        id: 4,
        username: "james",
        avatar: "assets/images/avatars/avatar-2.jpg",
      },
      {
        id: 5,
        username: "sarah",
        avatar: "assets/images/avatars/avatar-4.jpg",
      },
    ];

    storiesList.innerHTML = sampleStories
      .map(
        (story) => `
            <li class="md:pr-3 pr-2 hover:scale-[1.15] hover:-rotate-2 duration-300">
                <a href="#" data-caption="Story by ${story.username}">
                    <div class="md:w-16 md:h-16 w-12 h-12 relative md:border-4 border-2 shadow border-white rounded-full overflow-hidden dark:border-slate-700">
                        <img src="${story.avatar}" alt="${story.username}" class="absolute w-full h-full object-cover">
                    </div>
                </a>
            </li>
        `,
      )
      .join("");
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
        username: "Monroe Parker",
        user_handle: "@monroe",
        user_avatar: "assets/images/avatars/avatar-3.jpg",
        content:
          "Just captured this amazing sunset! Photography is truly about finding beauty in everyday moments. 📸✨",
        image_url: "assets/images/post/img-2.jpg",
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        likes_count: 127,
        comments_count: 23,
        is_liked: false,
        post_type: "image",
      },
      {
        id: 2,
        username: "John Michael",
        user_handle: "@john_m",
        user_avatar: "assets/images/avatars/avatar-5.jpg",
        content:
          "Photography is the art of capturing light with a camera. It can be used to create images that tell stories, express emotions, or document reality. it can be fun, challenging, or rewarding. It can also be a hobby, a profession, or a passion. 📷",
        created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        likes_count: 89,
        comments_count: 12,
        is_liked: true,
        post_type: "text",
      },
      {
        id: 3,
        username: "Alexa Gray",
        user_handle: "@alexa_g",
        user_avatar: "assets/images/avatars/avatar-6.jpg",
        content:
          "Working on some exciting new designs today! The creative process never gets old. 🎨",
        images: [
          "assets/images/post/img-3.jpg",
          "assets/images/post/img-4.jpg",
        ],
        created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        likes_count: 156,
        comments_count: 34,
        is_liked: false,
        post_type: "gallery",
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
    const userAvatar = post.user_avatar || "assets/images/avatars/avatar-2.jpg";

    // Handle different post types
    let mediaContent = "";
    if (post.post_type === "image" && post.image_url) {
      mediaContent = `
                <a href="#preview_modal" uk-toggle>
                    <div class="relative w-full lg:h-96 h-full sm:px-4">
                        <img src="${post.image_url}" alt="" class="sm:rounded-lg w-full h-full object-cover">
                    </div>
                </a>
            `;
    } else if (post.post_type === "gallery" && post.images) {
      mediaContent = `
                <div class="relative uk-visible-toggle sm:px-4" tabindex="-1" uk-slideshow="animation: push;ratio: 4:3">
                    <ul class="uk-slideshow-items overflow-hidden rounded-xl" uk-lightbox="animation: fade">
                        ${post.images
                          .map(
                            (img) => `
                            <li class="w-full">
                                <a class="inline" href="${img}" data-caption="Image"> 
                                    <img src="${img}" alt="" class="w-full h-full absolute object-cover insta-0">
                                </a>
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                    <a class="nav-prev left-6" href="#" uk-slideshow-item="previous"> <ion-icon name="chevron-back" class="text-2xl"></ion-icon> </a>
                    <a class="nav-next right-6" href="#" uk-slideshow-item="next"> <ion-icon name="chevron-forward" class="text-2xl"></ion-icon></a>
                </div>
            `;
    }

    return `
            <div class="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2" data-post-id="${post.id}">
                <!-- post heading -->
                <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                    <a href="timeline.html"> <img src="${userAvatar}" alt="${post.username}" class="w-9 h-9 rounded-full"> </a>  
                    <div class="flex-1">
                        <a href="timeline.html"> <h4 class="text-black dark:text-white">${post.username}</h4> </a>  
                        <div class="text-xs text-gray-500 dark:text-white/80">${timeAgo}</div>
                    </div>

                    <div class="-mr-1">
                        <button type="button" class="button-icon w-8 h-8"> <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon> </button>
                        <div class="w-[245px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click"> 
                            <nav> 
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="bookmark-outline"></ion-icon>  Add to favorites </a>  
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="notifications-off-outline"></ion-icon> Mute Notification </a>  
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="flag-outline"></ion-icon>  Report this post </a>  
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="share-outline"></ion-icon>  Share your profile </a>  
                                <hr>
                                <a href="#" class="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon class="text-xl shrink-0" name="stop-circle-outline"></ion-icon>  Unfollow </a>  
                            </nav>
                        </div>
                    </div>
                </div>
                
                ${
                  post.content
                    ? `
                <div class="sm:px-4 p-2.5 pt-0">
                    <p class="font-normal">${post.content}</p>
                </div>
                `
                    : ""
                }
                
                ${mediaContent}

                <!-- post icons -->
                <div class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                    <div>
                        <div class="flex items-center gap-2.5">
                            <button type="button" class="like-btn button-icon ${post.is_liked ? "text-red-500 bg-red-100" : "bg-slate-200/70"} dark:bg-slate-700" data-post-id="${post.id}"> 
                                <ion-icon class="text-lg" name="${post.is_liked ? "heart" : "heart-outline"}"></ion-icon> 
                            </button>
                            <a href="#" class="like-count">${post.likes_count}</a>
                        </div>
                        <div class="p-1 px-2 bg-white rounded-full drop-shadow-md w-[212px] dark:bg-slate-700 text-2xl"
                                uk-drop="offset:10;pos: top-left; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left"> 
                            
                            <div class="flex gap-2" uk-scrollspy="target: > button; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
                                <button type="button" class="text-red-600 hover:scale-125 duration-300"> <span> 👍 </span></button>
                                <button type="button" class="text-red-600 hover:scale-125 duration-300"> <span> ❤️ </span></button>
                                <button type="button" class="text-red-600 hover:scale-125 duration-300"> <span> 😂 </span></button>
                                <button type="button" class="text-red-600 hover:scale-125 duration-300"> <span> 😯 </span></button>
                                <button type="button" class="text-red-600 hover:scale-125 duration-300"> <span> 😢 </span></button>
                            </div>
                            
                            <div class="w-2.5 h-2.5 absolute -bottom-1 left-3 bg-white rotate-45 hidden"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" class="comment-btn button-icon bg-slate-200/70 dark:bg-slate-700" data-post-id="${post.id}"> 
                            <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> 
                        </button>
                        <span class="comment-count">${post.comments_count}</span>
                    </div>
                    <button type="button" class="share-btn button-icon ml-auto" data-post-id="${post.id}"> 
                        <ion-icon class="text-xl" name="paper-plane-outline"></ion-icon> 
                    </button>
                    <button type="button" class="button-icon"> <ion-icon class="text-xl" name="share-outline"></ion-icon> </button>
                </div>

                <!-- comments -->
                <div class="comments-section sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40 hidden"> 
                    <div class="comments-list"></div>
                    ${
                      this.currentUser
                        ? `
                    <!-- add comment -->
                    <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                        <img src="${this.currentUser.avatar || "assets/images/avatars/avatar-2.jpg"}" alt="" class="w-6 h-6 rounded-full">
                        <div class="flex-1 relative overflow-hidden h-10">
                            <textarea placeholder="Add Comment...." rows="1" class="comment-input w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>
                        </div>
                        <button type="submit" class="submit-comment-btn text-sm rounded-full py-1.5 px-3.5 bg-secondery">Reply</button>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
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

  async handleLike(e) {
    e.preventDefault();

    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const icon = btn.querySelector("ion-icon");
    const countSpan = btn.parentNode.querySelector(".like-count");
    const isLiked = btn.classList.contains("text-red-500");

    // Optimistic update
    if (isLiked) {
      btn.classList.remove("text-red-500", "bg-red-100");
      btn.classList.add("bg-slate-200/70");
      icon.setAttribute("name", "heart-outline");
      countSpan.textContent = parseInt(countSpan.textContent) - 1;
    } else {
      btn.classList.add("text-red-500", "bg-red-100");
      btn.classList.remove("bg-slate-200/70");
      icon.setAttribute("name", "heart");
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }

    // Try to sync with backend
    try {
      const method = isLiked ? "DELETE" : "POST";
      await fetch(`/api/posts/${postId}/like`, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nexify_token")}`,
        },
      });
    } catch (apiError) {
      console.warn("Could not sync like with backend");
    }
  }

  async handleShowComments(e) {
    e.preventDefault();

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const postCard = btn.closest("[data-post-id]");
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
      // Try to load from API first
      let comments = [];
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          comments = data.data || [];
        }
      } catch (apiError) {
        // Fallback sample comments
        comments = [
          {
            id: 1,
            username: "Steeve",
            user_avatar: "assets/images/avatars/avatar-2.jpg",
            content: "What a beautiful photo! I love it. 😍",
            created_at: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: 2,
            username: "Monroe",
            user_avatar: "assets/images/avatars/avatar-3.jpg",
            content: "You captured the moment perfectly! 😎",
            created_at: new Date(Date.now() - 900000).toISOString(),
          },
        ];
      }

      const commentsListContainer = postCard.querySelector(".comments-list");

      if (comments.length === 0) {
        commentsListContainer.innerHTML =
          '<p class="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>';
        return;
      }

      commentsListContainer.innerHTML = comments
        .map(
          (comment) => `
                <div class="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="${comment.user_avatar || "assets/images/avatars/avatar-2.jpg"}" alt="" class="w-6 h-6 mt-1 rounded-full"> </a>
                    <div class="flex-1">
                        <a href="timeline.html" class="text-black font-medium inline-block dark:text-white">${comment.username}</a>
                        <p class="mt-0.5">${comment.content}</p>
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
    const postCard = btn.closest("[data-post-id]");
    const postId = postCard.dataset.postId;
    const textarea = postCard.querySelector(".comment-input");
    const content = textarea.value.trim();

    if (!content) return;

    try {
      btn.disabled = true;
      btn.textContent = "Posting...";

      // Add comment to the comments list
      const commentsListContainer = postCard.querySelector(".comments-list");
      const newCommentHTML = `
                <div class="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="${this.currentUser.avatar || "assets/images/avatars/avatar-2.jpg"}" alt="" class="w-6 h-6 mt-1 rounded-full"> </a>
                    <div class="flex-1">
                        <a href="timeline.html" class="text-black font-medium inline-block dark:text-white">${this.currentUser.username || "You"}</a>
                        <p class="mt-0.5">${content}</p>
                    </div>
                </div>
            `;

      if (commentsListContainer.innerHTML.includes("No comments yet")) {
        commentsListContainer.innerHTML = newCommentHTML;
      } else {
        commentsListContainer.insertAdjacentHTML("beforeend", newCommentHTML);
      }

      // Update comment count
      const commentCountSpan = postCard.querySelector(".comment-count");
      commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;

      // Clear textarea
      textarea.value = "";

      this.showToast("Comment posted!", "success");
    } catch (error) {
      console.error("Failed to post comment:", error);
      this.showToast("Failed to post comment", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Reply";
    }
  }

  async handleShare(e) {
    e.preventDefault();

    const btn = e.currentTarget;
    const postId = btn.dataset.postId;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Nexify Post",
          text: "Check out this post on Nexify!",
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
            localStorage.setItem("nexify_token", data.token);
            localStorage.setItem("nexify_user", JSON.stringify(data.user));
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
            username:
              email === "john@example.com" ? "John Michael" : "Jane Smith",
            handle: email === "john@example.com" ? "@john_m" : "@jane_s",
            avatar:
              email === "john@example.com"
                ? "assets/images/avatars/avatar-5.jpg"
                : "assets/images/avatars/avatar-6.jpg",
          };

          localStorage.setItem("nexify_token", "demo-token-" + Date.now());
          localStorage.setItem("nexify_user", JSON.stringify(userData));
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
        this.showToast("Welcome to Nexify!", "success");

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
            Authorization: `Bearer ${localStorage.getItem("nexify_token")}`,
          },
        });
      } catch (apiError) {
        console.warn("Backend logout not available");
      }

      // Clear local storage
      localStorage.removeItem("nexify_token");
      localStorage.removeItem("nexify_user");

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
        post.username.toLowerCase().includes(query.toLowerCase()),
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

    // Hide login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.classList.add("hidden");

    // Update user avatars
    const headerUserAvatar = document.getElementById("headerUserAvatar");
    const dropdownUserAvatar = document.getElementById("dropdownUserAvatar");
    const storyUserAvatar = document.getElementById("storyUserAvatar");

    if (this.currentUser.avatar) {
      if (headerUserAvatar) headerUserAvatar.src = this.currentUser.avatar;
      if (dropdownUserAvatar) dropdownUserAvatar.src = this.currentUser.avatar;
      if (storyUserAvatar) storyUserAvatar.src = this.currentUser.avatar;
    }

    // Update user info in dropdown
    const dropdownUserName = document.getElementById("dropdownUserName");
    const dropdownUserEmail = document.getElementById("dropdownUserEmail");

    if (dropdownUserName)
      dropdownUserName.textContent = this.currentUser.username;
    if (dropdownUserEmail)
      dropdownUserEmail.textContent =
        this.currentUser.handle || this.currentUser.email;
  }

  updateUIForGuestUser() {
    console.log("Updating UI for guest user");

    // Show login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.classList.remove("hidden");

    // Reset avatars to default
    const headerUserAvatar = document.getElementById("headerUserAvatar");
    const dropdownUserAvatar = document.getElementById("dropdownUserAvatar");
    const storyUserAvatar = document.getElementById("storyUserAvatar");

    if (headerUserAvatar)
      headerUserAvatar.src = "assets/images/avatars/avatar-2.jpg";
    if (dropdownUserAvatar)
      dropdownUserAvatar.src = "assets/images/avatars/avatar-2.jpg";
    if (storyUserAvatar)
      storyUserAvatar.src = "assets/images/avatars/avatar-2.jpg";

    // Reset user info
    const dropdownUserName = document.getElementById("dropdownUserName");
    const dropdownUserEmail = document.getElementById("dropdownUserEmail");

    if (dropdownUserName) dropdownUserName.textContent = "Guest User";
    if (dropdownUserEmail) dropdownUserEmail.textContent = "@guest";
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
    toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white`;

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
                    <ion-icon name="close" class="w-4 h-4"></ion-icon>
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
                    <h3 class="text-lg font-medium text-black dark:text-white mb-2">Welcome to Nexify!</h3>
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
                <h3 class="text-lg font-medium text-black dark:text-white mb-2">No posts yet</h3>
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
                    <h3 class="text-lg font-medium text-black dark:text-white mb-2">Error loading posts</h3>
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
  console.log("DOM loaded, initializing Nexify...");
  app = new NexifyApp();
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
