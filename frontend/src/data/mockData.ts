// Import type definitions to ensure data matches expected structure
import { Listing, Filter, Notification } from '../types';

// Sample listings data
export const mockListings: Listing[] = [
  {
    id: 1, // Unique identifier
    title: 'BMW X5 3.0d xDrive', // Listing title
    price: 25000, // Price in the specified currency
    currency: 'EUR', // Currency code
    location: 'Riga', // Where the item is located
    type: 'car', // Type of listing (car or real-estate)
    category: 'SUV', // Subcategory (SUV, sedan, apartment, etc.)
    images: ['https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg'], // Array of image URLs
    description: 'Excellent condition BMW X5 with full service history', // Detailed description
    specs: { // Specifications object - different fields for cars vs real estate
      year: 2018, // Year manufactured
      mileage: 95000, // Kilometers driven
      fuel: 'Diesel', // Fuel type
      transmission: 'Automatic', // Transmission type
      color: 'Black' // Car color
    },
    datePosted: '2024-01-15', // When this listing was posted
    source: 'ss.com', // Which website this came from
    isFavorite: false, // Whether user has marked this as favorite
    priceHistory: [ // Historical price data for tracking changes
      { price: 27000, date: '2024-01-01' }, // Previous price
      { price: 25000, date: '2024-01-15' } // Current price
    ]
  },
  {
    id: 2,
    title: 'Modern Apartment in Old Town',
    price: 150000,
    currency: 'EUR',
    location: 'Riga Old Town',
    type: 'real-estate',
    category: 'Apartment',
    images: ['https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg'],
    description: 'Beautiful 2-bedroom apartment with city views',
    specs: { // Real estate specifications
      rooms: 2, // Number of rooms
      area: 75, // Area in square meters
      floor: 3, // Which floor
      totalFloors: 5, // Total floors in building
      yearBuilt: 2010 // Year building was constructed
    },
    datePosted: '2024-01-10',
    source: 'city24.lv',
    isFavorite: true // This one is marked as favorite
  },
  {
    id: 3,
    title: 'Audi A4 2.0 TDI',
    price: 18500,
    currency: 'EUR',
    location: 'Daugavpils',
    type: 'car',
    category: 'Sedan',
    images: ['https://images.pexels.com/photos/168938/pexels-photo-168938.jpeg'],
    description: 'Well maintained Audi A4 with low mileage',
    specs: {
      year: 2019,
      mileage: 65000,
      fuel: 'Diesel',
      transmission: 'Manual',
      color: 'Silver'
    },
    datePosted: '2024-01-12',
    source: 'auto24.lv',
    isFavorite: false
  },
  {
    id: 4,
    title: 'Family House with Garden',
    price: 280000,
    currency: 'EUR',
    location: 'Jurmala',
    type: 'real-estate',
    category: 'House',
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
    description: 'Spacious family house near the beach',
    specs: {
      rooms: 5,
      area: 180, // House area
      landArea: 800, // Land/garden area
      yearBuilt: 2005
    },
    datePosted: '2024-01-08',
    source: 'ss.com',
    isFavorite: true
  }
];

// Sample saved filters - these would be stored per user in the database
export const mockFilters: Filter[] = [
  {
    id: '1',
    name: 'BMW Cars Under 30k', // User-friendly name for this filter
    type: 'car', // What type of listings this filter applies to
    criteria: { // The actual filter conditions
      priceMax: 30000, // Maximum price
      category: ['SUV', 'Sedan'], // Allowed categories
      make: 'BMW' // Car manufacturer
    },
    notifications: true, // Whether to send notifications for matches
    userId: 'user1', // Which user this filter belongs to
    createdAt: '2024-01-01' // When filter was created
  },
  {
    id: '2',
    name: 'Riga Apartments',
    type: 'real-estate',
    criteria: {
      priceMax: 200000,
      location: ['Riga', 'Riga Old Town'], // Multiple allowed locations
      category: ['Apartment']
    },
    notifications: false, // No notifications for this filter
    userId: 'user1',
    createdAt: '2024-01-05'
  }
];

// Sample notifications - alerts sent to users about their favorited listings changes
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Listing deleted', // Notification title
    message: 'A listing you favorited has been deleted', // Detailed message
    type: 'system', // Type of notification
    read: false, // Whether user has read this notification
    createdAt: '2024-01-15T10:30:00Z', // When notification was created (ISO format)
    listingId: '1' // Which listing this notification is about
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: 'The price for "Modern Apartment in Old Town" has dropped by €5,000',
    type: 'price-change', // Different type of notification
    read: true, // This one has been read
    createdAt: '2024-01-14T15:20:00Z',
    listingId: '2'
  }
];