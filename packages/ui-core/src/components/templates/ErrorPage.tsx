import React from "react";
import { Button, Icon } from "../atoms";

export interface ErrorPageProps {
  error?: {
    status?: number;
    title?: string;
    message?: string;
    details?: string;
  };
  onRetry?: () => void;
  onGoHome?: () => void;
  onContactSupport?: () => void;
  showSupportContact?: boolean;
  className?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error = {
    status: 500,
    title: "Something went wrong",
    message: "We encountered an unexpected error. Please try again.",
    details: undefined,
  },
  onRetry,
  onGoHome,
  onContactSupport,
  showSupportContact = true,
  className = "",
}) => {
  const getErrorIcon = (status?: number) => {
    switch (status) {
      case 404:
        return "search";
      case 403:
        return "lock-closed";
      case 401:
        return "person";
      case 500:
      default:
        return "warning";
    }
  };

  const getErrorTitle = (status?: number) => {
    switch (status) {
      case 404:
        return "Page not found";
      case 403:
        return "Access forbidden";
      case 401:
        return "Unauthorized";
      case 500:
        return "Server error";
      default:
        return error.title || "Something went wrong";
    }
  };

  const getErrorMessage = (status?: number) => {
    switch (status) {
      case 404:
        return "The page you're looking for doesn't exist or has been moved.";
      case 403:
        return "You don't have permission to access this resource.";
      case 401:
        return "Please sign in to access this page.";
      case 500:
        return "Our servers are experiencing some issues. Please try again later.";
      default:
        return (
          error.message ||
          "We encountered an unexpected error. Please try again."
        );
    }
  };

  const getSuggestions = (status?: number) => {
    switch (status) {
      case 404:
        return [
          "Check the URL for typos",
          "Go back to the previous page",
          "Visit our homepage",
          "Use the search function",
        ];
      case 403:
        return [
          "Make sure you're signed in",
          "Contact the resource owner",
          "Check your account permissions",
          "Try refreshing the page",
        ];
      case 401:
        return [
          "Sign in to your account",
          "Create a new account",
          "Reset your password",
          "Contact support if the issue persists",
        ];
      case 500:
        return [
          "Refresh the page",
          "Try again in a few minutes",
          "Check your internet connection",
          "Contact support if the problem continues",
        ];
      default:
        return [
          "Refresh the page",
          "Check your internet connection",
          "Try again later",
          "Contact support if needed",
        ];
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 ${className}`}
    >
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div
            className={`
            w-24 h-24 mx-auto rounded-full flex items-center justify-center
            ${
              error.status === 404
                ? "bg-blue-100 dark:bg-blue-900/20"
                : error.status === 403
                  ? "bg-red-100 dark:bg-red-900/20"
                  : error.status === 401
                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                    : "bg-gray-100 dark:bg-gray-800"
            }
          `}
          >
            <Icon
              name={getErrorIcon(error.status)}
              className={`
                w-12 h-12
                ${
                  error.status === 404
                    ? "text-blue-600 dark:text-blue-400"
                    : error.status === 403
                      ? "text-red-600 dark:text-red-400"
                      : error.status === 401
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400"
                }
              `}
            />
          </div>
        </div>

        {/* Error Status */}
        {error.status && (
          <div className="mb-4">
            <span
              className={`
              inline-block px-3 py-1 rounded-full text-sm font-medium
              ${
                error.status === 404
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                  : error.status === 403
                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                    : error.status === 401
                      ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
              }
            `}
            >
              Error {error.status}
            </span>
          </div>
        )}

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {getErrorTitle(error.status)}
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {getErrorMessage(error.status)}
        </p>

        {/* Error Details */}
        {error.details && (
          <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technical details
              </summary>
              <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                {error.details}
              </code>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 mb-8">
          {onRetry && (
            <Button variant="primary" onClick={onRetry} className="w-full">
              <Icon name="refresh" className="w-4 h-4 mr-2" />
              Try again
            </Button>
          )}

          {onGoHome && (
            <Button variant="outline" onClick={onGoHome} className="w-full">
              <Icon name="home" className="w-4 h-4 mr-2" />
              Go to homepage
            </Button>
          )}

          {showSupportContact && onContactSupport && (
            <Button
              variant="ghost"
              onClick={onContactSupport}
              className="w-full"
            >
              <Icon name="mail" className="w-4 h-4 mr-2" />
              Contact support
            </Button>
          )}
        </div>

        {/* Suggestions */}
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            What you can try:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {getSuggestions(error.status).map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};
