import React, { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { Button, Input, Link, Switch, Icon } from "../atoms";

export interface RegisterPageProps {
  onRegister?: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
    subscribeNewsletter: boolean;
  }) => void;
  onSignIn?: () => void;
  onSocialRegister?: (provider: "google" | "facebook" | "twitter") => void;
  isLoading?: boolean;
  error?: string;
  backgroundImage?: string;
  logoSrc?: string;
  className?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onSignIn,
  onSocialRegister,
  isLoading = false,
  error,
  backgroundImage,
  logoSrc,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    subscribeNewsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");

    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push("One special character");

    return { score, feedback };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      errors.password = "Password is too weak";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...userData } = formData;
    onRegister?.(userData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Calculate password strength
    if (field === "password" && typeof value === "string") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getStrengthColor = (score: number) => {
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Weak";
    if (score < 4) return "Medium";
    return "Strong";
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of users and start connecting today"
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              First name
            </label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="First name"
              error={fieldErrors.firstName}
              disabled={isLoading}
              autoComplete="given-name"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Last name
            </label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Last name"
              error={fieldErrors.lastName}
              disabled={isLoading}
              autoComplete="family-name"
            />
          </div>
        </div>

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
            autoComplete="email"
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
              placeholder="Create a strong password"
              error={fieldErrors.password}
              disabled={isLoading}
              className="pr-10"
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength.score < 2
                      ? "text-red-600 dark:text-red-400"
                      : passwordStrength.score < 4
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>

              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Missing: {passwordStrength.feedback.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm your password"
              error={fieldErrors.confirmPassword}
              disabled={isLoading}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* Terms and Newsletter */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Switch
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(checked) => handleInputChange("acceptTerms", checked)}
              disabled={isLoading}
              className="mt-1"
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {fieldErrors.acceptTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldErrors.acceptTerms}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={(checked) =>
                handleInputChange("subscribeNewsletter", checked)
              }
              disabled={isLoading}
            />
            <label
              htmlFor="subscribeNewsletter"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Send me product updates and news
            </label>
          </div>
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
              Creating account...
            </>
          ) : (
            <>
              <Icon name="person-add" className="w-4 h-4 mr-2" />
              Create account
            </>
          )}
        </Button>
      </form>

      {/* Benefits */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          🎉 What you'll get:
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Connect with friends and communities</li>
          <li>• Share photos, videos, and stories</li>
          <li>• Discover events and groups near you</li>
          <li>• Private messaging and video calls</li>
        </ul>
      </div>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
        </span>
        <Link
          onClick={onSignIn}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
