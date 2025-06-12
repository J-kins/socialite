import React, { useState, useEffect } from 'react';
import { AuthPage } from './AuthPage';

interface EmailVerificationPageProps {
  className?: string;
  token?: string;
  email?: string;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  className = '',
  token,
  email,
}) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'resend'>(() => {
    return token ? 'verifying' : 'resend';
  });
  const [resendEmail, setResendEmail] = useState(email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && status === 'verifying') {
      verifyEmail(token);
    }
  }, [token, status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success or failure based on token
      if (verificationToken === 'invalid-token') {
        throw new Error('Invalid verification token');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setError('Invalid or expired verification link');
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resendEmail) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resendEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCountdown(60); // Start 60 second countdown
    } catch (error) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerifyingState = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          Verifying your email
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we verify your email address...
        </p>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          Email verified successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your email address has been verified. You can now access all features of your account.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
              What's next?
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              You can now sign in to your account and start exploring all features of Nexify.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <a
          href="/login"
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
        >
          Sign In
        </a>
        <a
          href="/feed"
          className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
        >
          Go to Feed
        </a>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          Verification failed
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || 'The verification link is invalid or has expired.'}
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              Common reasons for verification failure:
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• The verification link has expired (valid for 24 hours)</li>
              <li>• The link has already been used</li>
              <li>• The link was corrupted when copied</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleResendVerification} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black dark:text-white mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-white/5"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || countdown > 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            'Send New Verification Email'
          )}
        </button>
      </form>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Back to sign in
        </a>
      </div>
    </div>
  );

  const renderResendForm = () => (
    <form onSubmit={handleResendVerification} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Didn't receive a verification email? Enter your email address to get a new one.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-black dark:text-white mb-2"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className={`w-full px-4 py-3 border rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error ? 'border-red-300 dark:border-red-600' : 'border-slate-200 dark:border-slate-800'
          } dark:bg-white/5`}
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {countdown > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✓ Verification email sent! Check your inbox and spam folder.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || countdown > 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </div>
        ) : countdown > 0 ? (
          `Resend in ${countdown}s`
        ) : (
          'Send Verification Email'
        )}
      </button>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Back to sign in
        </a>
      </div>
    </form>
  );

  const getTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying email';
      case 'success':
        return 'Email verified';
      case 'error':
        return 'Verification failed';
      case 'resend':
        return 'Verify your email';
      default:
        return 'Email verification';
    }
  };

  const getSubtitle = () => {
    switch (status) {
      case 'resend':
        return 'We need to verify your email address to secure your account.';
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return renderVerifyingState();
      case 'success':
        return renderSuccessState();
      case 'error':
        return renderErrorState();
      case 'resend':
        return renderResendForm();
      default:
        return null;
    }
  };

  return (
    <AuthPage title={getTitle()} subtitle={getSubtitle()} className={className}>
      {renderContent()}
    </AuthPage>
  );
};

export default EmailVerificationPage;
