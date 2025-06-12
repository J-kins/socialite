import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface BillingPageProps {
  className?: string;
}

export const BillingPage: React.FC<BillingPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [currentPlan, setCurrentPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing: 'forever',
      features: [
        'Up to 10 posts per month',
        'Basic profile customization',
        'Community support',
        '1GB storage',
        'Standard analytics',
      ],
      limits: {
        posts: 10,
        storage: '1GB',
        friends: 100,
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      billing: 'month',
      popular: true,
      features: [
        'Unlimited posts',
        'Advanced profile customization',
        'Priority support',
        '100GB storage',
        'Advanced analytics',
        'Custom themes',
        'Ad-free experience',
      ],
      limits: {
        posts: 'Unlimited',
        storage: '100GB',
        friends: 1000,
      },
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      billing: 'month',
      features: [
        'Everything in Pro',
        'Business analytics',
        'Custom branding',
        '1TB storage',
        'API access',
        'White-label options',
        'Dedicated account manager',
      ],
      limits: {
        posts: 'Unlimited',
        storage: '1TB',
        friends: 'Unlimited',
      },
    },
  ];

  const billingHistory = [
    {
      id: '1',
      date: '2024-03-01',
      description: 'Pro Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-001234',
    },
    {
      id: '2',
      date: '2024-02-01',
      description: 'Pro Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-001233',
    },
    {
      id: '3',
      date: '2024-01-01',
      description: 'Pro Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-001232',
    },
    {
      id: '4',
      date: '2023-12-01',
      description: 'Pro Plan - Monthly',
      amount: 9.99,
      status: 'failed',
      invoice: 'INV-001231',
    },
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ];

  const usage = {
    posts: { used: 145, limit: 'Unlimited' },
    storage: { used: 25.6, limit: 100, unit: 'GB' },
    friends: { used: 342, limit: 1000 },
    analyticsViews: { used: 5420, limit: 'Unlimited' },
  };

  const tabs = [
    { id: 'subscription', label: 'Subscription' },
    { id: 'billing', label: 'Billing History' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'usage', label: 'Usage' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-5 bg-gray-400 rounded flex items-center justify-center">
            <span className="text-white text-xs">••••</span>
          </div>
        );
    }
  };

  const renderSubscriptionTab = () => (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Current Plan</h3>
        <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xl font-bold text-black dark:text-white">
                {plans.find((p) => p.id === currentPlan)?.name}
              </h4>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Current
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              ${plans.find((p) => p.id === currentPlan)?.price}/month • Next billing: April 1, 2024
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Change Plan
            </button>
            <button className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              Cancel Plan
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-6 relative ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                  : 'border-slate-200 dark:border-slate-700'
              } ${
                currentPlan === plan.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'bg-white dark:bg-dark3'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {plan.name}
                </h4>
                <div className="text-3xl font-bold text-black dark:text-white">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    /{plan.billing}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={currentPlan === plan.id}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white">Billing History</h3>
        <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          Download All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Description
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Amount
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 px-4 text-black dark:text-white">{formatDate(item.date)}</td>
                <td className="py-3 px-4 text-black dark:text-white">{item.description}</td>
                <td className="py-3 px-4 text-black dark:text-white">${item.amount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    {item.invoice}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white">Payment Methods</h3>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Payment Method
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                {getBrandIcon(method.brand)}
                <div>
                  <div className="font-medium text-black dark:text-white flex items-center gap-2">
                    •••• •••• •••• {method.last4}
                    {method.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <button className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    Set Default
                  </button>
                )}
                <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Billing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Country
            </label>
            <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsageTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-6">Current Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black dark:text-white">Posts</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.posts.used} / {usage.posts.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black dark:text-white">Storage</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.storage.used} {usage.storage.unit} / {usage.storage.limit}{' '}
                {usage.storage.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '25.6%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black dark:text-white">Friends</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.friends.used} / {usage.friends.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '34.2%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black dark:text-white">
                Analytics Views
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.analyticsViews.used.toLocaleString()} / {usage.analyticsViews.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscription':
        return renderSubscriptionTab();
      case 'billing':
        return renderBillingTab();
      case 'payment':
        return renderPaymentTab();
      case 'usage':
        return renderUsageTab();
      default:
        return null;
    }
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1000px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your subscription, billing, and payment methods
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-8">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default BillingPage;
