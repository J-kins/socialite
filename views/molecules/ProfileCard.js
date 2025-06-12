/**
 * ProfileCard Component
 * Compact user profile display with avatar, name, bio and action button
 */

import Avatar from "../atoms/Avatar.js";
import Text from "../atoms/Text.js";
import Button from "../atoms/Button.js";

const ProfileCard = ({ id, src, name, bio, className = "" }) => `
  <div class="profile-card ${className}" id="${id}">
    ${Avatar({ id: `${id}-avatar`, src, className: "w-16 h-16 mx-auto" })}
    ${Text({ id: `${id}-name`, content: name || "User", className: "font-bold text-lg mt-2 text-center" })}
    ${Text({ id: `${id}-bio`, content: bio || "Bio...", className: "text-sm text-gray-600 text-center mt-1" })}
    ${Button({ id: `${id}-follow`, label: "Follow", className: "mt-3 w-full" })}
  </div>
`;

// Initialize follow functionality
document.addEventListener("DOMContentLoaded", () => {
  const initProfileCard = (id) => {
    const followBtn = document.querySelector(`#${id}-follow`);
    if (followBtn) {
      followBtn.addEventListener("click", () => {
        $.ajax({
          url: `/user/${id}/follow`,
          method: "POST",
          success: () => {
            followBtn.textContent = "Following";
            followBtn.classList.add("bg-green-500");
          },
          error: () => console.error("Failed to follow user"),
        });
      });
    }
  };

  // Auto-initialize if jQuery is available
  if (typeof $ !== "undefined") {
    $(".profile-card").each(function () {
      initProfileCard(this.id);
    });
  }
});

export default ProfileCard;
