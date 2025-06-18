import React from 'react';
import { Link } from 'react-router-dom';
// Import icons for displaying listing information
import { Heart, MapPin, Calendar, Gauge, Fuel, Settings, Home, Bed, Square } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../hooks/useAuth';

// Define what props this component expects
interface ListingCardProps {
  listing: Listing; // The listing data to display
  onFavorite: (id: number) => void; // Function to call when favorite button is clicked
  onHide: (id: number, hidden: boolean) => void; // Function to call when hide/unhide button is clicked
}

// Component that displays a single listing (car or property) as a card
export function ListingCard({ listing, onFavorite, onHide }: ListingCardProps) {
  const { user } = useAuth();

  // Function to format price with proper currency symbol and formatting
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to format date in Latvian format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV');
  };

  // Component to show car-specific information (year, mileage, fuel, transmission)
  const CarSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
      {/* Year */}
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        {listing.specs.year}
      </div>
      {/* Mileage with thousands separator */}
      <div className="flex items-center">
        <Gauge className="h-3 w-3 mr-1" />
        {listing.specs.mileage?.toLocaleString()} km
      </div>
      {/* Fuel type */}
      <div className="flex items-center">
        <Fuel className="h-3 w-3 mr-1" />
        {listing.specs.fuel}
      </div>
      {/* Transmission type */}
      <div className="flex items-center">
        <Settings className="h-3 w-3 mr-1" />
        {listing.specs.transmission}
      </div>
    </div>
  );

  // Component to show real estate-specific information (rooms, area, floor, year built)
  const RealEstateSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
      {/* Number of rooms */}
      <div className="flex items-center">
        <Bed className="h-3 w-3 mr-1" />
        {listing.specs.rooms} rooms
      </div>
      {/* Area in square meters */}
      <div className="flex items-center">
        <Square className="h-3 w-3 mr-1" />
        {listing.specs.area} m²
      </div>
      {/* Floor information (only show if available) */}
      {listing.specs.floor && (
        <div className="flex items-center">
          <Home className="h-3 w-3 mr-1" />
          {listing.specs.floor}/{listing.specs.totalFloors} floor
        </div>
      )}
      {/* Year built (only show if available) */}
      {listing.specs.yearBuilt && (
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Built {listing.specs.yearBuilt}
        </div>
      )}
    </div>
  );

  return (
    // Card container with hover effects - wrapped in Link for navigation
    console.log(user?.role),
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          {/* Main listing image */}
          <img
            src={listing.images[0]} // Use first image from array
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          
          {/* Favorite button (heart icon) */}
          <button
            aria-label="Favorite"
            onClick={e => {
              e.preventDefault();
              onFavorite(listing.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
              listing.isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600' // Red if favorited
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500' // White if not favorited
            }`}
          >
            {/* Heart icon - filled if favorited, outline if not */}
            <Heart className={`h-4 w-4 ${listing.isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* Source badge (which website the listing came from) */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {listing.source}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4">
          
          {/* Title and price row */}
          <div className="flex justify-between items-start mb-2">
            {/* Listing title (truncated if too long) */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{listing.title}</h3>
            {/* Price */}
            <span className="text-lg font-bold text-blue-600 ml-2">
              {formatPrice(listing.price, listing.currency)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            {listing.location}
          </div>

          {/* Specifications section - show different info for cars vs real estate */}
          <div className="mb-3">
            {listing.type === 'car' ? <CarSpecs /> : <RealEstateSpecs />}
          </div>

          {/* Description (truncated to 2 lines) */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{listing.description}</p>

          {/* Footer with date and category */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            {/* Posted date */}
            <span className="text-xs text-gray-500">Posted {formatDate(listing.datePosted)}</span>
            
            {/* Category badge with different colors for cars vs real estate */}
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                listing.type === 'car' 
                  ? 'bg-blue-100 text-blue-800'  // Blue for cars
                  : 'bg-green-100 text-green-800' // Green for real estate
              }`}>
                {listing.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin controls - show hide/unhide button if user is admin */}
      {user?.role === 'admin' && (
        <div className="mt-2">
          <button
            onClick={() => onHide(listing.id, !listing.hidden)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              listing.hidden
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {listing.hidden ? 'Unhide' : 'Hide'}
          </button>
        </div>
      )}
    </Link>
  );
}