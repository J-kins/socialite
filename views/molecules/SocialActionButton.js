/**
 * SocialActionButton Component
 * Groups social interaction buttons (like, comment, share)
 */

import LikeButton from "../atoms/LikeButton.js";
import CommentButton from "../atoms/CommentButton.js";
import ShareButton from "../atoms/ShareButton.js";

const SocialActionButton = ({
  id,
  liked = false,
  likeCount = 0,
  commentCount = 0,
  postId,
  className = "",
}) => `
  <div class="social-action-button ${className}" id="${id}">
    ${LikeButton({
      id: `${id}-like`,
      liked,
      count: likeCount,
      postId,
      className: "flex-1",
    })}
    ${CommentButton({
      id: `${id}-comment`,
      count: commentCount,
      postId,
      className: "flex-1",
    })}
    ${ShareButton({
      id: `${id}-share`,
      postId,
      className: "flex-1",
    })}
  </div>
`;

// Initialize social action functionality
document.addEventListener("DOMContentLoaded", () => {
  const initSocialActionButton = (id) => {
    const container = document.querySelector(`#${id}`);
    const likeBtn = document.querySelector(`#${id}-like`);
    const commentBtn = document.querySelector(`#${id}-comment`);
    const shareBtn = document.querySelector(`#${id}-share`);

    // Like button interaction
    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        const postId = likeBtn.dataset.postId;
        const isLiked = likeBtn.classList.contains("liked");

        $.ajax({
          url: `/post/${postId}/${isLiked ? "unlike" : "like"}`,
          method: "POST",
          success: (response) => {
            // Update like state
            likeBtn.classList.toggle("liked");
            const countEl = likeBtn.querySelector(".like-count");
            if (countEl) {
              countEl.textContent = response.likeCount || 0;
            }

            // Dispatch like event
            document.dispatchEvent(
              new CustomEvent("post:like", {
                detail: { postId, liked: !isLiked, count: response.likeCount },
              }),
            );
          },
          error: () => console.error("Failed to toggle like"),
        });
      });
    }

    // Comment button interaction
    if (commentBtn) {
      commentBtn.addEventListener("click", () => {
        const postId = commentBtn.dataset.postId;

        // Dispatch comment event to show comment section
        document.dispatchEvent(
          new CustomEvent("post:comment", {
            detail: { postId, action: "show" },
          }),
        );
      });
    }

    // Share button interaction
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const postId = shareBtn.dataset.postId;

        // Dispatch share event to show share options
        document.dispatchEvent(
          new CustomEvent("post:share", {
            detail: { postId, action: "show" },
          }),
        );
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".social-action-button").forEach((actions) => {
    if (actions.id) initSocialActionButton(actions.id);
  });
});

export default SocialActionButton;
