# This file defines the structure of the database tables
# each class = table, each field = column

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class User(AbstractUser):
    # Defines the different types of users
    USER_ROLES = [
        ('visitor', 'Visitor'),           # Can browse listings
        ('registered', 'Registered User'), # Can save favorites, get notifications
        ('admin', 'Administrator'),        # Can manage everything
    ]
    
    # Uses UUID instead of regular ID for better security (whatever that means)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # What type of user is this person?
    role = models.CharField(max_length=20, choices=USER_ROLES, default='visitor')
    
    # Does this user want to receive email notifications?
    email_notifications = models.BooleanField(default=True)
    
    # When was this user account created and last updated?
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Source model - represents the websites you scrape data from
# Like SS.com, Auto24.lv, city24.lv
class Source(models.Model):
    # What type of listings does this source provide?
    SOURCE_TYPES = [
        ('car', 'Car Listings'),
        ('real_estate', 'Real Estate'),
    ]
    
    # The name of the website (like "SS.com")
    name = models.CharField(max_length=100)
    
    # The website URL
    url = models.URLField()
    
    # What type of listings: cars or real estate?
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    
    # Is this source currently being scraped?
    is_active = models.BooleanField(default=True)
    
    # When did we last scrape this source?
    last_scraped = models.DateTimeField(null=True, blank=True)
    
    # When was this source added to our system?
    created_at = models.DateTimeField(auto_now_add=True)
    
    # This makes the source appear nicely in Django admin
    def __str__(self):
        return f"{self.name} ({self.source_type})"

# Listing model - represents individual car or real estate listings
# This is the main table that stores all the listings you scrape
class Listing(models.Model):
    # What type of listing is this?
    LISTING_TYPES = [
        ('car', 'Car'),
        ('real_estate', 'Real Estate'),
    ]
    
    # For cars: what type of fuel do they use?
    FUEL_TYPES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('hybrid', 'Hybrid'),
        ('electric', 'Electric'),
        ('other', 'Other'),
    ]
    
    # For real estate: what type of property is it?
    PROPERTY_TYPES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('room', 'Room'),
        ('commercial', 'Commercial'),
        ('land', 'Land'),
        ('other', 'Other'),
    ]
    
    # === BASIC INFORMATION (for both cars and real estate) ===
    
    # Unique ID for this listing in our system
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # The original ID from the source website (like SS.com listing ID)
    external_id = models.CharField(max_length=100, unique=True)
    
    # Is this a car or real estate listing?
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPES)
    
    # Which website did we scrape this from? (links to Source table)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    
    # The listing title (like "BMW X5 2020" or "3-room apartment in Riga")
    title = models.CharField(max_length=500)
    
    # Full description of the listing
    description = models.TextField(blank=True)
    
    # How much does it cost? (in EUR)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Where is it located? (city name)
    location = models.CharField(max_length=100)
    
    # List of image URLs (stored as JSON array)
    images = models.JSONField(default=list, blank=True)
    
    # Link back to the original listing on the source website
    url = models.URLField()
    
    # === CAR-SPECIFIC INFORMATION ===
    # These fields are only filled if listing_type = 'car'
    
    # What year was the car made?
    year = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1900), MaxValueValidator(2030)])
    
    # How many kilometers has it driven?
    mileage = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    
    # What type of fuel does it use?
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES, null=True, blank=True)
    
    # What category of car? (SUV, Sedan, Hatchback, etc.)
    car_category = models.CharField(max_length=100, null=True, blank=True)
    
    # === REAL ESTATE-SPECIFIC INFORMATION ===
    # These fields are only filled if listing_type = 'real_estate'
    
    # How many rooms does the property have?
    rooms = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    
    # How big is the property? (in square meters)
    area = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # What type of property is it?
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES, null=True, blank=True)
    
    # === SYSTEM INFORMATION ===
    
    # Is this listing still available? (gets set to False if listing disappears from source)
    is_active = models.BooleanField(default=True)
    
    # When was this listing first added to our database?
    created_at = models.DateTimeField(auto_now_add=True)
    
    # When was this listing last updated?
    updated_at = models.DateTimeField(auto_now=True)
    
    # When did we scrape this listing?
    scraped_at = models.DateTimeField(auto_now_add=True)
    
    # Database indexes to make searches faster
    class Meta:
        indexes = [
            models.Index(fields=['listing_type', 'price']),  # Fast search by type and price
            models.Index(fields=['location']),               # Fast search by location
            models.Index(fields=['created_at']),             # Fast search by date
        ]
    
    # How this listing appears in Django admin
    def __str__(self):
        return f"{self.title} - €{self.price}"

