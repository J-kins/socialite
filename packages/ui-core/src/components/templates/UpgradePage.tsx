import React, { useState } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import '../../../styles/templates/upgrade-page.css';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'outline' | 'secondary';
}

export interface UpgradePageProps {
  plans?: PricingPlan[];
  billingInterval?: 'month' | 'year';
  currentPlan?: string;
  features?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    title: string;
    content: string;
    avatar: string;
    rating: number;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
}

export const UpgradePage: React.FC<UpgradePageProps> = ({
  plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: '$',
      interval: 'month',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 posts per day',
        'Basic analytics',
        'Community support',
        'Mobile app access',
      ],
      isCurrentPlan: true,
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      originalPrice: 19.99,
      currency: '$',
      interval: 'month',
      description: 'Best for content creators',
      features: [
        'Unlimited posts',
        'Advanced analytics',
        'Priority support',
        'Custom themes',
        'Video uploads up to 1GB',
        'Scheduled posts',
      ],
      isPopular: true,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary',
    },
    {
      id: 'business',
      name: 'Business',
      price: 29.99,
      currency: '$',
      interval: 'month',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced integrations',
        'White-label options',
        'Dedicated account manager',
        'Custom analytics reports',
        'API access',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary',
    },
  ],
  billingInterval = 'month',
  currentPlan = 'free',
  features = [
    {
      title: 'Advanced Analytics',
      description:
        'Get detailed insights into your content performance with advanced analytics and reporting.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team members with real-time collaboration features.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
    },
    {
      title: 'Priority Support',
      description: 'Get help when you need it with our priority support for premium users.',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
  testimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Content Creator',
      content:
        'The Pro plan has transformed how I manage my social media. The analytics are incredibly detailed and the scheduling features save me hours every week.',
      avatar: '/assets/images/avatars/avatar-1.jpg',
      rating: 5,
    },
    {
      id: '2',
      name: 'Mike Chen',
      title: 'Marketing Director',
      content:
        'Our team productivity has increased significantly since switching to the Business plan. The collaboration features are exactly what we needed.',
      avatar: '/assets/images/avatars/avatar-2.jpg',
      rating: 5,
    },
  ],
  faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer:
        'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes, you can save up to 20% when you choose annual billing instead of monthly.',
    },
  ],
  className,
}) => {
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>(billingInterval);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId);
    // Handle plan selection logic
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const getDiscountPercentage = (plan: PricingPlan) => {
    if (!plan.originalPrice || plan.originalPrice <= plan.price) return 0;
    return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
  };

  return (
    <div className={`upgrade-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Upgrade Your Experience
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Unlock powerful features and take your social
              media presence to the next level.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setSelectedInterval('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedInterval === 'month'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedInterval('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  selectedInterval === 'year'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Annual
                <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
                  Save 20%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const discountPercentage = getDiscountPercentage(plan);
              const yearlyPrice =
                selectedInterval === 'year' ? plan.price * 12 * 0.8 : plan.price * 12;
              const displayPrice = selectedInterval === 'year' ? yearlyPrice / 12 : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    plan.isPopular
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-200 dark:border-gray-700'
                  } ${plan.isCurrentPlan ? 'ring-2 ring-green-500/20 border-green-500' : ''}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" className="px-4 py-2">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {plan.isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="success" className="px-4 py-2">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">
                          {plan.currency}
                          {displayPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          /{selectedInterval}
                        </span>
                      </div>

                      {plan.originalPrice && discountPercentage > 0 && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg text-gray-500 line-through">
                            {plan.currency}
                            {plan.originalPrice.toFixed(2)}
                          </span>
                          <Badge variant="danger" size="sm">
                            {discountPercentage}% OFF
                          </Badge>
                        </div>
                      )}

                      {selectedInterval === 'year' && plan.price > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          Save {plan.currency}
                          {(plan.price * 12 * 0.2).toFixed(2)} per year
                        </p>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.buttonVariant || 'primary'}
                      size="lg"
                      className="w-full"
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={plan.isCurrentPlan}
                    >
                      {plan.buttonText || 'Get Started'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Everything you need to manage your social media presence effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join thousands of satisfied users who have upgraded their experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        {renderStarRating(testimonial.rating)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {testimonial.title}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">"{testimonial.content}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Have questions? We have answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full py-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="pb-6">
                      <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Upgrade?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already upgraded their experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary-600 border-white hover:bg-primary-50"
              >
                View All Plans
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-primary-800 text-white hover:bg-primary-900"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { UpgradePageProps, PricingPlan };
