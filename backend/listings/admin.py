from django.contrib import admin
from .models import User, Source, Listing, Filter, Favorite, Notification

#Admin is for staff/superusers to manage all users and data
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'email_notifications', 'created_at', 'is_active', 'is_staff')
    list_filter = ('role', 'email_notifications', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'source_type', 'url', 'is_active', 'last_scraped', 'created_at')
    list_filter = ('source_type', 'is_active')
    search_fields = ('name', 'url')
    readonly_fields = ('created_at', 'last_scraped')

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'listing_type', 'price', 'location', 'source', 'is_active', 'created_at', 'updated_at'
    )
    list_filter = ('listing_type', 'is_active', 'source')
    search_fields = ('title', 'location', 'external_id')
    readonly_fields = ('created_at', 'updated_at', 'scraped_at')
    ordering = ('-created_at',)
    raw_id_fields = ('source',)

@admin.register(Filter)
class FilterAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'filter_type', 'is_active', 'created_at')
    list_filter = ('filter_type', 'is_active')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'created_at')
    search_fields = ('user__username', 'listing__title')
    readonly_fields = ('created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'message', 'read', 'created_at')
    list_filter = ('read',)
    search_fields = ('user__username', 'listing__title', 'message')
    readonly_fields = ('created_at',)
