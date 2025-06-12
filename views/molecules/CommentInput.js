/**
 * CommentInput Component
 * Comment input field with avatar and submit button
 */

import Avatar from "../atoms/Avatar.js";
import Input from "../atoms/Input.js";
import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";

const CommentInput = ({
  id = "",
  placeholder = "Write a comment...",
  user = {},
  value = "",
  disabled = false,
  className = "",
  onSubmit = "",
  onChange = "",
  onFocus = "",
  ...props
} = {}) => {
  const inputId =
    id || `comment-input-${Math.random().toString(36).substr(2, 9)}`;
  const textareaId = `${inputId}-textarea`;

  const baseClasses = [
    "flex",
    "items-start",
    "space-x-3",
    "p-4",
    "bg-gray-50",
    "dark:bg-gray-800",
    "rounded-lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Default submit handler
  const defaultSubmit = `
        const textarea = document.getElementById('${textareaId}');
        const content = textarea.value.trim();
        if (content) {
            console.log('Submitting comment:', content);
            textarea.value = '';
            textarea.style.height = 'auto';
        }
    `;

  const handleSubmit = onSubmit || defaultSubmit;

  // Auto-resize textarea
  const autoResize = `
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        ${onChange ? `(${onChange})(event);` : ""}
    `;

  // Handle keydown for submit
  const handleKeyDown = `
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            ${handleSubmit}
        }
    `;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div 
            ${id ? `id="${inputId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <!-- User Avatar -->
            <div class="flex-shrink-0">
                ${Avatar({
                  src: user.avatar,
                  name: user.name,
                  size: "md",
                })}
            </div>

            <!-- Comment Input Area -->
            <div class="flex-1 min-w-0">
                <div class="relative">
                    <textarea
                        id="${textareaId}"
                        placeholder="${placeholder}"
                        ${disabled ? "disabled" : ""}
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors duration-200 ${disabled ? "opacity-60 cursor-not-allowed" : ""}"
                        rows="1"
                        onInput="${autoResize}"
                        onKeyDown="${handleKeyDown}"
                        ${onFocus ? `onFocus="${onFocus}"` : ""}
                    >${value}</textarea>

                    <!-- Action Buttons -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center space-x-2">
                            <!-- Emoji Button -->
                            <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors duration-200">
                                ${Icon({
                                  name: "happy-outline",
                                  type: "ion",
                                  size: "sm",
                                })}
                            </button>

                            <!-- Attachment Button -->
                            <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors duration-200">
                                ${Icon({
                                  name: "attach-outline",
                                  type: "ion",
                                  size: "sm",
                                })}
                            </button>

                            <!-- GIF Button -->
                            <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors duration-200 text-xs font-bold">
                                GIF
                            </button>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex items-center space-x-2">
                            <span class="text-xs text-gray-400 hidden" id="${textareaId}-count">0/500</span>
                            ${Button({
                              variant: "primary",
                              size: "sm",
                              label: "Post",
                              disabled: disabled,
                              onClick: handleSubmit,
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
        // Character counter
        document.getElementById('${textareaId}').addEventListener('input', function() {
            const counter = document.getElementById('${textareaId}-count');
            const length = this.value.length;
            if (counter) {
                counter.textContent = length + '/500';
                counter.classList.toggle('hidden', length === 0);
                counter.classList.toggle('text-red-500', length > 450);
            }
        });
        </script>
    `;
};

export default CommentInput;
