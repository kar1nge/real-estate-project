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
    PropertyVirtualTourManagementAPIView,
    PropertyManagementListCreateAPIView,
    PropertyManagementDetailAPIView,
    PropertyImageManagementAPIView,
    PropertyImageDetailManagementAPIView,
    TourSceneManagementListCreateAPIView,
    TourSceneManagementDetailAPIView,
    TourHotspotListCreateAPIView,
    TourHotspotDetailManagementAPIView,
)


urlpatterns = [
    path("", PropertyListAPIView.as_view()),

    path("featured/", FeaturedPropertyAPIView.as_view()),

    # Supporting/filter endpoints MUST come before the dynamic slug route.
    path("locations/", LocationListAPIView.as_view()),
    path("property-types/", PropertyTypeListAPIView.as_view()),
    path("statuses/", PropertyStatusListAPIView.as_view()),
    path("amenities/", AmenityListAPIView.as_view()),

    path(
        "virtual-tours/<int:pk>/",
        VirtualTourDetailAPIView.as_view(),
        name="virtual-tour-detail",
    ),

    # Protected CMS management endpoints.
    path(
        "manage/",
        PropertyManagementListCreateAPIView.as_view(),
        name="property-management-list-create",
    ),
    path(
        "manage/<int:pk>/",
        PropertyManagementDetailAPIView.as_view(),
        name="property-management-detail",
    ),
    path(
        "manage/<int:property_id>/virtual-tour/",
        PropertyVirtualTourManagementAPIView.as_view(),
        name="property-virtual-tour-management",
    ),

    # Protected property image management endpoints.
    path(
        "manage/<int:property_id>/images/",
        PropertyImageManagementAPIView.as_view(),
        name="property-image-management",
    ),
    path(
        "manage/<int:property_id>/images/<int:pk>/",
        PropertyImageDetailManagementAPIView.as_view(),
        name="property-image-detail-management",
    ),

    path(
        "manage/tours/<int:tour_id>/scenes/",
        TourSceneManagementListCreateAPIView.as_view(),
        name="tour-scene-management-list-create",
    ),
    path(
        "manage/scenes/<int:pk>/",
        TourSceneManagementDetailAPIView.as_view(),
        name="tour-scene-management-detail",
    ),

    # Protected virtual tour hotspot management endpoints.
    path(
        "manage/scenes/<int:scene_id>/hotspots/",
        TourHotspotListCreateAPIView.as_view(),
        name="tour-hotspot-list-create",
    ),
    path(
        "manage/hotspots/<int:pk>/",
        TourHotspotDetailManagementAPIView.as_view(),
        name="tour-hotspot-detail-management",
    ),

    # Dynamic route goes last.
    path(
        "<slug:slug>/",
        PropertyDetailAPIView.as_view(),
    ),
]
