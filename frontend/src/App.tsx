import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TabNavigation } from './components/TabNavigation';
import { FilterPanel } from './components/FilterPanel';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';
import { FavoritesPage } from './components/FavoritesPage';
import { NotificationPanel } from './components/NotificationPanel';
import { mockListings, mockNotifications } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Listing, Notification } from './types';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';

// This is the main component that controls the entire application
function App() {
  const { user, login, register, logout } = useAuth();
  const [listings, setListings] = useLocalStorage<Listing[]>('listings', mockListings);
  const { favoriteIds, toggleFavorite } = useFavorites();

  // Track what the user is searching for
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track which tab is currently active (all listings, cars only, or real estate only)
  const [activeTab, setActiveTab] = useState<'all' | 'car' | 'real-estate'>('all');
  
  // Control whether the filter panel is visible
  const [showFilters, setShowFilters] = useState(false);
  
  // Store the filters that user has applied
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  
  // Control whether the login/register modal is visible
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Track whether user wants to login or register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Authentication state - track if user is logged in and their info
  const isAuthenticated = !!user && (user.role === 'registered' || user.role === 'admin');

  // Notification state
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', mockNotifications);

  // Mark listings as favorite
  const listingsWithFavorite = useMemo(() => {
    return listings.map(listing => ({
      ...listing,
      isFavorite: favoriteIds.includes(listing.id),
    }));
  }, [listings, favoriteIds]);

  // Filter listings based on search, tab, and applied filters
  // useMemo means this calculation only runs when the dependencies change (optimization)
  const filteredListings = useMemo(() => {
    let filtered = listings; // Start with all listings

    // Apply search filter - check if search query appears in title, location, or description
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        // Convert to lowercase for case-insensitive search
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter - show only cars or real estate if specific tab is selected
    if (activeTab !== 'all') {
      // Replace dash with dash for matching (real-estate -> real-estate)
      filtered = filtered.filter(listing => listing.type === activeTab.replace('-', '-'));
    }

    // Apply advanced filters if any are set
    if (Object.keys(appliedFilters).length > 0) {
      filtered = filtered.filter(listing => {
        // Check minimum price filter
        if (appliedFilters.priceMin && listing.price < parseInt(appliedFilters.priceMin)) {
          return false; // Exclude this listing
        }
        
        // Check maximum price filter
        if (appliedFilters.priceMax && listing.price > parseInt(appliedFilters.priceMax)) {
          return false; // Exclude this listing
        }

        // Check location filter
        if (appliedFilters.location && appliedFilters.location !== '') {
          if (!listing.location.toLowerCase().includes(appliedFilters.location.toLowerCase())) {
            return false; // Exclude this listing
          }
        }

        // Check category filter (sedan, SUV, apartment, etc.)
        if (appliedFilters.category && appliedFilters.category !== '') {
          if (listing.category.toLowerCase() !== appliedFilters.category.toLowerCase()) {
            return false; // Exclude this listing
          }
        }

        return true; // Include this listing
      });
    }

    return filtered; // Return the filtered results
  }, [listings, searchQuery, activeTab, appliedFilters]); // Recalculate when these values change

  // Calculate dashboard statistics
  // useMemo optimizes this so it only recalculates when listings change
  const stats = useMemo(() => {
    const totalListings = listings.length;
    
    // Count listings posted today (using mock date for demo)
    const newToday = listings.filter(l => l.datePosted === '2024-01-15').length;
    
    // Count how many listings user has saved as favorites
    const savedCount = listings.filter(l => l.isFavorite).length;
    
    // Separate car and real estate listings for price calculations
    const carListings = listings.filter(l => l.type === 'car');
    const realEstateListings = listings.filter(l => l.type === 'real-estate');
    
    // Calculate average car price
    const averageCarPrice = carListings.length > 0 
      ? Math.round(carListings.reduce((sum, l) => sum + l.price, 0) / carListings.length)
      : 0;
    
    // Calculate average real estate price
    const averageRealEstatePrice = realEstateListings.length > 0
      ? Math.round(realEstateListings.reduce((sum, l) => sum + l.price, 0) / realEstateListings.length)
      : 0;

    // Return all calculated statistics
    return {
      totalListings,
      newToday,
      savedCount,
      averagePrice: {
        cars: averageCarPrice,
        realEstate: averageRealEstatePrice
      }
    };
  }, [listings]); // Recalculate when listings change

  // Count listings for each tab
  const tabCounts = {
    all: listings.length,
    car: listings.filter(l => l.type === 'car').length,
    realEstate: listings.filter(l => l.type === 'real-estate').length
  };

  // Main listings page component
  const ListingsPage = () => (
    <>
      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard showing statistics */}
        <Dashboard {...stats} />
        
        {/* Tab navigation to switch between all/cars/real estate */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

        {/* Header showing results count and clear filters button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredListings.length} {activeTab === 'all' ? 'Listings' : activeTab === 'car' ? 'Cars' : 'Properties'} Found
          </h2>
          
          {/* Show clear filters button only if filters are applied */}
          {Object.keys(appliedFilters).length > 0 && (
            <button
              onClick={() => setAppliedFilters({})} // Clear all filters
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Show listings or "no results" message */}
        {filteredListings.length === 0 ? (
          // No results found - show friendly message
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find more results.</p>
          </div>
        ) : (
          // Show listings in a responsive grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => {
              const listingWithFavorite = listingsWithFavorite.find(l => l.id === listing.id) || listing;
              return (
                <ListingCard
                  key={listing.id}
                  listing={listingWithFavorite}
                  onFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );

  // Handler to mark a notification as read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Handler to clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  function handleApplyFilters(filters: any): void {
    setAppliedFilters(filters);
    setShowFilters(false);
  }

  function handleShowAuth(mode: 'login' | 'register'): void {
    setAuthMode(mode);
    setShowAuthModal(true);
  }

  // Render the user interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header component with search and navigation */}
      <Header
        onSearchChange={setSearchQuery} // Pass function to handle search changes
        onShowFilters={() => setShowFilters(true)} // Pass function to show filter panel
        onShowNotifications={() => setShowNotificationPanel(true)}
        notificationCount={notifications.filter(n => !n.read).length}
        onShowAuth={handleShowAuth} // Pass function to show auth modal
        isAuthenticated={isAuthenticated} // Pass authentication status
        user={user} // Pass user data
        onLogout={logout} // Pass logout function
      />

      {/* Main content with routing */}
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route 
          path="/listing/:id" 
          element={
            <ListingDetail 
              listings={listingsWithFavorite} 
              onFavorite={toggleFavorite}
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfilePage 
              user={user} 
              isAuthenticated={isAuthenticated}
            />
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              listings={listingsWithFavorite} 
              favoriteIds={favoriteIds}
              onFavorite={toggleFavorite}
              isAuthenticated={isAuthenticated}
              user={user}
            />
          } 
        />
      </Routes>

      {/* Filter panel (slides in from right when opened) */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)} // Function to close panel
        onApplyFilters={handleApplyFilters} // Function to handle filter application
      />

      {/* Authentication modal (login/register popup) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)} // Function to close modal
        mode={authMode} // Whether showing login or register form
        onModeChange={setAuthMode} // Function to switch between login/register
        onRegister={register}
        onLogin={login}
      />

      <NotificationPanel
        isOpen={showNotificationPanel}
        notifications={notifications}
        onClose={() => setShowNotificationPanel(false)}
        onMarkRead={handleMarkNotificationRead}
        onClearAll={handleClearAllNotifications}
        onRestore={() => setNotifications(mockNotifications)}
        user={user}
      />
    </div>
  );
}

export default App;