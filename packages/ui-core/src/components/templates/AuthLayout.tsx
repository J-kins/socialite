import React from "react";
import { Button, Icon, Link } from "../atoms";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  footerLinks?: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }>;
  backgroundImage?: string;
  logoSrc?: string;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack,
  footerLinks = [],
  backgroundImage,
  logoSrc,
  className = "",
}) => {
  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {backgroundImage ? (
          <div
            className="w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Logo"
                className="w-16 h-16 mx-auto mb-8"
              />
            ) : (
              <div className="w-16 h-16 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="heart" className="w-8 h-8" />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">Welcome to Socialite</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Connect with friends, share your moments, and discover amazing
              communities around the world.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">10M+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-white/80">Communities</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1B+</div>
                <div className="text-sm text-white/80">Connections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 right-10 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          {showBackButton && (
            <Button variant="ghost" onClick={onBack} className="!p-2">
              <Icon name="arrow-back" className="w-5 h-5" />
            </Button>
          )}

          <div className="lg:hidden">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="w-8 h-8" />
            ) : (
              <Icon name="heart" className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* Language/Theme Switcher */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="!p-2">
              <Icon name="language" className="w-5 h-5 text-gray-500" />
            </Button>
            <Button variant="ghost" className="!p-2">
              <Icon name="moon" className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-8">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            <div className="space-y-6">{children}</div>

            {/* Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="!p-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>

              <Button variant="outline" className="!p-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Button>

              <Button variant="outline" className="!p-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {footerLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <Link
                  href={link.href}
                  onClick={link.onClick}
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            © 2024 Socialite. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
