import React, { useState } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { LightboxGallery } from '../organisms/LightboxGallery';
import '../../../styles/templates/product-view-page.css';

export interface ProductViewPageProps {
  productId?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  description?: string;
  images?: string[];
  seller?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    isVerified?: boolean;
  };
  category?: string;
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  location?: string;
  features?: string[];
  specifications?: { [key: string]: string };
  reviews?: Array<{
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    rating: number;
    comment: string;
    date: string;
  }>;
  relatedProducts?: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
  }>;
  className?: string;
}

export const ProductViewPage: React.FC<ProductViewPageProps> = ({
  productId = 'product-1',
  title = 'Amazing Product for Sale',
  price = 299.99,
  originalPrice = 399.99,
  currency = '$',
  description = 'This is an amazing product in excellent condition. Perfect for anyone looking for quality and value.',
  images = [
    '/assets/images/products/product-1.jpg',
    '/assets/images/products/product-1-2.jpg',
    '/assets/images/products/product-1-3.jpg',
  ],
  seller = {
    id: 'seller-1',
    name: 'John Smith',
    avatar: '/assets/images/avatars/avatar-1.jpg',
    rating: 4.8,
    totalReviews: 124,
    isVerified: true,
  },
  category = 'Electronics',
  condition = 'like-new',
  location = 'New York, NY',
  features = ['High Quality', 'Fast Shipping', 'Warranty Included', 'Money Back Guarantee'],
  specifications = {
    Brand: 'Premium Brand',
    Model: 'XYZ-123',
    Color: 'Black',
    Weight: '2.5 lbs',
    Dimensions: '10 x 8 x 3 inches',
  },
  reviews = [],
  relatedProducts = [],
  className,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>(
    'description'
  );

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', { productId, quantity });
  };

  const handleBuyNow = () => {
    // Buy now logic
    console.log('Buy now:', { productId, quantity });
  };

  const handleContactSeller = () => {
    // Contact seller logic
    console.log('Contact seller:', seller.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const renderStarRating = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400 fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`}
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half-star)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-300`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return <div className="flex items-center">{stars}</div>;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'like-new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'fair':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`product-view-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="main-image relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFavorite}
                  className={`absolute top-4 right-4 ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isFavorited ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{category}</Badge>
                  <Badge variant="outline" className={getConditionColor(condition)}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
              </div>

              {/* Price */}
              <div className="price-section">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currency}
                    {price.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {currency}
                        {originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="danger">{discountPercentage}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="seller-info flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar src={seller.avatar} alt={seller.name} size="lg" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{seller.name}</h3>
                      {seller.isVerified && (
                        <Badge variant="primary" size="sm">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStarRating(seller.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({seller.totalReviews} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleContactSeller}>
                  Contact Seller
                </Button>
              </div>

              {/* Features */}
              <div className="features">
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="actions space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300 dark:border-gray-600">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="primary" size="lg" onClick={handleBuyNow} className="flex-1">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleAddToCart} className="flex-1">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                {[
                  { key: 'description', label: 'Description' },
                  { key: 'specifications', label: 'Specifications' },
                  { key: 'reviews', label: `Reviews (${reviews.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p
                    className={`text-gray-700 dark:text-gray-300 ${!showFullDescription ? 'line-clamp-4' : ''}`}
                  >
                    {description}
                  </p>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Button>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{key}:</span>
                      <span className="text-gray-700 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6"
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar src={review.user.avatar} alt={review.user.name} size="md" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {review.user.name}
                              </h4>
                              {renderStarRating(review.rating)}
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Related Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-2">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {product.seller}
                    </p>
                    <p className="font-bold text-primary-600 dark:text-primary-400">
                      {currency}
                      {product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { ProductViewPageProps };