# Filter model - represents saved search filters that users create
# When users want to get notifications about new cars under €15,000 in Riga
class Filter(models.Model):
    FILTER_TYPES = [
        ('car', 'Car Filter'),
        ('real_estate', 'Real Estate Filter'),
    ]
    
    # Unique ID for this filter
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Which user created this filter?
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # What did the user name this filter? (like "Cheap cars in Riga")
    name = models.CharField(max_length=200)
    
    # Is this for cars or real estate?
    filter_type = models.CharField(max_length=20, choices=FILTER_TYPES)
    
    # === COMMON FILTERS (for both cars and real estate) ===
    
    # Price range the user is interested in
    min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Which city/location?
    location = models.CharField(max_length=100, null=True, blank=True)
    
    # === CAR-SPECIFIC FILTERS ===
    
    # Year range for cars
    min_year = models.IntegerField(null=True, blank=True)
    max_year = models.IntegerField(null=True, blank=True)
    
    # Maximum mileage the user accepts
    max_mileage = models.IntegerField(null=True, blank=True)
    
    # Which fuel types is the user interested in? (stored as JSON list)
    fuel_types = models.JSONField(default=list, blank=True)
    
    # Which car categories? (SUV, Sedan, etc. - stored as JSON list)
    car_categories = models.JSONField(default=list, blank=True)
    
    # === REAL ESTATE-SPECIFIC FILTERS ===
    
    # Room count range
    min_rooms = models.IntegerField(null=True, blank=True)
    max_rooms = models.IntegerField(null=True, blank=True)
    
    # Area range (in square meters)
    min_area = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    max_area = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Which property types? (apartment, house, etc. - stored as JSON list)
    property_types = models.JSONField(default=list, blank=True)
    
    # Is this filter currently active?
    is_active = models.BooleanField(default=True)
    
    # When was this filter created and last updated?
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"

# Favorite model - represents listings that users have saved as favorites
# Simple relationship: which user favorited which listing
class Favorite(models.Model):
    # Which user favorited this?
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Which listing did they favorite?
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    
    # When did they favorite it?
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Make sure each user can only favorite each listing once
    class Meta:
        unique_together = ['user', 'listing']
    
    def __str__(self):
        return f"{self.user.username} - {self.listing.title}"

# Notification model - represents notifications sent to users
# When new listings match their filters, we create notifications here
class Notification(models.Model):
    # What type of notification is this?
    NOTIFICATION_TYPES = [
        ('new_listing', 'New Listing Match'),    # New listing matches user's filter
        ('price_drop', 'Price Drop'),            # Price decreased on favorited listing
        ('favorite_update', 'Favorite Updated'), # Favorited listing was updated
    ]
    
    # What's the status of this notification?
    STATUS_CHOICES = [
        ('pending', 'Pending'),   # Not sent yet
        ('sent', 'Sent'),         # Successfully sent
        ('failed', 'Failed'),     # Failed to send
    ]
    
    # Unique ID for this notification
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Which user should receive this notification?
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Which filter triggered this notification? (can be empty)
    filter = models.ForeignKey(Filter, on_delete=models.CASCADE, null=True, blank=True)
    
    # Which listing is this notification about?
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    
    # What type of notification is this?
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    
    # Has this notification been sent?
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # The actual message to send to the user
    message = models.TextField()
    
    # When was this notification created?
    created_at = models.DateTimeField(auto_now_add=True)
    
    # When was it actually sent?
    sent_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.notification_type} - {self.status}"