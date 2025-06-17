import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Search, Filter as FilterIcon } from 'lucide-react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';

// Define what props this component expects
interface FavoritesPageProps {
  listings: Listing[]; // All listings to filter favorites from
  onFavorite: (id: string) => void; // Function to toggle favorite status
  isAuthenticated: boolean; // Whether user is logged in
  user: { name: string; email: string } | null; // User data
}

// Favorites page component - shows all listings the user has favorited
export function FavoritesPage({ listings, onFavorite, isAuthenticated, user }: FavoritesPageProps) {
  
  // Filter to get only favorited listings
  const favoriteListings = useMemo(() => {
    return listings.filter(listing => listing.isFavorite);
  }, [listings]);

  // Separate favorites by type for statistics
  const favoriteStats = useMemo(() => {
    const cars = favoriteListings.filter(l => l.type === 'car').length;
    const realEstate = favoriteListings.filter(l => l.type === 'real-estate').length;
    return { total: favoriteListings.length, cars, realEstate };
  }, [favoriteListings]);

  // If user is not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>

          {/* Not authenticated message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your saved listings and manage your favorites.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-2">
                Listings you've saved for later viewing
              </p>
            </div>
            
            {/* Favorites count badge */}
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">
                  {favoriteStats.total} Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {favoriteStats.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Favorites</h3>
                  <p className="text-2xl font-bold text-red-600">{favoriteStats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">🚗</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cars</h3>
                  <p className="text-2xl font-bold text-blue-600">{favoriteStats.cars}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">🏠</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
                  <p className="text-2xl font-bold text-green-600">{favoriteStats.realEstate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {favoriteListings.length === 0 ? (
          // Empty state - no favorites
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't saved any listings yet. Browse our listings and click the heart icon 
              to save items you're interested in.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Listings
              </Link>
            </div>
          </div>
        ) : (
          // Show favorite listings
          <div>
            {/* Results header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {favoriteStats.total} Favorite{favoriteStats.total !== 1 ? 's' : ''}
              </h2>
              
              {/* Quick actions */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse More Listings
                </Link>
              </div>
            </div>

            {/* Listings grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onFavorite={onFavorite}
                />
              ))}
            </div>

            {/* Bottom message */}
            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Want to find more listings like these?{' '}
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Continue browsing
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}