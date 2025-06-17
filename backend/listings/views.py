from rest_framework import viewsets, permissions, generics
from django.contrib.auth.hashers import make_password
from .models import User, Source, Listing, Filter, Favorite, Notification
from .serializers import (
    UserSerializer, SourceSerializer, ListingSerializer,
    FilterSerializer, FavoriteSerializer, NotificationSerializer
)

#API views handle HTTP requests (GET, POST, PUT, DELETE)
# #They connect models/serializers to the outside world, so the frontend can fetch and update data. 
# Routing tells Django which URLs should trigger which views.

# UserViewSet allows CRUD operations on users (admin only for now)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

# SourceViewSet allows CRUD operations on sources (admin only)
class SourceViewSet(viewsets.ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    permission_classes = [permissions.IsAdminUser]

# ListingViewSet allows anyone to view listings, but only admins can add/edit/delete
class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# FilterViewSet allows users to manage their own filters
class FilterViewSet(viewsets.ModelViewSet):
    queryset = Filter.objects.all()
    serializer_class = FilterSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Only show filters belonging to the current user
    def get_queryset(self):
        return Filter.objects.filter(user=self.request.user)

    # Automatically set the user when creating a filter
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# FavoriteViewSet allows users to manage their own favorites
class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Only show favorites belonging to the current user
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    # Automatically set the user when creating a favorite
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# NotificationViewSet allows users to view their own notifications
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Only show notifications for the current user
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

# Registration view for new users
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    # Hash the password before saving
    def perform_create(self, serializer):
        password = serializer.validated_data.get('password')
        serializer.save(password=make_password(password))

