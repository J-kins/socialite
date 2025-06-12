/**
 * CommentListItem Component
 * Single comment display with user avatar and text
 */

import Avatar from "../atoms/Avatar.js";
import Text from "../atoms/Text.js";
import Button from "../atoms/Button.js";

const CommentListItem = ({
  id,
  src,
  name,
  comment,
  timestamp,
  commentId,
  canDelete = false,
  className = "",
}) => `
  <div class="comment-list-item ${className}" id="${id}">
    ${Avatar({ id: `${id}-avatar`, src, className: "w-8 h-8 flex-shrink-0" })}
    <div class="comment-content flex-1 ml-3">
      <div class="comment-header flex items-center gap-2 mb-1">
        ${Text({ id: `${id}-name`, content: name || "User", className: "font-semibold text-sm text-gray-900" })}
        ${
          timestamp
            ? Text({
                id: `${id}-timestamp`,
                content: timestamp,
                className: "text-xs text-gray-500",
              })
            : ""
        }
      </div>
      ${Text({ id: `${id}-comment`, content: comment || "Comment", className: "text-sm text-gray-700" })}
      <div class="comment-actions mt-2 flex items-center gap-4">
        ${Button({
          id: `${id}-like`,
          label: "Like",
          className:
            "text-xs text-gray-500 hover:text-blue-600 p-0 bg-transparent",
        })}
        ${Button({
          id: `${id}-reply`,
          label: "Reply",
          className:
            "text-xs text-gray-500 hover:text-blue-600 p-0 bg-transparent",
        })}
        ${
          canDelete
            ? Button({
                id: `${id}-delete`,
                label: "Delete",
                className:
                  "text-xs text-gray-500 hover:text-red-600 p-0 bg-transparent",
              })
            : ""
        }
      </div>
    </div>
  </div>
`;

// Initialize comment functionality
document.addEventListener("DOMContentLoaded", () => {
  const initCommentListItem = (id) => {
    const likeBtn = document.querySelector(`#${id}-like`);
    const replyBtn = document.querySelector(`#${id}-reply`);
    const deleteBtn = document.querySelector(`#${id}-delete`);
    const item = document.querySelector(`#${id}`);

    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        const commentId = item.dataset.commentId;

        $.ajax({
          url: `/comment/${commentId}/like`,
          method: "POST",
          success: (response) => {
            likeBtn.classList.toggle("text-blue-600");

            // Dispatch comment like event
            document.dispatchEvent(
              new CustomEvent("comment:like", {
                detail: { commentId, liked: response.liked },
              }),
            );
          },
          error: () => console.error("Failed to like comment"),
        });
      });
    }

    if (replyBtn) {
      replyBtn.addEventListener("click", () => {
        const commentId = item.dataset.commentId;
        const userName = document.querySelector(`#${id}-name`)?.textContent;

        // Dispatch reply event
        document.dispatchEvent(
          new CustomEvent("comment:reply", {
            detail: { commentId, userName, replyTo: id },
          }),
        );
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const commentId = item.dataset.commentId;

        if (confirm("Are you sure you want to delete this comment?")) {
          $.ajax({
            url: `/comment/${commentId}`,
            method: "DELETE",
            success: () => {
              // Remove comment with animation
              item.classList.add("opacity-0", "transform", "scale-95");
              setTimeout(() => {
                item.remove();
              }, 150);

              // Dispatch delete event
              document.dispatchEvent(
                new CustomEvent("comment:delete", {
                  detail: { commentId },
                }),
              );
            },
            error: () => console.error("Failed to delete comment"),
          });
        }
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".comment-list-item").forEach((item) => {
    if (item.id) initCommentListItem(item.id);
  });
});

export default CommentListItem;
