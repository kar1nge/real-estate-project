from django.urls import path

from .views import (
    PropertyListAPIView,
    PropertyDetailAPIView,
    FeaturedPropertyAPIView,
    LocationListAPIView,
    PropertyTypeListAPIView,
    PropertyStatusListAPIView,
    AmenityListAPIView,
    VirtualTourDetailAPIView,
)

urlpatterns = [
    path("", PropertyListAPIView.as_view()),
    path("featured/", FeaturedPropertyAPIView.as_view()),

    # Supporting/filter endpoints MUST come before the dynamic slug route.
    path("locations/", LocationListAPIView.as_view()),
    path("property-types/", PropertyTypeListAPIView.as_view()),
    path("statuses/", PropertyStatusListAPIView.as_view()),
    path("amenities/", AmenityListAPIView.as_view()),
    path("virtual-tours/<int:pk>/", VirtualTourDetailAPIView.as_view(), name="virtual-tour-detail"),


    # Dynamic route goes last.
    path("<slug:slug>/", PropertyDetailAPIView.as_view()),
]