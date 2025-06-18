# Serializers in Django REST Framework (DRF) convert Django models into JSON
# so they can be sent to the frontend

from rest_framework import serializers
from .models import User, Source, Listing, Filter, Favorite, Notification

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'role', 'email_notifications',
            'created_at', 'updated_at', 'is_active', 'is_staff'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_active', 'is_staff')

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'last_scraped')

class ListingSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    source_id = serializers.PrimaryKeyRelatedField(
        queryset=Source.objects.all(), source='source', write_only=True
    )

    class Meta:
        model = Listing
        fields = [
            'id', 'external_id', 'listing_type', 'source', 'source_id', 'title', 'description',
            'price', 'location', 'images', 'url', 'year', 'mileage', 'fuel_type', 'car_category',
            'rooms', 'area', 'property_type', 'is_active', 'created_at', 'updated_at', 'scraped_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'scraped_at')

class FilterSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Filter
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    listing = ListingSerializer(read_only=True)
    listing_id = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all(), source='listing', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'user_id', 'listing', 'listing_id', 'created_at']
        read_only_fields = ('id', 'created_at')

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    filter = FilterSerializer(read_only=True)
    filter_id = serializers.PrimaryKeyRelatedField(
        queryset=Filter.objects.all(), source='filter', write_only=True, allow_null=True, required=False
    )
    listing = ListingSerializer(read_only=True)
    listing_id = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all(), source='listing', write_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_id', 'filter', 'filter_id', 'listing', 'listing_id',
            'notification_type', 'status', 'message', 'created_at', 'sent_at'
        ]
        read_only_fields = ('id', 'created_at', 'sent_at')

