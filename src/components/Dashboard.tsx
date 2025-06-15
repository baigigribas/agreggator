import React from 'react';
// Import icons for the dashboard statistics
import { TrendingUp, TrendingDown, Car, Home, Eye, Heart } from 'lucide-react';

// Define what data this component expects
interface DashboardProps {
  totalListings: number; // Total number of listings available
  newToday: number; // Number of new listings posted today
  savedCount: number; // Number of listings user has saved as favorites
  averagePrice: { cars: number; realEstate: number }; // Average prices for each category
}

// Dashboard component - shows overview statistics and key metrics
export function Dashboard({ totalListings, newToday, savedCount, averagePrice }: DashboardProps) {
  
  // Define the main statistics to display
  const stats = [
    {
      name: 'Total Listings', // What this statistic represents
      value: totalListings.toLocaleString(), // Format number with commas (e.g., 1,234)
      icon: Eye, // Icon to display
      change: '+12%', // Change indicator
      changeType: 'increase' as const, // Type of change (affects color)
    },
    {
      name: 'New Today',
      value: newToday.toString(), // Convert number to string
      icon: TrendingUp,
      change: '+5',
      changeType: 'increase' as const,
    },
    {
      name: 'Saved Listings',
      value: savedCount.toString(),
      icon: Heart,
      change: '', // No change indicator for this stat
      changeType: 'neutral' as const,
    },
  ];

  return (
    // Main dashboard container
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Main statistics grid - responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              {/* Icon */}
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              
              {/* Statistics content */}
              <div className="ml-4 w-0 flex-1">
                <dl>
                  {/* Statistic name */}
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="flex items-baseline">
                    {/* Main value */}
                    <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                    
                    {/* Change indicator (only show if change exists) */}
                    {item.change && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'increase'
                          ? 'text-green-600'   // Green for positive changes
                          : item.changeType === 'decrease'
                          ? 'text-red-600'     // Red for negative changes
                          : 'text-gray-500'    // Gray for neutral
                      }`}>
                        {/* Show appropriate trend icon */}
                        {item.changeType === 'increase' ? (
                          <TrendingUp className="h-3 w-3 flex-shrink-0 self-center mr-1" />
                        ) : item.changeType === 'decrease' ? (
                          <TrendingDown className="h-3 w-3 flex-shrink-0 self-center mr-1" />
                        ) : null}
                        <span>{item.change}</span>
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Average price section - two cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Average car price card */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Car className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Average Car Price</h3>
              <p className="text-2xl font-bold text-blue-600">
                {/* Format price with Euro symbol and thousands separator */}
                €{averagePrice.cars.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Average real estate price card */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Home className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Average Property Price</h3>
              <p className="text-2xl font-bold text-green-600">
                €{averagePrice.realEstate.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}