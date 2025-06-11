// UI Core Library Export
// This is the main entry point for the @socialite/ui-core package

// Export all atoms
export * from "./components/atoms";

// Export all molecules
export * from "./components/molecules";

// Export all organisms (when created)
// export * from './components/organisms';

// Export all templates (when created)
// export * from './components/templates';

// Export utilities (when created)
// export * from './utils';

// Import and re-export styles
import "./styles/base/global.css";

// Version information
export const VERSION = "1.0.0";

// Library metadata
export const LIBRARY_NAME = "@socialite/ui-core";
export const LIBRARY_DESCRIPTION =
  "Core UI components for Socialite/Nexify social media platform";
