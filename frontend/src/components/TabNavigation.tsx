import React from 'react';
// Import icons for each tab
import { Car, Home, SaveAll as All } from 'lucide-react';

// Define what props this component expects
interface TabNavigationProps {
  activeTab: 'all' | 'car' | 'real-estate'; // Which tab is currently selected
  onTabChange: (tab: 'all' | 'car' | 'real-estate') => void; // Function to call when tab changes
  counts: { all: number; car: number; realEstate: number }; // Number of listings in each category
}

// Tab navigation component - allows switching between all listings, car only, or real estate only
export function TabNavigation({ activeTab, onTabChange, counts }: TabNavigationProps) {
  
  // Define the tabs with their properties
  const tabs = [
    { 
      id: 'all' as const, // TypeScript const assertion for exact type
      label: 'All Listings', 
      icon: All, // Icon component to display
      count: counts.all // Number of listings to show in badge
    },
    { 
      id: 'car' as const, 
      label: 'Cars', 
      icon: Car, 
      count: counts.car 
    },
    { 
      id: 'real-estate' as const, 
      label: 'Real Estate', 
      icon: Home, 
      count: counts.realEstate 
    },
  ];

  return (
    // Container with background and border
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
      {/* Navigation container */}
      <nav className="flex space-x-1">
        {/* Loop through each tab and create a button */}
        {tabs.map((tab) => (
          <button
            key={tab.id} // Unique key for React rendering
            onClick={() => onTabChange(tab.id)} // Call function when clicked
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm' // Active tab styling (blue background)
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' // Inactive tab styling
            }`}
          >
            {/* Tab icon */}
            <tab.icon className="h-4 w-4 mr-2" />
            
            {/* Tab label */}
            {tab.label}
            
            {/* Count badge showing number of listings */}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white' // Active tab badge styling
                : 'bg-gray-200 text-gray-600' // Inactive tab badge styling
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}