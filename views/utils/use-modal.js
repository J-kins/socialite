/**
 * Modal Utility
 * Manages modal dialogs and overlays
 */

const useModal = {
  // Stack to track open modals
  openModals: [],

  // Create and show modal
  show(content, options = {}) {
    const {
      id = `modal-${Date.now()}`,
      className = "",
      backdrop = true,
      keyboard = true,
      focus = true,
      size = "md",
      animation = "fade",
      onShow = null,
      onHide = null,
      onShown = null,
      onHidden = null,
    } = options;

    // Create modal structure
    const modal = this.create(id, content, {
      className,
      backdrop,
      keyboard,
      focus,
      size,
      animation,
    });

    // Add to DOM
    document.body.appendChild(modal);

    // Trigger show event
    if (onShow) onShow(modal);

    // Add to stack
    this.openModals.push({
      id,
      element: modal,
      options,
      onHide,
      onHidden,
    });

    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add("show");
      if (focus) {
        this.trapFocus(modal);
      }
      if (onShown) {
        setTimeout(() => onShown(modal), 150);
      }
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return {
      id,
      element: modal,
      hide: () => this.hide(id),
      update: (newContent) => this.update(id, newContent),
    };
  },

  // Hide modal
  hide(id) {
    const modalData = this.openModals.find((m) => m.id === id);
    if (!modalData) return;

    const { element, onHide, onHidden } = modalData;

    // Trigger hide event
    if (onHide) onHide(element);

    // Remove show class for animation
    element.classList.remove("show");

    // Remove from DOM after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Remove from stack
      this.openModals = this.openModals.filter((m) => m.id !== id);

      // Restore body scroll if no modals open
      if (this.openModals.length === 0) {
        document.body.style.overflow = "";
      }

      // Trigger hidden event
      if (onHidden) onHidden(element);
    }, 150);
  },

  // Hide all modals
  hideAll() {
    [...this.openModals].forEach((modalData) => {
      this.hide(modalData.id);
    });
  },

  // Update modal content
  update(id, content) {
    const modalData = this.openModals.find((m) => m.id === id);
    if (!modalData) return;

    const contentElement = modalData.element.querySelector(".modal-content");
    if (contentElement) {
      contentElement.innerHTML = content;
    }
  },

  // Create modal element
  create(id, content, options) {
    const {
      className = "",
      backdrop = true,
      keyboard = true,
      size = "md",
      animation = "fade",
    } = options;

    // Size classes
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      full: "max-w-full mx-4",
    };

    // Animation classes
    const animationClasses = {
      fade: "modal-fade",
      slide: "modal-slide",
      zoom: "modal-zoom",
    };

    const modal = document.createElement("div");
    modal.id = id;
    modal.className = `modal fixed inset-0 z-50 flex items-center justify-center p-4 ${animationClasses[animation] || "modal-fade"} ${className}`;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("tabindex", "-1");

    modal.innerHTML = `
            ${backdrop ? '<div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50"></div>' : ""}
            <div class="modal-dialog relative w-full ${sizeClasses[size] || sizeClasses.md} mx-auto">
                <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                    ${content}
                </div>
            </div>
        `;

    // Add event listeners
    if (backdrop) {
      const backdropElement = modal.querySelector(".modal-backdrop");
      backdropElement.addEventListener("click", () => {
        this.hide(id);
      });
    }

    if (keyboard) {
      modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.hide(id);
        }
      });
    }

    // Prevent modal content clicks from closing modal
    const modalContent = modal.querySelector(".modal-content");
    modalContent.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    return modal;
  },

  // Trap focus within modal
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    // Handle tab key
    const handleTab = (event) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
  },

  // Confirm dialog
  confirm(message, options = {}) {
    const {
      title = "Confirm",
      confirmText = "Confirm",
      cancelText = "Cancel",
      confirmVariant = "primary",
      cancelVariant = "secondary",
    } = options;

    return new Promise((resolve) => {
      const content = `
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">${title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                                class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
                            ${cancelText}
                        </button>
                        <button type="button" 
                                class="confirm-btn px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

      const modal = this.show(content, {
        size: "sm",
        backdrop: true,
        keyboard: true,
      });

      // Add button handlers
      const confirmBtn = modal.element.querySelector(".confirm-btn");
      const cancelBtn = modal.element.querySelector(".cancel-btn");

      confirmBtn.addEventListener("click", () => {
        modal.hide();
        resolve(true);
      });

      cancelBtn.addEventListener("click", () => {
        modal.hide();
        resolve(false);
      });
    });
  },

  // Alert dialog
  alert(message, options = {}) {
    const { title = "Alert", buttonText = "OK" } = options;

    return new Promise((resolve) => {
      const content = `
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">${title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
                    <div class="flex justify-end">
                        <button type="button" 
                                class="ok-btn px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            `;

      const modal = this.show(content, {
        size: "sm",
        backdrop: true,
        keyboard: true,
      });

      // Add button handler
      const okBtn = modal.element.querySelector(".ok-btn");
      okBtn.addEventListener("click", () => {
        modal.hide();
        resolve();
      });
    });
  },
};

// CSS for modal animations
const modalCSS = `
    .modal {
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.15s ease-out;
    }

    .modal.show {
        opacity: 1;
        transform: scale(1);
    }

    .modal-fade {
        transition: opacity 0.15s ease-out;
    }

    .modal-slide .modal-dialog {
        transform: translateY(-50px);
        transition: transform 0.15s ease-out;
    }

    .modal-slide.show .modal-dialog {
        transform: translateY(0);
    }

    .modal-zoom .modal-dialog {
        transform: scale(0.8);
        transition: transform 0.15s ease-out;
    }

    .modal-zoom.show .modal-dialog {
        transform: scale(1);
    }
`;

// Inject CSS if not already present
if (typeof window !== "undefined" && !document.getElementById("modal-styles")) {
  const style = document.createElement("style");
  style.id = "modal-styles";
  style.textContent = modalCSS;
  document.head.appendChild(style);
}

export default useModal;
