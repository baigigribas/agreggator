import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Home, 
  Bed, 
  Square, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Euro,
  Car,
  Building
} from 'lucide-react';
import { Listing } from '../types';

interface ListingDetailProps {
  listings: Listing[];
  onFavorite: (id: string) => void;
}

export function ListingDetail({ listings, onFavorite }: ListingDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Find the listing by ID
  const listing = listings.find(l => l.id === id);

  // If listing not found, show error
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navigate to previous/next image
  const previousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  // Share listing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this ${listing.type}: ${listing.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Mock contact information (in real app, this would come from the listing data)
  const contactInfo = {
    name: 'John Doe',
    phone: '+371 20 123 456',
    email: 'john.doe@example.com',
    company: listing.source === 'ss.com' ? 'SS.com User' : 'Auto Dealer'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onFavorite(listing.id)}
                className={`p-2 rounded-lg transition-colors ${
                  listing.isFavorite
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${listing.isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-96">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Source Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {listing.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Title and Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Posted {formatDate(listing.datePosted)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.type === 'car' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {listing.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              
              {listing.type === 'car' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Year</div>
                      <div className="font-semibold">{listing.specs.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Gauge className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Mileage</div>
                      <div className="font-semibold">{listing.specs.mileage?.toLocaleString()} km</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Fuel</div>
                      <div className="font-semibold">{listing.specs.fuel}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-semibold">{listing.specs.transmission}</div>
                    </div>
                  </div>
                  {listing.specs.color && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Car className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Color</div>
                        <div className="font-semibold">{listing.specs.color}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Rooms</div>
                      <div className="font-semibold">{listing.specs.rooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Square className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Area</div>
                      <div className="font-semibold">{listing.specs.area} m²</div>
                    </div>
                  </div>
                  {listing.specs.floor && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Floor</div>
                        <div className="font-semibold">{listing.specs.floor}/{listing.specs.totalFloors}</div>
                      </div>
                    </div>
                  )}
                  {listing.specs.yearBuilt && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Built</div>
                        <div className="font-semibold">{listing.specs.yearBuilt}</div>
                      </div>
                    </div>
                  )}
                  {listing.specs.landArea && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Square className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Land Area</div>
                        <div className="font-semibold">{listing.specs.landArea} m²</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Price History */}
            {listing.priceHistory && listing.priceHistory.length > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Price History</h2>
                <div className="space-y-3">
                  {listing.priceHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600">{formatDate(entry.date)}</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(entry.price, listing.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Seller</h3>
              
              {!showContactInfo ? (
                <button
                  onClick={() => setShowContactInfo(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Show Contact Info
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Seller</div>
                    <div className="font-semibold text-gray-900">{contactInfo.name}</div>
                    <div className="text-sm text-gray-600">{contactInfo.company}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-3" />
                      {contactInfo.phone}
                    </a>
                    
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-3" />
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Original Listing Link */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Original Listing</h3>
              <a
                href={`https://${listing.source}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-3" />
                View on {listing.source}
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Opens in a new tab. This will take you to the original listing on {listing.source}.
              </p>
            </div>

            {/* Listing Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Views
                  </div>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </div>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Days Listed
                  </div>
                  <span className="font-semibold">
                    {Math.floor((new Date().getTime() - new Date(listing.datePosted).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}