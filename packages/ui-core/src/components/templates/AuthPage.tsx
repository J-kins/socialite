import React from 'react';

interface AuthPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackground?: boolean;
  className?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  children,
  title,
  subtitle,
  showBackground = true,
  className = '',
}) => {
  return (
    <div className={`sm:flex min-h-screen ${className}`}>
      {/* Background Side */}
      {showBackground && (
        <div className="hidden sm:block flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Background Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-12">
            <div className="text-center text-white max-w-md">
              <h2 className="text-3xl font-bold mb-4">Welcome to Nexify</h2>
              <p className="text-lg opacity-90 mb-8">
                Connect with friends, share moments, and discover amazing content in our vibrant
                social community.
              </p>
              <div className="flex items-center justify-center space-x-2 opacity-75">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Side */}
      <div className="relative lg:w-[580px] md:w-96 w-full p-10 min-h-screen bg-white shadow-xl flex items-center pt-10 dark:bg-slate-900 z-10">
        <div className="w-full lg:max-w-sm mx-auto space-y-10">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <a href="#" className="flex-shrink-0">
              <img src="/assets/images/logo.png" className="w-28 dark:hidden" alt="Nexify" />
              <img
                src="/assets/images/logo-light.png"
                className="w-28 hidden dark:block"
                alt="Nexify"
              />
            </a>
          </div>

          {/* Title Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-1.5 text-black dark:text-white">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-700 dark:text-gray-300 font-normal">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          <div className="space-y-7">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
