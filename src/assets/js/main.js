// Nexify Main JavaScript - Fixed responsive and interactive version
class NexifyApp {
  constructor() {
    this.currentUser = null;
    this.posts = [];
    this.currentPage = 1;
    this.postsPerPage = 10;
    this.isLoading = false;
    this.isMobile = window.innerWidth < 768;

    // Initialize app immediately but don't hide content
    this.initializeApp();

    // Show content immediately to prevent blank screen
    this.showContent();
  }

  showContent() {
    // Always show content, don't hide it
    const spinner = document.getElementById("loadingSpinner");
    const wrapper = document.getElementById("wrapper");

    if (spinner) spinner.style.display = "none";
    if (wrapper) {
      wrapper.classList.remove("hidden");
      wrapper.style.display = "block";
    }
  }

  async initializeApp() {
    try {
      console.log("Initializing Nexify app...");

      // Check authentication status
      await this.checkAuthStatus();

      // Initialize UI components
      this.initializeUI();

      // Initialize responsive features
      this.initializeResponsive();

      // Load sample stories
      this.loadStories();

      // Load initial posts
      await this.loadPosts();

      // Initialize mobile interactions
      this.initializeMobileFeatures();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.showToast("App loaded with limited functionality", "warning");
    }
  }

  initializeResponsive() {
    // Handle window resize
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 768;
      this.updateMobileUI();
    });

    // Initialize responsive sidebar
    this.initializeSidebar();

    // Fix mobile navigation
    this.fixMobileNavigation();
  }

  initializeSidebar() {
    const sidebarToggle = document.querySelector(
      '[uk-toggle="target: #site__sidebar"]',
    );
    const sidebar = document.getElementById("site__sidebar");
    const overlay = document.getElementById("site__sidebar__overly");

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isHidden = sidebar.classList.contains("-translate-x-full");

        if (isHidden) {
          // Show sidebar
          sidebar.classList.remove("-translate-x-full");
          sidebar.classList.add("translate-x-0");
          if (overlay) overlay.style.display = "block";
        } else {
          // Hide sidebar
          sidebar.classList.add("-translate-x-full");
          sidebar.classList.remove("translate-x-0");
          if (overlay) overlay.style.display = "none";
        }
      });
    }

    // Close sidebar when clicking overlay
    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0");
        overlay.style.display = "none";
      });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMobile &&
        sidebar &&
        !sidebar.contains(e.target) &&
        !sidebarToggle?.contains(e.target)
      ) {
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0");
        if (overlay) overlay.style.display = "none";
      }
    });
  }

  fixMobileNavigation() {
    // Ensure mobile search works
    const searchBox = document.getElementById("search--box");
    if (searchBox && this.isMobile) {
      searchBox.style.position = "fixed";
      searchBox.style.top = "0.5rem";
      searchBox.style.left = "0";
      searchBox.style.right = "0";
      searchBox.style.zIndex = "20";
    }
  }

  initializeMobileFeatures() {
    // Add touch interactions for mobile
    this.addTouchInteractions();

    // Fix mobile dropdowns
    this.fixMobileDropdowns();

    // Add swipe gestures
    this.addSwipeGestures();
  }

  addTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll(
      'button, .cursor-pointer, [role="button"]',
    );
    buttons.forEach((button) => {
      button.addEventListener("touchstart", () => {
        button.style.transform = "scale(0.95)";
      });

      button.addEventListener("touchend", () => {
        button.style.transform = "scale(1)";
      });
    });
  }

  fixMobileDropdowns() {
    // Ensure dropdowns work on mobile
    const dropdownTriggers = document.querySelectorAll("[uk-drop]");
    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("touchend", (e) => {
        e.preventDefault();
        // Toggle dropdown visibility
        const dropdown = trigger.nextElementSibling;
        if (dropdown) {
          dropdown.classList.toggle("hidden");
        }
      });
    });
  }

  addSwipeGestures() {
    let startX = 0;
    let startY = 0;

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener("touchmove", (e) => {
      if (!startX || !startY) return;

      const xDiff = startX - e.touches[0].clientX;
      const yDiff = startY - e.touches[0].clientY;

      // Swipe right to open sidebar
      if (Math.abs(xDiff) > Math.abs(yDiff) && xDiff < -50 && startX < 50) {
        const sidebar = document.getElementById("site__sidebar");
        if (sidebar && this.isMobile) {
          sidebar.classList.remove("-translate-x-full");
          sidebar.classList.add("translate-x-0");
        }
      }

      // Swipe left to close sidebar
      if (Math.abs(xDiff) > Math.abs(yDiff) && xDiff > 50) {
        const sidebar = document.getElementById("site__sidebar");
        if (sidebar && this.isMobile) {
          sidebar.classList.add("-translate-x-full");
          sidebar.classList.remove("translate-x-0");
        }
      }

      startX = 0;
      startY = 0;
    });
  }

  updateMobileUI() {
    const searchBox = document.getElementById("search--box");

    if (this.isMobile) {
      // Mobile layout adjustments
      if (searchBox) {
        searchBox.classList.add("max-md:hidden");
      }
    } else {
      // Desktop layout
      if (searchBox) {
        searchBox.classList.remove("max-md:hidden");
      }
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

    // Initialize all interactive elements
    this.initializeInteractiveElements();
  }

  initializeInteractiveElements() {
    // Make all buttons interactive
    this.makeButtonsInteractive();

    // Initialize create post modal
    this.initializeCreatePostModal();

    // Initialize notification system
    this.initializeNotifications();

    // Initialize user dropdown
    this.initializeUserDropdown();
  }

  makeButtonsInteractive() {
    // Create post triggers
    const createTriggers = document.querySelectorAll(
      '[uk-toggle*="create-status"], .create-post-trigger',
    );
    createTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        if (!this.currentUser) {
          this.showLoginModal();
        } else {
          this.showCreatePostModal();
        }
      });
    });

    // Notification button
    const notificationBtn = document.getElementById("notificationBtn");
    if (notificationBtn) {
      notificationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleNotifications();
      });
    }

    // Messages button
    const messagesBtn = document.getElementById("messagesBtn");
    if (messagesBtn) {
      messagesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showToast("Messages feature coming soon!", "info");
      });
    }

    // All follow buttons
    const followButtons = document.querySelectorAll(
      '.button:contains("follow"), .button:contains("Follow")',
    );
    followButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFollow(btn);
      });
    });
  }

  initializeCreatePostModal() {
    // Create the create post modal dynamically
    if (!document.getElementById("create-post-modal")) {
      const modalHTML = `
                <div id="create-post-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
                    <div class="bg-white dark:bg-dark2 rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-xl font-bold text-black dark:text-white">Create Post</h2>
                                <button id="closeCreateModal" class="text-gray-400 hover:text-gray-600">
                                    <ion-icon name="close" class="w-6 h-6"></ion-icon>
                                </button>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="flex items-start gap-3">
                                    <img id="createModalAvatar" src="assets/images/avatars/avatar-2.jpg" alt="Your avatar" class="w-10 h-10 rounded-full object-cover">
                                    <div class="flex-1">
                                        <textarea id="createPostContent" placeholder="What's on your mind?" 
                                                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                rows="3"></textarea>
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <button type="button" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500">
                                            <ion-icon name="image-outline"></ion-icon>
                                            Photo
                                        </button>
                                        <button type="button" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500">
                                            <ion-icon name="videocam-outline"></ion-icon>
                                            Video
                                        </button>
                                    </div>
                                    <button id="submitCreatePost" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    // Initialize modal interactions
    const modal = document.getElementById("create-post-modal");
    const closeBtn = document.getElementById("closeCreateModal");
    const content = document.getElementById("createPostContent");
    const submitBtn = document.getElementById("submitCreatePost");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hideCreatePostModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideCreatePostModal();
        }
      });
    }

    if (content && submitBtn) {
      content.addEventListener("input", () => {
        const hasContent = content.value.trim().length > 0;
        submitBtn.disabled = !hasContent;
      });

      submitBtn.addEventListener("click", () => this.handleCreatePost());
    }
  }

  showCreatePostModal() {
    const modal = document.getElementById("create-post-modal");
    const avatar = document.getElementById("createModalAvatar");

    if (modal) {
      modal.classList.remove("hidden");
      if (avatar && this.currentUser?.avatar) {
        avatar.src = this.currentUser.avatar;
      }
      document.getElementById("createPostContent")?.focus();
    }
  }

  hideCreatePostModal() {
    const modal = document.getElementById("create-post-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.getElementById("createPostContent").value = "";
      document.getElementById("submitCreatePost").disabled = true;
    }
  }

  initializeNotifications() {
    // Load sample notifications
    this.loadSampleNotifications();
  }

  loadSampleNotifications() {
    const notificationsList = document.getElementById("notificationsList");
    if (!notificationsList) return;

    const sampleNotifications = [
      {
        id: 1,
        user: "Alexa Gray",
        avatar: "assets/images/avatars/avatar-3.jpg",
        message: "started following you. Welcome them to your profile. 👋",
        time: "4 hours ago",
        unread: true,
      },
      {
        id: 2,
        user: "Jesse Steeve",
        avatar: "assets/images/avatars/avatar-7.jpg",
        message: "mentioned you in a story. Check it out and reply. 📣",
        time: "8 hours ago",
        unread: false,
      },
      {
        id: 3,
        user: "Alexa stella",
        avatar: "assets/images/avatars/avatar-6.jpg",
        message: 'commented on your photo "Wow, stunning shot!" 💬',
        time: "8 hours ago",
        unread: false,
      },
    ];

    notificationsList.innerHTML = `
            <div class="pl-2 p-1 text-sm font-normal dark:text-white">
                ${sampleNotifications
                  .map(
                    (notification) => `
                    <a href="#" class="relative flex items-center gap-3 p-2 duration-200 rounded-xl pr-10 hover:bg-secondery dark:hover:bg-white/10 ${notification.unread ? "bg-teal-500/5" : ""}">
                        <div class="relative w-12 h-12 shrink-0"> 
                            <img src="${notification.avatar}" alt="" class="object-cover w-full h-full rounded-full">
                        </div>
                        <div class="flex-1">
                            <p> <b class="font-bold mr-1">${notification.user}</b> ${notification.message} </p>
                            <div class="text-xs text-gray-500 mt-1.5 dark:text-white/80">${notification.time}</div>
                            ${notification.unread ? '<div class="w-2.5 h-2.5 bg-teal-600 rounded-full absolute right-3 top-5"></div>' : ""}
                        </div>
                    </a>
                `,
                  )
                  .join("")}
            </div>
        `;

    // Update notification badge
    const badge = document.getElementById("notificationBadge");
    const unreadCount = sampleNotifications.filter((n) => n.unread).length;
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  }

  toggleNotifications() {
    const dropdown = document.querySelector('[uk-drop*="notifications"]');
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  }

  initializeUserDropdown() {
    const userAvatar = document.getElementById("headerUserAvatar");
    const dropdown = userAvatar
      ?.closest(".relative")
      ?.querySelector("[uk-drop]");

    if (userAvatar) {
      userAvatar.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown) {
          dropdown.classList.toggle("hidden");
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        !userAvatar?.contains(e.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  }

  initializeHeader() {
    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.showLoginModal());
    }
  }

  initializePostCreation() {
    // Handle "What do you have in mind?" click
    const postTrigger = document.querySelector(".bg-slate-100");
    if (postTrigger) {
      postTrigger.addEventListener("click", () => {
        if (!this.currentUser) {
          this.showLoginModal();
        } else {
          this.showCreatePostModal();
        }
      });
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
            <li class="md:pr-3 pr-2 hover:scale-[1.15] hover:-rotate-2 duration-300 cursor-pointer">
                <div class="story-item" data-story-id="${story.id}">
                    <div class="md:w-16 md:h-16 w-12 h-12 relative md:border-4 border-2 shadow border-white rounded-full overflow-hidden dark:border-slate-700">
                        <img src="${story.avatar}" alt="${story.username}" class="absolute w-full h-full object-cover">
                    </div>
                </div>
            </li>
        `,
      )
      .join("");

    // Add story interactions
    document.querySelectorAll(".story-item").forEach((story) => {
      story.addEventListener("click", () => {
        this.showToast(`Viewing ${story.dataset.storyId}'s story`, "info");
      });
    });
  }

  async loadPosts(page = 1) {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      // Get sample posts
      const posts = this.getSamplePosts();

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
        created_at: new Date(Date.now() - 7200000).toISOString(),
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
          "Photography is the art of capturing light with a camera. It can be used to create images that tell stories, express emotions, or document reality. It can be fun, challenging, or rewarding. It can also be a hobby, a profession, or a passion. 📷",
        created_at: new Date(Date.now() - 14400000).toISOString(),
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
        created_at: new Date(Date.now() - 21600000).toISOString(),
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
                <div class="relative w-full lg:h-96 h-full sm:px-4 cursor-pointer" onclick="app.openImagePreview('${post.image_url}')">
                    <img src="${post.image_url}" alt="" class="sm:rounded-lg w-full h-full object-cover">
                </div>
            `;
    } else if (post.post_type === "gallery" && post.images) {
      mediaContent = `
                <div class="relative sm:px-4">
                    <div class="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                        ${post.images
                          .map(
                            (img, index) => `
                            <img src="${img}" alt="" class="w-full h-48 object-cover cursor-pointer" onclick="app.openImagePreview('${img}')">
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `;
    }

    return `
            <div class="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2 post-card" data-post-id="${post.id}">
                <!-- post heading -->
                <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                    <div class="cursor-pointer"> 
                        <img src="${userAvatar}" alt="${post.username}" class="w-9 h-9 rounded-full"> 
                    </div>  
                    <div class="flex-1">
                        <h4 class="text-black dark:text-white cursor-pointer hover:underline">${post.username}</h4>
                        <div class="text-xs text-gray-500 dark:text-white/80">${timeAgo}</div>
                    </div>

                    <div class="-mr-1">
                        <button type="button" class="button-icon w-8 h-8 post-menu-btn" data-post-id="${post.id}"> 
                            <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon> 
                        </button>
                    </div>
                </div>
                
                ${
                  post.content
                    ? `
                <div class="sm:px-4 p-2.5 pt-0">
                    <p class="font-normal text-black dark:text-white">${post.content}</p>
                </div>
                `
                    : ""
                }
                
                ${mediaContent}

                <!-- post icons -->
                <div class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                    <div>
                        <div class="flex items-center gap-2.5">
                            <button type="button" class="like-btn button-icon ${post.is_liked ? "text-red-500 bg-red-100" : "text-gray-500 bg-slate-200/70"} dark:bg-slate-700 transition-all duration-200" data-post-id="${post.id}"> 
                                <ion-icon class="text-lg" name="${post.is_liked ? "heart" : "heart-outline"}"></ion-icon> 
                            </button>
                            <span class="like-count cursor-pointer hover:underline">${post.likes_count}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" class="comment-btn button-icon bg-slate-200/70 dark:bg-slate-700 text-gray-500 hover:text-blue-500 transition-colors" data-post-id="${post.id}"> 
                            <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> 
                        </button>
                        <span class="comment-count cursor-pointer hover:underline">${post.comments_count}</span>
                    </div>
                    <button type="button" class="share-btn button-icon ml-auto text-gray-500 hover:text-green-500 transition-colors" data-post-id="${post.id}"> 
                        <ion-icon class="text-xl" name="paper-plane-outline"></ion-icon> 
                    </button>
                    <button type="button" class="button-icon text-gray-500 hover:text-blue-500 transition-colors"> 
                        <ion-icon class="text-xl" name="bookmark-outline"></ion-icon> 
                    </button>
                </div>

                <!-- comments section -->
                <div class="comments-section hidden">
                    <div class="comments-list sm:px-4 px-2.5"></div>
                    ${
                      this.currentUser
                        ? `
                    <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                        <img src="${this.currentUser.avatar || "assets/images/avatars/avatar-2.jpg"}" alt="" class="w-6 h-6 rounded-full">
                        <div class="flex-1 relative overflow-hidden h-10">
                            <textarea placeholder="Add Comment...." rows="1" class="comment-input w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent border border-gray-200 rounded-lg dark:border-gray-600"></textarea>
                        </div>
                        <button type="submit" class="submit-comment-btn text-sm rounded-full py-1.5 px-3.5 bg-blue-500 text-white hover:bg-blue-600 transition-colors">Reply</button>
                    </div>
                    `
                        : `
                    <div class="sm:px-4 p-2.5 text-center text-gray-500">
                        <button onclick="app.showLoginModal()" class="text-blue-500 hover:underline">Login to comment</button>
                    </div>
                    `
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

    // Post menu buttons
    document.querySelectorAll(".post-menu-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.showPostMenu(e));
    });
  }

  showPostMenu(e) {
    e.preventDefault();
    const postId = e.currentTarget.dataset.postId;
    this.showToast(`Post menu for post ${postId}`, "info");
  }

  openImagePreview(imageUrl) {
    // Create image preview modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center";
    modal.innerHTML = `
            <div class="relative max-w-4xl max-h-full p-4">
                <button class="absolute top-2 right-2 text-white text-2xl z-10" onclick="this.closest('.fixed').remove()">
                    <ion-icon name="close"></ion-icon>
                </button>
                <img src="${imageUrl}" alt="" class="max-w-full max-h-full object-contain rounded-lg">
            </div>
        `;

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
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

    // Add animation
    btn.style.transform = "scale(1.2)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 150);

    // Optimistic update
    if (isLiked) {
      btn.classList.remove("text-red-500", "bg-red-100");
      btn.classList.add("text-gray-500", "bg-slate-200/70");
      icon.setAttribute("name", "heart-outline");
      countSpan.textContent = parseInt(countSpan.textContent) - 1;
    } else {
      btn.classList.add("text-red-500", "bg-red-100");
      btn.classList.remove("text-gray-500", "bg-slate-200/70");
      icon.setAttribute("name", "heart");
      countSpan.textContent = parseInt(countSpan.textContent) + 1;

      // Heart animation
      const heart = document.createElement("div");
      heart.innerHTML = "❤️";
      heart.className = "absolute text-2xl animate-bounce pointer-events-none";
      heart.style.left = "50%";
      heart.style.top = "50%";
      heart.style.transform = "translate(-50%, -50%)";
      btn.style.position = "relative";
      btn.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
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
    const commentsListContainer = postCard.querySelector(".comments-list");

    // Sample comments
    const comments = [
      {
        id: 1,
        username: "Steeve Martin",
        user_avatar: "assets/images/avatars/avatar-2.jpg",
        content: "What a beautiful photo! I love it. 😍",
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 2,
        username: "Monroe Parker",
        user_avatar: "assets/images/avatars/avatar-3.jpg",
        content: "You captured the moment perfectly! 😎",
        created_at: new Date(Date.now() - 900000).toISOString(),
      },
    ];

    if (comments.length === 0) {
      commentsListContainer.innerHTML =
        '<p class="text-gray-500 dark:text-gray-400 text-sm py-4">No comments yet.</p>';
      return;
    }

    commentsListContainer.innerHTML = `
            <div class="space-y-3 py-4">
                ${comments
                  .map(
                    (comment) => `
                    <div class="flex items-start gap-3 relative">
                        <img src="${comment.user_avatar}" alt="" class="w-6 h-6 mt-1 rounded-full"> 
                        <div class="flex-1">
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <h5 class="text-black font-medium dark:text-white text-sm">${comment.username}</h5>
                                <p class="mt-0.5 text-gray-800 dark:text-gray-200">${comment.content}</p>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">${this.getTimeAgo(comment.created_at)}</div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;
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
                <div class="flex items-start gap-3 relative animate-fadeIn">
                    <img src="${this.currentUser.avatar || "assets/images/avatars/avatar-2.jpg"}" alt="" class="w-6 h-6 mt-1 rounded-full"> 
                    <div class="flex-1">
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                            <h5 class="text-black font-medium dark:text-white text-sm">${this.currentUser.username || "You"}</h5>
                            <p class="mt-0.5 text-gray-800 dark:text-gray-200">${content}</p>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">Just now</div>
                    </div>
                </div>
            `;

      if (commentsListContainer.innerHTML.includes("No comments yet")) {
        commentsListContainer.innerHTML = `<div class="space-y-3 py-4">${newCommentHTML}</div>`;
      } else {
        const commentsSpace = commentsListContainer.querySelector(".space-y-3");
        if (commentsSpace) {
          commentsSpace.insertAdjacentHTML("beforeend", newCommentHTML);
        }
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

    // Add animation
    btn.style.transform = "scale(1.1)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 150);

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
      this.showToast("Share feature coming soon!", "info");
    }
  }

  async handleCreatePost() {
    const content = document.getElementById("createPostContent").value.trim();
    if (!content) return;

    try {
      const submitBtn = document.getElementById("submitCreatePost");
      submitBtn.disabled = true;
      submitBtn.textContent = "Posting...";

      // Create new post
      const newPost = {
        id: Date.now(),
        username: this.currentUser.username,
        user_handle: this.currentUser.handle || "@user",
        user_avatar:
          this.currentUser.avatar || "assets/images/avatars/avatar-2.jpg",
        content: content,
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        post_type: "text",
      };

      // Add new post to the beginning
      this.posts.unshift(newPost);
      this.renderPosts();

      // Hide modal
      this.hideCreatePostModal();

      this.showToast("Post created successfully!", "success");
    } catch (error) {
      console.error("Failed to create post:", error);
      this.showToast("Failed to create post", "error");
    } finally {
      const submitBtn = document.getElementById("submitCreatePost");
      submitBtn.disabled = false;
      submitBtn.textContent = "Post";
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

    if (!email || !password) {
      this.showError(errorDiv, "Please enter both email and password");
      return;
    }

    try {
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      spinner.classList.remove("hidden");
      errorDiv.classList.add("hidden");

      let loginSuccess = false;
      let userData = null;

      // Demo authentication
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

      if (loginSuccess) {
        this.currentUser = userData;
        this.hideLoginModal();
        this.updateUIForAuthenticatedUser();
        this.showToast("Welcome to Nexify! 🎉", "success");

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
      localStorage.removeItem("nexify_token");
      localStorage.removeItem("nexify_user");

      this.currentUser = null;
      this.updateUIForGuestUser();
      this.showToast("Logged out successfully", "info");

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

    const filteredPosts = this.posts.filter(
      (post) =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase()),
    );

    const container = document.getElementById("postsContainer");
    if (container) {
      if (filteredPosts.length === 0) {
        container.innerHTML = `
                    <div class="text-center py-12">
                        <ion-icon name="search-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4"></ion-icon>
                        <h3 class="text-lg font-medium text-black dark:text-white mb-2">No results found</h3>
                        <p class="text-gray-600 dark:text-gray-400">Try searching for something else</p>
                    </div>
                `;
      } else {
        container.innerHTML = filteredPosts
          .map((post) => this.createPostHTML(post))
          .join("");
        this.attachPostEventListeners();
      }
    }
  }

  handleFollow(btn) {
    if (!this.currentUser) {
      this.showLoginModal();
      return;
    }

    const isFollowing = btn.textContent.toLowerCase().includes("following");

    if (isFollowing) {
      btn.textContent = "Follow";
      btn.classList.remove("bg-gray-200");
      btn.classList.add("bg-primary-soft");
      this.showToast("Unfollowed successfully", "info");
    } else {
      btn.textContent = "Following";
      btn.classList.add("bg-gray-200");
      btn.classList.remove("bg-primary-soft");
      this.showToast("Following successfully", "success");
    }
  }

  updateUIForAuthenticatedUser() {
    console.log(
      "Updating UI for authenticated user:",
      this.currentUser.username,
    );

    // Hide login button, show user elements
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.style.display = "none";

    // Update avatars
    const avatars = [
      "headerUserAvatar",
      "dropdownUserAvatar",
      "storyUserAvatar",
    ];

    avatars.forEach((id) => {
      const element = document.getElementById(id);
      if (element && this.currentUser.avatar) {
        element.src = this.currentUser.avatar;
      }
    });

    // Update user info
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
    if (loginBtn) loginBtn.style.display = "block";

    // Reset avatars
    const avatars = [
      "headerUserAvatar",
      "dropdownUserAvatar",
      "storyUserAvatar",
    ];

    avatars.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.src = "assets/images/avatars/avatar-2.jpg";
      }
    });

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
      document.getElementById("email")?.focus();
    }
  }

  hideLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.add("hidden");
      document.getElementById("loginForm")?.reset();
      document.getElementById("loginError")?.classList.add("hidden");
    }
  }

  toggleLoadMoreButton(hasMore) {
    const container = document.getElementById("loadMoreContainer");
    if (container) {
      container.style.display = hasMore ? "block" : "none";
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
    toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg text-white transform transition-transform duration-300 translate-x-full`;

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

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 100);

    toast.querySelector(".close-toast").addEventListener("click", () => {
      toast.classList.add("translate-x-full");
      setTimeout(() => toast.remove(), 300);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add("translate-x-full");
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  getEmptyState() {
    if (!this.currentUser) {
      return `
                <div class="text-center py-12">
                    <ion-icon name="person-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4"></ion-icon>
                    <h3 class="text-lg font-medium text-black dark:text-white mb-2">Welcome to Nexify!</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Please log in to see posts and start sharing.</p>
                    <button onclick="app.showLoginModal()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
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
                    <button onclick="location.reload()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
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
