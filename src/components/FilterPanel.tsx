import React, { useState } from 'react';
// Import icons for the filter interface
import { X, MapPin, Car, Home, Euro, Calendar } from 'lucide-react';

// Define what props this component expects
interface FilterPanelProps {
  isOpen: boolean; // Whether the panel is visible
  onClose: () => void; // Function to call when closing the panel
  onApplyFilters: (filters: any) => void; // Function to call when applying filters
}

// Filter panel component - slides in from the right side of screen
export function FilterPanel({ isOpen, onClose, onApplyFilters }: FilterPanelProps) {
  
  // Track which tab is active (cars or real estate filters)
  const [activeTab, setActiveTab] = useState<'cars' | 'real-estate'>('cars');
  
  // Store all filter values in one object
  const [filters, setFilters] = useState({
    type: 'cars', // Which type of listing to filter
    priceMin: '', // Minimum price
    priceMax: '', // Maximum price
    location: '', // Location filter
    category: '', // Category (sedan, SUV, apartment, etc.)
    yearMin: '', // Minimum year
    yearMax: '', // Maximum year
    
    // Car-specific filters
    mileageMax: '', // Maximum mileage for cars
    fuel: '', // Fuel type (petrol, diesel, etc.)
    transmission: '', // Transmission type (manual, automatic)
    
    // Real estate-specific filters
    roomsMin: '', // Minimum number of rooms
    roomsMax: '', // Maximum number of rooms
    areaMin: '', // Minimum area in square meters
    areaMax: '' // Maximum area in square meters
  });

  // Function to update a single filter value
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Function called when user clicks "Apply Filters" button
  const handleApply = () => {
    onApplyFilters({ ...filters, type: activeTab }); // Send filters to parent component
    onClose(); // Close the filter panel
  };

  // Function to reset all filters to empty values
  const handleReset = () => {
    setFilters({
      type: activeTab,
      priceMin: '',
      priceMax: '',
      location: '',
      category: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuel: '',
      transmission: '',
      roomsMin: '',
      roomsMax: '',
      areaMin: '',
      areaMax: ''
    });
  };

  // Don't render anything if panel is not open
  if (!isOpen) return null;

  return (
    // Full-screen overlay with semi-transparent background
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
      {/* Filter panel that slides in from right */}
      <div className="w-96 bg-white h-full shadow-xl overflow-y-auto">
        <div className="p-6">
          
          {/* Header with title and close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose} // Close panel when clicked
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs to switch between car and real estate filters */}
          <div className="flex border-b border-gray-200 mb-6">
            {/* Cars tab */}
            <button
              onClick={() => setActiveTab('cars')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'cars'
                  ? 'border-blue-500 text-blue-600' // Active tab styling
                  : 'border-transparent text-gray-500 hover:text-gray-700' // Inactive tab styling
              }`}
            >
              <Car className="h-4 w-4 inline mr-2" />
              Cars
            </button>
            
            {/* Real Estate tab */}
            <button
              onClick={() => setActiveTab('real-estate')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'real-estate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Real Estate
            </button>
          </div>

          {/* Filter form fields */}
          <div className="space-y-6">
            
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="h-4 w-4 inline mr-1" />
                Price Range (EUR)
              </label>
              {/* Two input fields side by side for min and max price */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              {/* Dropdown with predefined Latvian cities */}
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="riga">Riga</option>
                <option value="daugavpils">Daugavpils</option>
                <option value="liepaja">Liepāja</option>
                <option value="jelgava">Jelgava</option>
                <option value="jurmala">Jūrmala</option>
                <option value="ventspils">Ventspils</option>
              </select>
            </div>

            {/* Category Filter - different options for cars vs real estate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {/* Show different options based on active tab */}
                {activeTab === 'cars' ? (
                  <>
                    <option value="">All Categories</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                    <option value="wagon">Wagon</option>
                  </>
                ) : (
                  <>
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="condo">Condo</option>
                  </>
                )}
              </select>
            </div>

            {/* Car-specific filters - only show when cars tab is active */}
            {activeTab === 'cars' && (
              <>
                {/* Year Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Year Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="From"
                      value={filters.yearMin}
                      onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      value={filters.yearMax}
                      onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Maximum Mileage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Mileage (km)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={filters.mileageMax}
                    onChange={(e) => handleFilterChange('mileageMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => handleFilterChange('fuel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </>
            )}

            {/* Real estate-specific filters - only show when real estate tab is active */}
            {activeTab === 'real-estate' && (
              <>
                {/* Number of Rooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rooms
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.roomsMin}
                      onChange={(e) => handleFilterChange('roomsMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.roomsMax}
                      onChange={(e) => handleFilterChange('roomsMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Area Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (m²)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.areaMin}
                      onChange={(e) => handleFilterChange('areaMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.areaMax}
                      onChange={(e) => handleFilterChange('areaMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action buttons at bottom of panel */}
          <div className="flex space-x-3 mt-8">
            {/* Reset button - clears all filters */}
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
            {/* Apply button - applies filters and closes panel */}
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}