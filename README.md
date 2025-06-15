# Latvia Car & Real Estate Aggregator

A web application that helps people find cars and real estate in Latvia by collecting listings from multiple websites and showing them in one place.

## What This Application Does

Think of it like a search engine specifically for cars and apartments/houses

### Main Features:
- **Browse Listings**: See cars and properties from different Latvian websites in one place
- **Smart Filtering**: Filter by price, location, car type, property size, etc.
- **Save Favorites**: Mark listings you like to view them later
- **Search Everything**: Type to search across all listings
- **User Accounts**: Register and login to save your preferences
- **Dashboard**: See statistics about available listings and your saved items

## How It Works

1. **Data Collection**: The system visits websites like ss.com, city24.lv, and auto24.lv to collect new listings
2. **Data Storage**: All listings are saved in a database with standardized information
3. **User Interface**: This React app shows all the listings in a beautiful, easy-to-use interface
4. **Filtering**: Users can filter by price, location, type, etc. to find exactly what they want
5. **Notifications**: Users can set up alerts to get notified when new listings match their criteria

## Technology Stack (What It's Built With)

### Frontend (What Users See):
- **React**: A popular JavaScript library for building user interfaces
- **TypeScript**: JavaScript with extra features that help prevent bugs
- **Tailwind CSS**: A tool that makes styling websites easier and faster
- **Vite**: A fast build tool that helps develop and package the application

### Planned Backend:
- **Django**: A Python web framework for building the server
- **PostgreSQL**: A database to store all the listings and user data
- **Python**: Programming language for web scraping and data processing

## File Structure - to be updated

```
src/
├── components/         # Reusable pieces of the user interface
│   ├── Header.tsx      # Top navigation bar with search and user menu
│   ├── Dashboard.tsx   # Main statistics and overview page
│   ├── ListingCard.tsx # Individual listing display (each car/property)
│   ├── FilterPanel.tsx # Side panel for filtering listings
│   ├── TabNavigation.tsx # Tabs to switch between All/Cars/Real Estate
│   └── AuthModal.tsx   # Login and registration popup
├── data/
│   └── mockData.ts     # Sample data for testing (fake listings)
├── hooks/
│   └── useLocalStorage.ts # Helper to save data in browser
├── types/
│   └── index.ts        # Definitions of data structures
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Key Components Explained

### 1. App.tsx
The main "brain" of the application that:
- Manages all the data (listings, filters, user preferences)
- Decides what to show on screen
- Handles user interactions (clicking, searching, filtering)

### 2. Header.tsx
The top bar that includes:
- Logo and site name
- Search box
- Filter button
- User menu and notifications

### 3. ListingCard.tsx
Shows individual listings with:
- Photos of cars/properties
- Price and basic information
- Favorite button
- Specifications (year, mileage for cars; rooms, area for properties)

### 4. FilterPanel.tsx
A side panel that lets users filter by:
- Price range
- Location
- Category (sedan, SUV, apartment, house)
- Specific features (fuel type, number of rooms, etc.)

### 5. Dashboard.tsx
Shows important statistics:
- Total number of listings
- New listings today
- Average prices
- User's saved listings count

## How to Run This Application

1. **Install Node.js**: Download from nodejs.org (this lets you run JavaScript on your computer)
2. **Install Dependencies**: Run `npm install` in the project folder
3. **Start Development Server**: Run `npm run dev`
4. **Open in Browser**: Go to `http://localhost:5173`

## Current Status

 **Almost Completed**: Frontend interface with all the main features
 **Not Yet Built**: 
- Django backend server
- Database setup
- Web scraping system
- Real data integration
- User authentication system
- Email notifications

## Data

The application currently uses fake sample data including:
- BMW X5 and Audi A4 car listings
- Apartment and house listings in Riga and Jurmala
- Mock user notifications and filters

## User Roles

- **Visitor**: Can browse and search listings
- **Registered User**: Can save favorites, create filters, get notifications
- **Administrator**: Can manage users and data sources

## Next Steps for Full Implementation

1. **Set up Django backend** with PostgreSQL database
2. **Build web scrapers** for ss.com, city24.lv, auto24.lv
3. **Create API endpoints** to connect frontend to backend
4. **Implement user authentication** and database storage
5. **Add email notification system**
6. **Deploy to production server**