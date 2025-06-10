/**
 * User Management System
 * Simulates user registration with JSON file creation
 */

class UserManager {
  constructor() {
    this.users = this.loadUsers();
    this.initializeEventListeners();
  }

  /**
   * Load existing users from localStorage
   */
  loadUsers() {
    const storedUsers = localStorage.getItem("socialite_users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  /**
   * Save users to localStorage
   */
  saveUsers() {
    localStorage.setItem("socialite_users", JSON.stringify(this.users));
  }

  /**
   * Generate unique user ID
   */
  generateUserId() {
    return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if email already exists
   */
  emailExists(email) {
    return this.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  /**
   * Create user JSON data structure
   */
  createUserData(formData) {
    const currentDate = new Date().toISOString();

    return {
      id: this.generateUserId(),
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email.toLowerCase(),
      },
      account: {
        createdAt: currentDate,
        lastLogin: null,
        isActive: true,
        isVerified: false,
      },
      profile: {
        username: this.generateUsername(formData.firstName, formData.lastName),
        bio: "",
        profilePicture: "assets/images/avatars/default-avatar.png",
        coverPhoto: "",
        location: "",
        website: "",
        birthDate: null,
      },
      privacy: {
        profileVisibility: "public",
        allowMessages: true,
        allowFriendRequests: true,
        showEmail: false,
        showPhoneNumber: false,
      },
      social: {
        friends: [],
        followers: [],
        following: [],
        posts: [],
        groups: [],
        pages: [],
      },
      preferences: {
        theme: "light",
        language: "en",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      statistics: {
        totalPosts: 0,
        totalFriends: 0,
        totalFollowers: 0,
        totalFollowing: 0,
        profileViews: 0,
      },
    };
  }

  /**
   * Generate username from first and last name
   */
  generateUsername(firstName, lastName) {
    const baseUsername = (firstName + lastName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (this.users.some((user) => user.profile.username === username)) {
      username = baseUsername + counter;
      counter++;
    }

    return username;
  }

  /**
   * Register new user
   */
  registerUser(formData) {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      throw new Error("All fields are required");
    }

    if (!this.isValidEmail(formData.email)) {
      throw new Error("Please enter a valid email address");
    }

    if (this.emailExists(formData.email)) {
      throw new Error("An account with this email already exists");
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create user data
    const userData = this.createUserData(formData);

    // Add to users array
    this.users.push(userData);

    // Save to localStorage
    this.saveUsers();

    // Simulate JSON file creation
    this.simulateJsonFileCreation(userData);

    return userData;
  }

  /**
   * Simulate JSON file creation and show to user
   */
  simulateJsonFileCreation(userData) {
    // Create a clean copy without sensitive data for display
    const publicUserData = { ...userData };

    // Create JSON string with nice formatting
    const jsonString = JSON.stringify(publicUserData, null, 2);

    // Create a downloadable file
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Show success modal with JSON preview
    this.showRegistrationSuccess(userData, jsonString, url);
  }

  /**
   * Show registration success modal
   */
  showRegistrationSuccess(userData, jsonString, downloadUrl) {
    // Create modal HTML
    const modalHTML = `
            <div id="registration-success-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-green-600">Account Created Successfully! 🎉</h3>
                        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                            <p class="text-green-800 dark:text-green-200">
                                Welcome, <strong>${userData.personalInfo.fullName}</strong>! Your account has been created.
                            </p>
                            <p class="text-sm text-green-600 dark:text-green-300 mt-1">
                                Username: <strong>@${userData.profile.username}</strong>
                            </p>
                        </div>
                        
                        <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                            <p class="text-blue-800 dark:text-blue-200 font-medium mb-2">
                                📄 JSON User Data File Created:
                            </p>
                            <div class="flex gap-2">
                                <button id="view-json" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                    View JSON Data
                                </button>
                                <a href="${downloadUrl}" download="user_${userData.id}.json" 
                                   class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 inline-block">
                                    Download JSON File
                                </a>
                            </div>
                        </div>
                        
                        <div id="json-preview" class="hidden">
                            <h4 class="font-medium mb-2">JSON File Contents:</h4>
                            <pre class="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-auto max-h-40 text-gray-800 dark:text-gray-200">${jsonString}</pre>
                        </div>
                        
                        <div class="flex gap-2 pt-4">
                            <button id="continue-to-feed" class="bg-primary text-white px-4 py-2 rounded hover:opacity-90 flex-1">
                                Continue to Feed
                            </button>
                            <button id="view-all-users" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                View All Users (${this.users.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners
    document
      .getElementById("close-modal")
      .addEventListener("click", this.closeModal);
    document
      .getElementById("view-json")
      .addEventListener("click", this.toggleJsonPreview);
    document
      .getElementById("continue-to-feed")
      .addEventListener("click", () => {
        this.closeModal();
        window.location.href = "feed.html";
      });
    document.getElementById("view-all-users").addEventListener("click", () => {
      this.closeModal();
      this.showAllUsers();
    });
  }

  /**
   * Toggle JSON preview visibility
   */
  toggleJsonPreview() {
    const preview = document.getElementById("json-preview");
    const button = document.getElementById("view-json");

    if (preview.classList.contains("hidden")) {
      preview.classList.remove("hidden");
      button.textContent = "Hide JSON Data";
    } else {
      preview.classList.add("hidden");
      button.textContent = "View JSON Data";
    }
  }

  /**
   * Close modal
   */
  closeModal() {
    const modal = document.getElementById("registration-success-modal");
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Show all registered users
   */
  showAllUsers() {
    const usersData = this.users.map((user) => ({
      id: user.id,
      name: user.personalInfo.fullName,
      username: user.profile.username,
      email: user.personalInfo.email,
      createdAt: user.account.createdAt,
    }));

    const modalHTML = `
            <div id="all-users-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-hidden">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">All Registered Users (${this.users.length})</h3>
                        <button id="close-users-modal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="overflow-auto max-h-64">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th class="px-3 py-2 text-left">Name</th>
                                    <th class="px-3 py-2 text-left">Username</th>
                                    <th class="px-3 py-2 text-left">Email</th>
                                    <th class="px-3 py-2 text-left">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${usersData
                                  .map(
                                    (user) => `
                                    <tr class="border-b dark:border-gray-600">
                                        <td class="px-3 py-2">${user.name}</td>
                                        <td class="px-3 py-2">@${user.username}</td>
                                        <td class="px-3 py-2">${user.email}</td>
                                        <td class="px-3 py-2">${new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="mt-4 flex gap-2">
                        <button id="download-all-users" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Download All Users JSON
                        </button>
                        <button id="clear-all-users" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Clear All Users
                        </button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document
      .getElementById("close-users-modal")
      .addEventListener("click", () => {
        document.getElementById("all-users-modal").remove();
      });

    document
      .getElementById("download-all-users")
      .addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(this.users, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "all_users.json";
        a.click();
      });

    document.getElementById("clear-all-users").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all user data?")) {
        this.users = [];
        this.saveUsers();
        document.getElementById("all-users-modal").remove();
        alert("All user data has been cleared!");
      }
    });
  }

  /**
   * Initialize event listeners for registration form
   */
  initializeEventListeners() {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", () => {
      const registerForm = document.querySelector('form[action="#"]');
      if (registerForm && window.location.pathname.includes("form-register")) {
        this.setupRegistrationForm(registerForm);
      }
    });

    // If DOM is already loaded
    if (document.readyState === "loading") {
      return; // Event listener above will handle it
    } else {
      const registerForm = document.querySelector('form[action="#"]');
      if (registerForm && window.location.pathname.includes("form-register")) {
        this.setupRegistrationForm(registerForm);
      }
    }
  }

  /**
   * Setup registration form handling
   */
  setupRegistrationForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const userData = {
        firstName:
          formData.get("firstName") ||
          form.querySelector('input[placeholder="First name"]').value,
        lastName:
          formData.get("lastName") ||
          form.querySelector('input[placeholder="Last name"]').value,
        email:
          formData.get("email") ||
          form.querySelector('input[type="email"]').value,
        password:
          formData.get("password") ||
          form.querySelector('input[type="password"]').value,
        confirmPassword: form.querySelectorAll('input[type="password"]')[1]
          .value,
        acceptTerms: form.querySelector("#accept-terms").checked,
      };

      // Check terms acceptance
      if (!userData.acceptTerms) {
        this.showError("Please accept the terms of use to continue");
        return;
      }

      try {
        const newUser = this.registerUser(userData);
        console.log("User registered successfully:", newUser);
      } catch (error) {
        this.showError(error.message);
      }
    });
  }

  /**
   * Show error message
   */
  showError(message) {
    // Remove existing error
    const existingError = document.getElementById("registration-error");
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const errorHTML = `
            <div id="registration-error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
                ${message}
            </div>
        `;

    // Insert before form
    const form = document.querySelector('form[action="#"]');
    form.insertAdjacentHTML("beforebegin", errorHTML);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const error = document.getElementById("registration-error");
      if (error) error.remove();
    }, 5000);
  }
}

// Initialize user manager
const userManager = new UserManager();

// Export for other modules
window.UserManager = UserManager;
