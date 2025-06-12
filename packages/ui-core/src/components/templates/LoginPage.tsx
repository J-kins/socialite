import React, { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { Button, Input, Link, Switch, Icon } from "../atoms";

export interface LoginPageProps {
  onLogin?: (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onSocialLogin?: (provider: "google" | "facebook" | "twitter") => void;
  isLoading?: boolean;
  error?: string;
  backgroundImage?: string;
  logoSrc?: string;
  className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  isLoading = false,
  error,
  backgroundImage,
  logoSrc,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onLogin?.(formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      backgroundImage={backgroundImage}
      logoSrc={logoSrc}
      footerLinks={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Help Center", href: "/help" },
      ]}
      className={className}
    >
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon
              name="alert-circle"
              className="w-5 h-5 text-red-600 dark:text-red-400"
            />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            error={fieldErrors.email}
            disabled={isLoading}
            className="w-full"
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your password"
              error={fieldErrors.password}
              disabled={isLoading}
              className="w-full pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(checked) => handleInputChange("rememberMe", checked)}
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <Link
            onClick={onForgotPassword}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Icon name="refresh" className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Quick Login Demo */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          <Icon name="information-circle" className="w-4 h-4 inline mr-1" />
          Try demo accounts:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                email: "john@example.com",
                password: "password123",
                rememberMe: false,
              });
            }}
            disabled={isLoading}
          >
            Demo User 1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                email: "jane@example.com",
                password: "password123",
                rememberMe: false,
              });
            }}
            disabled={isLoading}
          >
            Demo User 2
          </Button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
        </span>
        <Link
          onClick={onSignUp}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign up for free
        </Link>
      </div>

      {/* Features Highlight */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Icon
            name="shield-checkmark"
            className="w-8 h-8 text-green-500 mx-auto mb-2"
          />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Secure
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            End-to-end encryption
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Icon name="flash" className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Fast
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lightning-fast experience
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
