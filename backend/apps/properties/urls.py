from django.urls import path

from .views import (
    PropertyListAPIView,
    PropertyDetailAPIView,
    FeaturedPropertyAPIView,
    LocationListAPIView,
    PropertyTypeListAPIView,
    PropertyStatusListAPIView,
    AmenityListAPIView,
)

urlpatterns = [
    path("", PropertyListAPIView.as_view()),
    path("featured/", FeaturedPropertyAPIView.as_view()),
    path("<slug:slug>/", PropertyDetailAPIView.as_view()),
    path("locations/", LocationListAPIView.as_view()),
    path("property-types/", PropertyTypeListAPIView.as_view()),
    path("statuses/", PropertyStatusListAPIView.as_view()),
    path("amenities/", AmenityListAPIView.as_view()),
]