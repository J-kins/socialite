import React, { useState } from 'react';
import { AuthPage } from './AuthPage';

interface PasswordResetPageProps {
  className?: string;
  token?: string;
}

export const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ className = '', token }) => {
  const [step, setStep] = useState<'request' | 'sent' | 'reset'>(() => {
    return token ? 'reset' : 'request';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasNonalphas,
      },
    };
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep('sent');
    } catch (error) {
      setErrors({ submit: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrors({ password: 'Password does not meet requirements' });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to login page or show success message
      window.location.href = '/login';
    } catch (error) {
      setErrors({ submit: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: 'Enter a password' };

    const validation = validatePassword(password);
    const passedChecks = Object.values(validation.checks).filter(Boolean).length;

    if (passedChecks < 2) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (passedChecks < 4) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (passedChecks < 5) return { level: 3, text: 'Good', color: 'bg-blue-500' };
    return { level: 4, text: 'Strong', color: 'bg-green-500' };
  };

  const renderRequestForm = () => (
    <form onSubmit={handleRequestReset} className="space-y-6">
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className={`w-full px-4 py-3 border rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.email
              ? 'border-red-300 dark:border-red-600'
              : 'border-slate-200 dark:border-slate-800'
          } dark:bg-white/5`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending Reset Link...
          </div>
        ) : (
          'Send Reset Link'
        )}
      </button>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Remember your password? Sign in
        </a>
      </div>
    </form>
  );

  const renderSentConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
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

      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Check your email</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => setStep('request')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            try again
          </button>
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
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
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              What's next?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Click the link in your email to reset your password. The link will expire in 1 hour
              for security reasons.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Back to sign in
        </a>
      </div>
    </div>
  );

  const renderResetForm = () => {
    const passwordStrength = getPasswordStrength(password);
    const passwordValidation = validatePassword(password);

    return (
      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black dark:text-white mb-2"
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            className={`w-full px-4 py-3 border rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.password
                ? 'border-red-300 dark:border-red-600'
                : 'border-slate-200 dark:border-slate-800'
            } dark:bg-white/5`}
          />

          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {passwordStrength.text}
                </span>
              </div>

              <div className="space-y-1">
                <div
                  className={`text-xs flex items-center gap-2 ${passwordValidation.checks.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
                >
                  <span>{passwordValidation.checks.minLength ? '✓' : '○'}</span>
                  At least 8 characters
                </div>
                <div
                  className={`text-xs flex items-center gap-2 ${passwordValidation.checks.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
                >
                  <span>{passwordValidation.checks.hasUpperCase ? '✓' : '○'}</span>
                  One uppercase letter
                </div>
                <div
                  className={`text-xs flex items-center gap-2 ${passwordValidation.checks.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
                >
                  <span>{passwordValidation.checks.hasLowerCase ? '✓' : '○'}</span>
                  One lowercase letter
                </div>
                <div
                  className={`text-xs flex items-center gap-2 ${passwordValidation.checks.hasNumbers ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
                >
                  <span>{passwordValidation.checks.hasNumbers ? '✓' : '○'}</span>
                  One number
                </div>
                <div
                  className={`text-xs flex items-center gap-2 ${passwordValidation.checks.hasNonalphas ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
                >
                  <span>{passwordValidation.checks.hasNonalphas ? '✓' : '○'}</span>
                  One special character
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-black dark:text-white mb-2"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            className={`w-full px-4 py-3 border rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.confirmPassword
                ? 'border-red-300 dark:border-red-600'
                : 'border-slate-200 dark:border-slate-800'
            } dark:bg-white/5`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Resetting Password...
            </div>
          ) : (
            'Reset Password'
          )}
        </button>

        <div className="text-center">
          <a href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Back to sign in
          </a>
        </div>
      </form>
    );
  };

  const getTitle = () => {
    switch (step) {
      case 'request':
        return 'Reset your password';
      case 'sent':
        return 'Reset link sent';
      case 'reset':
        return 'Set new password';
      default:
        return 'Reset your password';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'request':
        return "Enter your email address and we'll send you a link to reset your password.";
      case 'sent':
        return null;
      case 'reset':
        return 'Enter your new password below.';
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'request':
        return renderRequestForm();
      case 'sent':
        return renderSentConfirmation();
      case 'reset':
        return renderResetForm();
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

export default PasswordResetPage;
