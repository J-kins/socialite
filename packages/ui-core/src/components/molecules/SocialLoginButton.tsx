import React from 'react';
import { Icon, Button } from '../atoms';

export interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'twitter' | 'github' | 'apple' | 'microsoft' | 'linkedin';
  action?: 'login' | 'signup' | 'connect';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  action = 'login',
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
}) => {
  const getProviderConfig = () => {
    const configs = {
      google: {
        name: 'Google',
        icon: 'logo-google',
        colors: {
          default: 'bg-red-500 hover:bg-red-600 text-white',
          outline: 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
          minimal: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
        },
      },
      facebook: {
        name: 'Facebook',
        icon: 'logo-facebook',
        colors: {
          default: 'bg-blue-600 hover:bg-blue-700 text-white',
          outline: 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
          minimal: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        },
      },
      twitter: {
        name: 'Twitter',
        icon: 'logo-twitter',
        colors: {
          default: 'bg-sky-500 hover:bg-sky-600 text-white',
          outline: 'border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20',
          minimal: 'text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20',
        },
      },
      github: {
        name: 'GitHub',
        icon: 'logo-github',
        colors: {
          default:
            'bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700',
          outline:
            'border-gray-900 text-gray-900 hover:bg-gray-50 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-800',
          minimal: 'text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
        },
      },
      apple: {
        name: 'Apple',
        icon: 'logo-apple',
        colors: {
          default: 'bg-black hover:bg-gray-800 text-white',
          outline:
            'border-black text-black hover:bg-gray-50 dark:border-white dark:text-white dark:hover:bg-gray-800',
          minimal: 'text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800',
        },
      },
      microsoft: {
        name: 'Microsoft',
        icon: 'logo-microsoft',
        colors: {
          default: 'bg-blue-500 hover:bg-blue-600 text-white',
          outline: 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
          minimal: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        },
      },
      linkedin: {
        name: 'LinkedIn',
        icon: 'logo-linkedin',
        colors: {
          default: 'bg-blue-700 hover:bg-blue-800 text-white',
          outline: 'border-blue-700 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20',
          minimal: 'text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        },
      },
    };
    return configs[provider];
  };

  const getActionText = () => {
    const providerConfig = getProviderConfig();
    const actions = {
      login: `Sign in with ${providerConfig.name}`,
      signup: `Sign up with ${providerConfig.name}`,
      connect: `Connect ${providerConfig.name}`,
    };
    return actions[action];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        button: 'px-3 py-2 text-sm',
        icon: 'w-4 h-4',
        gap: 'gap-2',
      },
      md: {
        button: 'px-4 py-2.5 text-sm',
        icon: 'w-5 h-5',
        gap: 'gap-2',
      },
      lg: {
        button: 'px-6 py-3 text-base',
        icon: 'w-6 h-6',
        gap: 'gap-3',
      },
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    const providerConfig = getProviderConfig();
    const baseClasses =
      'transition-all duration-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';

    if (variant === 'outline') {
      return `${baseClasses} border-2 ${providerConfig.colors.outline}`;
    }

    if (variant === 'minimal') {
      return `${baseClasses} ${providerConfig.colors.minimal}`;
    }

    // Default variant
    return `${baseClasses} ${providerConfig.colors.default} shadow-md hover:shadow-lg`;
  };

  const providerConfig = getProviderConfig();
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses} ${sizeClasses.button}
        ${fullWidth ? 'w-full' : 'inline-flex'}
        flex items-center justify-center ${sizeClasses.gap}
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:active:scale-100
        ${className}
      `}
    >
      {loading ? (
        <Icon name="refresh" className={`${sizeClasses.icon} animate-spin`} />
      ) : (
        <Icon name={providerConfig.icon} className={sizeClasses.icon} />
      )}

      <span className="flex-1 text-center">{loading ? 'Connecting...' : getActionText()}</span>
    </button>
  );
};
