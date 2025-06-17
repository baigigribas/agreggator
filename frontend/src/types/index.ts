// Type definitions - these define the structure of data used throughout the application
// Think of these as blueprints that ensure data consistency

// User information structure
export interface User {
  id: string; // Unique identifier for each user
  name: string; // User's full name
  email: string; // User's email address
  role: 'visitor' | 'registered' | 'admin'; // What permissions the user has
  avatar?: string; // Optional profile picture URL (? means optional)
}

// Listing structure - represents a car or real estate listing
export interface Listing {
  id: number; // Use number for consistency
  title: string; // Listing title/name
  price: number; // Price as a number
  currency: string; // Currency code (EUR, USD, etc.)
  location: string; // Where the item is located
  type: 'car' | 'real-estate'; // What type of listing this is
  category: string; // Subcategory (SUV, apartment, etc.)
  images: string[]; // Array of image URLs
  description: string; // Detailed description
  specs: Record<string, any>; // Flexible object for specifications (different for cars vs real estate)
  datePosted: string; // When listing was posted (date string)
  source: string; // Which website this came from
  isFavorite?: boolean; // Optional - whether user favorited this
  favoriteId?: number;
  priceHistory?: Array<{ // Optional - price change history
    price: number; // Previous price
    date: string; // When price was this amount
  }>;
}

// Filter structure - represents a saved search configuration
export interface Filter {
  id: string; // Unique identifier
  name: string; // User-friendly name for this filter
  type: 'car' | 'real-estate'; // What type of listings to filter
  criteria: { // The actual filter conditions
    priceMin?: number; // Optional minimum price
    priceMax?: number; // Optional maximum price
    location?: string[]; // Optional array of allowed locations
    category?: string[]; // Optional array of allowed categories
    [key: string]: any; // Allow any other filter criteria
  };
  notifications: boolean; // Whether to send notifications for matches
  userId: string; // Which user this filter belongs to
  createdAt: string; // When filter was created
}

// Notification structure - represents alerts sent to users
export interface Notification {
  id: string; // Unique identifier
  title: string; // Short notification title
  message: string; // Detailed notification message
  type: 'new-listing' | 'price-change' | 'system'; // What kind of notification this is
  read: boolean; // Whether user has read this notification
  createdAt: string; // When notification was created (ISO date string)
  listingId?: string; // Optional - which listing this notification is about
}

export interface Favorite {
  id: number;
  listing_id: number;
}