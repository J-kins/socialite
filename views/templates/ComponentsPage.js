/**
 * ComponentsPage Template
 * Showcase page for all UI components in the design system
 */

import MainLayout from "./MainLayout.js";
import Button from "../atoms/Button.js";
import Input from "../atoms/Input.js";
import Avatar from "../atoms/Avatar.js";
import Badge from "../atoms/Badge.js";
import Text from "../atoms/Text.js";
import ProgressBar from "../atoms/ProgressBar.js";
import Switch from "../atoms/Switch.js";
import PostCard from "../molecules/PostCard.js";
import SearchBox from "../molecules/SearchBox.js";
import FormGroup from "../molecules/FormGroup.js";
import AvatarWithName from "../molecules/AvatarWithName.js";

const ComponentsPage = ({
  id = "",
  user = {},
  className = "",
  ...props
} = {}) => {
  const pageId =
    id || `components-page-${Math.random().toString(36).substr(2, 9)}`;

  // Component showcase sections
  const atomsSection = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Atoms</h2>
            
            <!-- Buttons -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Buttons</h3>
                <div class="flex flex-wrap gap-4 mb-4">
                    ${Button({ variant: "primary", label: "Primary" })}
                    ${Button({ variant: "secondary", label: "Secondary" })}
                    ${Button({ variant: "outline", label: "Outline" })}
                    ${Button({ variant: "ghost", label: "Ghost" })}
                    ${Button({ variant: "danger", label: "Danger" })}
                </div>
                <div class="flex flex-wrap gap-4">
                    ${Button({ size: "sm", label: "Small" })}
                    ${Button({ size: "md", label: "Medium" })}
                    ${Button({ size: "lg", label: "Large" })}
                    ${Button({ loading: true, label: "Loading" })}
                    ${Button({ disabled: true, label: "Disabled" })}
                </div>
            </div>

            <!-- Inputs -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Inputs</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${Input({ placeholder: "Default input" })}
                    ${Input({ type: "email", placeholder: "Email input" })}
                    ${Input({ variant: "error", placeholder: "Error state", value: "Invalid input" })}
                    ${Input({ disabled: true, placeholder: "Disabled input" })}
                </div>
            </div>

            <!-- Avatars -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Avatars</h3>
                <div class="flex items-center gap-4">
                    ${Avatar({ size: "xs", name: "XS" })}
                    ${Avatar({ size: "sm", name: "SM" })}
                    ${Avatar({ size: "md", name: "MD", src: "/assets/images/avatars/avatar-2.jpg" })}
                    ${Avatar({ size: "lg", name: "LG", src: "/assets/images/avatars/avatar-3.jpg", isOnline: true })}
                    ${Avatar({ size: "xl", name: "XL", src: "/assets/images/avatars/avatar-4.jpg" })}
                </div>
            </div>

            <!-- Badges -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Badges</h3>
                <div class="flex flex-wrap gap-4">
                    ${Badge({ text: "Default", variant: "default" })}
                    ${Badge({ text: "Primary", variant: "primary" })}
                    ${Badge({ text: "Success", variant: "success" })}
                    ${Badge({ text: "Warning", variant: "warning" })}
                    ${Badge({ text: "Error", variant: "error" })}
                    ${Badge({ text: "999+", variant: "info", size: "sm" })}
                </div>
            </div>

            <!-- Progress Bars -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Progress Bars</h3>
                <div class="space-y-4">
                    ${ProgressBar({ progress: 25, variant: "primary", showLabel: true, label: "Primary Progress" })}
                    ${ProgressBar({ progress: 50, variant: "success", showLabel: true, label: "Success Progress" })}
                    ${ProgressBar({ progress: 75, variant: "warning", showLabel: true, label: "Warning Progress" })}
                    ${ProgressBar({ progress: 90, variant: "error", showLabel: true, label: "Error Progress" })}
                </div>
            </div>

            <!-- Switches -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Switches</h3>
                <div class="space-y-4">
                    ${Switch({ id: "switch1", label: "Default switch", checked: false })}
                    ${Switch({ id: "switch2", label: "Checked switch", checked: true })}
                    ${Switch({ id: "switch3", label: "Disabled switch", disabled: true })}
                    ${Switch({ id: "switch4", label: "Small switch", size: "sm" })}
                    ${Switch({ id: "switch5", label: "Large switch", size: "lg" })}
                </div>
            </div>
        </div>
    `;

  const moleculesSection = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Molecules</h2>
            
            <!-- Search Box -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Search Box</h3>
                ${SearchBox({
                  placeholder: "Search components...",
                  className: "max-w-md",
                })}
            </div>

            <!-- Form Group -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Form Groups</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${FormGroup({
                      label: "Username",
                      type: "text",
                      placeholder: "Enter your username",
                      required: true,
                      helpText: "This will be your unique identifier",
                    })}
                    ${FormGroup({
                      label: "Email",
                      type: "email",
                      placeholder: "Enter your email",
                      required: true,
                      error: "Please enter a valid email address",
                    })}
                </div>
            </div>

            <!-- Avatar with Name -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Avatar with Name</h3>
                <div class="space-y-4">
                    ${AvatarWithName({
                      src: "/assets/images/avatars/avatar-2.jpg",
                      name: "Jesse Steeve",
                      subtitle: "Software Developer",
                      layout: "horizontal",
                    })}
                    ${AvatarWithName({
                      src: "/assets/images/avatars/avatar-3.jpg",
                      name: "Martin Gray",
                      subtitle: "UI/UX Designer",
                      layout: "vertical",
                      isOnline: true,
                      className: "inline-block",
                    })}
                </div>
            </div>
        </div>
    `;

  const organismsSection = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Organisms</h2>
            
            <!-- Post Card -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Post Card</h3>
                ${PostCard({
                  post: {
                    id: "sample-post",
                    author: {
                      id: "user1",
                      name: "Jesse Steeve",
                      avatar: "/assets/images/avatars/avatar-2.jpg",
                    },
                    content:
                      "This is a sample post to demonstrate the PostCard component. It includes text content, social interactions, and all the features you'd expect from a modern social media post! 🚀 #ComponentLibrary #UIDesign",
                    images: [
                      {
                        url: "/assets/images/posts/sample-1.jpg",
                        caption: "Sample image",
                      },
                    ],
                    timestamp: new Date(
                      Date.now() - 30 * 60 * 1000,
                    ).toISOString(),
                    likes: 42,
                    comments: 12,
                    shares: 5,
                    liked: false,
                    location: "Component Land",
                    privacy: "public",
                  },
                  onLike: 'alert("Like clicked!")',
                  onComment: 'alert("Comment clicked!")',
                  onShare: 'alert("Share clicked!")',
                })}
            </div>
        </div>
    `;

  const utilitySection = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Utilities & Interactions</h2>
            
            <!-- Theme Toggle -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Theme Toggle</h3>
                ${Button({
                  label: "Toggle Dark Mode",
                  onClick: "toggleTheme()",
                  variant: "outline",
                })}
            </div>

            <!-- Ripple Effects -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ripple Effects</h3>
                <div class="flex gap-4">
                    ${Button({
                      label: "Button with Ripple",
                      className: "ripple-effect",
                      variant: "primary",
                    })}
                    ${Button({
                      label: "Another Ripple",
                      className: "ripple-effect",
                      variant: "secondary",
                    })}
                </div>
            </div>

            <!-- Modal Example -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Modals</h3>
                <div class="flex gap-4">
                    ${Button({
                      label: "Show Alert",
                      onClick: "showAlert()",
                      variant: "outline",
                    })}
                    ${Button({
                      label: "Show Confirm",
                      onClick: "showConfirm()",
                      variant: "outline",
                    })}
                </div>
            </div>
        </div>
    `;

  const componentsContent = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Component Library</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Showcase of all available UI components in the Nexify design system
                </p>
            </div>

            <!-- Components Showcase -->
            ${atomsSection}
            ${moleculesSection}
            ${organismsSection}
            ${utilitySection}
        </div>
    `;

  return (
    MainLayout({
      id: pageId,
      title: "Components - Nexify",
      user: user,
      children: componentsContent,
      className: className,
      ...props,
    }) +
    `
        <script>
        // Component page functionality
        async function showAlert() {
            // Import modal utility
            const { default: useModal } = await import('/views/utils/use-modal.js');
            await useModal.alert('This is an example alert dialog!', {
                title: 'Alert Example'
            });
        }

        async function showConfirm() {
            // Import modal utility
            const { default: useModal } = await import('/views/utils/use-modal.js');
            const result = await useModal.confirm('Are you sure you want to continue?', {
                title: 'Confirm Example',
                confirmText: 'Yes, Continue',
                cancelText: 'Cancel'
            });
            
            if (result) {
                alert('You clicked confirm!');
            } else {
                alert('You clicked cancel!');
            }
        }

        // Initialize components page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Components page initialized');
            
            // Initialize ripple effects
            import('/views/utils/ripple-effect.js').then(module => {
                module.default.init();
            });
        });
        </script>
    `
  );
};

export default ComponentsPage;
