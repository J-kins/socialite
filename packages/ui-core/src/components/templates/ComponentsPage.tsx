import React from 'react';
import { MainLayout } from './MainLayout';

interface ComponentsPageProps {
  className?: string;
}

export const ComponentsPage: React.FC<ComponentsPageProps> = ({ className = '' }) => {
  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">UI Components</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete component library documentation and examples
          </p>
        </div>

        {/* Component Categories */}
        <div className="space-y-8">
          {/* Atoms Section */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Atomic Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Button',
                'Input',
                'Icon',
                'Avatar',
                'Badge',
                'Switch',
                'Label',
                'Text',
                'Link',
                'Tooltip',
                'Divider',
                'Image',
              ].map((component) => (
                <div
                  key={component}
                  className="bg-white dark:bg-dark3 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-black dark:text-white mb-2">{component}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Basic {component.toLowerCase()} component with variants
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    View Examples →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Molecules Section */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Molecule Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'SearchBox',
                'AvatarWithName',
                'NotificationItem',
                'ChatPreview',
                'ProfileCard',
                'SocialActionButton',
              ].map((component) => (
                <div
                  key={component}
                  className="bg-white dark:bg-dark3 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-black dark:text-white mb-2">{component}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Composite{' '}
                    {component
                      .toLowerCase()
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}{' '}
                    component
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    View Examples →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Organisms Section */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Organism Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Header',
                'Sidebar',
                'PostCard',
                'CommentSection',
                'NotificationsPanel',
                'UserProfile',
              ].map((component) => (
                <div
                  key={component}
                  className="bg-white dark:bg-dark3 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-black dark:text-white mb-2">{component}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Complex{' '}
                    {component
                      .toLowerCase()
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}{' '}
                    organism
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    View Examples →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Code Examples */}
          <section>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Usage Examples
            </h2>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{`import { Button, Input, Avatar } from '@/components/atoms';
import { SearchBox, ProfileCard } from '@/components/molecules';
import { Header, PostCard } from '@/components/organisms';

export function MyComponent() {
  return (
    <div>
      <Header />
      <SearchBox placeholder="Search..." />
      <PostCard 
        author={<ProfileCard user={userData} />}
        content="Hello world!"
      />
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComponentsPage;
