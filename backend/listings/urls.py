from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    UserViewSet, SourceViewSet, ListingViewSet,
    FilterViewSet, FavoriteViewSet, NotificationViewSet,
    RegisterView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'sources', SourceViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'filters', FilterViewSet)
router.register(r'favorites', FavoriteViewSet)
router.register(r'notifications', NotificationViewSet)

# Main API endpoints for the listings app.
urlpatterns = [
    path('', include(router.urls)),
    # Login endpoint using Django REST Framework's token authentication.
    # Expects a POST request with 'username' and 'password' fields, returns an authentication token.
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('auth/register/', RegisterView.as_view(), name='api_register'),
]