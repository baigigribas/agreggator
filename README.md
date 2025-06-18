# Latvia Car & Real Estate Aggregator

A comprehensive web application that aggregates car and real estate listings from multiple Latvian websites, providing users with a centralized platform to search, filter, and manage their property interests.

## What This Application Does

This is a full-stack web application that serves as a one-stop solution for finding cars and real estate in Latvia by collecting and organizing listings from various sources.

### Main Features:
- **Unified Listing Browser**: View cars and properties from different Latvian websites in one streamlined interface
- **Advanced Filtering System**: Filter by price range, location, vehicle specifications, property details, and more
- **Personal Favorites Management**: Save and organize listings of interest with a dedicated favorites system
- **Intelligent Search**: Full-text search across all listings with real-time results
- **User Account System**: Complete registration and authentication with personalized profiles
- **Interactive Dashboard**: Comprehensive statistics and analytics about listings and user activity
- **Detailed Listing Views**: In-depth information pages with contact details and original source links
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## How It Works

1. **Data Aggregation**: The system continuously monitors websites like ss.com, city24.lv, and auto24.lv for new listings
2. **Data Processing**: All listings are processed, standardized, and stored in our PostgreSQL database
3. **Real-time Updates**: The React frontend provides live updates and seamless user interactions
4. **Smart Filtering**: Advanced filtering algorithms help users find exactly what they're looking for
5. **User Management**: Complete user authentication and profile management system
6. **Notification System**: Users receive alerts when new listings match their saved criteria

## Technology Stack

### Frontend:
- **React 18**: Modern JavaScript library for building dynamic user interfaces
- **TypeScript**: Type-safe JavaScript for better development experience and fewer bugs
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for single-page application navigation
- **Vite**: Next-generation frontend build tool for fast development and optimized production builds
- **Lucide React**: Beautiful, customizable icon library

### Backend:
- **Django 5.2**: High-level Python web framework for rapid development
- **Django REST Framework**: Powerful toolkit for building Web APIs
- **SQLite3**: Advanced open-source relational database
- **Node.js**: JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts
- **Python 3.12**: Modern Python runtime with excellent performance

### Development Tools:
- **ESLint**: Code linting for consistent code quality
- **TypeScript Compiler**: Static type checking
- **Django Admin**: Built-in administrative interface
- **CORS Headers**: Cross-origin resource sharing configuration

## Project Structure

```
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.tsx      # Navigation bar with search and user menu
│   │   │   ├── Dashboard.tsx   # Statistics and overview dashboard
│   │   │   ├── ListingCard.tsx # Individual listing display component
│   │   │   ├── ListingDetail.tsx # Detailed listing view
│   │   │   ├── FilterPanel.tsx # Advanced filtering interface
│   │   │   ├── FavoritesPage.tsx # User favorites management
│   │   │   ├── ProfilePage.tsx # User profile and settings
│   │   │   ├── TabNavigation.tsx # Category navigation tabs
│   │   │   ├── AuthModal.tsx   # Login and registration modal
│   │   │   └── NotificationPanel.tsx # User notifications
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts      # Authentication management
│   │   │   ├── useFavorites.ts # Favorites functionality
│   │   │   └── useLocalStorage.ts # Browser storage utilities
│   │   ├── api/                # API communication layer
│   │   │   ├── auth.ts         # Authentication endpoints
│   │   │   ├── listings.ts     # Listing data endpoints
│   │   │   └── favorites.ts    # Favorites management endpoints
│   │   ├── types/              # TypeScript type definitions
│   │   └── data/               # Mock data for development
│   └── public/                 # Static assets
├── backend/                    # Django backend
│   ├── agg_backend/           # Main Django project
│   │   ├── settings.py        # Django configuration
│   │   ├── urls.py            # URL routing
│   │   └── wsgi.py            # WSGI configuration
│   ├── listings/              # Main Django app
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # Data serialization
│   │   ├── urls.py            # App URL patterns
│   │   └── admin.py           # Admin interface configuration
│   └── manage.py              # Django management script
└── requirements.txt           # Python dependencies
```

## Key Features Explained

### 1. User Authentication System
- Secure user registration and login
- Profile management with photo uploads
- Role-based access control (Visitor, Registered User, Administrator)
- Password change functionality

### 2. Listing Management
- Comprehensive car and real estate listings
- Detailed specifications and photo galleries
- Price history tracking
- Source attribution and original listing links

### 3. Advanced Search & Filtering
- Real-time search across all listing content
- Category-specific filters (cars vs. real estate)
- Price range, location, and specification filtering

### 4. Favorites System
- Save listings for later viewing
- Organized favorites page with statistics
- Quick access from any listing
- Persistent storage across sessions

### 5. Dashboard Analytics
- Total listing counts and trends
- Average pricing information
- User activity statistics
- New listing notifications

## Database Schema

### Core Models:
- **User**: Extended Django user model with roles and preferences
- **Listing**: Main listing model with flexible specifications
- **Filter**: User-defined search filters
- **Favorite**: User-listing relationships
- **Notification**: User notification system

## API Endpoints

### Authentication:
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration

### Listings:
- `GET /api/listings/` - List all listings
- `GET /api/listings/{id}/` - Get specific listing
- `GET /api/sources/` - List data sources

### User Management:
- `GET /api/users/` - User list (admin only)
- `GET /api/favorites/` - User favorites
- `POST /api/favorites/` - Add favorite
- `DELETE /api/favorites/{id}/` - Remove favorite

## Installation & Setup

### Prerequisites:
- Node.js 18+ and npm
- Python 3.12+
- SQLite 3

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## User Roles & Permissions

### Visitor
- Browse all listings
- Use search and filtering
- View listing details

### Registered User
- All visitor permissions
- Save favorite listings
- Create custom filters
- Receive notifications
- Manage profile

### Administrator
- All user permissions
- Manage data sources
- Hide/unhide listings
- User management
- System administration

## Data Sources

The application aggregates listings from:
- **ss.com**: Latvia's largest classified ads website
- **city24.lv**: Real estate focused platform
- **auto24.lv**: Automotive marketplac

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## Support

For support and questions, please contact our development team or create an issue in the project repository.
