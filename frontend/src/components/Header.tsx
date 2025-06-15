import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import icons from lucide-react library
import { Search, Bell, User, Heart, Filter, Settings, LogIn, UserPlus } from 'lucide-react';

// Define what props (inputs) this component expects
interface HeaderProps {
  onSearchChange: (query: string) => void; // Function to call when search changes
  onShowFilters: () => void; // Function to call when filter button is clicked
  notificationCount: number; // Number of unread notifications
  onShowAuth: (mode: 'login' | 'register') => void; // Function to show auth modal
  isAuthenticated?: boolean; // Whether user is logged in
  user?: { name: string; email: string } | null; // User data if logged in
  onLogout: () => void; // Function to handle logout
}

// Header component - the top navigation bar of the application
export function Header({ 
  onSearchChange, 
  onShowFilters, 
  notificationCount, 
  onShowAuth,
  isAuthenticated = false,
  user = null,
  onLogout
}: HeaderProps) {
  // State to track what user has typed in search box
  const [searchQuery, setSearchQuery] = useState('');
  
  // State to control whether user menu dropdown is visible
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get current location to conditionally show search and filters
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  // Function called when user types in search box
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value; // Get what user typed
    setSearchQuery(query); // Update local state
    onSearchChange(query); // Tell parent component about the change
  };

  // Function to handle logout
  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  return (
    // Header container - sticky means it stays at top when scrolling
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                {/* Site name with colored parts */}
                Īpašumu<span className="text-orange-500">Burvis</span>
              </Link>
            </div>
          </div>

          {/* Search Bar - only show on listings page */}
          {!isProfilePage && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                {/* Search icon inside the input box */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                {/* Search input field */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange} // Call function when user types
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search cars, apartments, houses..."
                />
              </div>
            </div>
          )}

          {/* Navigation buttons on the right */}
          <div className="flex items-center space-x-4">
            
            {/* Filter button - only show on listings page */}
            {!isProfilePage && (
              <button
                onClick={onShowFilters} // Call function when clicked
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Filter className="h-5 w-5" />
              </button>
            )}

            {/* Show different content based on authentication status */}
            {isAuthenticated ? (
              // Authenticated user content
              <>
                {/* Favorites button */}
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Notifications button with badge */}
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Bell className="h-5 w-5" />
                    {/* Show notification count badge if there are unread notifications */}
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* User menu button with dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)} // Toggle menu visibility
                    className="flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    {user && (
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {user.name.split(' ')[0]} {/* Show first name only */}
                      </span>
                    )}
                  </button>

                  {/* Dropdown menu - only show if showUserMenu is true */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* User info header */}
                      {user && (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </>
                      )}
                      
                      {/* Menu items */}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Filters
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Saved Listings
                      </a>
                      <hr className="my-2" />
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 inline mr-2" />
                        Settings
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Non-authenticated user content - show login/register buttons
              <div className="flex items-center space-x-2">
                {/* Login button */}
                <button
                  onClick={() => onShowAuth('login')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </button>
                
                {/* Register button */}
                <button
                  onClick={() => onShowAuth('register')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}